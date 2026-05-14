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

// 4. Password gate (same hash as A plan, shared session token)
const GATE_HASH = '3b546614344f894f49a1c2a8020c376f6a815063d5569660445bdb0d235c8e33';
async function sha256Hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function unlockSite() {
  document.documentElement.classList.remove('locked');
  const g = document.getElementById('gate');
  if (g) { g.classList.add('hidden'); setTimeout(() => g.remove(), 500); }
}
(function initGate() {
  const gate = document.getElementById('gate');
  if (!gate) return;
  try {
    if (sessionStorage.getItem('wp_recruit_auth') === 'ok') { unlockSite(); return; }
  } catch (e) {}
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
      err.style.animation = 'none'; void err.offsetWidth; err.style.animation = '';
      input.value = '';
      input.focus();
    }
  });
})();
