(() => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    document.querySelectorAll('[data-reveal-scroll]').forEach(element => {
      gsap.from(element, {y: 35, opacity: 0, duration: .85, ease: 'power2.out', scrollTrigger: {trigger: element, start: 'top 94%', once: true}});
    });
    document.querySelectorAll('.colour-ribbon').forEach((element, index) => {
      gsap.to(element, {y: -10 - index * 4, rotation: '+=6', duration: 3.5 + index, repeat: -1, yoyo: true, ease: 'sine.inOut'});
    });
    const hero = document.querySelector('#portrait-hero');
    if (hero && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const scene = hero.querySelector('.colour-scene');
      const moveX = gsap.quickTo(scene, 'x', {duration: .7, ease: 'power3.out'});
      const moveY = gsap.quickTo(scene, 'y', {duration: .7, ease: 'power3.out'});
      const move = event => {const box = hero.getBoundingClientRect();moveX(((event.clientX-box.left)/box.width-.5)*26);moveY(((event.clientY-box.top)/box.height-.5)*14);};
      const reset = () => {moveX(0);moveY(0);};
      hero.addEventListener('pointermove', move);hero.addEventListener('pointerleave', reset);
      return () => {hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',reset);};
    }
  });
})();
