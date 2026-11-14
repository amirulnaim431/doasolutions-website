(() => {
  const field = document.querySelector('.bo-login-space');
  if (!field) return;

  const colors = ['#eafdf6', '#bbecd9', '#b4d9ff', '#fff0d8'];
  // Fixed seed keeps the composition stable when changing orientation.
  let seed = 317415;
  function random() {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  const layers = Array.from(field.querySelectorAll('canvas'), (canvas, depth) => ({
    canvas,
    depth,
    stars: Array.from({length: 140}, () => ({
      x: random(),
      y: random(),
      opacity: .28 + random() * .68,
      size: random(),
      color: colors[Math.floor(random() * colors.length)],
    })),
  }));

  function paint() {
    const {width, height} = field.getBoundingClientRect();
    if (!width || !height) return;
    const w = width + 36;
    const h = height + 36;
    // Bound pixel work on large monitors while keeping high-density phone screens sharp.
    const scale = Math.min(devicePixelRatio || 1, 3, Math.sqrt(3600000 / (w * h)));
    const density = Math.min(1, Math.max(.24, width * height / 900000));
    for (const {canvas,depth,stars} of layers) {
      const context = canvas.getContext('2d');
      if (!context) continue;
      canvas.width = Math.ceil(w * scale);
      canvas.height = Math.ceil(h * scale);
      context.setTransform(scale,0,0,scale,0,0);
      const count = Math.ceil([140,95,38][depth] * density);
      for (const star of stars.slice(0,count)) {
        const x = star.x * w;
        const y = star.y * h;
        const radius = .45 + .38 * depth + star.size ** 2 * .65;
        context.globalAlpha = star.opacity;
        context.fillStyle = star.color;
        context.shadowColor = star.color;
        context.shadowBlur = depth === 2 ? 7 * scale : 0;
        context.beginPath();
        context.arc(x,y,radius,0,Math.PI * 2);
        context.fill();
        if (depth === 2 && star.size > .8) {
          context.globalAlpha = star.opacity * .44;
          context.beginPath();
          context.ellipse(x,y,.55,radius * 2.8,0,0,Math.PI * 2);
          context.ellipse(x,y,radius * 2.8,.55,0,0,Math.PI * 2);
          context.fill();
        }
      }
    }
  }

  paint();
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(paint).observe(field);
  } else {
    addEventListener('resize',paint);
  }
})();
