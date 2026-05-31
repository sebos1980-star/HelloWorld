/* ============================================
   BRONKO-DONKO — Frontend-Verhalten
   ============================================ */

/* ---- Mobile-Navigation ---- */
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('.nav__link')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* ---- Video: selbst gehostete MP4s (kein externer Dienst) ---- */
const BD_VIDEO = (() => {
  // Baut in `container` ein selbst gehostetes Video.
  // - opts.autoplay: stummes Endlos-Video sofort (für Charakter-Clips im Overlay)
  // - sonst: Poster/Klick-Fläche, erst beim Klick startet die Wiedergabe mit Ton
  // opts: { poster?: <Bild-URL → Poster-Variante>, ratio?: 'portrait', label?: <Text> }
  function mount(container, src, title, opts) {
    if (!src) return;
    opts = opts || {};
    container.classList.add('video');
    if (opts.ratio === 'portrait') container.classList.add('video--portrait');

    if (opts.autoplay) {
      const video = document.createElement('video');
      video.src = src;
      video.title = title || '';
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      if (opts.poster) video.poster = opts.poster; // Standbild bis das Video läuft (kein schwarzes Flackern)
      container.classList.add('is-playing');
      container.appendChild(video);
      video.play().catch(() => {}); // manche Browser starten beim Re-Mount nicht allein
      return;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Video abspielen' + (title ? ': ' + title : ''));

    if (opts.poster) {
      // Poster-Variante: Bild als Hintergrund, nur Play-Symbol + Label darüber.
      container.classList.add('video--poster');
      container.style.backgroundImage = "url('" + opts.poster + "')";
      btn.className = 'video__btn video__btn--poster';
      btn.innerHTML =
        '<span class="video__play" aria-hidden="true">&#9654;</span>' +
        '<span class="video__label">' + (opts.label || 'Video ansehen') + '</span>';
    } else {
      btn.className = 'video__btn';
      btn.innerHTML =
        '<span class="video__play" aria-hidden="true">&#9654;</span>' +
        '<span class="video__label">Video ansehen</span>';
    }

    btn.addEventListener('click', () => {
      const video = document.createElement('video');
      video.src = src;
      video.title = title || '';
      video.controls = true;
      video.autoplay = true;
      video.setAttribute('playsinline', '');
      container.innerHTML = '';
      container.classList.add('is-playing'); // entfernt u. a. die Poster-Maske
      container.appendChild(video);
      video.play();
    });

    container.innerHTML = '';
    container.appendChild(btn);
  }

  // Statische Facade-Container aufbauen (inkl. optionalem Poster / Hochformat)
  document.querySelectorAll('.video[data-video-src]').forEach((el) => {
    mount(el, el.dataset.videoSrc, el.dataset.title, {
      poster: el.dataset.poster,
      ratio: el.dataset.ratio,
    });
  });

  return { mount };
})();

/* ---- Detail-Overlay (Gängs & Charaktere) ---- */
(() => {
  const modal = document.getElementById('detail-modal');
  if (!modal) return;

  const dialog = modal.querySelector('.modal__dialog');
  const imgEl = modal.querySelector('.modal__image');
  const titleEl = modal.querySelector('.modal__title');
  const bodyEl = modal.querySelector('.modal__body');
  const videoEl = modal.querySelector('.modal__video');
  let lastFocused = null;
  let cameFromOtherPage = false; // Modal per Querverweis von einer anderen Seite geöffnet?

  // Kam der Nutzer von einer anderen Unterseite gleicher Domain (z. B. Hofregeln)?
  function isReferrerOtherPage() {
    if (!document.referrer) return false;
    try {
      const ref = new URL(document.referrer);
      return ref.origin === location.origin && ref.pathname !== location.pathname;
    } catch (e) {
      return false;
    }
  }

  function open(trigger) {
    const title = trigger.dataset.title || '';
    const img = trigger.dataset.img || '';
    const fullEl = trigger.querySelector('.gang-card__full');
    const fullText = fullEl ? fullEl.textContent.trim() : '';
    const videoSrc = trigger.dataset.videoSrc || '';
    const videoRatio = trigger.dataset.videoRatio || '';

    titleEl.textContent = title;
    if (img && !videoSrc) {
      imgEl.src = img;
      imgEl.alt = title;
      imgEl.hidden = false;
    } else {
      imgEl.hidden = true;
    }

    bodyEl.innerHTML = '';
    if (fullText) {
      const p = document.createElement('p');
      p.textContent = fullText;
      bodyEl.appendChild(p);
    }

    videoEl.innerHTML = '';
    dialog.classList.toggle('modal__dialog--has-video', !!videoSrc);
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    dialog.scrollTop = 0;
    modal.querySelector('.modal__close').focus();

    if (videoSrc) {
      const v = document.createElement('div');
      videoEl.appendChild(v);
      BD_VIDEO.mount(v, videoSrc, title, { ratio: videoRatio, autoplay: true, poster: img });
    }
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    videoEl.innerHTML = ''; // stoppt eine evtl. laufende Wiedergabe
    // Per Querverweis von einer anderen Seite gekommen (z. B. Hackordnung in den
    // Hofregeln)? Dann dorthin zurück, statt auf der Startseite zu bleiben.
    if (cameFromOtherPage && window.history.length > 1) {
      cameFromOtherPage = false;
      history.back();
      return;
    }
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  // Karten öffnen das Overlay
  document.querySelectorAll('[data-modal]').forEach((trigger) => {
    trigger.addEventListener('click', () => open(trigger));
  });

  // Schließen: X-Button, Backdrop
  modal.querySelectorAll('[data-close]').forEach((el) => {
    el.addEventListener('click', close);
  });

  // Esc + simple Fokusfalle
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = dialog.querySelectorAll('button, a[href], iframe, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Deep-Link: #gang-… / #char-… öffnet das passende Overlay
  function openFromHash() {
    const hash = location.hash.slice(1);
    if (!hash) return;
    const el = document.getElementById(hash);
    if (el && el.hasAttribute('data-modal')) {
      cameFromOtherPage = isReferrerOtherPage();
      open(el);
    }
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();

/* ---- Hero-Trailer: Titelbild als Poster, Klick lädt den Trailer ---- */
(() => {
  const hero = document.querySelector('.hero__media[data-video-src]');
  if (!hero) return;
  BD_VIDEO.mount(hero, hero.dataset.videoSrc, hero.dataset.title, {
    poster: hero.dataset.poster,
    label: 'Trailer ansehen',
  });
})();

/* ---- Scroll-Reveal: blendet .reveal-Elemente beim Hereinscrollen ein ---- */
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  els.forEach((el) => io.observe(el));
})();

/* ---- Hofregeln-Akkordeon: Anker öffnen ihr Kapitel + „Alle aufklappen" ---- */
(() => {
  if (!document.querySelector('.hofregeln-page')) return;

  const elById = (hash) => {
    if (!hash || hash === '#') return null;
    const id = hash.charAt(0) === '#' ? hash.slice(1) : hash;
    try { return document.getElementById(decodeURIComponent(id)); }
    catch (e) { return document.getElementById(id); }
  };

  // Kapitel (<details>) zum Ziel aufklappen
  const openChapterFor = (target) => {
    const chapter = target && target.closest('details.chapter');
    if (chapter && !chapter.open) chapter.open = true;
    return chapter;
  };

  const goTo = (el, smooth) => {
    openChapterFor(el);
    requestAnimationFrame(() => {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    });
  };

  // In-Page-Links (TOC + Querverweise) öffnen ihr Kapitel und scrollen sauber
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    const el = elById(hash);
    if (!el) return; // z. B. Skip-Link auf #main bleibt Standardverhalten
    e.preventDefault();
    if (location.hash !== hash) history.pushState(null, '', hash);
    goTo(el, true);
  });

  // Direktaufruf per Hash (QR / Deep-Link) und Vor-/Zurück-Navigation
  window.addEventListener('hashchange', () => {
    const el = elById(location.hash);
    if (el) goTo(el, true);
  });
  if (location.hash) {
    const el = elById(location.hash);
    if (el) goTo(el, false);
  }

  // Beim Aufklappen die reveal-Elemente (Hackordnung) sicher einblenden
  document.querySelectorAll('details.chapter').forEach((ch) => {
    ch.addEventListener('toggle', () => {
      if (ch.open) ch.querySelectorAll('.reveal').forEach((r) => r.classList.add('is-visible'));
    });
  });

  // „Alle Kapitel öffnen / schließen"
  const toggleAll = document.querySelector('[data-toggle-all]');
  if (toggleAll) {
    const chapters = Array.from(document.querySelectorAll('details.chapter'));
    toggleAll.addEventListener('click', () => {
      const open = chapters.some((c) => !c.open); // ist eines zu → alle auf
      chapters.forEach((c) => { c.open = open; });
      toggleAll.textContent = open ? 'Alle Kapitel schließen' : 'Alle Kapitel öffnen';
      toggleAll.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
