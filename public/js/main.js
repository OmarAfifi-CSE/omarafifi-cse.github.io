(() => {
  'use strict';

  const html = document.documentElement;

  const initThemeDropdown = () => {
    const dropdown = document.querySelector('.theme-dropdown');
    const toggle = document.querySelector('.theme-dropdown__toggle');
    const buttons = document.querySelectorAll('.theme-btn');

    if (!dropdown || !toggle) return;

    // Set initial active state
    const savedTheme = localStorage.getItem('site-theme') || '';
    buttons.forEach(b => {
      if (b.getAttribute('data-theme-value') === savedTheme) {
        b.classList.add('is-active');
      } else {
        b.classList.remove('is-active');
      }
    });

    // Initialize favicon and color picker to match the current theme
    setTimeout(() => {
      const themeAccent = getComputedStyle(html).getPropertyValue('--color-accent').trim();
      const colorInput = document.querySelector('.accent-dial input[type="color"]');
      if (colorInput && themeAccent.startsWith('#')) {
        colorInput.value = themeAccent.substring(0, 7);
      }
      updateFavicon(themeAccent);
    }, 10);

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('is-open');
      }
    });

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme-value');
        if (theme) {
          html.setAttribute('data-theme', theme);
        } else {
          html.removeAttribute('data-theme');
        }
        localStorage.setItem('site-theme', theme);
        dropdown.classList.remove('is-open');

        // Update active class
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        // Remove any custom inline accent so theme's default takes over
        html.style.removeProperty('--color-accent');
        html.style.removeProperty('--color-accent-rgb');
        html.style.removeProperty('--color-accent-adaptive');
        html.style.removeProperty('--color-accent-text');

        // Let CSS apply, then get the new theme's accent color
        setTimeout(() => {
          const themeAccent = getComputedStyle(html).getPropertyValue('--color-accent').trim();
          
          // Update the color picker dial to match the theme
          const colorInput = document.querySelector('.accent-dial input[type="color"]');
          if (colorInput && themeAccent.startsWith('#')) {
            colorInput.value = themeAccent.substring(0, 7);
          }
          
          // Update favicon
          updateFavicon(themeAccent);
        }, 10);
      });
    });
  };

  const initAccentDial = () => {
    const input = document.querySelector('.accent-dial input[type="color"]');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const color = e.target.value;
      applyAccent(color);
    });
  };

  const applyAccent = (hex) => {
    html.style.setProperty('--color-accent', hex);
    const rgb = hexToRgb(hex);
    if (rgb) {
      html.style.setProperty('--color-accent-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      
      const yiq = ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;
      const textColor = yiq >= 128 ? '#151E2B' : '#F2ECE4';
      html.style.setProperty('--color-accent-text', textColor);

      const isLightMode = html.getAttribute('data-theme') === 'light';
      let adaptiveColor = hex;
      if (isLightMode && yiq >= 128) {
        adaptiveColor = `color-mix(in srgb, ${hex}, black 35%)`;
      } else if (!isLightMode && yiq < 128) {
        adaptiveColor = `color-mix(in srgb, ${hex}, white 35%)`;
      }
      html.style.setProperty('--color-accent-adaptive', adaptiveColor);
      
      updateFavicon();
    }
  };

  const updateFavicon = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    const accentColor = rootStyles.getPropertyValue('--color-accent-adaptive').trim() || '#dbb778';
    const textColor = rootStyles.getPropertyValue('--color-accent-text').trim() || '#151E2B';

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fillStyle = accentColor;
    ctx.fill();

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const size = 44;
      const offset = (64 - size) / 2;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 64;
      tempCanvas.height = 64;
      const tCtx = tempCanvas.getContext('2d');
      
      tCtx.drawImage(img, offset, offset, size, size);
      tCtx.globalCompositeOperation = 'source-in';
      tCtx.fillStyle = textColor;
      tCtx.fillRect(0, 0, 64, 64);

      ctx.drawImage(tempCanvas, 0, 0);

      const dataUrl = canvas.toDataURL('image/png');
      
      let link = document.querySelector('link[rel="icon"][id="dynamic-favicon"]');
      if (!link) {
        link = document.createElement('link');
        link.id = 'dynamic-favicon';
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = dataUrl;

      document.querySelectorAll('link[rel="icon"]:not([id="dynamic-favicon"]), link[rel="apple-touch-icon"]').forEach(el => el.remove());
    };
    img.src = '/images/Logo-Without-Background.png';
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const initMobileMenu = () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isOpen);
      nav.classList.toggle('nav--open', !isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav--open');
      });
    });
  };

  const initScrollReveals = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach((el) => observer.observe(el));
  };

  const initHeaderScroll = () => {
    const header = document.querySelector('.site-header');
    if (!header) return;
    let last = 0;

    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 40) {
        header.style.background = 'rgba(var(--color-bg-rgb), 0.9)';
      } else {
        header.style.background = '';
      }
      last = current;
    }, { passive: true });
  };

  const initCurrentNav = () => {
    const links = document.querySelectorAll('.nav__link');
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    
    links.forEach((link) => {
      const href = link.getAttribute('href') || '/';
      if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
        link.setAttribute('aria-current', 'page');
      }
    });

    if (currentPath === '/') {
      const sections = document.querySelectorAll('section[id]');
      if (!sections.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            links.forEach((link) => {
              const href = link.getAttribute('href');
              if (href === `/#${activeId}` || (activeId === 'home' && href === '/')) {
                link.setAttribute('aria-current', 'page');
              } else if (href === '/' || href.startsWith('/#')) {
                link.removeAttribute('aria-current');
              }
            });
          }
        });
      }, { rootMargin: '-50% 0px -50% 0px' });

      sections.forEach(sec => observer.observe(sec));
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initThemeDropdown();
    initAccentDial();
    initMobileMenu();
    initScrollReveals();
    initHeaderScroll();
    initCurrentNav();
  });
})();
