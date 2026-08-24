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
    var cfg = JSON.stringify({ theme: currentTheme() });
    document.querySelectorAll('[data-cal-link]').forEach(function (el) {
      el.setAttribute('data-cal-config', cfg);
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
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
