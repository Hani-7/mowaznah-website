// موازنة المحاسبي — تفاعلات الصفحة (بدون مكتبات)
(() => {
  const WHATSAPP = '966544234284';
  const EN = document.documentElement.lang === 'en';
  // نصوص الواجهة حسب لغة الصفحة
  const T = EN
    ? {
        screen: 'Screen: ',
        needName: 'Please enter your name',
        needPhone: 'Please enter a valid mobile number (05xxxxxxxx)',
        sep: ', ',
        intro: 'Hello, I would like a quote for Mowaznah POS & Accounting.',
        name: 'Name', phone: 'Mobile', business: 'Business', city: 'City', type: 'Business type', devices: 'Cashier devices', notes: 'Notes'
      }
    : {
        screen: 'شاشة ',
        needName: 'اكتب اسمك',
        needPhone: 'اكتب رقم جوال صحيح (05xxxxxxxx)',
        sep: '، ',
        intro: 'السلام عليكم، أرغب في عرض سعر لنظام موازنة المحاسبي.',
        name: 'الاسم', phone: 'الجوال', business: 'المنشأة', city: 'المدينة', type: 'النشاط', devices: 'عدد أجهزة الكاشير', notes: 'ملاحظات'
      };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // الترويسة: خلفية أوضح بعد التمرير
  const nav = $('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // قائمة الجوال
  const menuBtn = $('#menuBtn');
  const links = $('#links');
  const setMenu = (open) => {
    links.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.innerHTML = `<svg class="ic"><use href="#i-${open ? 'x' : 'menu'}"/></svg>`;
  };
  menuBtn.addEventListener('click', () => setMenu(!links.classList.contains('open')));
  $$('a', links).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));

  // الظهور عند التمرير + عدّاد الأرقام
  const counted = new WeakSet();
  const countUp = (el) => {
    if (counted.has(el)) return;
    counted.add(el);
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion || target === 0) { el.textContent = target + suffix; return; }
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / 1200);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      $$('[data-count]', entry.target).forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });

  // جولة الشاشات (تبويبات بلوحة مفاتيح كاملة)
  const tabs = $$('.tabs [role="tab"]');
  const img = $('#tourImg');
  const title = $('#tourTitle');
  const text = $('#tourText');
  // مجلد الصور نفسه الذي تستخدمه الصورة الحالية، فيعمل من الصفحة العربية ومن /en/
  const imgBase = img.getAttribute('src').replace(/[^/]+$/, '');
  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tab.focus();
    title.textContent = tab.dataset.title;
    text.textContent = tab.dataset.text;
    const src = `${imgBase}${tab.dataset.img}.webp`;
    if (img.getAttribute('src') === src) return;
    img.classList.add('fading');
    const next = new Image();
    next.onload = () => { img.src = src; img.alt = `${T.screen}${tab.textContent.trim()}`; img.classList.remove('fading'); };
    next.src = src;
  };
  tabs.forEach((tab, i) => {
    tab.tabIndex = i === 0 ? 0 : -1;
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      // في العربية (من اليمين لليسار) السهم الأيسر = التالي، وفي الإنجليزية العكس
      const next = EN ? 'ArrowRight' : 'ArrowLeft';
      const prev = EN ? 'ArrowLeft' : 'ArrowRight';
      const dir = { [next]: 1, [prev]: -1, Home: -Infinity, End: Infinity }[e.key];
      if (dir === undefined) return;
      e.preventDefault();
      const idx = Number.isFinite(dir) ? (i + dir + tabs.length) % tabs.length : dir > 0 ? tabs.length - 1 : 0;
      select(tabs[idx], true);
    });
  });
  // تحميل مسبق لصور الجولة بعد تحميل الصفحة
  window.addEventListener('load', () => tabs.forEach((t) => { new Image().src = `${imgBase}${t.dataset.img}.webp`; }));

  // نموذج الطلب: يفتح واتساب برسالة جاهزة
  const form = $('#leadForm');
  const error = $('#formError');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const phone = String(data.phone || '').replace(/[\s-]/g, '');
    const problems = [];
    // form.elements لأن form.name هو اسم النموذج نفسه لا حقل الاسم
    form.elements.name.setAttribute('aria-invalid', String(!data.name.trim()));
    form.elements.phone.setAttribute('aria-invalid', String(!/^(\+?966|0)?5\d{8}$/.test(phone)));
    if (!data.name.trim()) problems.push(T.needName);
    if (!/^(\+?966|0)?5\d{8}$/.test(phone)) problems.push(T.needPhone);
    if (problems.length) {
      error.textContent = problems.join(T.sep);
      error.hidden = false;
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    error.hidden = true;
    const lines = [
      T.intro,
      `${T.name}: ${data.name.trim()}`,
      `${T.phone}: ${phone}`,
      data.business.trim() && `${T.business}: ${data.business.trim()}`,
      data.city.trim() && `${T.city}: ${data.city.trim()}`,
      `${T.type}: ${data.type}`,
      `${T.devices}: ${data.devices}`,
      data.notes.trim() && `${T.notes}: ${data.notes.trim()}`
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });

  $('#year').textContent = new Date().getFullYear();
})();
