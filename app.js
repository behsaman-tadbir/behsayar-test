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

  // Prevent accidental double-binding (e.g., if app.js is included twice)
  const markBound = (el, key) => {
    if (!el) return false;
    const k = `bsBound_${key}`;
    if (el.dataset && el.dataset[k] === '1') return true;
    if (el.dataset) el.dataset[k] = '1';
    return false;
  };

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
    CART: 'bs_cart',
    ORDERS: 'bs_orders'
  };

  const DEMO_USERS = [
    {
      id: '1001',
      password: '123',
      role: 'student',
      roleLabel: 'دانش‌آموز',
      fullName: 'آرین حسینی',
      nationalId: '0016598255',
      fatherName: 'حسین',
      mobile: '09121234567',
      address: 'تهران، خیابان ولیعصر، کوچه ۱۲، پلاک ۸',
      avatar: 'images/avatars/1001.png',
      parentId: '1002',
      credit: 5000000
    },
    {
      id: '1002',
      password: '123',
      role: 'staff',
      roleLabel: 'پرسنل',
      fullName: 'حسین حسینی',
      nationalId: '0025478844',
      fatherName: 'مجید',
      mobile: '09123334455',
      address: 'تهران، سعادت‌آباد، خیابان سرو، پلاک ۲۱',
      positionTitle: 'کارشناس فروش',
      avatar: 'images/avatars/1002.png',
      children: ['1001'],
      credit: 5000000
    },
    {
      id: '1003',
      password: '123',
      role: 'admin',
      roleLabel: 'مدیر سیستم',
      fullName: 'علیرضا داداشی',
      nationalId: '0012345678',
      fatherName: '',
      mobile: '09120001122',
      address: 'تهران، ونک، خیابان ملاصدرا',
      avatar: 'images/avatars/1003.png',
      credit: 5000000
    }
  ];

  
  function getOrders() {
    return LS.get(KEYS.ORDERS, []);
  }

  function ordersForUser(userId) {
    const all = getOrders();
    return (Array.isArray(all) ? all : []).filter((o) => o.userId === userId);
  }

