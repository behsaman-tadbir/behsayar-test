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
    ORDERS: 'bs_orders',
    PRODUCTS: 'bs_products',
    NEWS: 'bs_news'
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

  const DEMO_PRODUCTS = [
    { id: 'prd-001', type: 'product', title: 'پک کتاب ریاضی دهم', price: 890000, category: 'کتاب' },
    { id: 'prd-002', type: 'product', title: 'پک کتاب علوم نهم', price: 760000, category: 'کتاب' },
    { id: 'prd-003', type: 'product', title: 'دفتر برنامه‌ریزی هفتگی', price: 120000, category: 'لوازم آموزشی' },
    { id: 'srv-001', type: 'service', title: 'مشاوره برنامه‌ریزی درسی', price: 1200000, category: 'خدمت' }
  ];

  const DEMO_NEWS = [
    { id: 'nw-001', title: 'شروع ثبت‌نام دوره‌های بهمن', date: '1404/11/01', body: 'ثبت‌نام دوره‌های جدید آغاز شد. ظرفیت محدود است.' },
    { id: 'nw-002', title: 'وبینار رایگان خانواده و آموزش', date: '1404/11/07', body: 'وبینار تخصصی با محوریت مدیریت زمان و انگیزه دانش‌آموز.' }
  ];


  function ensureSeedOrders() {
    const orders = LS.get(KEYS.ORDERS, null);
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      LS.set(KEYS.ORDERS, DEMO_ORDERS);
    }

  function ensureSeedProducts() {
    const items = LS.get(KEYS.PRODUCTS, null);
    if (!items || !Array.isArray(items) || items.length === 0) {
      LS.set(KEYS.PRODUCTS, DEMO_PRODUCTS);
    }
  }

  function ensureSeedNews() {
    const items = LS.get(KEYS.NEWS, null);
    if (!items || !Array.isArray(items) || items.length === 0) {
      LS.set(KEYS.NEWS, DEMO_NEWS);
    }
  }

  }

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

      // Toggle menu options
      const adminLink = qs('#userMenuAdminPage');
      const ordersLink = qs('#userMenuOrders');
      if (adminLink) adminLink.hidden = user.role !== 'admin';
      if (ordersLink) ordersLink.hidden = user.role === 'admin';

      if (ordersLink && user.role !== 'admin') {
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
            ${it.meta ? `<div class="cart-item__meta">${it.meta}</div>` : ''}
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
      checkoutBtn.setAttribute('href', user ? 'checkout.html' : '#');
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


  // ---------- Admin Panel (Overlay MVP) ----------
  const adminState = {
    tab: 'users',
    reportQ: '',
    reportDate: ''
  };

  function isAdmin() {
    const u = getCurrentUser();
    return !!u && u.role === 'admin';
  }

  function openAdminOverlay() {
    const ov = qs('#adminOverlay');
    if (!ov) return;
    if (!isAdmin()) return;
    ov.hidden = false;
    document.body.classList.add('modal-open');
    adminState.tab = 'users';
    renderAdmin();
  }

  function closeAdminOverlay() {
    const ov = qs('#adminOverlay');
    if (!ov) return;
    ov.hidden = true;
    document.body.classList.remove('modal-open');
    closeAdminUserModal();
    closeAdminItemModal();
  }

  function setAdminTab(tab) {
    adminState.tab = tab;
    renderAdmin();
  }

  function renderAdmin() {
    const ov = qs('#adminOverlay');
    if (!ov || ov.hidden) return;

    // tabs
    qsa('.admin-tab').forEach((b) => {
      const t = b.getAttribute('data-admin-tab') || '';
      const onTab = t === adminState.tab;
      b.classList.toggle('is-active', onTab);
      b.setAttribute('aria-selected', onTab ? 'true' : 'false');
    });

    // sections
    qsa('[data-admin-section]').forEach((sec) => {
      const s = sec.getAttribute('data-admin-section') || '';
      sec.hidden = s !== adminState.tab;
    });

    if (adminState.tab === 'users') renderAdminUsers();
    if (adminState.tab === 'catalog') renderAdminCatalog();
    if (adminState.tab === 'news') renderAdminNews();
    if (adminState.tab === 'reports') renderAdminReports();
  }

  function getUsersList() {
    const users = LS.get(KEYS.USERS, {});
    return Object.values(users || {});
  }

  function roleLabel(role) {
    if (role === 'student') return 'دانش‌آموز';
    if (role === 'staff') return 'پرسنل';
    if (role === 'admin') return 'مدیر سیستم';
    return role || '—';
  }

  function normalize(s) {
    return String(s || '').trim().toLowerCase();
  }

  function renderAdminUsers() {
    const q = normalize(qs('#adminUserQ')?.value);
    const role = String(qs('#adminUserRole')?.value || '');

    const tbody = qs('#adminUsersTable tbody');
    if (!tbody) return;

    const list = getUsersList()
      .filter((u) => {
        if (role && u.role !== role) return false;
        if (!q) return true;
        const hay = [
          u.id, u.fullName, u.nationalId, u.mobile, u.role,
          u.fatherName, u.address, u.positionTitle
        ].join(' ');
        return normalize(hay).includes(q);
      })
      .sort((a, b) => String(a.id).localeCompare(String(b.id)));

    tbody.innerHTML = list.map((u) => {
      return `
        <tr data-uid="${escapeHTML(u.id)}">
          <td><strong>${escapeHTML(u.id)}</strong></td>
          <td>${escapeHTML(u.fullName || '—')}</td>
          <td>${escapeHTML(roleLabel(u.role))}</td>
          <td>${escapeHTML(u.nationalId || '—')}</td>
          <td>${escapeHTML(u.mobile || '—')}</td>
          <td>${formatIR(Number(u.credit || 0))}</td>
        </tr>
      `;
    }).join('');

    // credit target options
    const mode = String(qs('#adminCreditMode')?.value || 'single');
    const targetSel = qs('#adminCreditTarget');
    if (targetSel) {
      if (mode === 'single') {
        targetSel.innerHTML = list.map((u) => `<option value="${escapeHTML(u.id)}">${escapeHTML(u.id)} — ${escapeHTML(u.fullName || '')}</option>`).join('');
        targetSel.disabled = false;
      } else if (mode === 'role') {
        targetSel.innerHTML = `
          <option value="student">دانش‌آموز</option>
          <option value="staff">پرسنل</option>
          <option value="admin">مدیر سیستم</option>
        `;
        targetSel.disabled = false;
      } else {
        targetSel.innerHTML = `<option value="all">همه کاربران</option>`;
        targetSel.disabled = true;
      }
    }
  }

  function applyCredit() {
    const amount = Number(qs('#adminCreditAmount')?.value || 0);
    const mode = String(qs('#adminCreditMode')?.value || 'single');
    const target = String(qs('#adminCreditTarget')?.value || '');
    const out = qs('#adminCreditMsg');
    if (!amount || amount === 0) {
      if (out) { out.textContent = 'مبلغ معتبر وارد کنید.'; out.hidden = false; }
      return;
    }

    const users = LS.get(KEYS.USERS, {});
    const ids = Object.keys(users || {});
    let touched = 0;

    ids.forEach((id) => {
      const u = users[id];
      if (!u) return;

      if (mode === 'single' && id !== target) return;
      if (mode === 'role' && u.role !== target) return;

      const next = { ...u, credit: Number(u.credit || 0) + amount };
      users[id] = next;
      touched += 1;
    });

    LS.set(KEYS.USERS, users);
    syncAuthUI();

    if (out) {
      out.textContent = `اعتبار برای ${touched} کاربر به‌روزرسانی شد.`;
      out.hidden = false;
    }
    renderAdminUsers();
  }

  function downloadText(filename, text) {
    try {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (_) {}
  }

  function exportUsersCsv() {
    const list = getUsersList().sort((a, b) => String(a.id).localeCompare(String(b.id)));
    const header = ['id','fullName','role','nationalId','mobile','credit','fatherName','positionTitle','parentId','address','avatar'].join(',');
    const rows = list.map((u) => [
      u.id, u.fullName, u.role, u.nationalId, u.mobile, Number(u.credit||0),
      u.fatherName, u.positionTitle, u.parentId, u.address, u.avatar
    ].map((x) => `"${String(x ?? '').replaceAll('"','""')}"`).join(','));
    const csv = [header, ...rows].join('\n');
    downloadText('users.csv', csv);
  }

  // --- User Modal ---
  let adminEditingUserId = null;

  function openAdminUserModal(userId) {
    const m = qs('#adminUserModal');
    if (!m) return;
    const users = LS.get(KEYS.USERS, {});
    const u = userId ? users[userId] : null;

    adminEditingUserId = userId || null;

    const title = qs('#adminUserModalTitle');
    if (title) title.textContent = userId ? `ویرایش کاربر ${userId}` : 'ثبت کاربر جدید';

    const setVal = (id, v) => { const el = qs(id); if (el) el.value = v ?? ''; };

    setVal('#auId', u?.id || '');
    setVal('#auPassword', u?.password || '123');
    setVal('#auRole', u?.role || 'student');
    setVal('#auFullName', u?.fullName || '');
    setVal('#auNationalId', u?.nationalId || '');
    setVal('#auMobile', u?.mobile || '');
    setVal('#auFatherName', u?.fatherName || '');
    setVal('#auPosition', u?.positionTitle || '');
    setVal('#auParentId', u?.parentId || '');
    setVal('#auAvatar', u?.avatar || `images/avatars/${(u?.id||'')}.png`);
    setVal('#auCredit', u?.credit ?? 5000000);
    setVal('#auAddress', u?.address || '');

    const idEl = qs('#auId');
    if (idEl) idEl.disabled = !!userId;

    const msg = qs('#adminUserFormMsg');
    if (msg) { msg.hidden = true; msg.textContent = ''; }

    m.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeAdminUserModal() {
    const m = qs('#adminUserModal');
    if (!m) return;
    m.hidden = true;
    // do not remove modal-open if main admin is still open
    const adminOv = qs('#adminOverlay');
    if (!adminOv || adminOv.hidden) document.body.classList.remove('modal-open');
  }

  function saveAdminUser() {
    const msg = qs('#adminUserFormMsg');
    const id = String(qs('#auId')?.value || '').trim();
    const password = String(qs('#auPassword')?.value || '').trim();
    const role = String(qs('#auRole')?.value || 'student');
    const fullName = String(qs('#auFullName')?.value || '').trim();

    if (!id || !password || !fullName) {
      if (msg) { msg.textContent = 'کد، رمز عبور و نام الزامی است.'; msg.hidden = false; }
      return;
    }

    const users = LS.get(KEYS.USERS, {});
    if (!adminEditingUserId && users[id]) {
      if (msg) { msg.textContent = 'این کد قبلاً ثبت شده است.'; msg.hidden = false; }
      return;
    }

    const u = {
      id,
      password,
      role,
      roleLabel: roleLabel(role),
      fullName,
      nationalId: String(qs('#auNationalId')?.value || '').trim(),
      mobile: String(qs('#auMobile')?.value || '').trim(),
      fatherName: String(qs('#auFatherName')?.value || '').trim(),
      positionTitle: String(qs('#auPosition')?.value || '').trim(),
      parentId: String(qs('#auParentId')?.value || '').trim(),
      avatar: String(qs('#auAvatar')?.value || '').trim() || `images/avatars/${id}.png`,
      credit: Number(qs('#auCredit')?.value || 5000000),
      address: String(qs('#auAddress')?.value || '').trim()
    };

    if (u.role !== 'student') u.parentId = '';
    if (u.role !== 'staff') u.positionTitle = u.positionTitle || '';

    users[id] = u;
    LS.set(KEYS.USERS, users);

    if (msg) { msg.textContent = 'ذخیره شد.'; msg.hidden = false; }
    syncAuthUI();
    renderAdminUsers();

    setTimeout(() => closeAdminUserModal(), 300);
  }

  // --- Catalog/News storage ---
  function getCatalog() { return LS.get(KEYS.PRODUCTS, []) || []; }
  function setCatalog(list) { LS.set(KEYS.PRODUCTS, list); }
  function getNews() { return LS.get(KEYS.NEWS, []) || []; }
  function setNews(list) { LS.set(KEYS.NEWS, list); }

  function renderAdminCatalog() {
    const listEl = qs('#adminCatalogList');
    if (!listEl) return;
    const items = getCatalog().slice().sort((a,b) => String(a.id).localeCompare(String(b.id)));
    if (!items.length) {
      listEl.innerHTML = '<div class="admin-hint">موردی ثبت نشده است.</div>';
      return;
    }
    listEl.innerHTML = items.map((it) => {
      const type = it.type === 'service' ? 'خدمت' : 'محصول';
      const price = formatIR(Number(it.price || 0));
      return `
        <div class="admin-row" data-item-type="catalog" data-item-id="${escapeHTML(it.id)}">
          <div class="admin-row__main">
            <div class="admin-row__title">${escapeHTML(it.title || '—')}</div>
            <div class="admin-row__meta">کد: ${escapeHTML(it.id)} • نوع: ${type} • دسته: ${escapeHTML(it.category || '—')} • قیمت: ${price} تومان</div>
          </div>
          <div class="admin-row__actions">
            <button class="btn btn-outline" type="button" data-admin-edit>ویرایش</button>
            <button class="btn btn-outline" type="button" data-admin-del>حذف</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderAdminNews() {
    const listEl = qs('#adminNewsList');
    if (!listEl) return;
    const items = getNews().slice().sort((a,b) => String(b.date||'').localeCompare(String(a.date||'')));
    if (!items.length) {
      listEl.innerHTML = '<div class="admin-hint">موردی ثبت نشده است.</div>';
      return;
    }
    listEl.innerHTML = items.map((it) => {
      return `
        <div class="admin-row" data-item-type="news" data-item-id="${escapeHTML(it.id)}">
          <div class="admin-row__main">
            <div class="admin-row__title">${escapeHTML(it.title || '—')}</div>
            <div class="admin-row__meta">تاریخ: ${escapeHTML(it.date || '—')}</div>
            <div class="admin-row__meta">${escapeHTML(it.body || '')}</div>
          </div>
          <div class="admin-row__actions">
            <button class="btn btn-outline" type="button" data-admin-edit>ویرایش</button>
            <button class="btn btn-outline" type="button" data-admin-del>حذف</button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- Item modal (Catalog/News) ---
  let adminEditingItem = { type: '', id: null };

  function openAdminItemModal(type, id) {
    const m = qs('#adminItemModal');
    const fields = qs('#adminItemFields');
    const titleEl = qs('#adminItemModalTitle');
    const msg = qs('#adminItemFormMsg');
    if (!m || !fields) return;

    adminEditingItem = { type, id: id || null };

    if (msg) { msg.hidden = true; msg.textContent = ''; }

    let data = null;
    if (type === 'catalog') data = getCatalog().find((x) => x.id === id) || null;
    if (type === 'news') data = getNews().find((x) => x.id === id) || null;

    if (titleEl) titleEl.textContent = id ? 'ویرایش' : 'افزودن مورد';

    if (type === 'catalog') {
      fields.innerHTML = `
        <input class="input" id="aiId" type="text" placeholder="کد (مثلاً prd-010)" required>
        <select class="input" id="aiType" required>
          <option value="product">محصول</option>
          <option value="service">خدمت</option>
        </select>
        <input class="input" id="aiTitle" type="text" placeholder="عنوان" required>
        <input class="input" id="aiCategory" type="text" placeholder="دسته‌بندی">
        <input class="input" id="aiPrice" type="number" inputmode="numeric" placeholder="قیمت (تومان)">
      `;
      qs('#aiId') && (qs('#aiId').value = data?.id || '');
      qs('#aiType') && (qs('#aiType').value = data?.type || 'product');
      qs('#aiTitle') && (qs('#aiTitle').value = data?.title || '');
      qs('#aiCategory') && (qs('#aiCategory').value = data?.category || '');
      qs('#aiPrice') && (qs('#aiPrice').value = data?.price ?? '');
      const idEl = qs('#aiId');
      if (idEl) idEl.disabled = !!id;
    } else {
      const today = new Date().toLocaleDateString('fa-IR');
      fields.innerHTML = `
        <input class="input" id="aiId" type="text" placeholder="کد (مثلاً nw-010)" required>
        <input class="input" id="aiTitle" type="text" placeholder="عنوان" required>
        <input class="input" id="aiDate" type="text" placeholder="تاریخ (مثلاً 1404/11/07)">
        <input class="input" id="aiBody" type="text" placeholder="متن کوتاه">
      `;
      qs('#aiId') && (qs('#aiId').value = data?.id || '');
      qs('#aiTitle') && (qs('#aiTitle').value = data?.title || '');
      qs('#aiDate') && (qs('#aiDate').value = data?.date || today);
      qs('#aiBody') && (qs('#aiBody').value = data?.body || '');
      const idEl = qs('#aiId');
      if (idEl) idEl.disabled = !!id;
    }

    m.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeAdminItemModal() {
    const m = qs('#adminItemModal');
    if (!m) return;
    m.hidden = true;
    const adminOv = qs('#adminOverlay');
    if (!adminOv || adminOv.hidden) document.body.classList.remove('modal-open');
  }

  function saveAdminItem() {
    const type = adminEditingItem.type;
    const msg = qs('#adminItemFormMsg');
    const id = String(qs('#aiId')?.value || '').trim();
    const title = String(qs('#aiTitle')?.value || '').trim();

    if (!id || !title) {
      if (msg) { msg.textContent = 'کد و عنوان الزامی است.'; msg.hidden = false; }
      return;
    }

    if (type === 'catalog') {
      const list = getCatalog();
      if (!adminEditingItem.id && list.some((x) => x.id === id)) {
        if (msg) { msg.textContent = 'این کد قبلاً ثبت شده است.'; msg.hidden = false; }
        return;
      }
      const item = {
        id,
        type: String(qs('#aiType')?.value || 'product'),
        title,
        category: String(qs('#aiCategory')?.value || '').trim(),
        price: Number(qs('#aiPrice')?.value || 0)
      };
      const next = adminEditingItem.id ? list.map((x) => x.id === id ? item : x) : [...list, item];
      setCatalog(next);
      if (msg) { msg.textContent = 'ذخیره شد.'; msg.hidden = false; }
      renderAdminCatalog();
      setTimeout(() => closeAdminItemModal(), 250);
      return;
    }

    // news
    const list = getNews();
    if (!adminEditingItem.id && list.some((x) => x.id === id)) {
      if (msg) { msg.textContent = 'این کد قبلاً ثبت شده است.'; msg.hidden = false; }
      return;
    }
    const item = {
      id,
      title,
      date: String(qs('#aiDate')?.value || '').trim(),
      body: String(qs('#aiBody')?.value || '').trim()
    };
    const next = adminEditingItem.id ? list.map((x) => x.id === id ? item : x) : [...list, item];
    setNews(next);
    if (msg) { msg.textContent = 'ذخیره شد.'; msg.hidden = false; }
    renderAdminNews();
    setTimeout(() => closeAdminItemModal(), 250);
  }

  function deleteAdminItem(type, id) {
    if (type === 'catalog') {
      setCatalog(getCatalog().filter((x) => x.id !== id));
      renderAdminCatalog();
    }
    if (type === 'news') {
      setNews(getNews().filter((x) => x.id !== id));
      renderAdminNews();
    }
  }

  // --- Reports ---
  function productTitleById(pid) {
    const cat = getCatalog();
    const it = cat.find((x) => x.id === pid);
    return it?.title || pid;
  }

  function renderAdminReports() {
    const sumEl = qs('#adminReportSummary');
    const detEl = qs('#adminReportDetails');
    if (!sumEl || !detEl) return;

    const orders = getOrders();
    const summary = {};
    orders.forEach((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((it) => {
        const pid = String(it.productId || '');
        if (!pid) return;
        if (!summary[pid]) summary[pid] = { pid, qty: 0, revenue: 0, satSum: 0, satCnt: 0 };
        summary[pid].qty += Number(it.qty || 0);
        summary[pid].revenue += Number(it.qty || 0) * Number(it.unitPrice || 0);
        if (Number(o.satisfaction || 0) > 0) {
          summary[pid].satSum += Number(o.satisfaction || 0);
          summary[pid].satCnt += 1;
        }
      });
    });

    const rows = Object.values(summary).sort((a,b) => b.revenue - a.revenue);

    sumEl.innerHTML = rows.length ? rows.map((r) => {
      const avg = r.satCnt ? (r.satSum / r.satCnt).toFixed(1) : '—';
      return `
        <div class="admin-row">
          <div class="admin-row__main">
            <div class="admin-row__title">${escapeHTML(productTitleById(r.pid))}</div>
            <div class="admin-row__meta">تعداد فروش: ${r.qty} • فروش: ${formatIR(r.revenue)} تومان • رضایت: ${avg}</div>
          </div>
        </div>
      `;
    }).join('') : '<div class="admin-hint">داده‌ای برای نمایش وجود ندارد.</div>';

    // details with filters
    const users = LS.get(KEYS.USERS, {});
    const q = normalize(adminState.reportQ || qs('#adminReportQ')?.value);
    const date = String(adminState.reportDate || qs('#adminReportDate')?.value || '').trim();

    const filtered = orders
      .filter((o) => {
        if (date && String(o.createdAt || '') !== date) return false;
        if (!q) return true;
        const u = users[o.userId];
        const name = u?.fullName || '';
        return normalize(name).includes(q);
      })
      .slice()
      .sort((a,b) => String(b.createdAt||'').localeCompare(String(a.createdAt||'')));

    detEl.innerHTML = filtered.length ? filtered.map((o) => {
      const u = users[o.userId];
      let ident = u ? `${u.fullName} — ${roleLabel(u.role)}` : `کاربر ${o.userId}`;
      if (u?.role === 'student' && u.parentId) {
        const p = users[u.parentId];
        const pInfo = p ? `${p.fullName}${p.positionTitle ? ` (${p.positionTitle})` : ''}` : u.parentId;
        ident += ` • فرزندِ ${pInfo}`;
      }
      const total = orderTotal(o);
      const items = Array.isArray(o.items) ? o.items : [];
      const itemsText = items.map((it) => `${it.title} × ${it.qty}`).join('، ');
      return `
        <div class="admin-row">
          <div class="admin-row__main">
            <div class="admin-row__title">${escapeHTML(o.id || '—')} • ${escapeHTML(o.createdAt || '—')}</div>
            <div class="admin-row__meta">${escapeHTML(ident)}</div>
            <div class="admin-row__meta">مبلغ: ${formatIR(total)} تومان • وضعیت: ${escapeHTML(o.status || '—')} • پرداخت: ${escapeHTML(o.paymentType || '—')}</div>
            <div class="admin-row__meta">اقلام: ${escapeHTML(itemsText || '—')}</div>
          </div>
        </div>
      `;
    }).join('') : '<div class="admin-hint">نتیجه‌ای یافت نشد.</div>';
  }

  function bindAdminUI() {
    if (markBound(document.documentElement, 'adminUI')) return;

    // open via link (href has data-admin-open)
    on(document, 'click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;

      if (t.closest('[data-admin-open]')) {
        e.preventDefault();
        openAdminOverlay();
        return;
      }

      if (t.matches('[data-admin-close]')) {
        e.preventDefault();
        closeAdminOverlay();
        return;
      }

      if (t.matches('[data-admin-user-close]')) {
        e.preventDefault();
        closeAdminUserModal();
        return;
      }

      if (t.matches('[data-admin-item-close]')) {
        e.preventDefault();
        closeAdminItemModal();
        return;
      }

      const tabBtn = t.closest('[data-admin-tab]');
      if (tabBtn) {
        const tab = tabBtn.getAttribute('data-admin-tab') || 'users';
        setAdminTab(tab);
        return;
      }

      // catalog/news edit/delete
      const row = t.closest('[data-item-type][data-item-id]');
      if (row && (t.matches('[data-admin-edit]') || t.closest('[data-admin-edit]'))) {
        const type = row.getAttribute('data-item-type') || '';
        const id = row.getAttribute('data-item-id') || '';
        openAdminItemModal(type, id);
        return;
      }
      if (row && (t.matches('[data-admin-del]') || t.closest('[data-admin-del]'))) {
        const type = row.getAttribute('data-item-type') || '';
        const id = row.getAttribute('data-item-id') || '';
        deleteAdminItem(type, id);
        return;
      }
    });

    on(document, 'keydown', (e) => {
      const ov = qs('#adminOverlay');
      if (e.key === 'Escape' && ov && !ov.hidden) closeAdminOverlay();
    });

    // Users tab inputs
    on(qs('#adminUserQ'), 'input', () => renderAdminUsers());
    on(qs('#adminUserRole'), 'change', () => renderAdminUsers());
    on(qs('#adminCreditMode'), 'change', () => renderAdminUsers());

    on(qs('#adminCreditApply'), 'click', () => applyCredit());
    on(qs('#adminUsersExport'), 'click', () => exportUsersCsv());

    on(qs('#adminUserAddBtn'), 'click', () => openAdminUserModal(null));
    on(qs('#adminUserForm'), 'submit', (e) => { e.preventDefault(); saveAdminUser(); });

    // catalog/news add
    on(qs('#adminCatalogAdd'), 'click', () => openAdminItemModal('catalog', null));
    on(qs('#adminNewsAdd'), 'click', () => openAdminItemModal('news', null));
    on(qs('#adminItemForm'), 'submit', (e) => { e.preventDefault(); saveAdminItem(); });

    // reports filter
    on(qs('#adminReportApply'), 'click', () => {
      adminState.reportQ = String(qs('#adminReportQ')?.value || '');
      adminState.reportDate = String(qs('#adminReportDate')?.value || '');
      renderAdminReports();
    });
  }


// ---------- boot ----------
  function boot() {
    ensureSeedUsers();
    ensureSeedOrders();
    ensureSeedProducts();
    ensureSeedNews();
    bindHeaderAuth();
    bindUserMenu();
    bindSheets();
    bindMobileAuth();
    bindMobileCats();
    bindCategoriesDropdown();
    bindHeaderBottomCollapse();
    bindCartUI();
    bindAddToCart();
    syncAuthUI();
    syncCartUI();
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

(function initProductsPage(){
  const isProductsPage = document.body && document.body.classList.contains('page-products');
  if (!isProductsPage) return;

  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const q = document.getElementById('productsSearch');
  const cat = document.getElementById('productsCategory');
  const grade = document.getElementById('productsGrade');
  const sort = document.getElementById('productsSort');

  const cards = Array.from(grid.querySelectorAll('.product-card[data-id]'));

  function norm(s){
    return (s || '').toString().trim().toLowerCase();
  }

  function applyFromQueryString(){
    const params = new URLSearchParams(location.search);
    const c = params.get('cat');
    if (c && cat) cat.value = c;
  }

  function filterCards(){
    const query = norm(q && q.value);
    const catVal = (cat && cat.value) || 'all';
    const gradeVal = (grade && grade.value) || 'all';

    cards.forEach(card => {
      const title = norm(card.dataset.title);
      const c = card.dataset.cat || 'all';
      const g = card.dataset.grade || 'all';

      const matchQuery = !query || title.includes(query);
      const matchCat = (catVal === 'all') || (c === catVal);
      const matchGrade = (gradeVal === 'all') || (g === gradeVal);

      card.style.display = (matchQuery && matchCat && matchGrade) ? '' : 'none';
    });
  }

  function sortCards(){
    const mode = (sort && sort.value) || 'best';

    const visible = cards.filter(c => c.style.display !== 'none');

    const getNum = (el, key) => {
      const v = el.dataset[key];
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    };

    visible.sort((a,b) => {
      if (mode === 'best') return getNum(b,'sold') - getNum(a,'sold');
      if (mode === 'new') return (new Date(b.dataset.created || 0)) - (new Date(a.dataset.created || 0));
      if (mode === 'discount') return getNum(b,'discount') - getNum(a,'discount');
      if (mode === 'priceHigh') return getNum(b,'price') - getNum(a,'price');
      if (mode === 'priceLow') return getNum(a,'price') - getNum(b,'price');
      return 0;
    });

    // فقط reorder روی آیتم‌های قابل مشاهده
    visible.forEach(el => grid.appendChild(el));
  }

  function refresh(){
    filterCards();
    sortCards();
  }

  applyFromQueryString();
  refresh();

  [q,cat,grade,sort].forEach(el => {
    if (!el) return;
    el.addEventListener('input', refresh);
    el.addEventListener('change', refresh);
  });
})();
