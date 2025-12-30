/* Behsayar MVP (Static) — App Controller
   - No external deps
   - Demo auth + UI sync
   - LocalStorage keys: bs_users, bs_session, bs_cart
*/
(() => {
  'use strict';

  const qs = (s, r = document) => r.querySelector(s);
  const qsa = (s, r = document) => Array.from(r.querySelectorAll(s));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  const LS = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (_) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {}
    },
    del(key) {
      try { localStorage.removeItem(key); } catch (_) {}
    }
  };

  const KEYS = {
    USERS: 'bs_users',
    SESSION: 'bs_session',
    CART: 'bs_cart'
  };

  const DEMO_USERS = [
    {
      id: '1001',
      password: '123',
      role: 'student',
      roleLabel: 'دانش‌آموز',
      fullName: 'علی حسینی',
      nationalId: '0016598255',
      fatherName: 'حسین',
      credit: 20000000
    },
    {
      id: '1002',
      password: '123',
      role: 'teacher',
      roleLabel: 'معلم/ولی',
      fullName: 'حسین حسینی',
      nationalId: '0025478844',
      fatherName: 'پدر علی',
      credit: 12000000
    },
    {
      id: '1003',
      password: '123',
      role: 'admin',
      roleLabel: 'مدیر سیستم',
      fullName: 'علیرضا داداشی',
      nationalId: '0012345678',
      fatherName: '',
      credit: 50000000
    }
  ];

  const formatIR = (n) => {
    const num = Number(n || 0);
    const s = num.toLocaleString('fa-IR');
    return s;
  };

  function ensureSeedUsers() {
    const users = LS.get(KEYS.USERS, {});
    let changed = false;

    for (const u of DEMO_USERS) {
      if (!users[u.id]) {
        users[u.id] = u;
        changed = true;
      } else {
        // keep existing but ensure required fields exist
        const merged = { ...u, ...users[u.id] };
        // password should remain user-entered? for demo keep seed default
        merged.password = users[u.id].password || u.password;
        users[u.id] = merged;
        changed = true;
      }
    }
    if (changed) LS.set(KEYS.USERS, users);
  }

  function getSession() {
    return LS.get(KEYS.SESSION, null);
  }

  function setSession(userId) {
    LS.set(KEYS.SESSION, { userId, ts: Date.now() });
  }

  function clearSession() {
    LS.del(KEYS.SESSION);
  }

  function getCurrentUser() {
    const sess = getSession();
    if (!sess || !sess.userId) return null;
    const users = LS.get(KEYS.USERS, {});
    return users[sess.userId] || null;
  }

  function login(username, password) {
    const users = LS.get(KEYS.USERS, {});
    const u = users[String(username || '').trim()];
    if (!u) return { ok: false, msg: 'کاربر پیدا نشد.' };
    if (String(password || '').trim() !== String(u.password)) return { ok: false, msg: 'رمز عبور اشتباه است.' };
    setSession(u.id);
    return { ok: true, user: u };
  }

  function logout() {
    clearSession();
  }

  // ---------- UI: Header Auth (Desktop) ----------
  function bindHeaderAuth() {
    const btn = qs('#headerAuthBtn');
    const pop = qs('#headerAuthPopover');
    const form = qs('#headerInlineLoginForm');

    if (!btn || !pop || !form) return;

    const open = () => {
      pop.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.add('is-open');
      const first = qs('input', pop);
      first && first.focus({ preventScroll: true });
    };

    const close = () => {
      pop.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
    };

    on(btn, 'click', (e) => {
      e.preventDefault();
      if (!pop.hidden) close(); else open();
    });

    on(document, 'click', (e) => {
      if (pop.hidden) return;
      const t = e.target;
      if (btn.contains(t) || pop.contains(t)) return;
      close();
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && !pop.hidden) close();
    });

    on(form, 'submit', (e) => {
      e.preventDefault();
      const u = qs('#headerLoginUsername')?.value;
      const p = qs('#headerLoginPassword')?.value;
      const out = qs('#headerLoginMsg');
      const res = login(u, p);
      if (!res.ok) {
        if (out) { out.textContent = res.msg; out.hidden = false; }
        return;
      }
      if (out) { out.textContent = ''; out.hidden = true; }
      close();
      syncAuthUI();
    });
  }

  // ---------- UI: User menu (Desktop) ----------
  function bindUserMenu() {
    const trigger = qs('#userMenuTrigger');
    const drop = qs('#userMenuDropdown');
    if (!trigger || !drop) return;

    const open = () => {
      drop.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      drop.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    };

    on(trigger, 'click', (e) => {
      e.preventDefault();
      if (!drop.hidden) close(); else open();
    });

    on(document, 'click', (e) => {
      const t = e.target;
      if (drop.hidden) return;
      if (trigger.contains(t) || drop.contains(t)) return;
      close();
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && !drop.hidden) close();
    });

    const logoutBtn = qs('#userMenuLogout');
    on(logoutBtn, 'click', () => {
      logout();
      syncAuthUI();
    });
  }

  // ---------- UI: Bottom sheets (Mobile) ----------
  function bindSheets() {
    qsa('[data-sheet-close]').forEach((el) => {
      on(el, 'click', () => {
        const sheet = el.closest('.bottom-sheet');
        sheet && sheet.classList.remove('is-open');
      });
    });

    on(document, 'keydown', (e) => {
      if (e.key !== 'Escape') return;
      qsa('.bottom-sheet.is-open').forEach((s) => s.classList.remove('is-open'));
    });
  }

  function bindMobileAuth() {
    const btn = qs('#bnAuthBtn');
    const sheet = qs('#mobileAuthSheet');
    if (!btn || !sheet) return;

    on(btn, 'click', (e) => {
      e.preventDefault();
      sheet.classList.add('is-open');
    });

    const form = qs('#mobileLoginForm');
    on(form, 'submit', (e) => {
      e.preventDefault();
      const u = qs('#mobileLoginUsername')?.value;
      const p = qs('#mobileLoginPassword')?.value;
      const out = qs('#mobileLoginMsg');
      const res = login(u, p);
      if (!res.ok) {
        if (out) { out.textContent = res.msg; out.hidden = false; }
        return;
      }
      if (out) { out.textContent = ''; out.hidden = true; }
      syncAuthUI();
      // keep sheet open but show account options
    });

    const logoutBtn = qs('#mobileUserLogout');
    on(logoutBtn, 'click', () => {
      logout();
      syncAuthUI();
    });
  }

  // ---------- UI: Categories dropdown (Desktop) ----------
  function bindCategoriesDropdown() {
    const tgl = qs('.nav-dropdown-toggle');
    const panel = qs('.dropdown-panel');
    if (!tgl || !panel) return;

    const open = () => {
      panel.hidden = false;
      tgl.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      panel.hidden = true;
      tgl.setAttribute('aria-expanded', 'false');
    };

    on(tgl, 'click', (e) => {
      e.preventDefault();
      if (!panel.hidden) close(); else open();
    });

    on(document, 'click', (e) => {
      const t = e.target;
      if (panel.hidden) return;
      if (tgl.contains(t) || panel.contains(t)) return;
      close();
    });

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) close();
    });
  }

  // ---------- UI sync ----------
  function syncAuthUI() {
    const user = getCurrentUser();

    const authArea = qs('#authArea');
    const loginBtn = qs('#headerAuthBtn');
    const userMenu = qs('#headerUserMenu');

    const mobileLoginForm = qs('#mobileLoginForm');
    const mobileUserMenu = qs('#mobileUserMenu');

    const bnText = qs('#bnAuthText');

    if (user) {
      document.documentElement.classList.add('is-auth');
      // Desktop
      if (loginBtn) loginBtn.hidden = true;
      if (userMenu) userMenu.hidden = false;

      // Desktop menu fields
      const avatar = qs('#userMenuAvatar');
      if (avatar) avatar.src = `images/avatars/${user.id}.png`;
      const credit = qs('#userMenuCredit');
      if (credit) credit.textContent = `اعتبار: ${formatIR(user.credit)} تومان`;
      const name = qs('#userMenuName');
      if (name) name.textContent = user.fullName;
      const meta = qs('#userMenuMeta');
      if (meta) meta.textContent = user.roleLabel;

      // Mobile
      if (mobileLoginForm) mobileLoginForm.hidden = true;
      if (mobileUserMenu) mobileUserMenu.hidden = false;

      const mAvatar = qs('#mobileUserAvatar');
      if (mAvatar) mAvatar.src = `images/avatars/${user.id}.png`;
      const mCredit = qs('#mobileUserCredit');
      if (mCredit) mCredit.textContent = `اعتبار: ${formatIR(user.credit)} تومان`;
      const mName = qs('#mobileUserName');
      if (mName) mName.textContent = user.fullName;
      const mMeta = qs('#mobileUserMeta');
      if (mMeta) mMeta.textContent = user.roleLabel;

      if (bnText) bnText.textContent = 'حساب';

    } else {
      document.documentElement.classList.remove('is-auth');
      // Desktop
      if (loginBtn) loginBtn.hidden = false;
      if (userMenu) userMenu.hidden = true;

      // Mobile
      if (mobileLoginForm) mobileLoginForm.hidden = false;
      if (mobileUserMenu) mobileUserMenu.hidden = true;

      if (bnText) bnText.textContent = 'ورود';
    }

    // avatar fallback if missing images
    qsa('img').forEach((img) => {
      if (!img.getAttribute('onerror')) {
        img.onerror = () => { img.src = 'images/placeholder.svg'; };
      }
    });
  }

  // ---------- boot ----------
  function boot() {
    ensureSeedUsers();
    bindHeaderAuth();
    bindUserMenu();
    bindSheets();
    bindMobileAuth();
    bindCategoriesDropdown();
    syncAuthUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
