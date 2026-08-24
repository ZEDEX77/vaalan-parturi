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
      'skip': 'Hoppa till innehållet',
      'nav.palvelut': 'Tjänster', 'nav.hinnasto': 'Priser', 'nav.meista': 'Om oss',
      'nav.yhteys': 'Kontakt', 'nav.varaa': 'Boka tid',
      'hero.tagline': 'Precist arbete, avslappnad stil.<br>En klassisk barberare i hjärtat av Vaala — öppning 15.9.2026.',
      'hero.cta2': 'Se tjänsterna', 'hero.selaa': 'Skrolla',
      'marq1': '<span>Precision</span><i>·</i><em>Tradition</em><i>·</i><span>Stil</span><i>·</i><em>Vaala</em><i>·</i><span>Öppning 15.9.2026</span><i>·</i>',
      'marq2': '<span>Hår</span><i>·</i><em>Skägg</em><i>·</i><span>Varm handduk</span><i>·</i><em>Klassiker</em><i>·</i><span>Vaalan Parturi</span><i>·</i>',
      'svc.eyebrow': 'Tjänster',
      'svc.h2': 'Slå dig ner. <em>Vi sköter resten.</em>',
      'svc.sub': 'Varje besök börjar med ett samtal och slutar med ett genomarbetat resultat. Dra eller skrolla i sidled.',
      'svc1.t': 'Klassisk klippning', 'svc1.d': 'Sax och maskin, tvätt och styling ingår. En frisyr som håller i vardagen.',
      'svc2.t': 'Maskinklippning', 'svc2.d': 'Snabb och snygg maskinklippning av hela huvudet, i en längd.',
      'svc3.t': 'Skäggtrimning', 'svc3.d': 'Konturering, trimning och skäggolja. Ett skägg med stil.',
      'svc4.t': 'Klippning + skägg', 'svc4.d': 'Hela paketet på ett besök: hår, skägg och finish.',
      'svc5.t': 'Klassisk rakning', 'svc5.d': 'Rakning med rakkniv — varm handduk, förbehandling och lugn.',
      'svc6.t': 'Barnklippning', 'svc6.d': 'För de minsta kunderna — med tålamod och humor.',
      'svccta.p': 'Redo för<br><em>stolen?</em>',
      'cut.kicker': 'Ett resultat som syns', 'cut.word': 'PRECISION', 'cut.note': 'Skrolla — maskinen gör resten.',
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
      'slots.note': 'Välj tjänst och en ledig tid.',
      'map.eyebrow': 'Hitta hit', 'map.dir': 'Vägbeskrivning',
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
      'svc1.t': 'Classic haircut', 'svc1.d': 'Scissors and clippers, wash and styling included. A cut that holds up to everyday life.',
      'svc2.t': 'Clipper cut', 'svc2.d': 'A quick, clean all-over clipper cut with a single guard.',
      'svc3.t': 'Beard trim', 'svc3.d': 'Line-up, trim and beard oil. A beard with direction.',
      'svc4.t': 'Cut + beard', 'svc4.d': 'The full package in one visit: hair, beard and finishing.',
      'svc5.t': 'Traditional shave', 'svc5.d': 'A straight-razor shave — hot towel, pre-shave oils and calm.',
      'svc6.t': "Kids' haircut", 'svc6.d': 'For our youngest customers — with patience and humour.',
      'svccta.p': 'Ready for<br><em>the chair?</em>',
      'cut.kicker': 'Results you can see', 'cut.word': 'PRECISION', 'cut.note': 'Scroll — the clipper does the rest.',
      'price.h2': 'Clear prices, <em>no surprises.</em>',
      'price.r1': 'Haircut <small>(adults)</small>', 'price.r2': 'Students', 'price.r3': "Kids' haircut",
      'price.r4': 'Beard', 'price.r5': 'Cut + beard',
      'price.note': 'Prices include VAT. We accept card, cash and MobilePay.',
      'about.h2': 'A barbershop in the <em>heart of Vaala.</em>',
      'about.lead': 'Vaalan Parturi is a place where time slows down in the chair. To us every customer is a neighbour — and every haircut a calling card.',
      'about.body': 'We do classic barbering with a modern touch: sharp line-ups, careful finishing and honest advice on what suits you. Sit down for a chat — or for some quiet.',
      'val1.t': 'Precision', 'val1.d': 'Millimetres matter. Unfinished work never leaves the chair.',
      'val2.t': 'Tradition', 'val2.d': 'Hot towels, straight razors and scissor work. Skills that never age.',
      'val3.t': 'No hurry', 'val3.d': 'We set aside time for every customer. No clock-watching in the chair.',
      'about.caption': 'The chair is waiting. <em>Estd 2026.</em>',
      'styles.eyebrow': 'Styles', 'styles.h2': 'Classics and <em>fresh cuts.</em>',
      'sty1.t': 'Classic', 'sty1.d': 'A clean side part, scissor-finished.',
      'sty2.t': 'Fade', 'sty2.d': 'Skin fade — sharp, seamless transitions.',
      'sty3.t': 'Texture', 'sty3.d': 'Light, lively length on top.',
      'sty4.t': 'Full beard', 'sty4.d': 'Shaped, groomed and sharply lined.',
      'contact.title': 'Book <em>an appointment.</em>',
      'contact.sub': 'Book online, call, or drop by. We confirm every booking personally.',
      'contact.bookbtn': 'Book online', 'contact.callbtn': 'Call: 046&nbsp;637&nbsp;91&nbsp;31',
      'slots.h3': 'Available times', 'slots.sub': 'Next three days · Finnish time',
      'slots.note': 'Pick a service and a free slot.',
      'map.eyebrow': 'Find us here', 'map.dir': 'Get directions',
      'cg.addr': 'Address', 'cg.hours': 'Opening hours', 'cg.follow': 'Follow us',
      'hours.wk': 'Mon–Fri', 'hours.sa': 'Sat', 'hours.su': 'Sun',
      'footer.tagline': 'Your local barber, your global style.<br>Estd 2026 · Vaala, Finland',
      'footer.rights': 'All rights reserved.'
    }    ,
    ru: {
      'skip': 'Перейти к содержанию',
      'nav.palvelut': 'Услуги', 'nav.hinnasto': 'Цены', 'nav.meista': 'О нас',
      'nav.yhteys': 'Контакты', 'nav.varaa': 'Записаться',
      'hero.tagline': 'Точная работа, спокойная атмосфера.<br>Классический барбершоп в сердце Ваалы — открытие 15.9.2026.',
      'hero.cta2': 'Смотреть услуги', 'hero.selaa': 'Листайте',
      'marq1': '<span>Точность</span><i>·</i><em>Традиции</em><i>·</i><span>Стиль</span><i>·</i><em>Vaala</em><i>·</i><span>Открытие 15.9.2026</span><i>·</i>',
      'marq2': '<span>Волосы</span><i>·</i><em>Борода</em><i>·</i><span>Горячее полотенце</span><i>·</i><em>Классика</em><i>·</i><span>Vaalan Parturi</span><i>·</i>',
      'svc.eyebrow': 'Услуги',
      'svc.h2': 'Садитесь в кресло. <em>Остальное — за нами.</em>',
      'svc.sub': 'Каждый визит начинается с разговора и заканчивается безупречным результатом. Листайте вбок.',
      'svc1.t': 'Классическая стрижка', 'svc1.d': 'Ножницы и машинка, мытьё и укладка включены. Стрижка, которая держится.',
      'svc2.t': 'Стрижка машинкой', 'svc2.d': 'Быстрая и аккуратная стрижка машинкой под одну насадку.',
      'svc3.t': 'Моделирование бороды', 'svc3.d': 'Контур, подравнивание и масло для бороды. Борода с характером.',
      'svc4.t': 'Стрижка + борода', 'svc4.d': 'Полный комплект за один визит: волосы, борода и финальные штрихи.',
      'svc5.t': 'Классическое бритьё', 'svc5.d': 'Бритьё опасной бритвой — горячее полотенце, масла и спокойствие.',
      'svc6.t': 'Детская стрижка', 'svc6.d': 'Для самых маленьких клиентов — с терпением и юмором.',
      'svccta.p': 'Готовы<br><em>в кресло?</em>',
      'cut.kicker': 'Результат, который виден', 'cut.word': 'ТОЧНОСТЬ', 'cut.note': 'Листайте — машинка сделает остальное.',
      'price.h2': 'Понятные цены, <em>без сюрпризов.</em>',
      'price.r1': 'Стрижка <small>(взрослые)</small>', 'price.r2': 'Студенты', 'price.r3': 'Детская стрижка',
      'price.r4': 'Борода', 'price.r5': 'Стрижка + борода',
      'price.note': 'Цены включают НДС. Принимаем карты, наличные и MobilePay.',
      'about.h2': 'Барбершоп в <em>сердце Ваалы.</em>',
      'about.lead': 'Vaalan Parturi — место, где время в кресле замедляется. Для нас каждый клиент — сосед, а каждая стрижка — визитная карточка.',
      'about.body': 'Классическая барберская работа с современным подходом: чёткие контуры, аккуратный финиш и честный совет о том, что подойдёт именно вам. Садитесь поговорить — или помолчать.',
      'val1.t': 'Точность', 'val1.d': 'Миллиметры решают. Незаконченная работа не покидает кресло.',
      'val2.t': 'Традиции', 'val2.d': 'Горячее полотенце, опасная бритва и работа ножницами. Мастерство, которое не стареет.',
      'val3.t': 'Без спешки', 'val3.d': 'Для каждого клиента отведено время. На часы здесь не смотрят.',
      'about.caption': 'Кресло ждёт. <em>Estd 2026.</em>',
      'styles.eyebrow': 'Стили', 'styles.h2': 'Классика и <em>свежие стрижки.</em>',
      'sty1.t': 'Классика', 'sty1.d': 'Аккуратный боковой пробор, доводка ножницами.',
      'sty2.t': 'Фейд', 'sty2.d': 'Skin fade — чёткие, плавные переходы.',
      'sty3.t': 'Текстура', 'sty3.d': 'Лёгкая, живая длина сверху.',
      'sty4.t': 'Полная борода', 'sty4.d': 'Оформленная, ухоженная, с чётким контуром.',
      'contact.title': 'Запишитесь <em>к нам.</em>',
      'contact.sub': 'Запишитесь онлайн, позвоните или зайдите к нам. Мы лично подтверждаем каждую запись.',
      'contact.bookbtn': 'Записаться онлайн', 'contact.callbtn': 'Позвонить: 046&nbsp;637&nbsp;91&nbsp;31',
      'slots.h3': 'Свободное время',
      'slots.note': 'Выберите услугу и свободное время.',
      'map.eyebrow': 'Мы здесь', 'map.dir': 'Построить маршрут',
      'cg.addr': 'Адрес', 'cg.hours': 'Часы работы', 'cg.follow': 'Мы в соцсетях',
      'hours.wk': 'Пн–Пт', 'hours.sa': 'Сб', 'hours.su': 'Вс',
      'footer.tagline': 'Ваш местный барбер, ваш глобальный стиль.<br>Estd 2026 · Vaala, Финляндия',
      'footer.rights': 'Все права защищены.'
    },
    uk: {
      'skip': 'Перейти до вмісту',
      'nav.palvelut': 'Послуги', 'nav.hinnasto': 'Ціни', 'nav.meista': 'Про нас',
      'nav.yhteys': 'Контакти', 'nav.varaa': 'Записатися',
      'hero.tagline': 'Точна робота, спокійна атмосфера.<br>Класичний барбершоп у серці Ваали — відкриття 15.9.2026.',
      'hero.cta2': 'Переглянути послуги', 'hero.selaa': 'Гортайте',
      'marq1': '<span>Точність</span><i>·</i><em>Традиції</em><i>·</i><span>Стиль</span><i>·</i><em>Vaala</em><i>·</i><span>Відкриття 15.9.2026</span><i>·</i>',
      'marq2': '<span>Волосся</span><i>·</i><em>Борода</em><i>·</i><span>Гарячий рушник</span><i>·</i><em>Класика</em><i>·</i><span>Vaalan Parturi</span><i>·</i>',
      'svc.eyebrow': 'Послуги',
      'svc.h2': 'Сідайте в крісло. <em>Решта — за нами.</em>',
      'svc.sub': 'Кожен візит починається з розмови й закінчується бездоганним результатом. Гортайте вбік.',
      'svc1.t': 'Класична стрижка', 'svc1.d': 'Ножиці та машинка, миття й укладання включено. Стрижка, що тримається.',
      'svc2.t': 'Стрижка машинкою', 'svc2.d': 'Швидка й акуратна стрижка машинкою під одну насадку.',
      'svc3.t': 'Моделювання бороди', 'svc3.d': 'Контур, підрівнювання та олія для бороди. Борода з характером.',
      'svc4.t': 'Стрижка + борода', 'svc4.d': 'Повний комплект за один візит: волосся, борода та фініш.',
      'svc5.t': 'Класичне гоління', 'svc5.d': 'Гоління небезпечною бритвою — гарячий рушник, олії та спокій.',
      'svc6.t': 'Дитяча стрижка', 'svc6.d': 'Для наймолодших клієнтів — з терпінням і гумором.',
      'svccta.p': 'Готові<br><em>в крісло?</em>',
      'cut.kicker': 'Результат, який видно', 'cut.word': 'ТОЧНІСТЬ', 'cut.note': 'Гортайте — машинка зробить решту.',
      'price.h2': 'Зрозумілі ціни, <em>без сюрпризів.</em>',
      'price.r1': 'Стрижка <small>(дорослі)</small>', 'price.r2': 'Студенти', 'price.r3': 'Дитяча стрижка',
      'price.r4': 'Борода', 'price.r5': 'Стрижка + борода',
      'price.note': 'Ціни включають ПДВ. Приймаємо картки, готівку та MobilePay.',
      'about.h2': 'Барбершоп у <em>серці Ваали.</em>',
      'about.lead': 'Vaalan Parturi — місце, де час у кріслі сповільнюється. Для нас кожен клієнт — сусід, а кожна стрижка — візитівка.',
      'about.body': 'Ми робимо класичну барберську роботу з сучасним підходом: чіткі контури, акуратний фініш і чесна порада про те, що пасує саме вам. Сідайте поговорити — або помовчати.',
      'val1.t': 'Точність', 'val1.d': 'Міліметри вирішують. Незавершена робота не залишає крісла.',
      'val2.t': 'Традиції', 'val2.d': 'Гарячий рушник, небезпечна бритва й робота ножицями. Майстерність, що не старіє.',
      'val3.t': 'Без поспіху', 'val3.d': 'Для кожного клієнта відведено час. На годинник тут не дивляться.',
      'about.caption': 'Крісло чекає. <em>Estd 2026.</em>',
      'styles.eyebrow': 'Стилі', 'styles.h2': 'Класика та <em>свіжі стрижки.</em>',
      'sty1.t': 'Класика', 'sty1.d': 'Акуратний проділ, фініш ножицями.',
      'sty2.t': 'Фейд', 'sty2.d': 'Skin fade — чіткі, плавні переходи.',
      'sty3.t': 'Текстура', 'sty3.d': 'Легка, жива довжина зверху.',
      'sty4.t': 'Повна борода', 'sty4.d': 'Оформлена, доглянута, з чітким контуром.',
      'contact.title': 'Запишіться <em>до нас.</em>',
      'contact.sub': 'Запишіться онлайн, зателефонуйте або завітайте. Ми особисто підтверджуємо кожен запис.',
      'contact.bookbtn': 'Записатися онлайн', 'contact.callbtn': 'Подзвонити: 046&nbsp;637&nbsp;91&nbsp;31',
      'slots.h3': 'Вільні години',
      'slots.note': 'Оберіть послугу та вільну годину.',
      'map.eyebrow': 'Ми тут', 'map.dir': 'Прокласти маршрут',
      'cg.addr': 'Адреса', 'cg.hours': 'Години роботи', 'cg.follow': 'Ми в соцмережах',
      'hours.wk': 'Пн–Пт', 'hours.sa': 'Сб', 'hours.su': 'Нд',
      'footer.tagline': 'Ваш місцевий барбер, ваш глобальний стиль.<br>Estd 2026 · Vaala, Фінляндія',
      'footer.rights': 'Усі права захищені.'
    },
    zh: {
      'skip': '跳转到内容',
      'nav.palvelut': '服务', 'nav.hinnasto': '价格', 'nav.meista': '关于我们',
      'nav.yhteys': '联系方式', 'nav.varaa': '立即预约',
      'hero.tagline': '精细的手艺，轻松的氛围。<br>瓦拉（Vaala）中心的经典理发店 — 2026年9月15日开业。',
      'hero.cta2': '查看服务', 'hero.selaa': '向下滚动',
      'marq1': '<span>精准</span><i>·</i><em>传统</em><i>·</i><span>风格</span><i>·</i><em>Vaala</em><i>·</i><span>2026年9月15日开业</span><i>·</i>',
      'marq2': '<span>理发</span><i>·</i><em>胡须</em><i>·</i><span>热毛巾</span><i>·</i><em>经典</em><i>·</i><span>Vaalan Parturi</span><i>·</i>',
      'svc.eyebrow': '服务',
      'svc.h2': '请入座，<em>其余交给我们。</em>',
      'svc.sub': '每次光临都从交流开始，以完美的效果结束。左右滑动查看。',
      'svc1.t': '经典理发', 'svc1.d': '剪刀与电推配合，含洗发与造型。日常也持久有型。',
      'svc2.t': '电推快剪', 'svc2.d': '单一长度、快速利落的全头电推。',
      'svc3.t': '胡须修整', 'svc3.d': '修边、修剪加护须油。让胡须更有型。',
      'svc4.t': '理发＋修须', 'svc4.d': '一次搞定：头发、胡须与最后修饰。',
      'svc5.t': '传统剃须', 'svc5.d': '剃刀剃须 — 热毛巾、须前油，享受宁静时光。',
      'svc6.t': '儿童理发', 'svc6.d': '为小顾客服务 — 耐心又风趣。',
      'svccta.p': '准备好<br><em>入座了吗？</em>',
      'cut.kicker': '看得见的手艺', 'cut.word': '精益求精', 'cut.note': '滚动页面 — 剩下交给推剪。',
      'price.h2': '价格透明，<em>绝无套路。</em>',
      'price.r1': '理发 <small>（成人）</small>', 'price.r2': '学生', 'price.r3': '儿童理发',
      'price.r4': '修须', 'price.r5': '理发＋修须',
      'price.note': '价格含增值税。支持银行卡、现金和 MobilePay。',
      'about.h2': '位于 <em>Vaala 中心</em>的理发店。',
      'about.lead': 'Vaalan Parturi 是一个让时间慢下来的地方。每位顾客都是邻居，每次理发都是我们的名片。',
      'about.body': '我们以现代手法演绎经典理发：利落的线条、细致的修饰，以及最适合您的诚恳建议。坐下来聊聊天 — 或者安静地享受。',
      'val1.t': '精准', 'val1.d': '毫厘之间见真章。未完成的作品绝不出门。',
      'val2.t': '传统', 'val2.d': '热毛巾、剃刀与剪刀功夫。永不过时的手艺。',
      'val3.t': '从容', 'val3.d': '为每位顾客留足时间。在这里无需看表。',
      'about.caption': '座椅已备好。<em>Estd 2026。</em>',
      'styles.eyebrow': '风格', 'styles.h2': '经典与<em>新潮发型。</em>',
      'sty1.t': '经典', 'sty1.d': '干净的侧分，剪刀修饰。',
      'sty2.t': '渐变', 'sty2.d': 'Skin fade — 利落顺滑的过渡。',
      'sty3.t': '纹理', 'sty3.d': '头顶轻盈灵动的层次。',
      'sty4.t': '络腮胡', 'sty4.d': '修整有型，轮廓分明。',
      'contact.title': '来<em>预约吧。</em>',
      'contact.sub': '在线预约、致电或直接到店。每个预约我们都会亲自确认。',
      'contact.bookbtn': '在线预约', 'contact.callbtn': '致电：046&nbsp;637&nbsp;91&nbsp;31',
      'slots.h3': '可预约时间',
      'slots.note': '选择服务和可约的时间。',
      'map.eyebrow': '我们在这里', 'map.dir': '导航到店',
      'cg.addr': '地址', 'cg.hours': '营业时间', 'cg.follow': '关注我们',
      'hours.wk': '周一至周五', 'hours.sa': '周六', 'hours.su': '周日',
      'footer.tagline': '您身边的理发师，世界级的风格。<br>Estd 2026 · Vaala, 芬兰',
      'footer.rights': '版权所有。'
    },
    ro: {
      'skip': 'Sari la conținut',
      'nav.palvelut': 'Servicii', 'nav.hinnasto': 'Prețuri', 'nav.meista': 'Despre noi',
      'nav.yhteys': 'Contact', 'nav.varaa': 'Programează-te',
      'hero.tagline': 'Muncă precisă, atmosferă relaxată.<br>O frizerie clasică în inima orașului Vaala — deschidere 15.9.2026.',
      'hero.cta2': 'Vezi serviciile', 'hero.selaa': 'Derulează',
      'marq1': '<span>Precizie</span><i>·</i><em>Tradiție</em><i>·</i><span>Stil</span><i>·</i><em>Vaala</em><i>·</i><span>Deschidere 15.9.2026</span><i>·</i>',
      'marq2': '<span>Păr</span><i>·</i><em>Barbă</em><i>·</i><span>Prosop cald</span><i>·</i><em>Clasic</em><i>·</i><span>Vaalan Parturi</span><i>·</i>',
      'svc.eyebrow': 'Servicii',
      'svc.h2': 'Ia loc. <em>Restul e treaba noastră.</em>',
      'svc.sub': 'Fiecare vizită începe cu o discuție și se încheie cu un rezultat impecabil. Trage sau derulează lateral.',
      'svc1.t': 'Tuns clasic', 'svc1.d': 'Foarfecă și mașină, spălat și styling incluse. O tunsoare care ține.',
      'svc2.t': 'Tuns cu mașina', 'svc2.d': 'Tuns rapid și curat cu mașina, cu o singură sită.',
      'svc3.t': 'Aranjat barbă', 'svc3.d': 'Contur, egalizare și ulei de barbă. O barbă cu caracter.',
      'svc4.t': 'Tuns + barbă', 'svc4.d': 'Pachetul complet într-o singură vizită: păr, barbă și finisaj.',
      'svc5.t': 'Bărbierit tradițional', 'svc5.d': 'Bărbierit cu brici — prosop cald, uleiuri și liniște.',
      'svc6.t': 'Tuns copii', 'svc6.d': 'Pentru cei mai mici clienți — cu răbdare și umor.',
      'svccta.p': 'Gata pentru<br><em>scaun?</em>',
      'cut.kicker': 'Un rezultat care se vede', 'cut.word': 'PRECIZIE', 'cut.note': 'Derulează — mașina face restul.',
      'price.h2': 'Prețuri clare, <em>fără surprize.</em>',
      'price.r1': 'Tuns <small>(adulți)</small>', 'price.r2': 'Studenți', 'price.r3': 'Tuns copii',
      'price.r4': 'Barbă', 'price.r5': 'Tuns + barbă',
      'price.note': 'Prețurile includ TVA. Acceptăm card, numerar și MobilePay.',
      'about.h2': 'O frizerie în <em>inima orașului Vaala.</em>',
      'about.lead': 'Vaalan Parturi e locul unde timpul încetinește în scaun. Pentru noi fiecare client e un vecin — și fiecare tunsoare, o carte de vizită.',
      'about.body': 'Facem frizerie clasică cu o abordare modernă: contururi precise, finisaj atent și sfaturi sincere despre ce ți se potrivește. Ia loc la o vorbă — sau la liniște.',
      'val1.t': 'Precizie', 'val1.d': 'Milimetrii contează. Lucrul neterminat nu pleacă din scaun.',
      'val2.t': 'Tradiție', 'val2.d': 'Prosop cald, brici și lucru cu foarfeca. Meserie care nu îmbătrânește.',
      'val3.t': 'Fără grabă', 'val3.d': 'Rezervăm timp pentru fiecare client. Aici nimeni nu se uită la ceas.',
      'about.caption': 'Scaunul te așteaptă. <em>Estd 2026.</em>',
      'styles.eyebrow': 'Stiluri', 'styles.h2': 'Modele clasice și <em>tunsori noi.</em>',
      'sty1.t': 'Clasic', 'sty1.d': 'Cărare curată, finisată cu foarfeca.',
      'sty2.t': 'Fade', 'sty2.d': 'Skin fade — treceri precise, fără demarcații.',
      'sty3.t': 'Textură', 'sty3.d': 'Lungime lejeră și plină de viață în partea de sus.',
      'sty4.t': 'Barbă plină', 'sty4.d': 'Modelată, îngrijită și conturată clar.',
      'contact.title': 'Programează <em>o vizită.</em>',
      'contact.sub': 'Programează-te online, sună sau treci pe la noi. Confirmăm personal fiecare programare.',
      'contact.bookbtn': 'Programare online', 'contact.callbtn': 'Sună: 046&nbsp;637&nbsp;91&nbsp;31',
      'slots.h3': 'Ore disponibile',
      'slots.note': 'Alege serviciul și o oră liberă.',
      'map.eyebrow': 'Ne găsești aici', 'map.dir': 'Cum ajungi',
      'cg.addr': 'Adresă', 'cg.hours': 'Program', 'cg.follow': 'Urmărește-ne',
      'hours.wk': 'Lun–Vin', 'hours.sa': 'Sâm', 'hours.su': 'Dum',
      'footer.tagline': 'Frizerul tău local, stilul tău global.<br>Estd 2026 · Vaala, Finlanda',
      'footer.rights': 'Toate drepturile rezervate.'
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
  var LANG_CODES = { fi: 'FI', sv: 'SV', en: 'EN', ru: 'RU', uk: 'UA', zh: '中文', ro: 'RO' };
  function applyLang(lang) {
    if (lang !== 'fi' && !DICT[lang]) lang = 'fi';
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
    /* longer translated words are squeezed to the stage width; CJK stays natural */
    document.querySelectorAll('.cut-text').forEach(function (t) {
      if (lang === 'fi' || lang === 'zh') { t.removeAttribute('textLength'); t.removeAttribute('lengthAdjust'); }
      else { t.setAttribute('textLength', '1116'); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
    });
    var cur = document.getElementById('langCur');
    if (cur) cur.textContent = LANG_CODES[lang] || lang.toUpperCase();
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });
    document.dispatchEvent(new CustomEvent('vp:lang'));
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
  });
  (function () {
    var btn = document.getElementById('langBtn');
    var menu = document.getElementById('langMenu');
    if (!btn || !menu) return;
    function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.hidden;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', close); });
    document.addEventListener('click', function (ev) {
      if (!menu.hidden && !menu.contains(ev.target) && ev.target !== btn && !btn.contains(ev.target)) close();
    });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  })();
  (function () {
    var stored = null;
    try { stored = localStorage.getItem('vp-lang'); } catch (e) {}
    if (stored && stored !== 'fi' && DICT[stored]) applyLang(stored);
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
    var flow = document.getElementById('slotsFlow');
    var gridPane = document.getElementById('slotsGridPane');
    var formPane = document.getElementById('slotsFormPane');
    var nextBtn = document.getElementById('slotsNext');
    var dp = document.getElementById('dp');
    var dateBtn = document.getElementById('slotsDateBtn');
    var todayBtn = document.getElementById('slotsToday');
    var subEl = document.getElementById('slotsSub');
    var pickEl = document.getElementById('slotsPickLabel');
    if (!wrap || !grid || !chipsWrap || !flow || !formPane || typeof fetch === 'undefined') return;

    /* shop hours by weekday (0 = Sunday), [open, close] in Helsinki time */
    var HOURS = { 0: [10, 16], 1: [10, 18], 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 17] };
    var SERVICES = [
      { slug: 'klassinen-leikkaus', dur: 30, fi: 'Klassinen leikkaus', sv: 'Klassisk klippning', en: 'Classic haircut', ru: 'Классическая стрижка', uk: 'Класична стрижка', zh: '经典理发', ro: 'Tuns clasic' },
      { slug: 'koneajo', dur: 20, fi: 'Koneajo', sv: 'Maskinklippning', en: 'Clipper cut', ru: 'Стрижка машинкой', uk: 'Стрижка машинкою', zh: '电推快剪', ro: 'Tuns cu mașina' },
      { slug: 'parran-muotoilu', dur: 20, fi: 'Parran muotoilu', sv: 'Skäggtrimning', en: 'Beard trim', ru: 'Моделирование бороды', uk: 'Моделювання бороди', zh: '胡须修整', ro: 'Aranjat barbă' },
      { slug: 'leikkaus-parta', dur: 60, fi: 'Leikkaus + parta', sv: 'Klippning + skägg', en: 'Cut + beard', ru: 'Стрижка + борода', uk: 'Стрижка + борода', zh: '理发＋修须', ro: 'Tuns + barbă' },
      { slug: 'parranajo-kuumalla-pyyhkeella', dur: 40, fi: 'Perinteinen parranajo', sv: 'Klassisk rakning', en: 'Traditional shave', ru: 'Классическое бритьё', uk: 'Класичне гоління', zh: '传统剃须', ro: 'Bărbierit tradițional' },
      { slug: 'lasten-leikkaus', dur: 30, fi: 'Lasten leikkaus', sv: 'Barnklippning', en: "Kids' haircut", ru: 'Детская стрижка', uk: 'Дитяча стрижка', zh: '儿童理发', ro: 'Tuns copii' }
    ];
    var STR = {
      fi: { free: 'Vapaa', taken: 'Varattu', today: 'Tänään', tomorrow: 'Huomenna', days: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
            sub: 'Seuraavat kolme päivää · Suomen aikaa', sub2: 'Kolme päivää valitusta päivästä · Suomen aikaa', pick: 'Valitse päivä',
            next: 'Seuraava', back: 'Takaisin', formTitle: 'Vahvista varaus', name: 'Nimi', email: 'Sähköposti', phone: 'Puhelinnumero',
            note: 'Lisätiedot (valinnainen)', submit: 'Lähetä varauspyyntö', sending: 'Lähetetään…',
            okTitle: 'Varauspyyntö lähetetty!', okBody: 'Saat sähköpostiisi vahvistuksen, kun varaus on hyväksytty.', done: 'Valmis',
            error: 'Varaus epäonnistui. Yritä uudelleen tai avaa varauslomake.', errorBtn: 'Avaa varauslomake',
            required: 'Täytä nimi, sähköposti ja puhelinnumero.' },
      sv: { free: 'Ledig', taken: 'Bokad', today: 'Idag', tomorrow: 'Imorgon', days: ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'],
            sub: 'Kommande tre dagar · finsk tid', sub2: 'Tre dagar från valt datum · finsk tid', pick: 'Välj datum',
            next: 'Nästa', back: 'Tillbaka', formTitle: 'Bekräfta bokningen', name: 'Namn', email: 'E-post', phone: 'Telefonnummer',
            note: 'Meddelande (valfritt)', submit: 'Skicka bokningsförfrågan', sending: 'Skickar…',
            okTitle: 'Bokningsförfrågan skickad!', okBody: 'Du får en bekräftelse per e-post när bokningen har godkänts.', done: 'Klart',
            error: 'Bokningen misslyckades. Försök igen eller öppna bokningsformuläret.', errorBtn: 'Öppna bokningsformuläret',
            required: 'Fyll i namn, e-post och telefonnummer.' },
      en: { free: 'Free', taken: 'Booked', today: 'Today', tomorrow: 'Tomorrow', days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            sub: 'Next three days · Finnish time', sub2: 'Three days from the chosen date · Finnish time', pick: 'Pick a date',
            next: 'Next', back: 'Back', formTitle: 'Confirm your booking', name: 'Name', email: 'Email', phone: 'Phone number',
            note: 'Notes (optional)', submit: 'Send booking request', sending: 'Sending…',
            okTitle: 'Booking request sent!', okBody: "You'll get an email confirmation once we approve it.", done: 'Done',
            error: 'Booking failed. Try again or open the booking form.', errorBtn: 'Open booking form',
            required: 'Please fill in your name, email and phone number.' },
      ru: { free: 'Свободно', taken: 'Занято', today: 'Сегодня', tomorrow: 'Завтра', days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            sub: 'Ближайшие три дня · по финскому времени', sub2: 'Три дня с выбранной даты · по финскому времени', pick: 'Выбрать дату',
            next: 'Далее', back: 'Назад', formTitle: 'Подтвердите запись', name: 'Имя', email: 'Эл. почта', phone: 'Номер телефона',
            note: 'Комментарий (необязательно)', submit: 'Отправить заявку', sending: 'Отправка…',
            okTitle: 'Заявка отправлена!', okBody: 'Вы получите письмо с подтверждением, когда мы одобрим запись.', done: 'Готово',
            error: 'Не удалось записаться. Попробуйте ещё раз или откройте форму записи.', errorBtn: 'Открыть форму записи',
            required: 'Укажите имя, почту и номер телефона.' },
      uk: { free: 'Вільно', taken: 'Зайнято', today: 'Сьогодні', tomorrow: 'Завтра', days: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            sub: 'Найближчі три дні · за фінським часом', sub2: 'Три дні від обраної дати · за фінським часом', pick: 'Обрати дату',
            next: 'Далі', back: 'Назад', formTitle: 'Підтвердіть запис', name: "Ім'я", email: 'Ел. пошта', phone: 'Номер телефону',
            note: "Коментар (необов'язково)", submit: 'Надіслати заявку', sending: 'Надсилання…',
            okTitle: 'Заявку надіслано!', okBody: 'Ви отримаєте лист із підтвердженням, щойно ми схвалимо запис.', done: 'Готово',
            error: 'Не вдалося записатися. Спробуйте ще раз або відкрийте форму запису.', errorBtn: 'Відкрити форму запису',
            required: "Заповніть ім'я, пошту та номер телефону." },
      zh: { free: '可约', taken: '已订', today: '今天', tomorrow: '明天', days: ['日', '一', '二', '三', '四', '五', '六'],
            sub: '未来三天 · 芬兰时间', sub2: '所选日期起三天 · 芬兰时间', pick: '选择日期',
            next: '下一步', back: '返回', formTitle: '确认预约', name: '姓名', email: '邮箱', phone: '电话号码',
            note: '备注（可选）', submit: '提交预约申请', sending: '提交中…',
            okTitle: '预约申请已提交！', okBody: '预约通过后，您将收到确认邮件。', done: '完成',
            error: '预约失败。请重试或打开预约表单。', errorBtn: '打开预约表单',
            required: '请填写姓名、邮箱和电话号码。' },
      ro: { free: 'Liber', taken: 'Ocupat', today: 'Azi', tomorrow: 'Mâine', days: ['Dum', 'Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm'],
            sub: 'Următoarele trei zile · ora Finlandei', sub2: 'Trei zile de la data aleasă · ora Finlandei', pick: 'Alege data',
            next: 'Înainte', back: 'Înapoi', formTitle: 'Confirmă programarea', name: 'Nume', email: 'Email', phone: 'Număr de telefon',
            note: 'Observații (opțional)', submit: 'Trimite cererea', sending: 'Se trimite…',
            okTitle: 'Cererea a fost trimisă!', okBody: 'Vei primi un email de confirmare după ce o aprobăm.', done: 'Gata',
            error: 'Programarea a eșuat. Încearcă din nou sau deschide formularul.', errorBtn: 'Deschide formularul',
            required: 'Completează numele, emailul și telefonul.' }
    };
    var LOCALES = { fi: 'fi-FI', sv: 'sv-SE', en: 'en-GB', ru: 'ru-RU', uk: 'uk-UA', zh: 'zh-CN', ro: 'ro-RO' };
    var CAL_LOCALES = { fi: 'fi', sv: 'sv', en: 'en', ru: 'ru', uk: 'uk', zh: 'zh-CN', ro: 'ro' };

    var active = SERVICES[0];
    var cache = {};
    var startISO = null; /* null = today */
    var selection = null;
    var inForm = false;

    function lang() {
      var l = (document.documentElement.lang || 'fi').slice(0, 2);
      return STR[l] ? l : 'fi';
    }
    function T() { return STR[lang()]; }
    function label(svc) { return svc[lang()] || svc.en || svc.fi; }
    function esc(t) {
      return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function helsinkiISO(offsetDays) {
      var d = new Date(Date.now() + offsetDays * 86400000);
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Helsinki', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(d);
    }
    function addDaysISO(iso, n) {
      var d = new Date(iso + 'T12:00:00Z');
      d.setUTCDate(d.getUTCDate() + n);
      return d.toISOString().slice(0, 10);
    }
    function weekdayOf(iso) { return new Date(iso + 'T12:00:00Z').getUTCDay(); }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function fmtDate(iso) {
      var p = iso.split('-');
      return parseInt(p[2], 10) + '.' + parseInt(p[1], 10) + '.';
    }
    function endTime(hhmm, dur) {
      var p = hhmm.split(':');
      var m = parseInt(p[0], 10) * 60 + parseInt(p[1], 10) + dur;
      return pad(Math.floor(m / 60) % 24) + ':' + pad(m % 60);
    }

    function clearSelection() {
      selection = null;
      if (nextBtn) nextBtn.hidden = true;
      var prev = grid.querySelector('.slot.is-selected');
      if (prev) prev.classList.remove('is-selected');
    }

    /* ----- service chips ----- */
    function buildChips() {
      chipsWrap.innerHTML = SERVICES.map(function (svc) {
        return '<button type="button" class="chip' + (svc.slug === active.slug ? ' is-active' : '') +
          '" data-slug="' + svc.slug + '">' + esc(label(svc)) + '</button>';
      }).join('');
      chipsWrap.querySelectorAll('.chip').forEach(function (b) {
        b.addEventListener('click', function () {
          var next = SERVICES.filter(function (svc) { return svc.slug === b.getAttribute('data-slug'); })[0];
          if (!next || next.slug === active.slug) return;
          active = next;
          buildChips();
          load();
        });
      });
    }

    /* ----- custom date picker ----- */
    var dpMonth = null; /* ISO of the 1st of the shown month */
    function monthFirst(iso) { return iso.slice(0, 7) + '-01'; }
    function dpClose() {
      if (dp) dp.hidden = true;
      if (dateBtn) dateBtn.setAttribute('aria-expanded', 'false');
    }
    function dpRender() {
      if (!dp) return;
      var S = T(), L = LOCALES[lang()];
      var todayISO = helsinkiISO(0);
      var maxISO = addDaysISO(todayISO, 180);
      var selISO = startISO || todayISO;
      if (!dpMonth) dpMonth = monthFirst(selISO);
      var monthDate = new Date(dpMonth + 'T12:00:00Z');
      var title = new Intl.DateTimeFormat(L, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(monthDate);
      var prevOk = dpMonth > monthFirst(todayISO);
      var nextOk = dpMonth < monthFirst(maxISO);
      /* Monday-first weekday header */
      var wk = [1, 2, 3, 4, 5, 6, 0].map(function (i) { return '<span>' + S.days[i] + '</span>'; }).join('');
      /* first cell: Monday on/before the 1st */
      var firstWd = (weekdayOf(dpMonth) + 6) % 7; /* 0 = Monday */
      var cellISO = addDaysISO(dpMonth, -firstWd);
      var cells = '';
      for (var i = 0; i < 42; i++) {
        var iso = addDaysISO(cellISO, i);
        var inMonth = iso.slice(0, 7) === dpMonth.slice(0, 7);
        var disabled = iso < todayISO || iso > maxISO;
        var cls = (inMonth ? '' : ' is-other') + (iso === todayISO ? ' is-today' : '') + (iso === selISO ? ' is-selected' : '');
        cells += '<button type="button" data-iso="' + iso + '"' + (disabled ? ' disabled' : '') +
          (cls ? ' class="' + cls.trim() + '"' : '') + '>' + parseInt(iso.slice(8), 10) + '</button>';
      }
      dp.innerHTML =
        '<div class="dp-head"><p class="dp-title">' + esc(title) + '</p><div class="dp-nav">' +
        '<button type="button" data-nav="-1"' + (prevOk ? '' : ' disabled') + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>' +
        '<button type="button" data-nav="1"' + (nextOk ? '' : ' disabled') + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>' +
        '</div></div><div class="dp-week">' + wk + '</div><div class="dp-days">' + cells + '</div>';
      dp.querySelectorAll('[data-nav]').forEach(function (b) {
        b.addEventListener('click', function (e) {
          /* dpRender() replaces dp.innerHTML, which detaches this very button.
             Without stopPropagation the click then reaches the document-level
             "clicked outside" handler, where dp.contains(target) is false for
             the now-detached node - and the picker would close on every
             month change. */
          e.stopPropagation();
          var d = new Date(dpMonth + 'T12:00:00Z');
          d.setUTCMonth(d.getUTCMonth() + parseInt(b.getAttribute('data-nav'), 10));
          dpMonth = d.toISOString().slice(0, 8) + '01';
          dpRender();
        });
      });
      dp.querySelectorAll('.dp-days button:not(:disabled)').forEach(function (b) {
        b.addEventListener('click', function () {
          var iso = b.getAttribute('data-iso');
          startISO = iso === helsinkiISO(0) ? null : iso;
          dpClose();
          load();
        });
      });
    }
    if (dateBtn && dp) {
      dateBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (dp.hidden) {
          dpMonth = monthFirst(startISO || helsinkiISO(0));
          dpRender();
          dp.hidden = false;
          dateBtn.setAttribute('aria-expanded', 'true');
        } else { dpClose(); }
      });
      document.addEventListener('click', function (ev) {
        if (!dp.hidden && !dp.contains(ev.target) && !dateBtn.contains(ev.target)) dpClose();
      });
      window.addEventListener('keydown', function (e) { if (e.key === 'Escape') dpClose(); });
    }
    if (todayBtn) {
      todayBtn.addEventListener('click', function () { startISO = null; load(); });
    }

    /* ----- availability grid ----- */
    function render(data) {
      var S = T();
      clearSelection();
      var todayISO = helsinkiISO(0), tomorrowISO = helsinkiISO(1);
      var first = startISO || todayISO;
      var days = [first, addDaysISO(first, 1), addDaysISO(first, 2)];
      if (subEl) subEl.textContent = startISO ? S.sub2 : S.sub;
      if (pickEl) pickEl.textContent = S.pick;
      /* while the booking form is open the day controls stay hidden */
      if (todayBtn) { todayBtn.textContent = S.today; todayBtn.hidden = inForm || !startISO; }
      if (nextBtn) nextBtn.textContent = S.next;
      var html = '';
      days.forEach(function (iso) {
        var wd = weekdayOf(iso);
        var dayLabel = iso === todayISO ? S.today : (iso === tomorrowISO ? S.tomorrow : S.days[wd]);
        var open = HOURS[wd][0], close = HOURS[wd][1];
        var free = {};
        (data[iso] || []).forEach(function (x) {
          if (x && x.start) free[x.start.slice(11, 16)] = x.start;
        });
        var times = {};
        for (var m = open * 60; m + active.dur <= close * 60; m += active.dur) {
          times[pad(Math.floor(m / 60)) + ':' + pad(m % 60)] = true;
        }
        Object.keys(free).forEach(function (t) { times[t] = true; });
        var cells = '';
        Object.keys(times).sort().forEach(function (t) {
          if (free[t]) {
            cells += '<button type="button" class="slot" data-iso="' + iso + '" data-hhmm="' + t +
              '" data-start="' + esc(free[t]) + '"><span>' + t + '</span><span class="slot-tag">' + S.free + '</span></button>';
          } else {
            cells += '<span class="slot slot--taken"><span>' + t + '</span><span class="slot-tag">' + S.taken + '</span></span>';
          }
        });
        html += '<div class="slots-day"><p class="slots-day-label">' + dayLabel +
          '<small>' + fmtDate(iso) + '</small></p><div class="slots-list">' + cells + '</div></div>';
      });
      grid.innerHTML = html;
      grid.querySelectorAll('button.slot').forEach(function (b) {
        b.addEventListener('click', function () {
          var prev = grid.querySelector('.slot.is-selected');
          if (prev) prev.classList.remove('is-selected');
          if (prev === b) { selection = null; nextBtn.hidden = true; return; }
          b.classList.add('is-selected');
          selection = {
            slug: active.slug, dur: active.dur, svc: active,
            iso: b.getAttribute('data-iso'),
            hhmm: b.getAttribute('data-hhmm'),
            start: b.getAttribute('data-start')
          };
          nextBtn.hidden = false;
        });
      });
      wrap.hidden = false;
      if (typeof syncCalTheme === 'function') syncCalTheme();
      if (hasGsap && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }

    function load() {
      var first = startISO || helsinkiISO(0);
      var key = active.slug + '|' + first;
      if (cache[key]) { render(cache[key]); return; }
      var url = 'https://api.cal.com/v2/slots?eventTypeSlug=' + active.slug + '&username=vaalanparturi' +
        '&start=' + first + '&end=' + addDaysISO(first, 3) + '&timeZone=Europe/Helsinki';
      fetch(url, { headers: { 'cal-api-version': '2024-09-04' } })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error('slots http ' + r.status)); })
        .then(function (json) {
          cache[key] = (json && json.data) || {};
          render(cache[key]);
        })
        .catch(function () { /* API unreachable: leave the board hidden */ });
    }

    /* ----- slide flow: grid <-> form ----- */
    function slideToForm() {
      formPane.hidden = false;
      /* The date is locked in once the form opens - hide the day controls so
         the chosen slot cannot drift out from under the booking. */
      dpClose();
      if (dateBtn) dateBtn.hidden = true;
      if (todayBtn) todayBtn.hidden = true;
      requestAnimationFrame(function () { flow.classList.add('is-form'); });
      inForm = true;
    }
    function slideToGrid() {
      gridPane.style.height = '';
      gridPane.style.overflow = '';
      gridPane.style.visibility = '';
      if (dateBtn) dateBtn.hidden = false;
      if (todayBtn) todayBtn.hidden = !startISO;
      flow.classList.remove('is-form');
      inForm = false;
    }
    flow.addEventListener('transitionend', function (e) {
      if (e.target !== flow) return;
      if (inForm) {
        gridPane.style.height = '0px';
        gridPane.style.overflow = 'hidden';
        gridPane.style.visibility = 'hidden';
      } else {
        formPane.hidden = true;
      }
    });

    function summaryHTML(S) {
      var sel = selection;
      var wd = weekdayOf(sel.iso);
      var todayISO = helsinkiISO(0), tomorrowISO = helsinkiISO(1);
      var dayLabel = sel.iso === todayISO ? S.today : (sel.iso === tomorrowISO ? S.tomorrow : S.days[wd]);
      return '<div class="bk-summary"><strong>' + esc(label(sel.svc)) + '</strong>' +
        '<span>' + dayLabel + ' ' + fmtDate(sel.iso) + '</span>' +
        '<em>' + sel.hhmm + '–' + endTime(sel.hhmm, sel.dur) + '</em></div>';
    }

    function renderForm(keep) {
      if (!selection) return;
      var S = T();
      var old = keep ? {
        name: (document.getElementById('bkName') || {}).value || '',
        email: (document.getElementById('bkEmail') || {}).value || '',
        phone: (document.getElementById('bkPhone') || {}).value || '',
        note: (document.getElementById('bkNote') || {}).value || ''
      } : { name: '', email: '', phone: '', note: '' };
      formPane.innerHTML =
        '<h4 class="bk-title" style="font-family: Fraunces, Georgia, serif; font-size: 1.5rem; font-weight: 580; margin-bottom: 18px;">' + S.formTitle + '</h4>' +
        summaryHTML(S) +
        '<div class="bk-fields">' +
        '<div class="bk-field"><label for="bkName">' + S.name + ' *</label><input id="bkName" type="text" autocomplete="name" value="' + esc(old.name) + '"></div>' +
        '<div class="bk-field"><label for="bkEmail">' + S.email + ' *</label><input id="bkEmail" type="email" autocomplete="email" value="' + esc(old.email) + '"></div>' +
        '<div class="bk-field bk-field--full"><label for="bkPhone">' + S.phone + ' *</label><input id="bkPhone" type="tel" autocomplete="tel" placeholder="+358 40 123 4567" value="' + esc(old.phone) + '"></div>' +
        '<div class="bk-field bk-field--full"><label for="bkNote">' + S.note + '</label><textarea id="bkNote">' + esc(old.note) + '</textarea></div>' +
        '</div>' +
        '<p class="bk-error" id="bkError"></p>' +
        '<div class="bk-actions">' +
        '<button type="button" class="btn btn--ghost" id="bkBack">' + S.back + '</button>' +
        '<button type="button" class="btn btn--solid" id="bkSubmit">' + S.submit + '</button>' +
        '</div>';
      document.getElementById('bkBack').addEventListener('click', slideToGrid);
      document.getElementById('bkSubmit').addEventListener('click', submitBooking);
    }

    function renderSuccess() {
      var S = T();
      formPane.innerHTML =
        '<div class="bk-success">' +
        '<div class="bk-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
        '<h4>' + S.okTitle + '</h4>' +
        summaryHTML(S) +
        '<p>' + S.okBody + '</p>' +
        '<button type="button" class="btn btn--solid" id="bkDone">' + S.done + '</button>' +
        '</div>';
      document.getElementById('bkDone').addEventListener('click', function () {
        slideToGrid();
        selection = null;
        load();
      });
    }

    function normalizePhone(v) {
      v = v.replace(/[\s\-().]/g, '');
      if (v.charAt(0) === '+') return v;
      if (v.indexOf('00') === 0) return '+' + v.slice(2);
      if (v.charAt(0) === '0') return '+358' + v.slice(1);
      return '+' + v;
    }

    function submitBooking() {
      var S = T();
      var name = (document.getElementById('bkName').value || '').trim();
      var email = (document.getElementById('bkEmail').value || '').trim();
      var phone = (document.getElementById('bkPhone').value || '').trim();
      var note = (document.getElementById('bkNote').value || '').trim();
      var err = document.getElementById('bkError');
      var btn = document.getElementById('bkSubmit');
      err.classList.remove('is-visible');
      if (!name || !email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/) || phone.replace(/\D/g, '').length < 6) {
        err.textContent = S.required;
        err.classList.add('is-visible');
        return;
      }
      var sel = selection;
      btn.disabled = true;
      btn.textContent = S.sending;
      var body = {
        start: new Date(sel.start).toISOString(),
        eventTypeSlug: sel.slug,
        username: 'vaalanparturi',
        attendee: {
          name: name,
          email: email,
          timeZone: 'Europe/Helsinki',
          language: CAL_LOCALES[lang()] || 'fi',
          phoneNumber: normalizePhone(phone)
        },
        bookingFieldsResponses: { attendeePhoneNumber: normalizePhone(phone) }
      };
      if (note) body.bookingFieldsResponses.notes = note;
      fetch('https://api.cal.com/v2/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'cal-api-version': '2024-08-13' },
        body: JSON.stringify(body)
      })
        .then(function (r) {
          if (!r.ok) return Promise.reject(new Error('book http ' + r.status));
          return r.json();
        })
        .then(function () {
          /* the slot is now pending: drop cached availability for this service */
          Object.keys(cache).forEach(function (k) {
            if (k.indexOf(sel.slug + '|') === 0) delete cache[k];
          });
          renderSuccess();
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = S.submit;
          err.innerHTML = esc(S.error) + ' <button type="button" class="btn btn--ghost" style="margin-top:10px; padding:9px 18px; font-size:0.85rem;" data-cal-link="vaalanparturi/' + sel.slug +
            "\" data-cal-config='" + JSON.stringify({ theme: currentTheme(), month: sel.iso.slice(0, 7), date: sel.iso, slot: new Date(sel.start).toISOString() }) + "'>" + esc(S.errorBtn) + '</button>';
          err.classList.add('is-visible');
        });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (!selection) return;
        renderForm(false);
        slideToForm();
      });
    }

    document.addEventListener('vp:lang', function () {
      buildChips();
      if (!dp.hidden) dpRender();
      if (inForm && selection) { renderForm(true); return; }
      var key = active.slug + '|' + (startISO || helsinkiISO(0));
      if (cache[key]) render(cache[key]);
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
