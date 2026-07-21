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

  const home = document.querySelector('.doa-home-v2');
  let motionEnabled = true;
  try {
    motionEnabled = window.localStorage.getItem('doa-motion-enabled') !== 'false';
  } catch (error) {
    motionEnabled = true;
  }
  document.documentElement.classList.toggle('doa-motion-enabled', motionEnabled);
  document.documentElement.classList.toggle('doa-motion-paused', !motionEnabled);
  const prefersReducedMotion = !motionEnabled;
  const canDirectScroll = Boolean(home && window.gsap && window.ScrollTrigger && !prefersReducedMotion);
  const reveals = Array.from(document.querySelectorAll('.doa-reveal'));

  document.querySelectorAll('.doa-scroll-circuit li').forEach((item) => {
    item.querySelector('button')?.addEventListener('click', () => {
      const target = document.querySelector(item.dataset.target);
      target?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });
  });

  if (canDirectScroll) {
    home.classList.add('is-scroll-directed');
    reveals.forEach((element) => element.classList.add('is-visible'));
    initScrollStory(home);
  } else if (!('IntersectionObserver' in window)) {
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

  function initScrollStory(root) {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    const circuitFill = root.querySelector('.doa-scroll-circuit__track i');
    if (circuitFill) {
      const compactCircuit = window.matchMedia('(max-width: 1024px)').matches;
      gsap.fromTo(circuitFill, compactCircuit ? { scaleX: 0, scaleY: 1 } : { scaleX: 1, scaleY: 0 }, {
        scaleX: 1,
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.25 },
      });
    }

    root.querySelectorAll('.doa-scroll-circuit li').forEach((node) => {
      const section = root.querySelector(node.dataset.target);
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top 55%',
        end: 'bottom 55%',
        toggleClass: { targets: node, className: 'is-active' },
        onEnter: () => node.previousElementSibling?.classList.add('is-past'),
        onLeaveBack: () => node.previousElementSibling?.classList.remove('is-past'),
      });
    });

    const media = gsap.matchMedia();
    media.add('(min-width: 1025px)', () => {
      const heroTimeline = gsap.timeline({
        scrollTrigger: { trigger: '.doa-hero-v2', start: 'top top', end: 'bottom top', scrub: 0.7 },
      });
      heroTimeline
        .to('.doa-hero-v2__copy', { xPercent: -3, yPercent: -7, opacity: 0.38, ease: 'none' }, 0)
        .to('.doa-control-map', { yPercent: -15, scale: 1.075, rotate: 0.7, ease: 'none' }, 0)
        .to('.doa-hero-v2__rail', { yPercent: -80, opacity: 0, ease: 'none' }, 0.12);

      gsap.from('.doa-tension .doa-kicker', {
        x: -60, autoAlpha: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: '.doa-tension', start: 'top 76%' },
      });
      gsap.from('.doa-tension h2, .doa-tension__copy', {
        y: 85, autoAlpha: 0, duration: 1, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: '.doa-tension__grid', start: 'top 78%' },
      });

      gsap.from('.doa-section-head > *', {
        y: 55, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.doa-section-head', start: 'top 82%' },
      });
      gsap.to('.doa-capability-grid', {
        '--doa-wire': '100%', ease: 'none',
        scrollTrigger: { trigger: '.doa-capability-grid', start: 'top 82%', end: 'bottom 60%', scrub: 0.7 },
      });
      gsap.from('.doa-capability', {
        y: 90, rotationX: 7, autoAlpha: 0, transformOrigin: '50% 100%',
        duration: 0.9, stagger: 0.13, ease: 'power3.out',
        scrollTrigger: { trigger: '.doa-capability-grid', start: 'top 78%' },
      });
      gsap.from('.doa-build-console', {
        y: 70, scale: 0.97, autoAlpha: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '.doa-build-console', start: 'top 82%' },
      });
      gsap.from('.doa-build-console__metrics > div', {
        y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.doa-build-console', start: 'top 72%' },
      });

      gsap.to('.doa-method__steps', {
        '--doa-method-progress': '100%', ease: 'none',
        scrollTrigger: { trigger: '.doa-method__steps', start: 'top 62%', end: 'bottom 48%', scrub: 0.5 },
      });
      root.querySelectorAll('.doa-method__step').forEach((step) => {
        gsap.fromTo(step, { x: 45, opacity: 0.34 }, {
          x: 0, opacity: 1, duration: 0.55, ease: 'power2.out',
          scrollTrigger: {
            trigger: step, start: 'top 68%', end: 'bottom 45%', toggleActions: 'play reverse play reverse',
            toggleClass: { targets: step, className: 'is-active' },
          },
        });
      });

      gsap.fromTo('.doa-proof-v2', { clipPath: 'inset(0 100% 0 0)' }, {
        clipPath: 'inset(0 0% 0 0)', duration: 1.25, ease: 'power4.inOut',
        scrollTrigger: { trigger: '.doa-proof-v2', start: 'top 84%' },
      });
      gsap.from('.doa-proof-v2__ledger > div', {
        x: 70, autoAlpha: 0, duration: 0.65, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: '.doa-proof-v2', start: 'top 64%' },
      });

      gsap.from('.doa-contact-v2__intro > *', {
        x: -65, autoAlpha: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.doa-contact-v2', start: 'top 70%' },
      });
      gsap.from('.doa-contact-console', {
        y: 105, scale: 0.94, rotationX: 7, autoAlpha: 0, duration: 1.05, ease: 'power4.out',
        clearProps: 'transform,opacity,visibility',
        scrollTrigger: { trigger: '.doa-contact-v2', start: 'top 70%' },
      });
      gsap.from('.doa-contact-form .doa-field, .doa-contact-form__foot', {
        y: 28, autoAlpha: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: '.doa-contact-console', start: 'top 62%' },
      });
    });

    media.add('(max-width: 1024px)', () => {
      const targets = gsap.utils.toArray('.doa-tension__grid > *, .doa-section-head > *, .doa-build-console, .doa-capability, .doa-method__step, .doa-proof-v2 > *, .doa-contact-v2__intro > *, .doa-contact-console');
      targets.forEach((target) => {
        gsap.from(target, {
          y: 34, autoAlpha: 0, duration: 0.62, ease: 'power2.out',
          scrollTrigger: { trigger: target, start: 'top 88%', once: true },
        });
      });
    });

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }

  const buildConsole = document.querySelector('.doa-build-console');
  if (buildConsole) {
    const states = [
      { metrics: ['131', 'RM 84.2K', '2,424', '99.4%'], deltas: ['+12.4%', '+8.7%', '+31', 'Stable'], events: ['Approval routed to finance', 'Customer record synchronised', 'Weekly report prepared'] },
      { metrics: ['148', 'RM 91.8K', '2,502', '99.7%'], deltas: ['+17 today', '+9.1%', '+78', 'Optimal'], events: ['New order entered workflow', 'Inventory threshold checked', 'Sales digest generated'] },
      { metrics: ['156', 'RM 96.4K', '2,611', '99.5%'], deltas: ['+8 today', '+5.0%', '+109', 'Stable'], events: ['Leave request approved', 'Attendance records reconciled', 'Payroll file prepared'] },
      { metrics: ['164', 'RM 102.7K', '2,704', '99.8%'], deltas: ['+8 today', '+6.5%', '+93', 'Optimal'], events: ['Backup integrity confirmed', 'Access policy synchronised', 'Health report completed'] },
    ];
    const metricNodes = Array.from(buildConsole.querySelectorAll('[data-console-metric]'));
    const deltaNodes = Array.from(buildConsole.querySelectorAll('[data-console-delta]'));
    const eventNodes = Array.from(buildConsole.querySelectorAll('[data-console-event]'));
    const modules = Array.from(buildConsole.querySelectorAll('[data-console-module]'));
    const capabilityModules = Array.from(document.querySelectorAll('[data-capability-module]'));
    const processNode = buildConsole.querySelector('[data-console-process]');
    const progressNode = buildConsole.querySelector('.doa-build-console__report i b');
    const toggle = buildConsole.querySelector('.doa-build-console__toggle');
    const reducedMotion = !motionEnabled;

    const setState = (index, animate = true) => {
      const state = states[index];
      modules.forEach((module, moduleIndex) => module.classList.toggle('is-active', moduleIndex === index));
      capabilityModules.forEach((module, moduleIndex) => module.classList.toggle('is-active', moduleIndex === index));
      if (processNode) processNode.textContent = `Process 0${index + 1}/04`;
      if (progressNode && window.gsap) window.gsap.to(progressNode, { scaleX: (index + 1) / 4, duration: animate ? 0.45 : 0, ease: 'power2.out' });

      [...metricNodes, ...deltaNodes, ...eventNodes].forEach((node, nodeIndex) => {
        const nextText = nodeIndex < metricNodes.length
          ? state.metrics[nodeIndex]
          : nodeIndex < metricNodes.length + deltaNodes.length
            ? state.deltas[nodeIndex - metricNodes.length]
            : state.events[nodeIndex - metricNodes.length - deltaNodes.length];

        if (!animate || !window.gsap) {
          node.textContent = nextText;
          return;
        }

        window.gsap.to(node, {
          y: -5, autoAlpha: 0, duration: 0.14, ease: 'power1.in',
          onComplete: () => {
            node.textContent = nextText;
            window.gsap.fromTo(node, { y: 6, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.24, ease: 'power2.out' });
          },
        });
      });
    };

    setState(0, false);
    if (reducedMotion) {
      toggle?.setAttribute('aria-pressed', 'false');
      if (toggle?.querySelector('span')) toggle.querySelector('span').textContent = 'Enable site motion';
      toggle?.addEventListener('click', () => {
        try {
          window.localStorage.setItem('doa-motion-enabled', 'true');
        } catch (error) {
          document.documentElement.classList.add('doa-motion-enabled');
        }
        window.location.reload();
      });
    } else if (window.gsap) {
      const cycle = window.gsap.timeline({ repeat: -1 });
      states.forEach((state, index) => cycle.call(() => setState(index), null, index ? '+=2.8' : 0));
      cycle.to({}, { duration: 2.8 });

      toggle?.addEventListener('click', () => {
        try {
          window.localStorage.setItem('doa-motion-enabled', 'false');
        } catch (error) {
          document.documentElement.classList.add('doa-motion-paused');
        }
        window.location.reload();
      });
    }
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

    if (visible && motionEnabled) animationFrame = window.requestAnimationFrame(draw);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  resize();
  if (motionEnabled) animationFrame = window.requestAnimationFrame(draw);
  else draw();

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    window.cancelAnimationFrame(animationFrame);
    if (visible && motionEnabled) animationFrame = window.requestAnimationFrame(draw);
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
