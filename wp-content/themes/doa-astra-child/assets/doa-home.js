(() => {
  'use strict';

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
  if (!('IntersectionObserver' in window)) {
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
  if (canvas) {
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

    const centerX = width * .5;
    const centerY = height * .49;
    const orbit = Math.min(width, height) * .18;
    context.save();
    context.translate(centerX, centerY);
    context.rotate(time * .00018);
    context.setLineDash([4, 9]);
    context.beginPath();
    context.arc(0, 0, orbit, -.35, Math.PI * 1.55);
    context.strokeStyle = 'rgba(8,120,74,.36)';
    context.stroke();
    context.setLineDash([]);
    context.beginPath();
    context.arc(Math.cos(time * .001) * orbit, Math.sin(time * .001) * orbit, 3.2, 0, Math.PI * 2);
    context.fillStyle = '#22c77a';
    context.shadowColor = '#22c77a';
    context.shadowBlur = 14;
    context.fill();
    context.restore();

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
  }

  const contactForm = document.getElementById('doa-contact-form');
  const contactConsole = document.querySelector('.doa-contact-console');
  if (contactForm && contactConsole) {
    const submitButton = contactForm.querySelector('.doa-form-submit');
    const status = contactForm.querySelector('.doa-contact-form__status');

    contactForm.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => field.closest('.doa-field')?.classList.toggle('has-value', Boolean(field.value.trim())));
    });

    contactConsole.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = contactConsole.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
      contactConsole.style.setProperty('--contact-rx', `${-y * 1.4}deg`);
      contactConsole.style.setProperty('--contact-ry', `${x * 1.4}deg`);
      contactConsole.style.setProperty('--contact-x', `${(x + 1) * 50}%`);
      contactConsole.style.setProperty('--contact-y', `${(y + 1) * 50}%`);
    }, { passive: true });
    contactConsole.addEventListener('pointerleave', () => {
      contactConsole.style.setProperty('--contact-rx', '0deg');
      contactConsole.style.setProperty('--contact-ry', '0deg');
    });

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      submitButton.disabled = true;
      submitButton.classList.add('is-sending');
      status.textContent = 'Opening a secure channel…';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          credentials: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.data?.message || 'Unable to send your enquiry.');

        status.textContent = result.data.message;
        contactConsole.classList.add('is-success');
        contactConsole.querySelector('.doa-contact-console__success')?.setAttribute('aria-hidden', 'false');
        contactForm.reset();
      } catch (error) {
        status.textContent = error.message || 'Unable to send your enquiry. Please try again.';
        submitButton.disabled = false;
        submitButton.classList.remove('is-sending');
        contactConsole.classList.add('has-error');
      }
    });
  }
})();
