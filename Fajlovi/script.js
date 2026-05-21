/* =========================================
   SCRIPT.JS — Animations & Interactions
   ========================================= */

// ── 1. NAVBAR: shrink on scroll ──────────────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── 2. HAMBURGER MENU ────────────────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── 3. SCROLL REVEAL (Intersection Observer) ─────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on order
        entry.target.style.transitionDelay = `${i * 0.08}s`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── 4. EVENT CARDS: staggered entrance when scroll box is visible ─────────────
const eventsBox = document.querySelector('.EventsScrollBox');
const eventCards = document.querySelectorAll('.Event');

// Initially hide all event cards
eventCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateX(-24px)';
  card.style.transition = 'opacity 0.42s cubic-bezier(0.4,0,0.2,1), transform 0.42s cubic-bezier(0.4,0,0.2,1)';
});

const eventBoxObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        eventCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateX(0)';
          }, i * 100);
        });
        eventBoxObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

if (eventsBox) eventBoxObserver.observe(eventsBox);

// ── 5. MAPS BUTTON: ripple effect ─────────────────────────────────────────────
document.querySelectorAll('.maps-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top  - size / 2}px;
      transform: scale(0);
      animation: ripple 0.5s linear;
      pointer-events: none;
    `;

    // Inject keyframe if not already done
    if (!document.getElementById('ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
  });
});

// ── 6. NAVBAR ACTIVE LINK HIGHLIGHT ──────────────────────────────────────────
document.querySelectorAll('.nav-btn, .mobile-menu .nav-btn').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-btn').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.mobile-menu .nav-btn').forEach(l => l.classList.remove('active'));
    // Mark matching text active in both navs
    const label = this.textContent;
    document.querySelectorAll('.nav-btn').forEach(l => {
      if (l.textContent === label) l.classList.add('active');
    });
  });
});

// ── 7. PERSON CARD: subtle parallax on mouse move ────────────────────────────
const personCard = document.querySelector('.person-card');
if (personCard && window.matchMedia('(min-width: 900px)').matches) {
  personCard.addEventListener('mousemove', (e) => {
    const rect = personCard.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    personCard.style.transform = `perspective(900px) rotateY(${dx * 5}deg) rotateX(${-dy * 4}deg)`;
  });
  personCard.addEventListener('mouseleave', () => {
    personCard.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
    personCard.style.transition = 'transform 0.5s ease';
  });
  personCard.addEventListener('mouseenter', () => {
    personCard.style.transition = 'transform 0.1s ease';
  });
}
