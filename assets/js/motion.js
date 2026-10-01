(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Section reveals with optional per-element stagger delay.
    document.querySelectorAll('[data-reveal-scroll]').forEach(element => {
      gsap.from(element, {
        y: 35,
        opacity: 0,
        duration: .85,
        delay: parseFloat(element.dataset.revealDelay || 0),
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 94%', once: true }
      });
    });
    // Hero entrance.
    const hero = document.querySelector('#portrait-hero');
    if (hero) {
      gsap.from('.identity span, .role-title, .role-desc, .reset, .scroll-cue', { y: 26, opacity: 0, duration: .9, stagger: .07, ease: 'power3.out', clearProps: 'transform,opacity' });
      gsap.from('.portrait', { opacity: 0, duration: 1.2, ease: 'power2.out', clearProps: 'opacity' });
    }
    // Ambient colour ribbons.
    document.querySelectorAll('.colour-ribbon').forEach((element, index) => {
      gsap.to(element, { y: -10 - index * 4, rotation: '+=6', duration: 3.5 + index, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    // Gentle parallax on the colour scene.
    if (hero && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const scene = hero.querySelector('.colour-scene');
      const moveX = gsap.quickTo(scene, 'x', { duration: .7, ease: 'power3.out' });
      const moveY = gsap.quickTo(scene, 'y', { duration: .7, ease: 'power3.out' });
      const move = event => { const box = hero.getBoundingClientRect(); moveX(((event.clientX - box.left) / box.width - .5) * 26); moveY(((event.clientY - box.top) / box.height - .5) * 14); };
      const reset = () => { moveX(0); moveY(0); };
      hero.addEventListener('pointermove', move);
      hero.addEventListener('pointerleave', reset);
      return () => { hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', reset); };
    }
  });
})();
