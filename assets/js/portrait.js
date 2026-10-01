(() => {
  const hero = document.querySelector('#portrait-hero');
  if (!hero) return;
  const art = hero.querySelector('.portrait-art');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let current = 50, target = 50, frame = null, previous = 0;
  const render = () => hero.style.setProperty('--reveal', `${current}%`);
  const tick = time => {
    const delta = previous ? Math.min(time - previous, 64) : 16.67;
    previous = time;
    current += (target - current) * (1 - Math.exp(-delta / 95));
    if (Math.abs(target - current) < .03) current = target;
    render();
    if (current !== target) frame = requestAnimationFrame(tick);
    else { frame = null; previous = 0; }
  };
  const reveal = value => {
    target = Math.max(0, Math.min(100, value));
    if (reduced.matches) {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null; previous = 0; current = target; render();
    } else if (frame === null) frame = requestAnimationFrame(tick);
  };
  hero.addEventListener('pointermove', event => {
    if (!fine.matches || event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    const fraction = (event.clientX - bounds.left) / bounds.width;
    reveal(100 - ((fraction - .25) / .5) * 100);
  });
  hero.addEventListener('pointerleave', () => { if (fine.matches) reveal(50); });
  hero.querySelectorAll('[data-reveal]').forEach(button => {
    button.addEventListener('focus', () => reveal(Number(button.dataset.reveal)));
    button.addEventListener('click', () => reveal(Number(button.dataset.reveal)));
    button.addEventListener('blur', () => reveal(50));
  });
  // Keep the photographic portrait usable if the artwork fails to load.
  art.addEventListener('error', () => { art.hidden = true; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && frame !== null) {
      cancelAnimationFrame(frame); frame = null; previous = 0;
    } else if (!document.hidden && current !== target) reveal(target);
  });
})();
