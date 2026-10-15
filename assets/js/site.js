// Navigation stays visible without JavaScript. Enhance it only after binding.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
if (toggle && nav) {
  nav.dataset.enhanced = 'true';
  toggle.hidden = false;
  const label = toggle.querySelector('[data-menu-label]');
  const close = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); label.textContent = 'Menu'; };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    label.textContent = open ? 'Close' : 'Menu';
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { close(); toggle.focus(); }
  });
  window.matchMedia('(min-width:851px)').addEventListener('change', () => {
    if (nav.contains(document.activeElement) && matchMedia('(max-width:850px)').matches) toggle.focus();
    close();
  });
}
