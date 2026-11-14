(() => {
  const root = document.documentElement;
  const key = 'doa-back-office-theme';
  try {
    root.dataset.boTheme = localStorage.getItem(key) === 'dark' ? 'dark' : 'light';
  } catch {
    root.dataset.boTheme = 'light';
  }

  function updateLabels() {
    const dark = root.dataset.boTheme === 'dark';
    document.querySelectorAll('button[data-bo-theme]').forEach(button => {
      button.textContent = dark ? '☀ Day mode' : '☾ Night mode';
    });
  }

  document.addEventListener('DOMContentLoaded', updateLabels);
  let animating = false;
  document.addEventListener('click', async event => {
    const button = event.target.closest('button[data-bo-theme]');
    if (!button || animating) return;
    const apply = () => {
      root.dataset.boTheme = root.dataset.boTheme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, root.dataset.boTheme); } catch {}
      updateLabels();
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      apply();
      return;
    }
    animating = true;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const center = x + 'px ' + y + 'px';
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    if (!document.startViewTransition) {
      root.classList.add('bo-theme-fade');
      apply();
      setTimeout(() => { root.classList.remove('bo-theme-fade'); animating = false; }, 520);
      return;
    }
    try {
      const transition = document.startViewTransition(apply);
      await transition.ready;
      root.animate({ clipPath: ['circle(0 at ' + center + ')', 'circle(' + radius + 'px at ' + center + ')'] },
        { duration: 680, easing: 'cubic-bezier(.22,.61,.36,1)', pseudoElement: '::view-transition-new(root)' });
      await transition.finished;
    } catch {
      // If the browser skips the animation, the transition callback still sets the theme.
    } finally {
      animating = false;
    }
  });
})();
