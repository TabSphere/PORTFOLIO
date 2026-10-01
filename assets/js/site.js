(() => {
  const header = document.querySelector('header');
  const toTop = document.querySelector('.to-top');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // Sticky header shrink + floating back-to-top visibility.
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', event => {
      event.preventDefault();
      scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
    });
  }

  // Highlight the nav link of the section currently in view.
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const map = new Map();
  links.forEach(link => {
    const section = document.getElementById(link.getAttribute('href').slice(1));
    if (section) map.set(section, link);
  });
  if (map.size && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => link.removeAttribute('aria-current'));
        map.get(entry.target).setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((link, section) => observer.observe(section));
  }
})();