const formatIR = (n) => {
    const num = Number(n || 0);
    const s = num.toLocaleString('fa-IR');
    return s;
  };

  function escapeHTML(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }


  
  const DEMO_ORDERS = [
    {
      id: 'TRK-24001',
      userId: '1001',
      createdAt: '1404/10/12',
      status: 'موفق',
      address: 'تحویل در مدرسه (شعبه مرکزی)',
      paymentType: 'اعتباری/اقساط',
      satisfaction: 5,
      items: [
        { productId: 'best-001', title: 'بهترین تست ریاضی', qty: 1, unitPrice: 910000 },
        { productId: 'best-003', title: 'کتاب کمک‌آموزشی علوم', qty: 1, unitPrice: 780000 }
      ]
    },
    {
      id: 'TRK-24002',
      userId: '1001',
      createdAt: '1404/10/25',
      status: 'موفق',
      address: 'تهران، سعادت‌آباد، خیابان سرو، پلاک ۲۱',
      paymentType: 'نقدی',
      satisfaction: 4,
      items: [
        { productId: 'khi-001', title: 'خیلی سبز - عربی', qty: 1, unitPrice: 650000 }
      ]
    },
    {
      id: 'TRK-34001',
      userId: '1002',
      createdAt: '1404/09/18',
      status: 'موفق',
      address: 'تهران، سعادت‌آباد، خیابان سرو، پلاک ۲۱',
      paymentType: 'اعتباری/اقساط',
      satisfaction: 5,
      items: [
        { productId: 'srv-001', title: 'مشاوره برنامه‌ریزی درسی', qty: 1, unitPrice: 1200000 }
      ]
    }
  ];

  function ensureSeedOrders() {
    const orders = LS.get(KEYS.ORDERS, null);
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      LS.set(KEYS.ORDERS, DEMO_ORDERS);
    }
  }

   function ensureSeedUsers() {
    const users = LS.get(KEYS.USERS, {});
    let changed = false;

    for (const u of DEMO_USERS) {
      const ex = users[u.id];

      if (!ex) {
        users[u.id] = u;
        changed = true;
        continue;
      }

      // Merge: keep user-editable fields (credit/password/avatar/etc) but ALWAYS lock role info for demo users
      const merged = { ...ex, ...u };

      // keep user-entered password/credit if present
      merged.password = (ex.password != null && String(ex.password).trim() !== '') ? ex.password : u.password;
      merged.credit = Number.isFinite(Number(ex.credit)) ? Number(ex.credit) : u.credit;

      // keep custom avatar/name/contact fields if they exist
      merged.avatar = ex.avatar || u.avatar;
      merged.fullName = ex.fullName || u.fullName;
      merged.nationalId = ex.nationalId || u.nationalId;
      merged.fatherName = ex.fatherName || u.fatherName;
      merged.mobile = ex.mobile || u.mobile;
      merged.address = ex.address || u.address;
      merged.positionTitle = ex.positionTitle || u.positionTitle;

      // IMPORTANT: lock role & roleLabel to the seeded demo definitions
      merged.role = u.role;
      merged.roleLabel = u.roleLabel;
      merged.parentId = u.parentId;
      merged.children = u.children;

      users[u.id] = merged;
      changed = true;
    }

    if (changed) LS.set(KEYS.USERS, users);
  }
   


  function getSession() {
    const s = LS.get(KEYS.SESSION, null);
    if (!s || typeof s !== 'object') return { userId: null, role: 'guest', ts: 0 };
    if (!('userId' in s)) s.userId = null;
    if (!s.role) s.role = 'guest';
    if (!s.ts) s.ts = 0;
    return s;
  }

  function setSession(userId) {
    const users = LS.get(KEYS.USERS, {});
    const u = users && users[userId] ? users[userId] : null;
    const role = u && u.role ? u.role : 'guest';
    LS.set(KEYS.SESSION, { userId, role, ts: Date.now() });
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


  function isAdminUser(user) {
    return !!(user && String(user.id) === '1003');
  }

  function buildInstallmentSchedule(payable, plan) {
    if (!plan || !Number.isFinite(Number(plan.installments))) return null;

    const down = Math.round(Number(payable || 0) * (Number(plan.downPercent || 0) / 100));
    const rest = Math.max(0, Number(payable || 0) - down);
    const n = Math.max(0, Number(plan.installments || 0));
    const each = n > 0 ? Math.ceil(rest / n) : 0;

    const installments = [];
    const now = new Date();

    for (let i = 1; i <= n; i++) {
      const d = new Date(now);
      d.setMonth(d.getMonth() + i);
      installments.push({
        index: i,
        dueDate: d.toLocaleDateString('fa-IR'),
        amount: each,
        status: 'در انتظار پرداخت'
      });
    }

    return {
      downPayment: down,
      eachInstallment: each,
      count: n,
      installments
    };
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
    const closeBtn = qs('#headerAuthClose');

    if (!btn || !pop || !form) return;
    if (markBound(btn, 'headerAuth')) return;

    const open = () => {
      pop.hidden = false;
      document.body.classList.add('modal-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.classList.add('is-open');
      const first = qs('input', pop);
      first && first.focus({ preventScroll: true });
    };

    const close = () => {
      pop.hidden = true;
      document.body.classList.remove('modal-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
    };

    on(btn, 'click', (e) => {
      e.preventDefault();
      if (!pop.hidden) close(); else open();
    });

    // Close button inside modal
    closeBtn && on(closeBtn, 'click', (e) => {
      e.preventDefault();
      close();
    });

    // Backdrop click closes (but clicking inside the dialog does not)
    on(pop, 'click', (e) => {
      if (e.target === pop) close();
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
    if (markBound(trigger, 'userMenu')) return;

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

    const ordersLink = qs('#userMenuOrders');
    on(ordersLink, 'click', (e) => {
      e.preventDefault();
      close();
      openOrdersOverlay();
    });
  }

  // ---------- UI: Bottom sheets (Mobile) ----------
  function bindSheets() {
    if (markBound(document.documentElement, 'sheets')) return;
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
    if (markBound(btn, 'mobileAuth')) return;

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

  
  function bindMobileCats() {
    const btn = qs('#bnCatsBtn');
    const sheet = qs('#mobileCatsSheet');
    if (!btn || !sheet) return;
    if (markBound(btn, 'mobileCats')) return;

    const open = () => {
      sheet.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      sheet.classList.remove('is-open');
      sheet.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
    };

    on(btn, 'click', (e) => {
      e.preventDefault();
      if (sheet.classList.contains('is-open')) close();
      else open();
    });

    // Close when user taps a link
    qsa('a', sheet).forEach((a) => {
      on(a, 'click', () => close());
    });
  }

// ---------- UI: Categories dropdown (Desktop) ----------
  function bindCategoriesDropdown() {
    const items = qsa('.nav-item.has-dropdown');
    if (!items.length) return;

    const header = qs('.site-header');

    // Close open dropdown when user scrolls (prevents sticky open menus while browsing)
    let active = null; // { close, panel, openedAt }
    const ensureScrollClose = () => {
      if (markBound(window, 'catsScrollClose')) return;
      let ticking = false;
      on(window, 'scroll', () => {
        if (!active || !active.panel || active.panel.hidden) return;
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          ticking = false;
          const dy = Math.abs(window.scrollY - (active.openedAt || 0));
          if (dy >= 12) active.close();
        });
      }, { passive: true });
    };
    ensureScrollClose();

    items.forEach((item) => {
      const tgl = qs('.nav-dropdown-toggle', item);
      const panel = qs('.dropdown-panel', item);
      if (!tgl || !panel) return;
      if (markBound(tgl, 'cats')) return;

      const open = () => {
        panel.hidden = false;
        tgl.setAttribute('aria-expanded', 'true');
        item.classList.add('is-open');
        if (header) {
          // Allow dropdown panel to render outside collapsed header-bottom.
          header.classList.add('is-nav-dropdown-open');
          header.classList.remove('is-bottom-collapsed');
        }
        active = { close, panel, openedAt: window.scrollY };
      };
      const close = () => {
        panel.hidden = true;
        tgl.setAttribute('aria-expanded', 'false');
        item.classList.remove('is-open');
        if (header) header.classList.remove('is-nav-dropdown-open');
        if (active && active.panel === panel) active = null;
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
    });
  }

 
 // ---------- UI: Header Bottom Auto Collapse (Desktop) ----------
  function bindHeaderBottomCollapse() {
    const header = qs('.site-header');
    const bottom = qs('.header-bottom');
    if (!header || !bottom) return;
    if (markBound(window, 'headerBottomCollapse')) return;

    // Hysteresis-based collapse to avoid flicker ("پرپر زدن")
    let lastY = window.scrollY || 0;
    let ticking = false;
    let isCollapsed = header.classList.contains('is-bottom-collapsed');

    const HIDE_AT = 96;      // collapse after user has scrolled a bit
    const SHOW_AT = 48;      // expand when near top
    const MIN_DELTA = 2;     // ignore micro scroll noise
    const UP_DELTA = 18;     // user intent to go up

    on(window, 'scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;

        const y = window.scrollY || 0;

        // Dropdown open should pin header-bottom visible
        if (header.classList.contains('is-nav-dropdown-open')) {
          if (isCollapsed) {
            header.classList.remove('is-bottom-collapsed');
            isCollapsed = false;
          }
          lastY = y;
          return;
        }

        // Always show near very top
        if (y <= 8) {
          if (isCollapsed) {
            header.classList.remove('is-bottom-collapsed');
            isCollapsed = false;
          }
          lastY = y;
          return;
        }

        const delta = y - lastY;
        if (Math.abs(delta) < MIN_DELTA) {
          lastY = y;
          return;
        }

        if (!isCollapsed) {
          // Collapse only if user is clearly going down and past HIDE_AT
          if (delta > 0 && y >= HIDE_AT) {
            header.classList.add('is-bottom-collapsed');
            isCollapsed = true;
          }
        } else {
          // Expand if user is going up with intent OR returns close to top
          if (y <= SHOW_AT || delta <= -UP_DELTA) {
            header.classList.remove('is-bottom-collapsed');
            isCollapsed = false;
          }
        }

        lastY = y;
      });
    }, { passive: true });
  }


  // ---------- UI sync ----------
  function syncAuthUI() {
    const user = getCurrentUser();


    const isAdmin = isAdminUser(user);
    // Admin entry points are outside avatar menu (hard gated)
    qsa('[data-admin-link]').forEach((el) => { el.hidden = !isAdmin; });
    const headerAdminBtn = qs('#headerAdminBtn');
    if (headerAdminBtn) headerAdminBtn.hidden = !isAdmin;
    const authArea = qs('#authArea');
    const loginBtn = qs('#headerAuthBtn');
    const userMenu = qs('#headerUserMenu');

    const mobileLoginForm = qs('#mobileLoginForm');
    // Mobile account actions live inside the bottom sheet
    const mobileUserMenu = qs('#mobileAccountActions');

    const bnText = qs('#bnAuthText');

    if (user) {
      document.documentElement.classList.add('is-auth');
      // Desktop
      if (loginBtn) loginBtn.hidden = true;
      if (userMenu) userMenu.hidden = false;

      // Desktop menu fields
      const avatar = qs('#userMenuAvatar');
      if (avatar) avatar.src = user.avatar ? user.avatar : `images/avatars/${user.id}.png`;
      const credit = qs('#userMenuCredit');
      if (credit) credit.textContent = `اعتبار: ${formatIR(user.credit)} تومان`;
      const name = qs('#userMenuName');
      if (name) name.textContent = user.fullName;
      const meta = qs('#userMenuMeta');
      if (meta) meta.textContent = user.roleLabel;

      const ident = qs('#userMenuIdentity');
      if (ident) ident.textContent = `کد: ${user.id} • کدملی: ${user.nationalId || '—'}`;

      const parent = qs('#userMenuParent');
      if (parent) {
        if (user.role === 'student' && user.parentId) {
          const users = LS.get(KEYS.USERS, {});
          const p = users[user.parentId];
          const pName = p?.fullName || '—';
          const pPos = p?.positionTitle ? `(${p.positionTitle})` : '';
          parent.textContent = `فرزندِ: ${pName} ${pPos}`;
          parent.hidden = false;
        } else {
          parent.hidden = true;
        }
      }
      
      // Toggle menu options (SAFE + deterministic)
      const adminLink = qs('#userMenuAdminPage');
      const ordersLink = qs('#userMenuOrders');
      
      const isAdmin = isAdminUser(user);
      
      // Admin page: hidden by default, only show for admin
      if (adminLink) adminLink.hidden = !isAdmin;
      
      // Orders: only for non-admin
      if (ordersLink) ordersLink.hidden = isAdmin;
      
      if (ordersLink && !isAdmin) {
        const cnt = ordersForUser(user.id).length;
        ordersLink.textContent = cnt > 0 ? `سوابق خرید (${cnt})` : 'سوابق خرید';
      }



      // Mobile
      if (mobileLoginForm) mobileLoginForm.hidden = true;
      if (mobileUserMenu) mobileUserMenu.hidden = false;

      const mAvatar = qs('#mobileUserAvatar');
      if (mAvatar) mAvatar.src = user.avatar ? user.avatar : `images/avatars/${user.id}.png`;
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

  
  // ---------- Cart (MVP) ----------
  function parseFaNumber(str) {
    const map = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9','٬':'',',':'', '٫':'.' };
    return String(str || '').replace(/[۰-۹٬,٫]/g, (c) => map[c] ?? c);
  }

  function parsePriceIRR(text) {
    const raw = parseFaNumber(text).replace(/[^\d.]/g, '');
    const n = Number(raw || 0);
    return Number.isFinite(n) ? n : 0;
  }

  function getCart() {
    return LS.get(KEYS.CART, { items: [] });
  }

  function setCart(cart) {
    LS.set(KEYS.CART, cart);
    syncCartUI();
    initProductsPage();
  }

  function cartCount(cart = getCart()) {
    return (cart.items || []).reduce((sum, it) => sum + Number(it.qty || 0), 0);
  }

  function cartTotal(cart = getCart()) {
    return (cart.items || []).reduce((sum, it) => sum + (Number(it.qty || 0) * Number(it.unitPrice || 0)), 0);
  }

  function upsertCartItem(item) {
    const cart = getCart();
    cart.items = Array.isArray(cart.items) ? cart.items : [];
    const idx = cart.items.findIndex((x) => x.productId === item.productId);
    if (idx >= 0) {
      cart.items[idx].qty = Number(cart.items[idx].qty || 0) + Number(item.qty || 1);
    } else {
      cart.items.push({ ...item, qty: Number(item.qty || 1) });
    }
    setCart(cart);
  }

  function changeCartQty(productId, delta) {
    const cart = getCart();
    cart.items = Array.isArray(cart.items) ? cart.items : [];
    const idx = cart.items.findIndex((x) => x.productId === productId);
    if (idx === -1) return;
    const next = Number(cart.items[idx].qty || 0) + Number(delta || 0);
    if (next <= 0) cart.items.splice(idx, 1);
    else cart.items[idx].qty = next;
    setCart(cart);
    renderCartDrawer();
  }

  function removeCartItem(productId) {
    const cart = getCart();
    cart.items = Array.isArray(cart.items) ? cart.items : [];
    cart.items = cart.items.filter((x) => x.productId !== productId);
    setCart(cart);
    renderCartDrawer();
  }

  function syncCartUI() {
    const countEl = qs('#headerCartCount');
    if (countEl) countEl.textContent = String(cartCount());
  }

  function openCartDrawer() {
    const drawer = qs('#cartDrawer');
    if (!drawer) return;
    drawer.hidden = false;
    const btn = qs('#headerCartBtn');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    renderCartDrawer();
  }

  function closeCartDrawer() {
    const drawer = qs('#cartDrawer');
    if (!drawer) return;
    drawer.hidden = true;
    const btn = qs('#headerCartBtn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  function renderCartDrawer() {
    const drawer = qs('#cartDrawer');
    const list = qs('#cartItems');
    const totalEl = qs('#cartTotal');
    const hintEl = qs('#cartHint');
    const checkoutBtn = qs('#cartCheckoutBtn');
    if (!drawer || !list || !totalEl) return;

    const cart = getCart();
    const items = Array.isArray(cart.items) ? cart.items : [];

    if (items.length === 0) {
      list.innerHTML = '<div class="muted">سبد خرید شما خالی است.</div>';
      totalEl.textContent = '0';
      if (hintEl) hintEl.textContent = 'برای اضافه کردن محصول، روی «افزودن به سبد» بزنید.';
      if (checkoutBtn) checkoutBtn.classList.add('is-disabled');
      return;
    }

    const rows = items.map((it) => {
      const title = it.title || 'محصول';
      const price = formatIR(it.unitPrice || 0);
      return `
        <div class="cart-item" data-pid="${it.productId}">
          <div class="cart-item__meta">
            <div class="cart-item__title">${title}</div>
            <div class="cart-item__price">${price} تومان</div>
          </div>
          <div class="cart-item__qty">
            <button class="cart-qty-btn" type="button" data-qty="-1" aria-label="کم کردن">−</button>
            <span class="cart-qty-val">${it.qty}</span>
            <button class="cart-qty-btn" type="button" data-qty="1" aria-label="زیاد کردن">+</button>
          </div>
          <button class="cart-item__remove" type="button" data-remove aria-label="حذف">حذف</button>
        </div>
      `;
    }).join('');

    list.innerHTML = rows;
    totalEl.textContent = `${formatIR(cartTotal(cart))} تومان`;

    const user = getCurrentUser();
    if (hintEl) {
      hintEl.textContent = user ? `اعتبار شما: ${formatIR(user.credit)} تومان` : 'برای ادامه و پرداخت، ابتدا وارد شوید.';
    }
    if (checkoutBtn) {
      checkoutBtn.classList.toggle('is-disabled', !user);
      checkoutBtn.setAttribute('href', '#');
}
  }

  function bindCartUI() {
    const btn = qs('#headerCartBtn');
    if (btn) btn.addEventListener('click', () => openCartDrawer());

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      if (t.matches('[data-cart-close]')) {
        closeCartDrawer();
      }

      const itemEl = t.closest('.cart-item');
      if (itemEl && (t.matches('[data-qty]') || t.closest('[data-qty]'))) {
        const btn = t.matches('[data-qty]') ? t : t.closest('[data-qty]');
        const delta = Number(btn?.getAttribute('data-qty') || 0);
        const pid = itemEl.getAttribute('data-pid');
        if (pid) changeCartQty(pid, delta);
      }

      if (itemEl && (t.matches('[data-remove]') || t.closest('[data-remove]'))) {
        const pid = itemEl.getAttribute('data-pid');
        if (pid) removeCartItem(pid);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCartDrawer();
    });
  }

  function bindAddToCart() {
    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const btn = t.closest('.js-add-to-cart');
      if (!btn) return;

      const pid = btn.getAttribute('data-product-id') || btn.getAttribute('data-id') || '';
      const card = btn.closest('.product-card');
      
      const titleEl = card ? (card.querySelector('.product-title') || card.querySelector('.product-name')) : null;
      
      // قیمت را از چند منبع بخوان: (۱) data-price (۲) price-now (۳) price-new
      const priceFromData = card ? Number(card.getAttribute('data-price') || 0) : 0;
      const priceEl =
        card
          ? (card.querySelector('.product-price .price-now') || card.querySelector('.product-prices .price-new'))
          : null;
      
      const title = titleEl ? titleEl.textContent.trim() : 'محصول';
      const unitPrice = priceFromData > 0
        ? priceFromData
        : (priceEl ? parsePriceIRR(priceEl.textContent) : 0);
      
      // مشخصات کوتاه (اختیاری ولی مفید برای “مشخصات” در سبد)
      const metaEl = card ? (card.querySelector('.product-meta') || card.querySelector('.product-sub')) : null;
      const meta = metaEl ? metaEl.textContent.trim() : '';
      
      if (!pid) return;
      upsertCartItem({ productId: pid, title, unitPrice, meta, qty: 1 });

      // micro feedback
      btn.classList.add('is-added');
      setTimeout(() => btn.classList.remove('is-added'), 600);
    });
  }

  // ---------- Checkout (Overlay MVP) ----------
  const PLANS_KEY = 'bs_plans';
  const DEFAULT_PLANS = [
    { id: 'p30_2', title: '۳۰٪ نقد + ۲ قسط', downPercent: 30, installments: 2 },
    { id: 'p50_3', title: '۵۰٪ نقد + ۳ قسط', downPercent: 50, installments: 3 },
    { id: 'p0_4',  title: '۴ قسط بدون پیش‌پرداخت', downPercent: 0, installments: 4 }
  ];

  function getPlans() {
    const plans = LS.get(PLANS_KEY, null);
    if (!plans || !Array.isArray(plans) || plans.length === 0) {
      LS.set(PLANS_KEY, DEFAULT_PLANS);
      return DEFAULT_PLANS;
    }
    return plans;
  }

  const checkoutState = {
    discountCode: '',
    discountPercent: 0,
    payMethod: 'cash',
    selectedPlanId: ''
  };

  function openCheckoutOverlay() {
    const ov = qs('#checkoutOverlay');
    if (!ov) return;
    ov.hidden = false;
    document.body.classList.add('modal-open');
    renderCheckout();
  }

  function closeCheckoutOverlay() {
    const ov = qs('#checkoutOverlay');
    if (!ov) return;
    ov.hidden = true;
    document.body.classList.remove('modal-open');
    checkoutState.selectedPlanId = '';
    checkoutState.discountCode = '';
    checkoutState.discountPercent = 0;
    const msg = qs('#checkoutMsg');
    if (msg) { msg.hidden = true; msg.textContent = ''; }
  }

  function openPayModal(totalText) {
    const m = qs('#payModal');
    if (!m) return;
    m.hidden = false;
    document.body.classList.add('modal-open');
    const hint = qs('#payHint');
    if (hint) hint.textContent = totalText ? `مبلغ قابل پرداخت: ${totalText}` : '';
  }

  function closePayModal() {
    const m = qs('#payModal');
    if (!m) return;
    m.hidden = true;
    document.body.classList.remove('modal-open');
    const form = qs('#payForm');
    form && form.reset();
  }

  function computeTotals(cart) {
    const items = Array.isArray(cart.items) ? cart.items : [];
    const total = cartTotal(cart);

    // savings: difference between oldUnitPrice and unitPrice when available
    const savings = items.reduce((sum, it) => {
      const oldP = Number(it.oldUnitPrice || 0);
      const newP = Number(it.unitPrice || 0);
      const qty = Number(it.qty || 0);
      const s = oldP > newP ? (oldP - newP) * qty : 0;
      return sum + s;
    }, 0);

    const discount = Math.round(total * (checkoutState.discountPercent / 100));
    const payable = Math.max(0, total - discount);

    return { total, savings, discount, payable };
  }

  function renderCheckout() {
    const user = getCurrentUser();
    if (!user) return;

    const cart = getCart();
    const items = Array.isArray(cart.items) ? cart.items : [];

    const itemsEl = qs('#checkoutItems');
    const totalEl = qs('#checkoutTotal');
    const savingsEl = qs('#checkoutSavings');
    const creditEl = qs('#checkoutCredit');
    const remEl = qs('#checkoutRemaining');

    const cashBox = qs('#checkoutCashBox');
    const creditBox = qs('#checkoutCreditBox');

    const { total, savings, payable } = computeTotals(cart);

    if (itemsEl) {
      if (items.length === 0) {
        itemsEl.innerHTML = '<div class="muted">سبد خرید شما خالی است.</div>';
      } else {
        itemsEl.innerHTML = items.map((it) => {
          const name = escapeHTML(it.title || 'محصول');
          const meta = it.meta ? `<div class="checkout-item__meta">${escapeHTML(it.meta)}</div>` : '';
          const qty = Number(it.qty || 0);
          const line = formatIR(qty * Number(it.unitPrice || 0));
          return `
            <div class="checkout-item">
              <div class="checkout-item__left">
                <div class="checkout-item__name">${name}</div>
                ${meta}
                <div class="checkout-item__qty">تعداد: ${qty}</div>
              </div>
              <div class="checkout-item__price">${line} تومان</div>
            </div>
          `;
        }).join('');
      }
    }

    if (totalEl) totalEl.textContent = `${formatIR(payable)} تومان`;
    if (savingsEl) savingsEl.textContent = `${formatIR(savings)} تومان`;
    if (creditEl) creditEl.textContent = `${formatIR(user.credit)}`;
    if (remEl) remEl.textContent = `${formatIR(Math.max(0, Number(user.credit || 0) - payable))} تومان`;

    // method toggle
    if (cashBox && creditBox) {
      cashBox.hidden = checkoutState.payMethod !== 'cash';
      creditBox.hidden = checkoutState.payMethod !== 'credit';
    }

    renderPlans(payable);
  }

  function renderPlans(payable) {
    const host = qs('#installmentPlans');
    const preview = qs('#installmentPreview');
    const confirmBtn = qs('#checkoutConfirmCredit');
    if (!host) return;

    const plans = getPlans();
    host.innerHTML = plans.map((p) => {
      const meta = p.downPercent > 0
        ? `پیش‌پرداخت: ${p.downPercent}٪ • تعداد اقساط: ${p.installments}`
        : `بدون پیش‌پرداخت • تعداد اقساط: ${p.installments}`;
      const sel = checkoutState.selectedPlanId === p.id ? ' is-selected' : '';
      return `
        <div class="plan${sel}" role="button" tabindex="0" data-plan="${p.id}">
          <div class="plan__title">${escapeHTML(p.title)}</div>
          <div class="plan__meta">${escapeHTML(meta)}</div>
        </div>
      `;
    }).join('');

    const p = plans.find((x) => x.id === checkoutState.selectedPlanId);
    if (!p) {
      if (preview) preview.hidden = true;
      if (confirmBtn) confirmBtn.disabled = true;
      return;
    }

    const down = Math.round(payable * (p.downPercent / 100));
    const rest = Math.max(0, payable - down);
    const each = p.installments > 0 ? Math.ceil(rest / p.installments) : 0;

    if (preview) {
      preview.hidden = false;
      preview.innerHTML = `
        <div><strong>پیش‌پرداخت:</strong> ${formatIR(down)} تومان</div>
        <div><strong>مبلغ هر قسط:</strong> ${formatIR(each)} تومان</div>
        <div class="muted">زمان‌بندی اقساط پس از تایید نمایش داده می‌شود.</div>
      `;
    }
    if (confirmBtn) confirmBtn.disabled = false;
  }

  function finalizeOrder({ paymentType, installmentPlan }) {
    const user = getCurrentUser();
    if (!user) return { ok: false, msg: 'ابتدا وارد شوید.' };

    const cart = getCart();
    const items = Array.isArray(cart.items) ? cart.items : [];
    if (items.length === 0) return { ok: false, msg: 'سبد خرید خالی است.' };

    const { payable, savings, discount } = computeTotals(cart);


    let installmentInfo = null;
    if (paymentType !== 'نقدی' && installmentPlan) {
      installmentInfo = buildInstallmentSchedule(payable, installmentPlan);
    }
    // credit check for credit method
    if (paymentType !== 'نقدی') {
      if (Number(user.credit || 0) < payable) {
        return { ok: false, msg: 'اعتبار کافی نیست.' };
      }
      // deduct credit
      const users = LS.get(KEYS.USERS, {});
      const nextUser = { ...user, credit: Number(user.credit || 0) - payable };
      users[user.id] = nextUser;
      LS.set(KEYS.USERS, users);
    }

    const now = new Date();
    const createdAt = now.toLocaleDateString('fa-IR');
    const id = `TRK-${Math.floor(10000 + Math.random() * 89999)}`;

    const order = {
      id,
      userId: user.id,
      createdAt,
      status: 'موفق',
      address: user.address || '—',
      paymentType,
      discount,
      savings,
      installmentPlan: installmentPlan || null,
      installmentInfo: installmentInfo || null,
      items: items.map((it) => ({
        productId: it.productId,
        title: it.title,
        qty: it.qty,
        unitPrice: it.unitPrice
      }))
    };

    const orders = getOrders();
    orders.push(order);
    LS.set(KEYS.ORDERS, orders);

    // clear cart
    LS.set(KEYS.CART, { items: [] });
    syncCartUI();
    syncAuthUI();
    renderCartDrawer();

    return { ok: true, order };
  }

  // ---------- Orders (Overlay MVP) ----------
  function openOrdersOverlay(targetUserId) {
    const ov = qs('#ordersOverlay');
    if (!ov) return;
    const user = getCurrentUser();
    if (!user) return;

    // build user switcher for staff (own + children)
    const select = qs('#ordersUserSelect');
    const switchRow = qs('#ordersUserSwitch');
    if (select && switchRow) {
      const users = LS.get(KEYS.USERS, {});
      const opts = [];
      opts.push({ id: user.id, label: `خریدهای من (${user.fullName})` });
      if (user.role === 'staff' && Array.isArray(user.children) && user.children.length) {
        user.children.forEach((cid) => {
          const cu = users[cid];
          if (cu) opts.push({ id: cu.id, label: `خریدهای فرزند (${cu.fullName})` });
        });
      }

      if (opts.length > 1) {
        select.innerHTML = opts.map((o) => `<option value="${escapeHTML(o.id)}">${escapeHTML(o.label)}</option>`).join('');
        switchRow.hidden = false;
      } else {
        select.innerHTML = '';
        switchRow.hidden = true;
      }
    }

    ov.hidden = false;
    document.body.classList.add('modal-open');
    const id = String(targetUserId || user.id);
    if (select) select.value = id;
    renderOrdersOverlay(id);
  }

  function closeOrdersOverlay() {
    const ov = qs('#ordersOverlay');
    if (!ov) return;
    ov.hidden = true;
    document.body.classList.remove('modal-open');
  }

  function orderTotal(o) {
    const items = Array.isArray(o?.items) ? o.items : [];
    return items.reduce((sum, it) => sum + (Number(it.qty || 0) * Number(it.unitPrice || 0)), 0);
  }

  function renderOrdersOverlay(userId) {
    const list = qs('#ordersList');
    const title = qs('#ordersOverlayTitle');
    if (!list) return;

    const users = LS.get(KEYS.USERS, {});
    const u = users[userId];
    if (title) title.textContent = u ? `سوابق خرید — ${u.fullName}` : 'سوابق خرید';

    const orders = ordersForUser(userId)
      .slice()
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

    if (!orders.length) {
      list.innerHTML = '<div class="orders-empty">هنوز خریدی ثبت نشده است.</div>';
      return;
    }

    list.innerHTML = orders.map((o) => {
      const total = orderTotal(o);
      const items = Array.isArray(o.items) ? o.items : [];
      const itemsHtml = items.map((it) => {
        const name = escapeHTML(it.title || 'محصول');
        const qty = Number(it.qty || 0);
        const price = formatIR(Number(it.unitPrice || 0));
        const line = formatIR(qty * Number(it.unitPrice || 0));
        return `
          <div class="orders-item">
            <div class="orders-item__name">${name}</div>
            <div class="orders-item__meta">تعداد: ${qty} • قیمت واحد: ${price}</div>
            <div class="orders-item__price">${line} تومان</div>
          </div>
        `;
      }).join('');


      let instHtml = '';
      if (o.installmentInfo && o.paymentType === 'اعتباری/اقساط') {
        const info = o.installmentInfo;
        const rows = (info.installments || []).map((x) => {
          return `
            <div class=\"installment-row\">
              <div>قسط ${x.index} — <strong>${formatIR(x.amount)} تومان</strong></div>
              <div>${escapeHTML(x.dueDate)} • ${escapeHTML(x.status || '—')}</div>
            </div>
          `;
        }).join('');

        instHtml = `
          <div class=\"installments\">
            <div class=\"installments__title\">اقساط</div>
            <div class=\"muted\">پیش‌پرداخت: ${formatIR(info.downPayment)} تومان • مبلغ هر قسط: ${formatIR(info.eachInstallment)} تومان</div>
            <div style=\"height:8px\"></div>
            ${rows}
          </div>
        `;
      }
      return `
        <article class="orders-card">
          <header class="orders-card__head">
            <div class="orders-card__trk">کد رهگیری: <strong>${escapeHTML(o.id || '—')}</strong></div>
            <div class="orders-card__date">${escapeHTML(o.createdAt || '—')}</div>
          </header>
          <div class="orders-card__meta">
            <span class="pill">${escapeHTML(o.status || '—')}</span>
            <span class="pill pill--muted">${escapeHTML(o.paymentType || '—')}</span>
            <span class="pill pill--accent">مبلغ: ${formatIR(total)} تومان</span>
          </div>
          <div class="orders-card__addr">آدرس: ${escapeHTML(o.address || '—')}</div>
          <div class=\"orders-card__items\">${itemsHtml}</div>
          ${instHtml}
        </article>
      `;
    }).join('');
  }

  function bindOrdersUI() {
    if (markBound(document.documentElement, 'ordersUI')) return;


    // Open orders from anywhere (user menu / other triggers)
    on(document, 'click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const openBtn = t.closest('#userMenuOrders,[data-open-orders]');
      if (openBtn) {
        e.preventDefault();
        openOrdersOverlay();
      }
    });
    // close actions
    on(document, 'click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.matches('[data-orders-close]')) {
        e.preventDefault();
        closeOrdersOverlay();
      }
    });

    on(document, 'keydown', (e) => {
      const ov = qs('#ordersOverlay');
      if (e.key === 'Escape' && ov && !ov.hidden) closeOrdersOverlay();
    });

    const select = qs('#ordersUserSelect');
    on(select, 'change', () => {
      const v = String(select?.value || '');
      if (v) renderOrdersOverlay(v);
    });
  }

  function bindCheckoutUI() {
    // open checkout from cart
    on(document, 'click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      if (t.closest('#cartCheckoutBtn')) {
        e.preventDefault();
        const user = getCurrentUser();
        if (!user) {
          // open login popover/sheet
          const desktopBtn = qs('#headerAuthBtn');
          if (desktopBtn && !desktopBtn.hidden) desktopBtn.click();
          const msg = qs('#cartHint');
          if (msg) msg.textContent = 'برای ادامه و پرداخت، ابتدا وارد شوید.';
          return;
        }
        closeCartDrawer();
        openCheckoutOverlay();
      }

      if (t.matches('[data-checkout-close]')) {
        closeCheckoutOverlay();
      }

      if (t.matches('[data-pay-close]')) {
        closePayModal();
      }

      const plan = t.closest('[data-plan]');
      if (plan) {
        const pid = plan.getAttribute('data-plan');
        checkoutState.selectedPlanId = pid || '';
        renderCheckout();
      }
    });

    // pay method change
    on(document, 'change', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.matches('input[name="payMethod"]')) {
        checkoutState.payMethod = t.value === 'credit' ? 'credit' : 'cash';
        renderCheckout();
      }
    });

    // discount apply
    const applyBtn = qs('#checkoutApplyDiscount');
    on(applyBtn, 'click', () => {
      const input = qs('#checkoutDiscountCode');
      const code = String(input?.value || '').trim().toUpperCase();
      checkoutState.discountCode = code;

      // demo codes
      if (code === 'BEHSAYAR10') checkoutState.discountPercent = 10;
      else if (code === 'FAMILY15') checkoutState.discountPercent = 15;
      else checkoutState.discountPercent = 0;

      const msg = qs('#checkoutMsg');
      if (msg) {
        if (checkoutState.discountPercent > 0) {
          msg.textContent = `کد تخفیف اعمال شد (${checkoutState.discountPercent}٪).`;
          msg.hidden = false;
        } else if (code) {
          msg.textContent = 'کد تخفیف معتبر نیست.';
          msg.hidden = false;
        } else {
          msg.textContent = '';
          msg.hidden = true;
        }
      }
      renderCheckout();
    });

    // cash pay
    const cashBtn = qs('#checkoutPayCash');
    on(cashBtn, 'click', () => {
      const user = getCurrentUser();
      if (!user) return;
      const cart = getCart();
      const { payable } = computeTotals(cart);
      if (payable <= 0) return;
      openPayModal(`${formatIR(payable)} تومان`);
    });

    // pay form submit -> success
    const payForm = qs('#payForm');
    on(payForm, 'submit', (e) => {
      e.preventDefault();
      const res = finalizeOrder({ paymentType: 'نقدی' });
      const msg = qs('#checkoutMsg');
      if (!res.ok) {
        if (msg) { msg.textContent = res.msg; msg.hidden = false; }
        return;
      }
      closePayModal();
      if (msg) {
        msg.textContent = `پرداخت موفق بود. کد رهگیری: ${res.order.id}`;
        msg.hidden = false;
      }
      renderCheckout();
    });

    // credit confirm
    const creditConfirm = qs('#checkoutConfirmCredit');
    on(creditConfirm, 'click', () => {
      const plans = getPlans();
      const p = plans.find((x) => x.id === checkoutState.selectedPlanId);
      const msg = qs('#checkoutMsg');
      if (!p) {
        if (msg) { msg.textContent = 'لطفاً یک شرایط اقساط را انتخاب کنید.'; msg.hidden = false; }
        return;
      }
      const res = finalizeOrder({ paymentType: 'اعتباری/اقساط', installmentPlan: p });
      if (!res.ok) {
        if (msg) { msg.textContent = res.msg; msg.hidden = false; }
        return;
      }
      if (msg) {
        msg.textContent = `خرید با موفقیت ثبت شد. کد رهگیری: ${res.order.id}`;
        msg.hidden = false;
      }
      renderCheckout();
    });
  }

  // ---------- Products page: filter/sort (SAFE) ----------
  function initProductsPage() {
    const isProductsPage = document.body && document.body.classList.contains('page-products');
    if (!isProductsPage) return;
    if (markBound(document.body, 'productsPage')) return;

    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const q = document.getElementById('productsSearch');
    const cat = document.getElementById('productsCategory');
    const grade = document.getElementById('productsGrade');
    const sort = document.getElementById('productsSort');

    const cards = Array.from(grid.querySelectorAll('.product-card'));

    const norm = (s) => (s || '').toString().trim().toLowerCase();

    function applyFromQueryString() {
      const params = new URLSearchParams(location.search);
      const c = params.get('cat');
      if (c && cat) cat.value = c;
    }

    function getTitle(card) {
      // Prefer data-title; fallback to visible title text
      const ds = card && card.dataset ? card.dataset.title : '';
      if (ds) return ds;
      const el = card ? card.querySelector('.product-title, .product-name') : null;
      return el ? el.textContent : '';
    }

    function filterCards() {
      const query = norm(q && q.value);
      const catVal = (cat && cat.value) || 'all';
      const gradeVal = (grade && grade.value) || 'all';

      cards.forEach((card) => {
        const title = norm(getTitle(card));
        const c = (card.dataset && card.dataset.cat) ? card.dataset.cat : 'all';
        const g = (card.dataset && card.dataset.grade) ? card.dataset.grade : 'all';

        const matchQuery = !query || title.includes(query);
        const matchCat = (catVal === 'all') || (c === catVal);
        const matchGrade = (gradeVal === 'all') || (g === gradeVal);

        card.style.display = (matchQuery && matchCat && matchGrade) ? '' : 'none';
      });
    }

    function sortCards() {
      const mode = (sort && sort.value) || 'best';
      const visible = cards.filter((c) => c.style.display !== 'none');

      const getNum = (el, key) => {
        const v = el && el.dataset ? el.dataset[key] : undefined;
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
      };

      visible.sort((a, b) => {
        if (mode === 'best') return getNum(b, 'sold') - getNum(a, 'sold');
        if (mode === 'new') return (new Date(b.dataset.created || 0)) - (new Date(a.dataset.created || 0));
        if (mode === 'discount_desc' || mode === 'discount') return getNum(b, 'discount') - getNum(a, 'discount');
        if (mode === 'price_desc' || mode === 'priceHigh') return getNum(b, 'price') - getNum(a, 'price');
        if (mode === 'price_asc' || mode === 'priceLow') return getNum(a, 'price') - getNum(b, 'price');
        return 0;
      });

      // Reorder only visible cards, in a single DOM write (prevents interaction glitches)
      const frag = document.createDocumentFragment();
      visible.forEach((el) => frag.appendChild(el));
      grid.appendChild(frag);
    }

    function refresh(mode) {
      filterCards();
      if (mode !== 'filter') sortCards();
    }

    applyFromQueryString();
    refresh();

    // Search: filter only (no resort on each keystroke)
    if (q) {
      q.addEventListener('input', () => refresh('filter'));
      q.addEventListener('change', () => refresh('filter'));
    }
    // Filters/sort: refresh fully
    if (cat) cat.addEventListener('change', () => refresh());
    if (grade) grade.addEventListener('change', () => refresh());
    if (sort) sort.addEventListener('change', () => refresh());
  }


  // ---------- Admin (Overlay MVP) ----------
  const ADMIN_CATALOG_KEY = 'bs_admin_catalog';
  const ADMIN_NEWS_KEY = 'bs_admin_news';

  function getAdminCatalog() {
    const list = LS.get(ADMIN_CATALOG_KEY, null);
    return Array.isArray(list) ? list : [];
  }
  function setAdminCatalog(list) { LS.set(ADMIN_CATALOG_KEY, Array.isArray(list) ? list : []); }

  function getAdminNews() {
    const list = LS.get(ADMIN_NEWS_KEY, null);
    return Array.isArray(list) ? list : [];
  }
  function setAdminNews(list) { LS.set(ADMIN_NEWS_KEY, Array.isArray(list) ? list : []); }

  function openAdminOverlay() {
    const user = getCurrentUser();
    if (!isAdminUser(user)) return;
    const ov = qs('#adminOverlay');
    if (!ov) return;
    ov.hidden = false;
    document.body.classList.add('modal-open');
    const btn = qs('#headerAdminBtn');
    btn && btn.setAttribute('aria-expanded', 'true');
    renderAdminUsers();
    renderAdminCatalog();
    renderAdminNews();
    renderAdminReports();
  }

  function closeAdminOverlay() {
    const ov = qs('#adminOverlay');
    if (!ov) return;
    ov.hidden = true;
    document.body.classList.remove('modal-open');
    const btn = qs('#headerAdminBtn');
    btn && btn.setAttribute('aria-expanded', 'false');
  }

  function setAdminTab(tab) {
    qsa('[data-admin-tab]').forEach((b) => {
      const active = b.getAttribute('data-admin-tab') === tab;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    qsa('[data-admin-panel]').forEach((p) => {
      const active = p.getAttribute('data-admin-panel') === tab;
      p.classList.toggle('is-active', active);
    });
  }

  function renderAdminUsers() {
    const host = qs('#adminUsersList');
    if (!host) return;
    const users = LS.get(KEYS.USERS, {});
    const q = String(qs('#adminUserQ')?.value || '').trim();
    const role = String(qs('#adminUserRole')?.value || 'all');

    const arr = Object.values(users || {});
    const norm = (s) => String(s || '').toLowerCase();

    const filtered = arr.filter((u) => {
      if (role !== 'all' && String(u.role) !== role) return false;
      if (!q) return true;
      const hay = [u.fullName, u.nationalId, u.id, u.mobile].map(norm).join(' ');
      return hay.includes(norm(q));
    });

    const usersMap = users || {};
    host.innerHTML = filtered.map((u) => {
      const parentLine = (u.role === 'student' && u.parentId && usersMap[u.parentId])
        ? `فرزندِ: ${escapeHTML(usersMap[u.parentId].fullName)}${usersMap[u.parentId].positionTitle ? ' ('+escapeHTML(usersMap[u.parentId].positionTitle)+')' : ''}`
        : '';
      const roleLabel = u.roleLabel || (u.role === 'admin' ? 'مدیر سیستم' : u.role === 'staff' ? 'پرسنل' : 'دانش‌آموز');
      return `
        <div class="admin-user-card" data-user="${escapeHTML(u.id)}">
          <div class="admin-user-main">
            <img class="admin-user-avatar" src="${escapeHTML(u.avatar || ('images/avatars/'+u.id+'.png'))}" alt="">
            <div>
              <div class="admin-user-name">${escapeHTML(u.fullName || '—')}</div>
              <div class="admin-user-meta">${escapeHTML(roleLabel)} • کد: ${escapeHTML(u.id)} • کدملی: ${escapeHTML(u.nationalId || '—')}${parentLine ? ' • ' + parentLine : ''}</div>
            </div>
          </div>
          <div class="admin-user-actions">
            <div class="muted" style="margin-bottom:6px">اعتبار فعلی: <strong>${formatIR(u.credit || 0)}</strong> تومان</div>
            <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center">
              <input class="admin-input admin-input--num" type="number" inputmode="numeric" min="0" placeholder="افزایش اعتبار" data-credit-amount>
              <button class="btn btn-primary" type="button" data-credit-apply>اعمال</button>
            </div>
          </div>
        </div>
      `;
    }).join('') || '<div class="muted">کاربری یافت نشد.</div>';
  }

  function applyCreditToUser(userId, amount) {
    const users = LS.get(KEYS.USERS, {});
    const u = users[userId];
    if (!u) return;
    const a = Math.max(0, Number(amount || 0));
    users[userId] = { ...u, credit: Number(u.credit || 0) + a };
    LS.set(KEYS.USERS, users);
  }

  function applyCreditBulk(role, amount) {
    const users = LS.get(KEYS.USERS, {});
    const a = Math.max(0, Number(amount || 0));
    Object.keys(users).forEach((id) => {
      const u = users[id];
      if (!u) return;
      if (role !== 'all' && String(u.role) !== role) return;
      users[id] = { ...u, credit: Number(u.credit || 0) + a };
    });
    LS.set(KEYS.USERS, users);
  }

  function exportUsersCSV() {
    const users = LS.get(KEYS.USERS, {});
    const rows = [['id','fullName','role','nationalId','mobile','credit','parentId','positionTitle','address']];
    Object.values(users || {}).forEach((u) => {
      rows.push([
        u.id, u.fullName, u.role, u.nationalId, u.mobile, u.credit, u.parentId || '', u.positionTitle || '', (u.address || '').replace(/\n/g,' ')
      ]);
    });
    const csv = rows.map(r => r.map(x => `"${String(x ?? '').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'behsayar_users.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1200);
  }

  function renderAdminCatalog() {
    const host = qs('#adminCatalogList');
    if (!host) return;
    const list = getAdminCatalog();
    if (!list.length) {
      host.innerHTML = '<div class="muted">موردی ثبت نشده است.</div>';
      return;
    }
    host.innerHTML = list.map((x, i) => {
      return `
        <div class="admin-user-card" data-cat-idx="${i}">
          <div>
            <div class="admin-user-name">${escapeHTML(x.title || '—')}</div>
            <div class="admin-user-meta">${escapeHTML(x.type === 'service' ? 'خدمت' : 'محصول')} • قیمت: ${formatIR(x.price || 0)} تومان</div>
          </div>
          <button class="btn" type="button" data-cat-del>حذف</button>
        </div>
      `;
    }).join('');
  }

  function renderAdminNews() {
    const host = qs('#adminNewsList');
    if (!host) return;
    const list = getAdminNews();
    if (!list.length) {
      host.innerHTML = '<div class="muted">موردی ثبت نشده است.</div>';
      return;
    }
    host.innerHTML = list.map((x, i) => {
      return `
        <div class="admin-user-card" data-news-idx="${i}">
          <div>
            <div class="admin-user-name">${escapeHTML(x.title || '—')}</div>
            <div class="admin-user-meta">تاریخ: ${escapeHTML(x.date || '—')}</div>
          </div>
          <button class="btn" type="button" data-news-del>حذف</button>
        </div>
      `;
    }).join('');
  }

  function renderAdminReports() {
    const q = String(qs('#adminReportQ')?.value || '').trim().toLowerCase();
    const users = LS.get(KEYS.USERS, {});
    const orders = getOrders();

    // aggregate by product title
    const agg = new Map(); // key -> {title, count, revenue, satSum, satN}
    (Array.isArray(orders) ? orders : []).forEach((o) => {
      const sat = Number(o.satisfaction || 0);
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((it) => {
        const key = String(it.productId || it.title || 'x');
        const cur = agg.get(key) || { title: it.title || '—', count: 0, revenue: 0, satSum: 0, satN: 0 };
        cur.count += Number(it.qty || 0);
        cur.revenue += Number(it.qty || 0) * Number(it.unitPrice || 0);
        if (sat > 0) { cur.satSum += sat; cur.satN += 1; }
        agg.set(key, cur);
      });
    });

    const aggArr = Array.from(agg.values()).sort((a,b) => b.revenue - a.revenue);
    const aggHost = qs('#adminAggReport');
    if (aggHost) {
      aggHost.innerHTML = aggArr.map((x) => {
        const avg = x.satN ? (x.satSum / x.satN).toFixed(1) : '—';
        return `
          <div class="admin-user-card">
            <div>
              <div class="admin-user-name">${escapeHTML(x.title)}</div>
              <div class="admin-user-meta">فروش: ${formatIR(x.count)} • مبلغ: ${formatIR(x.revenue)} تومان • رضایت: ${avg}</div>
            </div>
          </div>
        `;
      }).join('') || '<div class="muted">داده‌ای برای نمایش نیست.</div>';
    }

    const detHost = qs('#adminOrdersReport');
    if (detHost) {
      const norm = (s) => String(s || '').toLowerCase();
      const filtered = (Array.isArray(orders) ? orders : []).filter((o) => {
        if (!q) return true;
        const u = users[o.userId];
        const parent = u && u.role === 'student' && u.parentId ? users[u.parentId] : null;
        const hay = [
          o.id, o.createdAt, o.paymentType, u?.fullName, u?.nationalId, u?.id,
          parent?.fullName, parent?.positionTitle
        ].map(norm).join(' ');
        return hay.includes(q);
      }).slice().sort((a,b) => String(b.createdAt||'').localeCompare(String(a.createdAt||'')));

      detHost.innerHTML = filtered.map((o) => {
        const u = users[o.userId];
        const roleLabel = u?.roleLabel || '—';
        let extra = '';
        if (u && u.role === 'student' && u.parentId && users[u.parentId]) {
          const p = users[u.parentId];
          extra = ` • فرزندِ ${escapeHTML(p.fullName)}${p.positionTitle ? ' ('+escapeHTML(p.positionTitle)+')' : ''}`;
        }
        return `
          <div class="admin-user-card">
            <div>
              <div class="admin-user-name">کد رهگیری: ${escapeHTML(o.id || '—')}</div>
              <div class="admin-user-meta">${escapeHTML(o.createdAt || '—')} • ${escapeHTML(roleLabel)} • ${escapeHTML(u?.fullName || '—')}${extra}</div>
              <div class="admin-user-meta">مبلغ: ${formatIR(orderTotal(o))} تومان • پرداخت: ${escapeHTML(o.paymentType || '—')} • رضایت: ${escapeHTML(String(o.satisfaction || '—'))}</div>
            </div>
          </div>
        `;
      }).join('') || '<div class="muted">سفارشی مطابق فیلتر یافت نشد.</div>';
    }
  }

  function bindAdminUI() {
    if (markBound(document.documentElement, 'adminUI')) return;

    const btn = qs('#headerAdminBtn');
    on(btn, 'click', (e) => {
      e.preventDefault();
      openAdminOverlay();
    });

    on(document, 'click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      if (t.matches('[data-admin-close]')) {
        e.preventDefault();
        closeAdminOverlay();
        return;
      }

      const tab = t.closest('[data-admin-tab]');
      if (tab) {
        e.preventDefault();
        setAdminTab(tab.getAttribute('data-admin-tab') || 'users');
        return;
      }

      // per-user credit apply
      const card = t.closest('[data-user]');
      if (card && t.matches('[data-credit-apply]')) {
        const uid = card.getAttribute('data-user');
        const amount = Number(card.querySelector('[data-credit-amount]')?.value || 0);
        applyCreditToUser(uid, amount);
        renderAdminUsers();
        syncAuthUI();
        return;
      }

      // bulk credit
      if (t.matches('#adminCreditApplyAll')) {
        const amount = Number(qs('#adminCreditAmountAll')?.value || 0);
        const role = String(qs('#adminCreditTargetAll')?.value || 'all');
        applyCreditBulk(role, amount);
        renderAdminUsers();
        syncAuthUI();
        return;
      }

      if (t.matches('#adminExportUsers')) {
        exportUsersCSV();
        return;
      }

      if (t.matches('#adminCatalogAdd')) {
        const type = String(qs('#adminCatalogType')?.value || 'product');
        const title = String(qs('#adminCatalogTitle')?.value || '').trim();
        const price = Number(qs('#adminCatalogPrice')?.value || 0);
        if (!title) return;
        const list = getAdminCatalog();
        list.unshift({ type, title, price, createdAt: Date.now() });
        setAdminCatalog(list);
        qs('#adminCatalogTitle').value = '';
        qs('#adminCatalogPrice').value = '';
        renderAdminCatalog();
        return;
      }

      const catCard = t.closest('[data-cat-idx]');
      if (catCard && t.matches('[data-cat-del]')) {
        const idx = Number(catCard.getAttribute('data-cat-idx') || -1);
        const list = getAdminCatalog();
        if (idx >= 0) { list.splice(idx, 1); setAdminCatalog(list); renderAdminCatalog(); }
        return;
      }

      if (t.matches('#adminNewsAdd')) {
        const title = String(qs('#adminNewsTitle')?.value || '').trim();
        const date = String(qs('#adminNewsDate')?.value || '').trim();
        if (!title) return;
        const list = getAdminNews();
        list.unshift({ title, date, createdAt: Date.now() });
        setAdminNews(list);
        qs('#adminNewsTitle').value = '';
        qs('#adminNewsDate').value = '';
        renderAdminNews();
        return;
      }

      const newsCard = t.closest('[data-news-idx]');
      if (newsCard && t.matches('[data-news-del]')) {
        const idx = Number(newsCard.getAttribute('data-news-idx') || -1);
        const list = getAdminNews();
        if (idx >= 0) { list.splice(idx, 1); setAdminNews(list); renderAdminNews(); }
        return;
      }

      if (t.matches('#adminReportRefresh')) {
        renderAdminReports();
        return;
      }
    });

    on(document, 'input', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.matches('#adminUserQ') || t.matches('#adminUserRole')) renderAdminUsers();
      if (t.matches('#adminReportQ')) renderAdminReports();
    });

    on(document, 'keydown', (e) => {
      const ov = qs('#adminOverlay');
      if (e.key === 'Escape' && ov && !ov.hidden) closeAdminOverlay();
    });
  }

// ---------- boot ----------
  function boot() {
    ensureSeedUsers();
    ensureSeedOrders();
    bindHeaderAuth();
    bindUserMenu();
    bindSheets();
    bindMobileAuth();
    bindMobileCats();
    bindCategoriesDropdown();
    bindHeaderBottomCollapse();
    bindCartUI();
    bindAddToCart();
    bindCheckoutUI();
    bindOrdersUI();
    bindAdminUI();
    syncAuthUI();
    syncCartUI();
    initProductsPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

/* === Home Slider (RTL: right → left) === */
/* === Home Slider (RTL: enter from right, exit to left) === */
(() => {
  const root = document.querySelector('.post-slider');
  const slidesWrap = document.querySelector('.post-slides');
  const slides = Array.from(document.querySelectorAll('.post-slide'));
  if (!root || !slidesWrap || slides.length < 2) return;

  const DURATION = 600; // باید با CSS هماهنگ باشد
  const INTERVAL = 5000;

  let current = 0;
  let timer = null;
  let busy = false;

  // حالت پایه: همه بیرون از راست
  slides.forEach((s, i) => {
    s.classList.remove('is-active', 'is-exit-left');
    s.style.pointerEvents = 'none';
    if (i === 0) s.classList.add('is-active');
  });

  const goNext = () => {
    if (busy) return;
    busy = true;

    const prev = current;
    const next = (current + 1) % slides.length;

    const prevEl = slides[prev];
    const nextEl = slides[next];

    // next را آماده کن (بیرون از راست) و بعد فعالش کن
    nextEl.classList.remove('is-exit-left');
    // با یک فریم فاصله تا مرورگر ترنزیشن را درست اعمال کند
    requestAnimationFrame(() => {
      // خروج قبلی به چپ
      prevEl.classList.remove('is-active');
      prevEl.classList.add('is-exit-left');

      // ورود بعدی از راست
      nextEl.classList.add('is-active');

      current = next;

      // پاکسازی بعد از اتمام ترنزیشن
      window.setTimeout(() => {
        // اسلاید قبلی را فقط به حالت پایه برگردان (بیرون از راست)
        prevEl.classList.remove('is-exit-left');
        busy = false;
      }, DURATION + 50);
    });
  };

  const start = () => {
    stop();
    timer = window.setInterval(goNext, INTERVAL);
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  // اگر تب inactive شد، تایمر را متوقف کن تا با برگشت “خالی” نشود
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
})();


