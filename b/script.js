// WonderPrax RECRUIT — Plan B — minimal interactions

// 1. Header scroll effect
const hdr = document.getElementById('hdr');
const onScroll = () => {
  if (window.scrollY > 80) hdr.classList.add('scrolled');
  else hdr.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 2. Reveal animation on scroll
const revealTargets = document.querySelectorAll('.huge, .big, .massive, .lead, .manifesto-body, .manifesto-quote, .pillars li, .biz-b, .job-rows li, .entry-actions, .entry-info');
revealTargets.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealTargets.forEach(el => io.observe(el));

// 3. Smooth scroll with header offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (ev) => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    ev.preventDefault();
    const top = t.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

