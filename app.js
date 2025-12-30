/* Behsayar - minimal JS bootstrap (demo)
   Keep this file tiny & safe: no external deps, no hard failures. */
(() => {
  'use strict';

  // tiny helpers
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // smooth focus ring only when keyboard used
  try {
    const body = document.body;
    const onKey = (e) => {
      if (e.key === 'Tab') {
        body.classList.add('is-keyboard');
        window.removeEventListener('keydown', onKey);
      }
    };
    window.addEventListener('keydown', onKey, { passive: true });
  } catch (_) {}

  // Demo: attach to "ورود" button if present (no auth yet)
  const loginBtn = qs('[data-login-btn], #loginBtn, .btn-login');
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      const pop = qs('[data-login-popover], #loginPopover');
      if (!pop) return;
      e.preventDefault();
      pop.classList.toggle('is-open');
      loginBtn.setAttribute('aria-expanded', pop.classList.contains('is-open') ? 'true' : 'false');
      const firstInput = qs('input', pop);
      if (firstInput) firstInput.focus({ preventScroll: true });
    });
    // click outside to close
    document.addEventListener('click', (e) => {
      const pop = qs('[data-login-popover], #loginPopover');
      if (!pop || !pop.classList.contains('is-open')) return;
      if (pop.contains(e.target) || loginBtn.contains(e.target)) return;
      pop.classList.remove('is-open');
      loginBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Prevent horizontal overflow from accidental wide elements
  try {
    document.documentElement.style.overflowX = 'hidden';
  } catch (_) {}
})();
