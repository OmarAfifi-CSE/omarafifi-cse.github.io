// Hero typewriter effect
(() => {
  'use strict';

  const texts = [
    'Software Engineer',
    'Flutter Developer',
    'IoT Systems Builder',
    'Cross-Platform Developer'
  ];

  const target = document.querySelector('.typewriter');
  if (!target) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    target.textContent = texts[0];
    return;
  }

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const current = texts[textIndex];
    if (isDeleting) {
      target.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    } else {
      target.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 90);
    }
  };

  setTimeout(tick, 800);
})();

// Contact form (Google Sheets submission)
(() => {
  'use strict';

  const form = document.forms['submit-to-google-sheet'];
  if (!form) return;

  const msg = document.getElementById('msg');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbx6Iy37SouYu_YjHu0gdn-CnQ7thOhj3rnX8KFspXF2e2PWXEY9rsINdN90A7fdoztDHA/exec';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalLabel = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      await fetch(scriptURL, { method: 'POST', body: new FormData(form) });
      form.reset();
      if (msg) {
        msg.textContent = 'Thanks! Your message has been sent.';
        msg.classList.remove('is-error');
      }
    } catch (err) {
      if (msg) {
        msg.textContent = 'Something went wrong. Please try again or email me directly.';
        msg.classList.add('is-error');
      }
    } finally {
      btn.textContent = originalLabel;
      btn.disabled = false;
      if (msg) {
        setTimeout(() => { msg.textContent = ''; }, 5000);
      }
    }
  });
})();