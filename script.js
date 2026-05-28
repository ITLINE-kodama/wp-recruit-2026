// WonderPrax RECRUIT - lightweight interactions

// 1. Header scroll effect + scroll progress bar
const header = document.getElementById('header');
const sidenav = document.getElementById('sidenav');
const progress = document.getElementById('scrollProgress');

const darkSections = document.querySelectorAll('.section-cta');

const onScroll = () => {
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');

  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = pct + '%';
  }

  // Fallback dark-bg detection on every scroll tick (more reliable than IntersectionObserver alone)
  if (sidenav && darkSections.length > 0) {
    const midY = window.innerHeight * 0.45;
    let onDark = false;
    for (const ds of darkSections) {
      const r = ds.getBoundingClientRect();
      if (r.top < midY && r.bottom > midY) { onDark = true; break; }
    }
    if (onDark) sidenav.classList.add('on-dark');
    else sidenav.classList.remove('on-dark');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Sidenav: show immediately on load (slight delay for visual rhythm)
if (sidenav) {
  setTimeout(() => sidenav.classList.add('visible'), 400);
}

// Floating CTA: show after small scroll, persistent thereafter
const floatingCta = document.getElementById('floatingCta');
if (floatingCta) {
  const showFc = () => {
    if (window.scrollY > 200) floatingCta.classList.add('visible');
  };
  window.addEventListener('scroll', showFc, { passive: true });
  showFc();
  // Also show once after 1.5s on load even if user hasn't scrolled
  setTimeout(() => floatingCta.classList.add('visible'), 1500);
}

// Favorite button: persist state in localStorage
const favBtn = document.getElementById('favBtn');
if (favBtn) {
  try {
    if (localStorage.getItem('wp_recruit_fav') === '1') favBtn.classList.add('is-fav');
  } catch (e) {}
  favBtn.addEventListener('click', () => {
    const on = favBtn.classList.toggle('is-fav');
    try { localStorage.setItem('wp_recruit_fav', on ? '1' : '0'); } catch (e) {}
    const label = favBtn.querySelector('.fc-label');
    if (label) label.textContent = on ? 'お気に入り済み' : 'お気に入り';
  });
}

// 1b. Active section tracking + dark-section detection for sidenav
const sidenavLinks = document.querySelectorAll('.sidenav a[data-target]');
const sectionMap = new Map();
sidenavLinks.forEach(a => {
  const sec = document.getElementById(a.dataset.target);
  if (sec) sectionMap.set(sec, a);
});

// Selectors that count as "dark-bg" sections (sidenav switches color when over them)
const isDarkSection = (sec) => sec && sec.classList.contains('section-cta');

if (sectionMap.size > 0) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const a = sectionMap.get(e.target);
      if (!a) return;
      if (e.isIntersecting) {
        sidenavLinks.forEach(x => x.classList.remove('active'));
        a.classList.add('active');
        // Adapt sidenav color to current section background
        if (sidenav) {
          if (isDarkSection(e.target)) sidenav.classList.add('on-dark');
          else sidenav.classList.remove('on-dark');
        }
      }
    });
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });
  sectionMap.forEach((_, sec) => navObserver.observe(sec));
}

// Hero region: clear active section state (hero is now dark itself, on-dark handled by darkSections detection above)
const heroEl = document.getElementById('hero');
if (heroEl && sidenav) {
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        sidenavLinks.forEach(x => x.classList.remove('active'));
      }
    });
  }, { rootMargin: '0px 0px -60% 0px', threshold: 0 });
  heroObserver.observe(heroEl);
}

// 2. Reveal on intersect
const revealTargets = document.querySelectorAll(
  '.section-title, .section-lead, .msg-body, .msg-figure, .why-card, .num-item, .job-card, .member-feature, .member-mini, .timeline li, .p-step, .faq-list details, .entry-inner'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => io.observe(el));

// 3. Smooth-scroll already handled by html { scroll-behavior: smooth }
// Offset for fixed header on anchor clicks
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

// 4. Hamburger toggle for mobile (simple show/hide of nav)
const ham = document.getElementById('hamburger');
const nav = document.querySelector('.site-header .nav');
if (ham && nav) {
  ham.addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
}
