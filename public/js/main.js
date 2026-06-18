(() => {
  'use strict';

  const html = document.documentElement;

  const initTheme = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    
    // Set default accent on load to ensure favicon gets generated
    const currentAccent = html.style.getPropertyValue('--color-accent') || '#dbb778';
    applyAccent(currentAccent);
  };

  const updateThemeIcon = (theme) => {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.innerHTML = theme === 'dark'
      ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  };

  const toggleTheme = () => {
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);
    
    const currentAccent = html.style.getPropertyValue('--color-accent');
    if (currentAccent) {
      applyAccent(currentAccent);
    }
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
    initTheme();
    initAccentDial();
    initMobileMenu();
    initScrollReveals();
    initHeaderScroll();
    initCurrentNav();

    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  });
})();
