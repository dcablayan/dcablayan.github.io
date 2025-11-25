(function () {
  const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  // Smooth scroll for internal links
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        event.preventDefault();
        document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Highlight active section in nav
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        if (!id) return;
        const link = navLinks.find((l) => l.getAttribute('href') === `#${id}`);
        if (link) {
          link.classList.toggle('active', entry.isIntersecting);
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
})();
