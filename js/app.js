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
  function mount(container, id, title) {
    if (!id) return;
    container.classList.add('video');
    container.innerHTML = '';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'video__btn';
    btn.setAttribute('aria-label', 'Video laden und abspielen' + (title ? ': ' + title : ''));
    btn.innerHTML =
      '<span class="video__play" aria-hidden="true">&#9654;</span>' +
      '<span class="video__label">Video ansehen</span>' +
      '<span class="video__hint">Lädt YouTube (youtube-nocookie.com) erst nach Klick.</span>';
    btn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      iframe.title = title || 'YouTube-Video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      container.innerHTML = '';
      container.appendChild(iframe);
    });
    container.appendChild(btn);
  }

  // Statische Facade-Container auf der Seite aufbauen
  document.querySelectorAll('.video[data-video]').forEach((el) => {
    mount(el, el.dataset.video, el.dataset.title);
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

    titleEl.textContent = title;
    if (img) {
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
      BD_VIDEO.mount(v, videoId, title);
    }

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
