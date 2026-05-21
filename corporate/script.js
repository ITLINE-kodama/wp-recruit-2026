// WonderPrax CORPORATE - lightweight interactions

// 1. Header scroll effect + progress bar
const header = document.getElementById('header');
const progress = document.getElementById('scrollProgress');

const onScroll = () => {
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = pct + '%';
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 2. Reveal animations on intersect
const revealTargets = document.querySelectorAll(
  '.hero-text, .hero-photo, .section-title, .section-lead, .section-eyebrow, ' +
  '.manifesto-list .m-line, .manifesto-aside, ' +
  '.stat-massive, .service-card, .principle-list li, .approach-diagram, ' +
  '.case-card, .member-card, .company-info, .company-tree, .news-list li, ' +
  '.cta-buttons, .cta-info'
);
revealTargets.forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger micro-delays for grids
  if (el.matches('.stat-massive, .service-card, .case-card, .member-card, .principle-list li, .manifesto-list .m-line')) {
    el.style.transitionDelay = ((i % 4) * 80) + 'ms';
  }
});
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealTargets.forEach(el => io.observe(el));

// 3. Smooth-scroll with header offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (ev) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    ev.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// 4. Horizontal scroll: keyboard arrow support on case-rail
const rail = document.querySelector('.case-rail');
if (rail) {
  rail.setAttribute('tabindex', '0');
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { rail.scrollBy({ left: 380, behavior: 'smooth' }); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { rail.scrollBy({ left: -380, behavior: 'smooth' }); e.preventDefault(); }
  });
}
