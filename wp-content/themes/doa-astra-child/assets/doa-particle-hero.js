(() => {
'use strict';
const canvas = document.querySelector('#doa-particle-canvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');
const logo = new Image();
logo.src = canvas.dataset.logo;
const whatsapp = new Image();
whatsapp.src = canvas.dataset.whatsapp;
const buttons = [...document.querySelectorAll('[data-doa-stage]')];
let reduce = !document.documentElement.classList.contains('doa-motion-enabled');
const motionToggle = document.querySelector('#doa-particle-motion');
const sceneLink = document.querySelector('#doa-particle-link');
const heroCopy = canvas.parentElement.querySelector('.doa-hero-v2__copy');
const navigation = document.querySelector('.doa-nav-v2');
const pointer = { x: -1000, y: -1000, active: false };
const sway = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0 };
let dots = [], stage = 0, start = 0, width = 0, height = 0, visible = true;
let frameId = 0, lastTime = 0, lastWidth = 0, lastHeight = 0;
let centerX = 0, centerY = 0, size = 0;

function startAnimation() {
  if (frameId) cancelAnimationFrame(frameId);
  frameId = requestAnimationFrame(draw);
}

function targets(index) {
  const sample = document.createElement('canvas');
  sample.width = sample.height = 180;
  const source = sample.getContext('2d', { willReadFrequently: true });
  if (index === 0) source.drawImage(logo, 0, 0, 180, 180);
  else if (index === 1) {
    source.strokeStyle = '#fff';
    source.lineWidth = 3;
    source.strokeRect(12, 33, 156, 114);
    source.beginPath(); source.moveTo(12, 54); source.lineTo(168, 54); source.stroke();
    source.fillStyle = '#fff';
    source.font = 'bold 10px Arial'; source.fillText('DOA CONTROL', 22, 48);
    source.fillRect(23, 68, 34, 4); source.fillRect(72, 68, 34, 4); source.fillRect(121, 68, 34, 4);
    source.fillRect(23, 78, 26, 8); source.fillRect(72, 78, 28, 8); source.fillRect(121, 78, 27, 8);
    source.beginPath(); source.moveTo(24, 129); source.lineTo(42, 117); source.lineTo(59, 120); source.lineTo(80, 100); source.lineTo(98, 108); source.lineTo(118, 95); source.lineTo(138, 104); source.lineTo(155, 88); source.stroke();
  } else {
    if (whatsapp.complete && whatsapp.naturalWidth) source.drawImage(whatsapp, 16, 16, 148, 148);
  }
  const pixels = source.getImageData(0, 0, 180, 180).data;
  const result = [];
  for (let y = 0; y < 180; y += 1) for (let x = 0; x < 180; x += 1) {
    if (pixels[(y * 180 + x) * 4 + 3] > 100 && Math.random() < .67) {
      result.push({ x: centerX - size / 2 + x / 180 * size, y: centerY - size / 2 + y / 180 * size });
    }
  }
  return result;
}

function placeSceneLink(points) {
  if (!sceneLink) return;
  if (!stage || !points.length || !size) {
    sceneLink.hidden = true;
    return;
  }
  let left = width, top = height, right = 0, bottom = 0;
  for (const { x, y } of points) {
    left = Math.min(left, x);
    right = Math.max(right, x);
    top = Math.min(top, y);
    bottom = Math.max(bottom, y);
  }
  const linkWidth = Math.max(44, right - left + 18);
  const linkHeight = Math.max(44, bottom - top + 18);
  Object.assign(sceneLink.style, {
    left: ((left + right - linkWidth) / 2) + 'px',
    top: ((top + bottom - linkHeight) / 2) + 'px',
    width: linkWidth + 'px',
    height: linkHeight + 'px',
  });
  sceneLink.href = stage === 1 ? sceneLink.dataset.showcase : sceneLink.dataset.contact;
  const label = stage === 1 ? 'Open Showcase' : 'Contact us';
  sceneLink.setAttribute('aria-label', label);
  sceneLink.title = label;
  sceneLink.hidden = false;
}

function resize() {
  if (!logo.complete || !logo.naturalWidth) return;
  const rect = canvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  if (Math.abs(width - lastWidth) < 1 && Math.abs(height - lastHeight) < 1 && dots.length) return;
  lastWidth = width;
  lastHeight = height;
  const mobile = width < 800;
  centerX = width * (mobile ? .5 : .67);
  if (mobile && heroCopy) {
    const startY = (navigation?.offsetHeight || 70) + 8;
    const endY = heroCopy.getBoundingClientRect().top - rect.top - 8;
    centerY = (startY + endY) / 2;
    size = Math.max(44, Math.min(width * .72, endY - startY));
  } else {
    centerY = height * .53;
    size = Math.min(width * .39, height * .62);
  }
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const initialTargets = targets(stage);
  placeSceneLink(initialTargets);
  const count = Math.min(width < 800 ? 1800 : 5200, initialTargets.length);
  dots = Array.from({ length: count }, (_, i) => initialTargets[Math.floor(i * initialTargets.length / count)]).map((target) => ({
    x: reduce ? target.x : target.x + (Math.random() - .5) * width * .24,
    y: reduce ? target.y : 82 + Math.random() * height * .12,
    tx: target.x, ty: target.y, vx: 0, vy: 0, r: .45 + Math.random() * 1.1,
    phase: Math.random() * 7, releaseAt: Math.random() * 1050,
  }));
  start = performance.now();
  lastTime = start;
  startAnimation();
}

function select(index) {
  stage = index;
  const next = targets(index);
  placeSceneLink(dots.length ? next : []);
  dots.forEach((dot, i) => {
    const target = next[Math.floor(i * next.length / dots.length)] || { x: width / 2, y: height / 2 };
    dot.tx = target.x;
    dot.ty = target.y;
    dot.releaseAt = 0;
    if (reduce) { dot.x = target.x; dot.y = target.y; }
  });
  buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  if (reduce) draw(0);
}

function draw(time) {
  frameId = 0;
  if (document.body.classList.contains('doa-venom-active')) { lastTime = time; frameId = requestAnimationFrame(draw); return; }
  const frameInterval = width < 800 ? 33 : 22;
  if (!reduce && time - lastTime < frameInterval) { frameId = requestAnimationFrame(draw); return; }
  const dt = Math.min(2, Math.max(.5, (time - lastTime) / 16.67 || 1));
  lastTime = time;
  if (!reduce) {
    sway.vx = (sway.vx - sway.x * .055 * dt) * Math.pow(.87, dt);
    sway.vy = (sway.vy - sway.y * .055 * dt) * Math.pow(.87, dt);
    sway.spin = (sway.spin - sway.angle * .06 * dt) * Math.pow(.86, dt);
    sway.x = Math.max(-11, Math.min(11, sway.x + sway.vx * dt));
    sway.y = Math.max(-9, Math.min(9, sway.y + sway.vy * dt));
    sway.angle = Math.max(-.025, Math.min(.025, sway.angle + sway.spin * dt));
  }
  const cosine = Math.cos(sway.angle);
  const sine = Math.sin(sway.angle);
  const ambientX = reduce ? 0 : Math.sin(time * .00065) * 1.4;
  const ambientY = reduce ? 0 : Math.sin(time * .0009) * 1.1;
  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = .5;
  ctx.strokeStyle = 'rgba(190,255,220,.065)';
  ctx.beginPath();
  for (let i = 0; i < dots.length; i += 31) {
    const dot = dots[i];
    ctx.moveTo(dot.x, 0);
    ctx.lineTo(dot.x, dot.y);
  }
  ctx.stroke();
  dots.forEach((dot) => {
    if (!reduce) {
      const relativeX = dot.tx - centerX;
      const relativeY = dot.ty - centerY;
      const targetX = centerX + relativeX * cosine - relativeY * sine + sway.x + ambientX;
      const targetY = centerY + relativeX * sine + relativeY * cosine + sway.y + ambientY;
      const released = time - start >= dot.releaseAt;
      let ax = released ? (targetX - dot.x) * .022 : 0;
      let ay = released ? (targetY - dot.y) * .022 : 0;
      const dx = dot.x - pointer.x;
      const dy = dot.y - pointer.y;
      const distance = Math.hypot(dx, dy) || 1;
      if (released && pointer.active && distance < 86) {
        const force = Math.pow(1 - distance / 86, 2) * 10;
        ax += dx / distance * force;
        ay += dy / distance * force;
      }
      dot.vx = (dot.vx + ax * dt) * Math.pow(.88, dt);
      dot.vy = (dot.vy + ay * dt) * Math.pow(.88, dt);
      dot.x += dot.vx * dt;
      dot.y += dot.vy * dt;
    }
    ctx.globalAlpha = .48 + .5 * (Math.sin(time * .0015 + dot.phase) + 1) / 2;
    ctx.fillStyle = dot.phase > 2.6 ? '#ecfff7' : '#8deac0';
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  if (!reduce && visible && !document.hidden) frameId = requestAnimationFrame(draw);
}

logo.onload = resize;
whatsapp.onload = () => { if (stage === 2) select(2); };
if (logo.complete) resize();
new ResizeObserver(resize).observe(canvas);
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !reduce) startAnimation(); else if (frameId) cancelAnimationFrame(frameId); }).observe(canvas);
function trackPointer(event) {
  const rect = canvas.getBoundingClientRect();
  const nextX = event.clientX - rect.left;
  const nextY = event.clientY - rect.top;
  if (pointer.active) {
    const dx = Math.max(-50, Math.min(50, nextX - pointer.x));
    const dy = Math.max(-50, Math.min(50, nextY - pointer.y));
    sway.vx += dx * .04;
    sway.vy += dy * .035;
    sway.spin += dx * .000045;
  }
  pointer.x = nextX;
  pointer.y = nextY;
  pointer.active = true;
}
for (const surface of [canvas, sceneLink]) {
  surface?.addEventListener('pointermove', trackPointer, { passive: true });
  surface?.addEventListener('pointerleave', () => { pointer.active = false; });
}
buttons.forEach((button, index) => button.onclick = () => {
  if (index === stage && index > 0) document.querySelector(index === 1 ? '#capabilities' : '#contact').scrollIntoView();
  else select(index);
});
motionToggle.textContent = reduce ? 'Play motion' : 'Pause motion';
motionToggle.setAttribute('aria-pressed', String(!reduce));
motionToggle.addEventListener('click', () => {
  reduce = !reduce;
  motionToggle.textContent = reduce ? 'Play motion' : 'Pause motion';
  motionToggle.setAttribute('aria-pressed', String(!reduce));
  if (!reduce) startAnimation();
});
setTimeout(() => {
  if (!reduce && visible && !document.hidden) select(1);
  setInterval(() => {
    if (!reduce && visible && !document.hidden && !sceneLink?.matches(':focus-visible, :hover')) {
      select((stage + 1) % 3);
    }
  }, 6800);
}, 7600);

})();
