(() => {
  'use strict';

  const html = document.documentElement;

  const initThemeDropdown = () => {
    const dropdown = document.querySelector('.theme-dropdown');
    const toggle = document.querySelector('.theme-dropdown__toggle');
    const buttons = document.querySelectorAll('.theme-btn');

    if (!dropdown || !toggle) return;

    // Set initial active state
    const savedTheme = localStorage.getItem('site-theme') || 'dark';
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
        html.setAttribute('data-theme', theme);
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

  let faviconBaseImage = null;

  const updateFavicon = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    let accentColor = rootStyles.getPropertyValue('--color-accent').trim();
    let textColor = rootStyles.getPropertyValue('--color-accent-text').trim();

    // Fallbacks if CSS isn't fully ready or variables are unresolved
    if (!accentColor || accentColor.includes('var(')) accentColor = '#dbb778';
    if (!textColor || textColor.includes('var(')) textColor = '#151E2B';

    const draw = (img) => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');

      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.fill();

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

    if (faviconBaseImage && faviconBaseImage.complete) {
      draw(faviconBaseImage);
    } else {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        faviconBaseImage = img;
        draw(img);
      };
      img.src = 'data:image/png;base64,' + "iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAMAAABrrFhUAAAAVFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////8wXzyWAAAAG3RSTlMAKplIFu90+NvkPg1gVMBqHzR/tquJodIGyZLAcdFYAAALDElEQVR42uzY0ZKrIAwA0CgKohRExKr5//+83YfubVys27WzxS5npi/tTEchhCSQJEmSJEmSJEmSJEmSJEmSJMljilp1c+/0pN3QsQL+EtsNukJCTI438BfU3SBxRX+C99aoWeJd0rfwrsa6x4tycoPnRinD595V+IV/z5NQdHjhTLb83miBCwbeUIUlb1dC4zQhJWt4O8zCHW2P1AB/TaaRKN8wCDaoEgkOdzQZU4Z33vv58um4MSd7+Fqq0EjMEFRzP5wFBkidd6Ye4bj8RiIYrelL3FA6ftzC+nRvBWov8bu0yeCQaiT8/83nJT5G8kPGgRWhmqgYMEhc4LrzEXuLGok6UCWU2itW26wtPrRtZhlTXS/xK3mUwropVvKAbIDs/sRZNkJYW6tAjhyOcBJYKeGToWFc4ZUYTAtbWKeREnPsS5A5eunn4QP97YGJzeWR2qsxR5QWbk24JHoLjzhpJCSDWDGB6IAqSqTyBh5lJyR6iFKhyW0fPgRlAT+RTUjEGARqpes5I2F/HF2R99j9SoKySJ135JdbMq762Mq1rrfHhW7HBYs3REzHwKx2/Rl+YeGnGr2YMsTCk26H4EjszeH5YsoQhx4/uODBlUjsTuE8vvtwPF8L/QCFAdPzxgwaXq6R9062wxAGO7C4VqCpSEJa6YeFFvSpnxcDDl6qqO5G9fAZ9PniIthDxZMHrvsv2vDP5ec4LHvmtvFoikJ3fcGNB20BNN7KYJd8UVq9AKnyKgibbvaofuINvlxOBa/hN2YUjDzgU0OgEIt/e4XT1r3uSICYp5axbDlt/H2t2AiAQtCXrfBGBTvNr06E4z/mrS1ZVhAGlnp0fD9BVPa/z/t5qnKFKOnKHBcwQEgn3R2m5gSuJQm6Yq2988vCKOdKUFeSnofshLSq6peBgjW5hv+Ir8HueP0mJ+5+AW2ZTtUc9wzukoPwiyCw7E22NEBUGzu5Cymw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";
    }
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
  const initThemeShowcase = () => {
    // Only run on homepage
    const path = window.location.pathname.replace(/\/$/, '');
    if (path !== '' && path !== '/index.html') return;
    
    // Play once per session OR on manual refresh
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
    
    if (sessionStorage.getItem('theme-intro-played') && !isReload) {
      const savedTheme = localStorage.getItem('site-theme');
      if (!savedTheme) {
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('site-theme', 'light');
      }
      return;
    }
    
    const toggleBtn = document.querySelector('.theme-dropdown__toggle');
    const originalTheme = localStorage.getItem('site-theme') || 'light';
    let isCancelled = false;

    // If user switches tabs, cancel the showcase immediately
    const handleVisibility = () => {
      if (document.hidden) {
        isCancelled = true;
        html.setAttribute('data-theme', originalTheme);
        localStorage.setItem('site-theme', originalTheme);
        sessionStorage.setItem('theme-intro-played', 'true');
        document.removeEventListener('visibilitychange', handleVisibility);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    const playSpotlight = async (theme, x, y, duration = 800) => {
      if (isCancelled) return;
      
      // Strip custom accents during showcase
      html.style.removeProperty('--color-accent');
      html.style.removeProperty('--color-accent-rgb');
      html.style.removeProperty('--color-accent-adaptive');
      html.style.removeProperty('--color-accent-text');

      // Fallback for browsers that don't support View Transitions
      if (!document.startViewTransition) {
        html.setAttribute('data-theme', theme);
        return new Promise(resolve => setTimeout(resolve, duration));
      }

      return new Promise(resolve => {
        try {
          const transition = document.startViewTransition(() => {
            if (!isCancelled) html.setAttribute('data-theme', theme);
          });

          // If the transition is skipped/aborted by the browser (e.g., background tab), resolve immediately
          transition.ready.then(() => {
            if (isCancelled) return resolve();
            
            const maxW = Math.max(window.innerWidth, window.screen ? window.screen.width : 0);
            const maxH = Math.max(window.innerHeight, window.screen ? window.screen.height : 0) + 150;
            const radius = Math.hypot(
              Math.max(x, maxW - x),
              Math.max(y, maxH - y)
            );

            const animation = document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${radius}px at ${x}px ${y}px)`
                ]
              },
              {
                duration: duration,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                pseudoElement: '::view-transition-new(root)'
              }
            );
            
            animation.onfinish = resolve;
            animation.oncancel = resolve;
          }).catch(() => {
            // Transition was aborted (e.g., page hidden)
            resolve();
          });
        } catch (error) {
          // Fallback if startViewTransition throws an exception
          if (!isCancelled) html.setAttribute('data-theme', theme);
          setTimeout(resolve, duration);
        }
      });
    };

    const runSequence = async () => {
      if (isCancelled) return;

      // 1. Pick a random theme of the opposite brightness
      const lightThemes = ['light', 'nordic', 'neobrutalism', 'sepia'];
      const darkThemes = ['dark', 'obsidian', 'cyber', 'crimson', 'midnight'];
      
      let oppositeThemes = darkThemes;
      if (darkThemes.includes(originalTheme)) {
        oppositeThemes = lightThemes;
      } else if (lightThemes.includes(originalTheme)) {
        oppositeThemes = darkThemes;
      }
      
      const randomTheme = oppositeThemes[Math.floor(Math.random() * oppositeThemes.length)];
      
      // Start from bottom-left corner so it contrasts with the top-right header button
      await playSpotlight(randomTheme, 0, window.innerHeight, 800);
      if (isCancelled) return;
      
      // 2. Return to Original Theme from the toggle button
      let btnX = window.innerWidth / 2;
      let btnY = window.innerHeight / 2;
      
    
      if (toggleBtn) {
        const rect = toggleBtn.getBoundingClientRect();
        btnX = rect.left + rect.width / 2;
        btnY = rect.top + rect.height / 2;
      }
      
      await playSpotlight(originalTheme, btnX, btnY, 900);
      if (isCancelled) return;
      
      // Save and show tooltip
      localStorage.setItem('site-theme', originalTheme);
      
      if (toggleBtn) {
        toggleBtn.classList.add('showcase-ping');
        const tooltip = document.createElement('div');
        tooltip.className = 'theme-showcase-tooltip';
        tooltip.innerHTML = 'Customize your vibe ✨';
        toggleBtn.parentElement.appendChild(tooltip);
        
        let isRemoved = false;
        const removeTooltip = () => {
          if (isRemoved) return;
          isRemoved = true;
          tooltip.classList.add('fade-out');
          toggleBtn.classList.remove('showcase-ping');
          setTimeout(() => tooltip.remove(), 500);
          toggleBtn.removeEventListener('click', removeTooltip);
        };

        toggleBtn.addEventListener('click', removeTooltip);
        setTimeout(removeTooltip, 4000);
      }
      
      sessionStorage.setItem('theme-intro-played', 'true');
      document.removeEventListener('visibilitychange', handleVisibility);
    };

    setTimeout(() => {
      if (!isCancelled) runSequence();
    }, 200);
  };

  document.addEventListener('DOMContentLoaded', () => {
    initThemeDropdown();
    initAccentDial();
    initMobileMenu();
    initScrollReveals();
    initHeaderScroll();
    initCurrentNav();
    initThemeShowcase();
  });
  
  window.addEventListener('load', () => {
    // Failsafe to guarantee favicon is correct after all CSS is fully parsed and rendered
    if (typeof updateFavicon === 'function') updateFavicon();
  });
})();
