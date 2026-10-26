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
  let storedMotionPreference = null;
  try {
    storedMotionPreference = window.localStorage.getItem('doa-motion-enabled');
  } catch (error) {
    storedMotionPreference = null;
  }
  const systemPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionEnabled = storedMotionPreference === 'true' || (storedMotionPreference !== 'false' && !systemPrefersReducedMotion);
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
      toggle?.setAttribute('aria-pressed', 'true');
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

  const controlMap = document.querySelector('[data-control-map]');
  if (controlMap) {
    const nodes = Array.from(controlMap.querySelectorAll('[data-control-node]'));
    const edges = Array.from(controlMap.querySelectorAll('[data-control-edge]'));
    const stepNode = controlMap.querySelector('[data-control-step]');
    const titleNode = controlMap.querySelector('[data-control-title]');
    const copyNode = controlMap.querySelector('[data-control-copy]');
    const replayButton = controlMap.querySelector('[data-control-replay]');
    const descriptions = {
      booking: ['Module 01 / Booking', 'Every enquiry enters one visible workflow.', 'Appointments, resources and follow-up stay connected from first contact.'],
      customers: ['Module 02 / Customers', 'One customer record follows the whole relationship.', 'History, notes and communication remain available to the right team.'],
      sales: ['Module 03 / Sales', 'Quotes and payments remain tied to the work.', 'The team can see what was requested, approved, delivered and paid.'],
      reporting: ['Module 04 / Reporting', 'The report updates from the operation itself.', 'Management sees current activity without rebuilding a spreadsheet by hand.'],
    };
    let flowTimers = [];

    const clearFlow = () => {
      flowTimers.forEach((timer) => window.clearTimeout(timer));
      flowTimers = [];
      controlMap.classList.remove('is-flowing');
    };

    const selectModule = (key, content = descriptions[key]) => {
      nodes.forEach((node) => {
        const active = node.dataset.controlNode === key;
        node.classList.toggle('is-active', active);
        node.setAttribute('aria-pressed', String(active));
      });
      edges.forEach((edge) => edge.classList.toggle('is-active', edge.dataset.controlEdge === key));
      if (stepNode) stepNode.textContent = content[0];
      if (titleNode) titleNode.textContent = content[1];
      if (copyNode) copyNode.textContent = content[2];
    };

    const runBookingFlow = () => {
      clearFlow();
      controlMap.classList.add('is-flowing');
      const flow = [
        ['booking', ['Step 01 / Enquiry', 'Enquiry captured.', 'The request enters the booking queue with the customer details attached.']],
        ['booking', ['Step 02 / Appointment', 'Appointment scheduled.', 'The selected time and service are reserved for the operating team.']],
        ['customers', ['Step 03 / Customer record', 'Customer record updated.', 'The confirmed appointment is added to the same customer history.']],
        ['reporting', ['Step 04 / Report', 'Operational report refreshed.', 'The new booking is now reflected in activity and management reporting.']],
      ];

      if (!motionEnabled) {
        selectModule(flow[flow.length - 1][0], flow[flow.length - 1][1]);
        controlMap.classList.remove('is-flowing');
        return;
      }

      flow.forEach(([key, content], index) => {
        flowTimers.push(window.setTimeout(() => {
          selectModule(key, content);
          if (index === flow.length - 1) controlMap.classList.remove('is-flowing');
        }, index * 1050));
      });
    };

    nodes.forEach((node) => {
      node.addEventListener('pointerenter', (event) => {
        if (event.pointerType !== 'touch') selectModule(node.dataset.controlNode);
      });
      node.addEventListener('focus', () => selectModule(node.dataset.controlNode));
      node.addEventListener('click', () => {
        if (node.dataset.controlNode === 'booking') runBookingFlow();
        else {
          clearFlow();
          selectModule(node.dataset.controlNode);
        }
      });
    });
    replayButton?.addEventListener('click', runBookingFlow);
    selectModule('booking');
  }

  const strandsCanvas = document.getElementById('doa-strands-canvas');
  const strandsSection = strandsCanvas?.closest('.doa-tension');
  if (strandsCanvas && strandsSection) {
    const context = strandsCanvas.getContext('2d');
    if (context) {
      let width = 0;
      let height = 0;
      let frame = 0;
      let sectionVisible = false;
      let pointer = { x: .72, y: .48, active: false };
      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      const resize = () => {
        const rect = strandsCanvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, finePointer ? 1.5 : 1);
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        strandsCanvas.width = Math.round(width * dpr);
        strandsCanvas.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const draw = (time = 0) => {
        context.clearRect(0, 0, width, height);
        context.globalCompositeOperation = 'lighter';
        const count = finePointer ? 54 : 28;
        const px = pointer.x * width;
        const py = pointer.y * height;
        for (let index = 0; index < count; index += 1) {
          const ratio = index / Math.max(1, count - 1);
          const startY = height * (.08 + ratio * .84);
          const phase = time * .00016 + index * .22;
          const ambient = Math.sin(phase) * height * .055;
          const distance = Math.abs(startY + ambient - py);
          const influence = pointer.active ? Math.max(0, 1 - distance / 175) : 0;
          const bend = (startY + ambient < py ? -1 : 1) * influence * 120;
          context.beginPath();
          context.moveTo(width * .34, startY);
          context.bezierCurveTo(width * .52, startY + ambient * .45, width * .58, startY + ambient + bend, width * .73, py + (ratio - .5) * 46 + bend * .18);
          context.bezierCurveTo(width * .82, py + (ratio - .5) * 70, width * .9, startY - ambient * .5, width * 1.04, startY - ambient);
          context.strokeStyle = `rgba(81,228,155,${0.08 + (1 - Math.abs(ratio - .5) * 1.3) * .34})`;
          context.lineWidth = index % 8 === 0 ? 1.5 : .72;
          context.stroke();
        }
        context.globalCompositeOperation = 'source-over';
        if (sectionVisible && motionEnabled && !document.hidden) frame = window.requestAnimationFrame(draw);
      };

      const restart = () => {
        window.cancelAnimationFrame(frame);
        if (sectionVisible && motionEnabled && !document.hidden) frame = window.requestAnimationFrame(draw);
        else draw(1600);
      };

      strandsSection.addEventListener('pointermove', (event) => {
        if (!finePointer) return;
        const rect = strandsSection.getBoundingClientRect();
        pointer = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height, active: true };
      }, { passive: true });
      strandsSection.addEventListener('pointerleave', () => { pointer.active = false; }, { passive: true });
      new ResizeObserver(() => { resize(); restart(); }).observe(strandsSection);
      new IntersectionObserver(([entry]) => { sectionVisible = entry.isIntersecting; restart(); }, { rootMargin: '160px' }).observe(strandsSection);
      document.addEventListener('visibilitychange', restart);
      resize();
      draw(1600);
    }
  }

  const liquidCanvas = document.getElementById('doa-liquid-canvas');
  const liquidStage = liquidCanvas?.closest('[data-liquid-stage]');
  if (liquidCanvas && liquidStage) {
    const gl = liquidCanvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, powerPreference: 'high-performance' });
    if (!gl) {
      liquidStage.classList.add('is-fallback');
    } else {
      const vertexSource = `#version 300 es
        void main() {
          vec2 position = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
          gl_Position = vec4(position * 2.0 - 1.0, 0.0, 1.0);
        }`;
      const fragmentSource = `#version 300 es
        precision highp float;
        out vec4 color;
        uniform vec2 resolution;
        uniform vec2 pointer;
        uniform float time;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }
        float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          mat2 rotation = mat2(0.82, -0.57, 0.57, 0.82);
          for (int i = 0; i < 5; i++) {
            value += amplitude * noise(p);
            p = rotation * p * 2.03 + 3.7;
            amplitude *= 0.5;
          }
          return value;
        }
        void main() {
          vec2 uv = gl_FragCoord.xy / max(resolution, vec2(1.0));
          vec2 p = uv * 2.0 - 1.0;
          p.x *= resolution.x / max(resolution.y, 1.0);
          vec2 mouse = pointer * 2.0 - 1.0;
          mouse.x *= resolution.x / max(resolution.y, 1.0);
          vec2 delta = p - mouse;
          float distanceToPointer = length(delta);
          float influence = exp(-distanceToPointer * 3.6);
          float angle = atan(delta.y, delta.x) + influence * 2.2;
          p += vec2(cos(angle), sin(angle)) * influence * 0.22;
          float t = time * 0.11;
          float fieldA = fbm(p * 1.6 + vec2(t, -t * .42));
          float fieldB = fbm(p * 3.1 - vec2(t * .35, t * .23) + fieldA);
          float ribbon = smoothstep(.48, .76, fieldA + fieldB * .42 + influence * .55);
          float filament = smoothstep(.52, .57, sin((fieldB + p.x * .15) * 18.0 + t * 3.0) * .5 + .5) * ribbon;
          vec3 deep = vec3(.004, .025, .016);
          vec3 emerald = vec3(.025, .46, .27);
          vec3 light = vec3(.31, .95, .62);
          vec3 rgb = mix(deep, emerald, ribbon * .78);
          rgb = mix(rgb, light, filament * .72 + influence * .22);
          rgb += vec3(.02, .18, .1) * smoothstep(.78, .98, fieldB);
          color = vec4(rgb, 1.0);
        }`;

      const compile = (type, source) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };
      const vertex = compile(gl.VERTEX_SHADER, vertexSource);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
      const program = vertex && fragment ? gl.createProgram() : null;
      if (program && vertex && fragment) {
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);
      }

      if (!program || !gl.getProgramParameter(program, gl.LINK_STATUS)) {
        liquidStage.classList.add('is-fallback');
      } else {
        const resolutionLocation = gl.getUniformLocation(program, 'resolution');
        const pointerLocation = gl.getUniformLocation(program, 'pointer');
        const timeLocation = gl.getUniformLocation(program, 'time');
        let frame = 0;
        let stageVisible = false;
        let pointer = { x: .72, y: .48 };
        const mobile = window.matchMedia('(pointer: coarse), (max-width: 700px)').matches;

        const resize = () => {
          const rect = liquidCanvas.getBoundingClientRect();
          const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.5);
          liquidCanvas.width = Math.max(1, Math.round(rect.width * dpr));
          liquidCanvas.height = Math.max(1, Math.round(rect.height * dpr));
          gl.viewport(0, 0, liquidCanvas.width, liquidCanvas.height);
        };
        const render = (timestamp = 0) => {
          gl.useProgram(program);
          gl.uniform2f(resolutionLocation, liquidCanvas.width, liquidCanvas.height);
          gl.uniform2f(pointerLocation, pointer.x, 1 - pointer.y);
          gl.uniform1f(timeLocation, timestamp * .001);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          if (stageVisible && motionEnabled && !document.hidden) frame = window.requestAnimationFrame(render);
        };
        const restart = () => {
          window.cancelAnimationFrame(frame);
          if (stageVisible && motionEnabled && !document.hidden) frame = window.requestAnimationFrame(render);
          else render(2600);
        };
        liquidStage.addEventListener('pointermove', (event) => {
          const rect = liquidStage.getBoundingClientRect();
          pointer = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
        }, { passive: true });
        liquidCanvas.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          window.cancelAnimationFrame(frame);
          liquidStage.classList.add('is-fallback');
        });
        new ResizeObserver(() => { resize(); restart(); }).observe(liquidStage);
        new IntersectionObserver(([entry]) => { stageVisible = entry.isIntersecting; restart(); }, { rootMargin: '180px' }).observe(liquidStage);
        document.addEventListener('visibilitychange', restart);
        resize();
        render(2600);
      }
    }
  }

  document.querySelectorAll('[data-comparison]').forEach((comparison) => {
    const range = comparison.querySelector('[data-comparison-range]');
    if (!range) return;
    const update = () => {
      const value = Math.max(0, Math.min(100, Number(range.value)));
      comparison.style.setProperty('--split', `${value}%`);
      range.setAttribute('aria-valuetext', `${value} percent before view, ${100 - value} percent connected view`);
    };
    range.addEventListener('input', update);
    update();
  });

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
