// WonderPrax RECRUIT - lightweight interactions

// ---------- Password Gate ----------
// SHA-256 of the passcode. The plain passcode is never stored in source.
const GATE_HASH = '3b546614344f894f49a1c2a8020c376f6a815063d5569660445bdb0d235c8e33';

async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function unlockSite() {
  document.documentElement.classList.remove('locked');
  const gate = document.getElementById('gate');
  if (gate) {
    gate.classList.add('hidden');
    setTimeout(() => gate.remove(), 500);
  }
}

(function initGate() {
  const gate = document.getElementById('gate');
  if (!gate) return;
  // If already authenticated in this session, skip the gate
  try {
    if (sessionStorage.getItem('wp_recruit_auth') === 'ok') {
      unlockSite();
      return;
    }
  } catch (e) { /* sessionStorage unavailable, fall through to gate */ }

  const form = document.getElementById('gate-form');
  const input = document.getElementById('gate-pw');
  const err = document.getElementById('gate-error');
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    err.hidden = true;
    const pw = (input.value || '').trim();
    if (!pw) return;
    const hex = await sha256Hex(pw);
    if (hex === GATE_HASH) {
      try { sessionStorage.setItem('wp_recruit_auth', 'ok'); } catch (e) {}
      unlockSite();
    } else {
      err.hidden = false;
      // Re-trigger shake animation
      err.style.animation = 'none'; void err.offsetWidth; err.style.animation = '';
      input.value = '';
      input.focus();
    }
  });
})();


// 1. Header scroll effect
const header = document.getElementById('header');
const onScroll = () => {
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

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
