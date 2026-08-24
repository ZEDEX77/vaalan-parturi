/* ============================================================
   VAALAN PARTURI — scroll choreography
   GSAP + ScrollTrigger + Lenis (all vendored locally)
   ============================================================ */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* ---------- Theme ---------- */
  var themeToggle = document.getElementById('themeToggle');
  var themeMedia = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    var attr = doc.getAttribute('data-theme');
    if (attr === 'dark' || attr === 'light') return attr;
    return themeMedia.matches ? 'dark' : 'light';
  }
  function syncThemeButton() {
    if (themeToggle) themeToggle.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      doc.setAttribute('data-theme', next);
      try { localStorage.setItem('vp-theme', next); } catch (e) {}
      syncThemeButton();
    });
  }
  themeMedia.addEventListener('change', syncThemeButton);
  syncThemeButton();

  /* ---------- Languages (fi default, sv, en) ---------- */
  var DICT = {
    sv: {
      'skip': 'Hoppa till innehåll',
      'nav.palvelut': 'Tjänster', 'nav.hinnasto': 'Priser', 'nav.meista': 'Om oss',
      'nav.yhteys': 'Kontakt', 'nav.varaa': 'Boka tid',
      'hero.tagline': 'Precist arbete, avslappnad stil.<br>En klassisk barberare i hjärtat av Vaala — öppning 15.9.2026.',
      'hero.cta2': 'Se tjänster', 'hero.selaa': 'Bläddra',
      'marq1': '<span>Precision</span><i>·</i><em>Tradition</em><i>·</i><span>Stil</span><i>·</i><em>Vaala</em><i>·</i><span>Öppning 15.9.2026</span><i>·</i>',
      'marq2': '<span>Hår</span><i>·</i><em>Skägg</em><i>·</i><span>Varm handduk</span><i>·</i><em>Klassiker</em><i>·</i><span>Vaalan Parturi</span><i>·</i>',
      'svc.eyebrow': 'Tjänster',
      'svc.h2': 'Slå dig ner. <em>Vi sköter resten.</em>',
      'svc.sub': 'Varje besök börjar med ett samtal och slutar med ett genomarbetat resultat. Dra eller bläddra i sidled.',
      'svc1.t': 'Klassisk klippning', 'svc1.d': 'Sax och maskin, tvätt och styling ingår. En frisyr som håller i vardagen.',
      'svc2.t': 'Maskinklippning', 'svc2.d': 'Snabb och snygg maskinklippning med ett skär.',
      'svc3.t': 'Skäggtrimning', 'svc3.d': 'Kantlinje, trimning och skäggolja. Ett skägg med stil.',
      'svc4.t': 'Klippning + skägg', 'svc4.d': 'Hela paketet på ett besök: hår, skägg och finish.',
      'svc5.t': 'Klassisk rakning', 'svc5.d': 'Rakning med kniv — varm handduk, förbehandling och lugn.',
      'svc6.t': 'Barnklippning', 'svc6.d': 'För de minsta kunderna — med tålamod och humor.',
      'svccta.p': 'Redo för<br><em>stolen?</em>',
      'cut.kicker': 'Ett resultat som syns', 'cut.word': 'PRECISION', 'cut.note': 'Bläddra — maskinen gör resten.',
      'price.h2': 'Tydliga priser, <em>inga överraskningar.</em>',
      'price.r1': 'Klippning <small>(vuxna)</small>', 'price.r2': 'Studerande', 'price.r3': 'Barnklippning',
      'price.r4': 'Skägg', 'price.r5': 'Klippning + skägg',
      'price.note': 'Priserna inkluderar moms. Vi tar kort, kontanter och MobilePay.',
      'about.h2': 'En barberare i <em>hjärtat av Vaala.</em>',
      'about.lead': 'Vaalan Parturi är en plats där tiden saktar ner i stolen. För oss är varje kund en granne — och varje klippning ett visitkort.',
      'about.body': 'Vi gör klassiskt barberararbete med modern touch: skarpa linjer, noggrann finish och ärliga råd om vad som passar just dig. Slå dig ner för att prata — eller för att vara tyst.',
      'val1.t': 'Precision', 'val1.d': 'Millimetrarna avgör. Ofärdigt arbete lämnar aldrig stolen.',
      'val2.t': 'Tradition', 'val2.d': 'Varm handduk, rakkniv och saxarbete. Kunskap som aldrig åldras.',
      'val3.t': 'Ingen brådska', 'val3.d': 'Vi reserverar tid för varje kund. Ingen tittar på klockan i stolen.',
      'about.caption': 'Stolen väntar. <em>Estd 2026.</em>',
      'styles.eyebrow': 'Stilar', 'styles.h2': 'Klassiker och <em>nya frisyrer.</em>',
      'sty1.t': 'Klassiker', 'sty1.d': 'Snygg sidbena, finish med sax.',
      'sty2.t': 'Fade', 'sty2.d': 'Skin fade — skarpa, sömlösa övergångar.',
      'sty3.t': 'Textur', 'sty3.d': 'Lätt, levande längd på toppen.',
      'sty4.t': 'Helskägg', 'sty4.d': 'Format, vårdat och skarpt kantat.',
      'contact.title': 'Boka <em>tid.</em>',
      'contact.sub': 'Boka online, ring eller titta förbi. Vi bekräftar varje bokning personligen.',
      'contact.bookbtn': 'Boka online', 'contact.callbtn': 'Ring: 046&nbsp;637&nbsp;91&nbsp;31',
      'slots.h3': 'Lediga tider', 'slots.sub': 'Kommande tre dagar · finsk tid',
      'slots.note': 'Välj tjänst och en ledig tid — bokningen öppnas med tiden förvald.',
      'cg.addr': 'Besöksadress', 'cg.hours': 'Öppettider', 'cg.follow': 'Följ oss',
      'hours.wk': 'Mån–Fre', 'hours.sa': 'Lör', 'hours.su': 'Sön',
      'footer.tagline': 'Din lokala barberare, din globala stil.<br>Estd 2026 · Vaala, Finland',
      'footer.rights': 'Alla rättigheter förbehållna.'
    },
    en: {
      'skip': 'Skip to content',
      'nav.palvelut': 'Services', 'nav.hinnasto': 'Prices', 'nav.meista': 'About',
      'nav.yhteys': 'Contact', 'nav.varaa': 'Book now',
      'hero.tagline': 'Precise work, relaxed attitude.<br>A classic barbershop in the heart of Vaala — grand opening 15.9.2026.',
      'hero.cta2': 'See services', 'hero.selaa': 'Scroll',
      'marq1': '<span>Precision</span><i>·</i><em>Tradition</em><i>·</i><span>Style</span><i>·</i><em>Vaala</em><i>·</i><span>Grand opening 15.9.2026</span><i>·</i>',
      'marq2': '<span>Hair</span><i>·</i><em>Beard</em><i>·</i><span>Hot towel</span><i>·</i><em>Classics</em><i>·</i><span>Vaalan Parturi</span><i>·</i>',
      'svc.eyebrow': 'Services',
      'svc.h2': 'Take a seat. <em>We handle the rest.</em>',
      'svc.sub': 'Every visit starts with a chat and ends with a polished result. Drag or scroll sideways.',
      'svc1.t': 'Classic haircut', 'svc1.d': 'Scissors and clippers, wash and styling included. A fit that lasts.',
      'svc2.t': 'Clipper cut', 'svc2.d': 'A quick, clean all-over clipper cut with one guard.',
      'svc3.t': 'Beard trim', 'svc3.d': 'Line-up, trim and beard oil. A beard with direction.',
      'svc4.t': 'Cut + beard', 'svc4.d': 'The full package in one visit: hair, beard and finishing.',
      'svc5.t': 'Traditional shave', 'svc5.d': 'A straight-razor shave — hot towel, pre-shave oils and calm.',
      'svc6.t': "Kids' haircut", 'svc6.d': 'For our youngest customers — with patience and humour.',
      'svccta.p': 'Ready for<br><em>the chair?</em>',
      'cut.kicker': 'Work you can see', 'cut.word': 'PRECISION', 'cut.note': 'Scroll — the clipper does the rest.',
      'price.h2': 'Clear prices, <em>no surprises.</em>',
      'price.r1': 'Haircut <small>(adults)</small>', 'price.r2': 'Students', 'price.r3': "Kids' haircut",
      'price.r4': 'Beard', 'price.r5': 'Cut + beard',
      'price.note': 'Prices include VAT. We accept card, cash and MobilePay.',
      'about.h2': 'A barbershop in the <em>heart of Vaala.</em>',
      'about.lead': 'Vaalan Parturi is a place where time slows down in the chair. To us every customer is a neighbour — and every haircut a calling card.',
      'about.body': 'We do classic barbering with a modern touch: sharp line-ups, careful finishing and honest advice on what suits you. Sit down for a chat — or for some quiet.',
      'val1.t': 'Precision', 'val1.d': 'Millimetres matter. Unfinished work never leaves the chair.',
      'val2.t': 'Tradition', 'val2.d': 'Hot towels, straight razors and scissor work. Skills that never age.',
      'val3.t': 'No hurry', 'val3.d': 'We reserve time for every customer. No clock-watching in the chair.',
      'about.caption': 'The chair is waiting. <em>Estd 2026.</em>',
      'styles.eyebrow': 'Styles', 'styles.h2': 'Classics and <em>fresh cuts.</em>',
      'sty1.t': 'Classic', 'sty1.d': 'A clean side part, scissor-finished.',
      'sty2.t': 'Fade', 'sty2.d': 'Skin fade — sharp, seamless transitions.',
      'sty3.t': 'Texture', 'sty3.d': 'Light, lively length on top.',
      'sty4.t': 'Full beard', 'sty4.d': 'Shaped, groomed and sharply lined.',
      'contact.title': 'Book <em>a time.</em>',
      'contact.sub': 'Book online, call, or drop by. We confirm every booking personally.',
      'contact.bookbtn': 'Book online', 'contact.callbtn': 'Call: 046&nbsp;637&nbsp;91&nbsp;31',
      'slots.h3': 'Available times', 'slots.sub': 'Next three days · Finnish time',
      'slots.note': 'Pick a service and a free time — the booking opens with that time preselected.',
      'cg.addr': 'Address', 'cg.hours': 'Opening hours', 'cg.follow': 'Follow us',
      'hours.wk': 'Mon–Fri', 'hours.sa': 'Sat', 'hours.su': 'Sun',
      'footer.tagline': 'Your local barber, your global style.<br>Estd 2026 · Vaala, Finland',
      'footer.rights': 'All rights reserved.'
    }
  };

  function currentLang() {
    var l = document.documentElement.lang || 'fi';
    return l.slice(0, 2);
  }
  /* capture Finnish originals once, into data attributes */
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    if (!el.dataset.i18nFi) el.dataset.i18nFi = el.innerHTML;
  });
  function applyLang(lang) {
    if (lang !== 'sv' && lang !== 'en') lang = 'fi';
    document.documentElement.lang = lang;
    try { localStorage.setItem('vp-lang', lang); } catch (e) {}
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (lang === 'fi') {
        if (el.dataset.i18nFi) el.innerHTML = el.dataset.i18nFi;
      } else if (DICT[lang][key] != null) {
        el.innerHTML = DICT[lang][key];
      }
    });
    /* PRECISION is one letter wider than TARKKUUS — squeeze it into the stage */
    document.querySelectorAll('.cut-text').forEach(function (t) {
      if (lang === 'fi') { t.removeAttribute('textLength'); t.removeAttribute('lengthAdjust'); }
      else { t.setAttribute('textLength', '1116'); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });
    document.dispatchEvent(new CustomEvent('vp:lang'));
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });
  (function () {
    var stored = null;
    try { stored = localStorage.getItem('vp-lang'); } catch (e) {}
    if (stored === 'sv' || stored === 'en') applyLang(stored);
  })();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    var y = new Date().getFullYear();
    if (y > 2026) yearEl.textContent = String(y);
  }

  /* ---------- Mobile menu ---------- */
  var burger = document.getElementById('burger');
  var mmenu = document.getElementById('mobileMenu');
  function menuIsOpen() { return mmenu && mmenu.classList.contains('is-open'); }
  function closeMenu(returnFocus) {
    if (!burger || !mmenu || !menuIsOpen()) return;
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Avaa valikko');
    mmenu.classList.remove('is-open');
    mmenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (typeof lenis !== 'undefined' && lenis) lenis.start();
    if (returnFocus) burger.focus();
  }
  if (burger && mmenu) {
    burger.addEventListener('click', function () {
      var open = !menuIsOpen();
      if (!open) { closeMenu(true); return; }
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Sulje valikko');
      mmenu.classList.add('is-open');
      mmenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (typeof lenis !== 'undefined' && lenis) lenis.stop();
      var first = mmenu.querySelector('a');
      if (first) first.focus();
    });
    mmenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu(true);
      if (e.key === 'Tab' && menuIsOpen()) {
        /* keep focus inside the dialog (menu links + burger) */
        var items = Array.prototype.slice.call(mmenu.querySelectorAll('a'));
        items.push(burger);
        var idx = items.indexOf(document.activeElement);
        if (idx === -1) { e.preventDefault(); items[0].focus(); return; }
        if (!e.shiftKey && idx === items.length - 1) { e.preventDefault(); items[0].focus(); }
        else if (e.shiftKey && idx === 0) { e.preventDefault(); items[items.length - 1].focus(); }
      }
    });
  }

  /* ---------- Booking (Cal.com embed) ---------- */
  /* Official embed loader: queues calls until embed.js arrives from app.cal.com */
  (function (C, A, L) {
    var p = function (a, ar) { a.q.push(ar); };
    var doc = C.document;
    C.Cal = C.Cal || function () {
      var cal = C.Cal; var ar = arguments;
      if (!cal.loaded) {
        cal.ns = {}; cal.q = cal.q || [];
        doc.head.appendChild(doc.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        var api = function () { p(api, arguments); };
        var namespace = ar[1]; api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');
  Cal('init', { origin: 'https://app.cal.com' });
  Cal('ui', { styles: { branding: { brandColor: '#C22F23' } }, hideEventTypeDetails: false });

  function syncCalTheme() {
    var t = currentTheme();
    document.querySelectorAll('[data-cal-link]').forEach(function (el) {
      var cfg = {};
      try { cfg = JSON.parse(el.getAttribute('data-cal-config') || '{}'); } catch (e) {}
      cfg.theme = t;
      el.setAttribute('data-cal-config', JSON.stringify(cfg));
    });
  }
  syncCalTheme();
  if (themeToggle) themeToggle.addEventListener('click', syncCalTheme);
  themeMedia.addEventListener('change', syncCalTheme);

  /* if the embed cannot load (offline, blocker), fall back to the contact section */
  document.querySelectorAll('.js-book').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (menuIsOpen()) closeMenu(false);
      setTimeout(function () {
        if (!document.querySelector('iframe[src*="cal.com"]')) {
          var y = document.getElementById('yhteys');
          if (y) y.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1200);
    });
  });

  /* ---------- Availability board (Vapaat ajat) ---------- */
  (function initSlotsBoard() {
    var wrap = document.getElementById('slots');
    var grid = document.getElementById('slotsGrid');
    var chipsWrap = document.getElementById('slotsServices');
    if (!wrap || !grid || !chipsWrap || typeof fetch === 'undefined') return;

    /* shop hours by weekday (0 = Sunday), [open, close] in Helsinki time */
    var HOURS = { 0: [10, 16], 1: [10, 18], 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 17] };
    var SERVICES = [
      { slug: 'klassinen-leikkaus', dur: 30, fi: 'Klassinen leikkaus', sv: 'Klassisk klippning', en: 'Classic haircut' },
      { slug: 'koneajo', dur: 20, fi: 'Koneajo', sv: 'Maskinklippning', en: 'Clipper cut' },
      { slug: 'parran-muotoilu', dur: 20, fi: 'Parran muotoilu', sv: 'Skäggtrimning', en: 'Beard trim' },
      { slug: 'leikkaus-parta', dur: 60, fi: 'Leikkaus + parta', sv: 'Klippning + skägg', en: 'Cut + beard' },
      { slug: 'parranajo-kuumalla-pyyhkeella', dur: 40, fi: 'Perinteinen parranajo', sv: 'Klassisk rakning', en: 'Traditional shave' },
      { slug: 'lasten-leikkaus', dur: 30, fi: 'Lasten leikkaus', sv: 'Barnklippning', en: "Kids' haircut" }
    ];
    var STR = {
      fi: { free: 'Vapaa', taken: 'Varattu', today: 'Tänään', tomorrow: 'Huomenna', days: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'] },
      sv: { free: 'Ledig', taken: 'Bokad', today: 'Idag', tomorrow: 'Imorgon', days: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'] },
      en: { free: 'Free', taken: 'Booked', today: 'Today', tomorrow: 'Tomorrow', days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }
    };
    var active = SERVICES[0];
    var cache = {};

    function lang() {
      var l = (document.documentElement.lang || 'fi').slice(0, 2);
      return STR[l] ? l : 'fi';
    }
    function helsinkiISO(offsetDays) {
      var d = new Date(Date.now() + offsetDays * 86400000);
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Helsinki', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(d);
    }
    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function buildChips() {
      var L = lang();
      chipsWrap.innerHTML = SERVICES.map(function (s) {
        return '<button type="button" class="chip' + (s.slug === active.slug ? ' is-active' : '') +
          '" data-slug="' + s.slug + '">' + s[L] + '</button>';
      }).join('');
      chipsWrap.querySelectorAll('.chip').forEach(function (b) {
        b.addEventListener('click', function () {
          var next = SERVICES.filter(function (s) { return s.slug === b.getAttribute('data-slug'); })[0];
          if (!next || next.slug === active.slug) return;
          active = next;
          buildChips();
          load();
        });
      });
    }

    function render(data) {
      var L = lang(), S = STR[L];
      var days = [helsinkiISO(0), helsinkiISO(1), helsinkiISO(2)];
      var html = '';
      days.forEach(function (iso, idx) {
        var noonUTC = new Date(iso + 'T12:00:00Z');
        var wd = noonUTC.getUTCDay();
        var label = idx === 0 ? S.today : (idx === 1 ? S.tomorrow : S.days[wd]);
        var parts = iso.split('-');
        var dateStr = parseInt(parts[2], 10) + '.' + parseInt(parts[1], 10) + '.';
        var open = HOURS[wd][0], close = HOURS[wd][1];
        /* free start times for this service, HH:MM -> full ISO start */
        var free = {};
        (data[iso] || []).forEach(function (s) {
          if (s && s.start) free[s.start.slice(11, 16)] = s.start;
        });
        /* expected grid at the service's own interval, plus any extra API times */
        var times = {};
        for (var m = open * 60; m + active.dur <= close * 60; m += active.dur) {
          times[pad(Math.floor(m / 60)) + ':' + pad(m % 60)] = true;
        }
        Object.keys(free).forEach(function (t) { times[t] = true; });
        var cells = '';
        Object.keys(times).sort().forEach(function (t) {
          if (free[t]) {
            var cfg = {
              theme: currentTheme(),
              month: iso.slice(0, 7),
              date: iso,
              slot: new Date(free[t]).toISOString()
            };
            cells += '<button type="button" class="slot" data-cal-link="vaalanparturi/' + active.slug +
              '" data-cal-config=\'' + JSON.stringify(cfg) + '\'>' +
              '<span>' + t + '</span><span class="slot-tag">' + S.free + '</span></button>';
          } else {
            cells += '<span class="slot slot--taken"><span>' + t + '</span>' +
              '<span class="slot-tag">' + S.taken + '</span></span>';
          }
        });
        html += '<div class="slots-day"><p class="slots-day-label">' + label +
          '<small>' + dateStr + '</small></p><div class="slots-list">' + cells + '</div></div>';
      });
      grid.innerHTML = html;
      wrap.hidden = false;
      if (typeof syncCalTheme === 'function') syncCalTheme();
      if (hasGsap && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }

    function load() {
      if (cache[active.slug]) { render(cache[active.slug]); return; }
      var url = 'https://api.cal.com/v2/slots?eventTypeSlug=' + active.slug + '&username=vaalanparturi' +
        '&start=' + helsinkiISO(0) + '&end=' + helsinkiISO(3) + '&timeZone=Europe/Helsinki';
      fetch(url, { headers: { 'cal-api-version': '2024-09-04' } })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('slots http ' + r.status)); })
        .then(function (json) {
          cache[active.slug] = (json && json.data) || {};
          render(cache[active.slug]);
        })
        .catch(function () { /* API unreachable: leave the board hidden */ });
    }

    document.addEventListener('vp:lang', function () {
      buildChips();
      if (cache[active.slug]) render(cache[active.slug]);
    });

    buildChips();
    load();
  })();

  /* ---------- Progressive slots: hero video + gallery photos ---------- */
  var heroVideo = document.getElementById('heroVideo');
  if (heroVideo && !prefersReduced && location.protocol !== 'file:') {
    fetch('assets/video/hero.mp4', { method: 'HEAD' }).then(function (res) {
      if (!res.ok) return;
      heroVideo.src = 'assets/video/hero.mp4';
      heroVideo.addEventListener('canplay', function () {
        heroVideo.classList.add('is-live');
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {});
      }, { once: true });
      heroVideo.load();
    }).catch(function () {});
  }
  document.querySelectorAll('[data-gallery]').forEach(function (card) {
    var n = card.getAttribute('data-gallery');
    var img = new Image();
    img.onload = function () {
      card.style.backgroundImage =
        'linear-gradient(180deg, rgba(20,10,6,0.15) 20%, rgba(20,10,6,0.72)), url("assets/img/gallery/' + n + '.jpg")';
      card.classList.add('has-photo');
    };
    img.src = 'assets/img/gallery/' + n + '.jpg';
  });

  /* ---------- Reduced motion / no GSAP: static site ---------- */
  var loader = document.getElementById('loader');
  if (prefersReduced || !hasGsap) {
    doc.classList.add('no-motion');
    if (loader) loader.classList.add('is-done');
    simpleNav();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function focusTarget(el) {
    if (!el) return;
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  }
  function scrollToTarget(target) {
    var el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el && target !== 0) return;
    if (lenis) {
      lenis.scrollTo(target === 0 ? 0 : el, { offset: target === 0 ? 0 : -70, duration: 1.4 });
    } else if (target === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (target !== 0) focusTarget(el);
  }
  /* the skip link keeps native jump+focus behavior */
  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href.length < 2) return;
      var el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      scrollToTarget(href);
    });
  });

  /* ---------- Nav behaviour ---------- */
  var nav = document.getElementById('nav');
  var lastY = 0;
  function onScrollPos(yPos) {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', yPos > 60);
    if (yPos > 400 && yPos > lastY + 4 && !mmenu.classList.contains('is-open')) {
      nav.classList.add('is-hidden');
    } else if (yPos < lastY - 4 || yPos <= 400) {
      nav.classList.remove('is-hidden');
    }
    lastY = yPos;
  }
  if (lenis) {
    lenis.on('scroll', function (e) { onScrollPos(e.scroll); });
  } else {
    window.addEventListener('scroll', function () { onScrollPos(window.scrollY); }, { passive: true });
  }
  function simpleNav() {
    var navEl = document.getElementById('nav');
    window.addEventListener('scroll', function () {
      if (navEl) navEl.classList.toggle('is-scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* active section highlighting */
  ['palvelut', 'hinnasto', 'meista', 'yhteys'].forEach(function (id) {
    var section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle: function (self) {
        document.querySelectorAll('.nav-links a').forEach(function (a) {
          a.classList.toggle('is-active', self.isActive && a.getAttribute('href') === '#' + id);
        });
      }
    });
  });

  /* ---------- Back to top ---------- */
  var totop = document.getElementById('totop');
  var totopFill = document.getElementById('totopFill');
  var TOTOP_LEN = 131.9;
  ScrollTrigger.create({
    start: 0,
    end: function () { return ScrollTrigger.maxScroll(window); },
    onUpdate: function (self) {
      if (totopFill) totopFill.style.strokeDashoffset = String(TOTOP_LEN * (1 - self.progress));
      if (totop) totop.classList.toggle('is-visible', self.scroll() > 600);
    }
  });
  if (totop) totop.addEventListener('click', function () { scrollToTarget(0); });

  /* ---------- Magnetic buttons ---------- */
  if (finePointer) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      var strength = 0.32;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var relX = e.clientX - r.left - r.width / 2;
        var relY = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: relX * strength, y: relY * strength, duration: 0.4, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------- Hero entrance ---------- */
  var heroTl = gsap.timeline({ paused: true });
  heroTl
    .to('.hero-line:first-child .ht-l', {
      y: 0, duration: 1.05, ease: 'power4.out', stagger: 0.045
    }, 0)
    .to('.hero-line--em .ht-l', {
      y: 0, duration: 1.05, ease: 'power4.out', stagger: 0.045
    }, 0.14)
    .to('[data-hero-fade]', {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12
    }, 0.55);

  /* ---------- Preloader ---------- */
  var seen = false;
  try { seen = sessionStorage.getItem('vp-loaded') === '1'; } catch (e) {}
  if (loader && !seen) {
    var loadTl = gsap.timeline({
      onComplete: function () {
        loader.classList.add('is-done');
        try { sessionStorage.setItem('vp-loaded', '1'); } catch (e) {}
      }
    });
    loadTl
      .to('.loader-ring-draw', { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' })
      .to('.loader-badge', { opacity: 1, duration: 0.35, ease: 'power2.out' }, 0.2)
      .fromTo('.loader-badge', { scale: 0.82 }, { scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 0.2)
      .to('.loader-word', { opacity: 1, duration: 0.35 }, 0.35)
      .to(loader, { yPercent: -100, duration: 0.6, ease: 'power4.inOut' }, 0.85)
      .add(function () { heroTl.play(); }, 0.95);
  } else {
    if (loader) loader.classList.add('is-done');
    heroTl.play();
  }

  /* ---------- Hero scroll choreography ---------- */
  gsap.to('#heroRing', {
    rotation: 80,
    transformOrigin: '50% 50%',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
  });
  gsap.to('.hero-content', {
    yPercent: -18,
    opacity: 0.05,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '88% top', scrub: 0.6 }
  });
  /* letters drift apart on scroll-out — transform-only, no layout work */
  gsap.to('.ht-l', {
    x: function (i, el) {
      var sibs = el.parentNode.children;
      var center = (sibs.length - 1) / 2;
      return (Array.prototype.indexOf.call(sibs, el) - center) * 14;
    },
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
  });
  gsap.to('.hero-spot--a', {
    yPercent: 26, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
  gsap.to('.hero-spot--b', {
    yPercent: -20, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
  gsap.to('.hero-scrollcue', {
    opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '25% top', scrub: true }
  });

  /* ---------- Marquees (velocity-reactive) ---------- */
  var marqueeRemeasure = [];
  document.querySelectorAll('.marquee').forEach(function (mq) {
    var track = mq.querySelector('.marquee-track');
    var chunk = mq.querySelector('.marquee-chunk');
    if (!track || !chunk) return;
    var dir = parseFloat(mq.getAttribute('data-marquee-dir') || '1');
    var chunkW = chunk.offsetWidth;
    /* overshoot clone count so a post-font-load width change never leaves a gap */
    var maxW = Math.max(window.innerWidth, (window.screen && screen.width) || 0);
    var copies = Math.max(3, Math.ceil((maxW * 2.4) / Math.max(chunkW, 200)) + 1);
    for (var i = 1; i < copies; i++) track.appendChild(chunk.cloneNode(true));
    var pos = 0;
    var base = 0.55;
    gsap.ticker.add(function () {
      if (!chunkW) { chunkW = chunk.offsetWidth; if (!chunkW) return; }
      if (!ScrollTrigger.isInViewport(mq)) return;
      var vel = lenis ? Math.abs(lenis.velocity) : 0;
      /* deltaRatio keeps speed identical on 60/120/144 Hz displays */
      pos += (base + Math.min(vel * 0.05, 3.2)) * dir * gsap.ticker.deltaRatio(60);
      while (pos <= -chunkW) pos += chunkW;
      while (pos > 0) pos -= chunkW;
      track.style.transform = 'translate3d(' + pos + 'px,0,0)';
    });
    var remeasure = function () { chunkW = chunk.offsetWidth; };
    window.addEventListener('resize', remeasure);
    marqueeRemeasure.push(remeasure);
  });
  document.addEventListener('vp:lang', function () {
    /* translated marquee text changes chunk width; wait a frame for reflow */
    requestAnimationFrame(function () {
      marqueeRemeasure.forEach(function (fn) { fn(); });
    });
  });

  /* ---------- Services: pinned horizontal scroll (desktop) ---------- */
  var svcTrack = document.getElementById('servicesTrack');
  var svcPin = document.getElementById('servicesPin');
  var svcProgress = document.getElementById('servicesProgress');

  ScrollTrigger.matchMedia({
    '(min-width: 901px)': function () {
      if (!svcTrack || !svcPin) return;
      function travel() {
        return Math.max(0, svcTrack.scrollWidth - document.documentElement.clientWidth);
      }
      gsap.to(svcTrack, {
        x: function () { return -travel(); },
        ease: 'none',
        scrollTrigger: {
          trigger: svcPin,
          start: 'top top',
          end: function () { return '+=' + travel(); },
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            if (svcProgress) svcProgress.style.transform = 'scaleX(' + self.progress + ')';
          }
        }
      });
      /* card entrances within the horizontal flow */
      gsap.from('.svc-card', {
        y: 60, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: svcPin, start: 'top 70%' }
      });
    },
    '(max-width: 900px)': function () {
      gsap.from('.svc-card', {
        y: 50, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: '.services-viewport', start: 'top 80%' }
      });
    }
  });

  /* icon line-draw on entry */
  document.querySelectorAll('.svc-icon').forEach(function (icon) {
    icon.querySelectorAll('path, circle, rect').forEach(function (shape) {
      var len = 0;
      try { len = shape.getTotalLength(); } catch (e) { return; }
      if (!len) return;
      shape.style.strokeDasharray = String(len);
      shape.style.strokeDashoffset = String(len);
      gsap.to(shape, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        delay: 0.2,
        scrollTrigger: { trigger: icon, start: 'top 92%' }
      });
    });
  });

  /* ---------- TARKKUUS: clipper cut scrub ---------- */
  var cutPin = document.getElementById('cutPin');
  var clipper = document.getElementById('clipper');
  var cutRect = document.getElementById('cutRect');
  var cutStage = document.querySelector('.cut-stage');
  var hairGroup = document.getElementById('hairBits');

  if (cutPin && clipper && cutRect && cutStage && hairGroup) {
    /* build hair particles */
    var SVG_NS = 'http://www.w3.org/2000/svg';
    var bits = [];
    for (var h = 0; h < 26; h++) {
      var t = 0.06 + (h / 26) * 0.88 + (Math.random() - 0.5) * 0.02;
      var bx = t * 1200;
      var by = 258 + Math.random() * 34;
      var blen = 9 + Math.random() * 15;
      var rot = -70 + Math.random() * 140;
      var line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', String(bx));
      line.setAttribute('y1', String(by));
      line.setAttribute('x2', String(bx + blen * 0.3));
      line.setAttribute('y2', String(by + blen));
      line.setAttribute('transform', 'rotate(' + rot.toFixed(1) + ' ' + bx + ' ' + by + ')');
      hairGroup.appendChild(line);
      bits.push({ el: line, t: t, fired: false });
    }

    var cutProgress = { p: 0 };
    function applyCut() {
      var p = cutProgress.p;
      var stageW = cutStage.clientWidth;
      gsap.set(clipper, { x: p * stageW });
      var edge = p * 1200;
      cutRect.setAttribute('x', String(edge));
      cutRect.setAttribute('width', String(Math.max(0, 1200 - edge)));
      bits.forEach(function (b) {
        if (p >= b.t && !b.fired) {
          b.fired = true;
          gsap.fromTo(b.el,
            { opacity: 0.85, y: 0 },
            { opacity: 0, y: 46 + Math.random() * 30, rotation: (Math.random() - 0.5) * 60, duration: 1.1, ease: 'power1.in' });
        } else if (p < b.t - 0.02 && b.fired) {
          b.fired = false;
          gsap.set(b.el, { opacity: 0, y: 0, rotation: 0 });
        }
      });
    }

    gsap.to(cutProgress, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: cutPin,
        start: 'top top',
        end: '+=1500',
        pin: true,
        scrub: 0.5,
        invalidateOnRefresh: true
      },
      onUpdate: applyCut
    });
    applyCut();

    gsap.from('.cut-kicker, .cut-note', {
      opacity: 0, y: 24, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.cut', start: 'top 75%' }
    });
  }

  /* ---------- Generic reveals ---------- */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: function (els) {
      gsap.to(els, { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.09 });
    }
  });

  /* line-split reveals */
  function splitLines(el) {
    var text = el.textContent.trim();
    var words = text.split(/\s+/);
    el.textContent = '';
    var spans = words.map(function (w) {
      var s = document.createElement('span');
      s.textContent = w + ' ';
      s.style.display = 'inline-block';
      el.appendChild(s);
      return s;
    });
    var lines = [];
    var lastTop = null;
    spans.forEach(function (s) {
      var top = s.offsetTop;
      if (top !== lastTop) { lines.push([]); lastTop = top; }
      lines[lines.length - 1].push(s);
    });
    el.textContent = '';
    lines.forEach(function (lineWords) {
      var lineEl = document.createElement('span');
      lineEl.className = 'rl-line';
      var inner = document.createElement('span');
      inner.className = 'rl-inner';
      inner.textContent = lineWords.map(function (s) { return s.textContent; }).join('').replace(/\s+$/, '');
      lineEl.appendChild(inner);
      el.appendChild(lineEl);
    });
    return el.querySelectorAll('.rl-inner');
  }
  function initLineReveals() {
    document.querySelectorAll('[data-reveal-lines]').forEach(function (el) {
      var inners = splitLines(el);
      gsap.to(inners, {
        y: 0, duration: 1, ease: 'power4.out', stagger: 0.09,
        scrollTrigger: { trigger: el, start: 'top 86%' }
      });
    });
  }

  /* ---------- Parallax elements ---------- */
  document.querySelectorAll('[data-speed]').forEach(function (el) {
    var speed = parseFloat(el.getAttribute('data-speed') || '1');
    var dist = (1 - speed) * 320;
    gsap.fromTo(el, { y: -dist }, {
      y: dist,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.7
      }
    });
  });

  /* ---------- Contact title slight zoom ---------- */
  gsap.from('.contact-title', {
    scale: 0.94,
    transformOrigin: '0% 100%',
    ease: 'none',
    scrollTrigger: { trigger: '.contact', start: 'top 90%', end: 'top 30%', scrub: 0.8 }
  });

  /* ---------- Line reveals wait for fonts (breaks must match final face) ---------- */
  var fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  fontsReady.then(function () {
    initLineReveals();
    marqueeRemeasure.forEach(function (fn) { fn(); });
    ScrollTrigger.refresh();
  });
  document.addEventListener('vp:lang', function () {
    requestAnimationFrame(function () { ScrollTrigger.refresh(); });
  });
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
