(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const menuButton = document.querySelector('.doa-menu-toggle');
  if (menuButton) {
    const menu = document.getElementById(menuButton.getAttribute('aria-controls'));
    const closeMenu = () => {
      menu?.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    };

    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menu?.classList.toggle('is-open', open);
    });
    menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const reveals = Array.from(document.querySelectorAll('.doa-reveal'));
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = Array.from(entry.target.parentElement?.querySelectorAll(':scope > .doa-reveal') || []);
        const index = Math.max(0, siblings.indexOf(entry.target));
        entry.target.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach((element) => observer.observe(element));
  }

  const canvas = document.getElementById('doa-operations-canvas');
  if (!canvas || reduceMotion) return;

  const context = canvas.getContext('2d');
  if (!context) return;

  const points = [
    { x: .14, y: .2 }, { x: .76, y: .16 }, { x: .84, y: .62 },
    { x: .13, y: .74 }, { x: .49, y: .87 }, { x: .5, y: .49 },
    { x: .29, y: .43 }, { x: .7, y: .42 },
  ];
  const links = [[0,5],[1,5],[2,5],[3,5],[4,5],[6,5],[7,5],[0,6],[1,7],[2,7],[3,6],[4,6],[4,7]];
  let width = 0;
  let height = 0;
  let dpr = 1;
  let animationFrame = 0;
  let visible = true;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (time = 0) => {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;

    links.forEach(([from, to], index) => {
      const a = points[from];
      const b = points[to];
      context.beginPath();
      context.moveTo(a.x * width, a.y * height);
      context.lineTo(b.x * width, b.y * height);
      context.strokeStyle = index < 5 ? 'rgba(8,120,74,.48)' : 'rgba(7,16,13,.16)';
      context.stroke();

      if (index < 5) {
        const progress = ((time * .00012) + index * .21) % 1;
        const x = (a.x + (b.x - a.x) * progress) * width;
        const y = (a.y + (b.y - a.y) * progress) * height;
        context.beginPath();
        context.arc(x, y, 2.2, 0, Math.PI * 2);
        context.fillStyle = '#22c77a';
        context.fill();
      }
    });

    points.forEach((point, index) => {
      if (index === 5) return;
      const pulse = 2 + Math.sin(time * .0015 + index) * .65;
      context.beginPath();
      context.arc(point.x * width, point.y * height, pulse, 0, Math.PI * 2);
      context.fillStyle = index < 5 ? '#08784a' : '#5b6c64';
      context.fill();
    });

    if (visible) animationFrame = window.requestAnimationFrame(draw);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  animationFrame = window.requestAnimationFrame(draw);

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    window.cancelAnimationFrame(animationFrame);
    if (visible) animationFrame = window.requestAnimationFrame(draw);
  });
})();
