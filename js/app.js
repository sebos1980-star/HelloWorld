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

/* ---- YouTube-Facade: lädt das Video erst nach Klick (Privacy) ---- */
const BD_VIDEO = (() => {
  // Baut in `container` eine Klick-Fläche; erst beim Klick wird das
  // youtube-nocookie-iframe geladen. Vorher kein Request an Google.
  // opts: { poster?: <Bild-URL → Poster-Variante>, ratio?: 'portrait', label?: <Text> }
  function mount(container, id, title, opts) {
    if (!id) return;
    opts = opts || {};
    container.classList.add('video');
    if (opts.ratio === 'portrait') container.classList.add('video--portrait');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Video laden und abspielen' + (title ? ': ' + title : ''));

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
        '<span class="video__label">Video ansehen</span>' +
        '<span class="video__hint">Lädt YouTube erst nach Klick.</span>';
    }

    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/' + id + '?rel=0&origin=https://sebos1980-star.github.io';
      iframe.title = title || 'YouTube-Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      container.innerHTML = '';
      container.classList.add('is-playing'); // entfernt u. a. die Poster-Maske
      container.appendChild(iframe);
    });

    container.innerHTML = '';
    container.appendChild(btn);
  }

  // Statische Facade-Container aufbauen (inkl. optionalem Poster / Hochformat)
  document.querySelectorAll('.video[data-video]').forEach((el) => {
    mount(el, el.dataset.video, el.dataset.title, {
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

  function open(trigger) {
    const title = trigger.dataset.title || '';
    const img = trigger.dataset.img || '';
    const fullEl = trigger.querySelector('.gang-card__full');
    const fullText = fullEl ? fullEl.textContent.trim() : '';
    const videoId = trigger.dataset.video || '';
    const videoRatio = trigger.dataset.videoRatio || '';

    titleEl.textContent = title;
    if (img && !videoId) {
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
    if (videoId) {
      const v = document.createElement('div');
      videoEl.appendChild(v);
      BD_VIDEO.mount(v, videoId, title, { ratio: videoRatio });
    }

    dialog.classList.toggle('modal__dialog--has-video', !!videoId);
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    dialog.scrollTop = 0;
    modal.querySelector('.modal__close').focus();
  }

  function close() {
    modal.hidden = true;
    document.body.classList.remove('modal-open');
    videoEl.innerHTML = ''; // stoppt eine evtl. laufende Wiedergabe
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
    if (el && el.hasAttribute('data-modal')) open(el);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();

/* ---- Hero-Trailer: Titelbild als Poster, Klick lädt den Trailer ---- */
(() => {
  const hero = document.querySelector('.hero__media[data-video]');
  if (!hero) return;
  BD_VIDEO.mount(hero, hero.dataset.video, hero.dataset.title, {
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
