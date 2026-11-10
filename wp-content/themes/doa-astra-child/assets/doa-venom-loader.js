(() => {
  'use strict';
  const button = document.querySelector('[data-elastic-cta]');
  if (!button || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  let requested = false;
  const load = () => {
    if (requested || !document.documentElement.classList.contains('doa-motion-enabled')) return;
    requested = true;
    const script = document.createElement('script');
    script.src = button.dataset.venomSrc;
    script.async = true;
    document.head.appendChild(script);
  };
  window.addEventListener('pointermove', (event) => {
    if (requested) return;
    const rect = button.getBoundingClientRect();
    const x = Math.max(rect.left - event.clientX, 0, event.clientX - rect.right);
    const y = Math.max(rect.top - event.clientY, 0, event.clientY - rect.bottom);
    if (Math.hypot(x, y) < 340) load();
  }, { passive: true });
  button.addEventListener('pointerenter', load, { once: true });
  button.addEventListener('focus', load, { once: true });
})();
