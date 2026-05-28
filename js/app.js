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
