(() => {
  'use strict';

  const html = document.documentElement;

  const initTheme = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
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
  };

  const initAccentDial = () => {
    const input = document.querySelector('.accent-dial input[type="color"]');
    if (!input) return;

    const saved = localStorage.getItem('accent');
    if (saved) {
      input.value = saved;
      applyAccent(saved);
    }

    input.addEventListener('input', (e) => {
      const color = e.target.value;
      applyAccent(color);
      localStorage.setItem('accent', color);
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
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('nav--open');
        document.body.style.overflow = '';
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
