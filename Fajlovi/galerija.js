/* =========================================
   GALERIJA.JS — Slider + Lightbox
   ========================================= */

const sliderState = {};

function initSlider(id) {
  if (!sliderState[id]) {
    const thumbs = document.querySelectorAll(`#${id}-thumbs .thumb`);
    sliderState[id] = { current: 0, total: thumbs.length };
  }
}

// Klik na thumbnail
function setSlide(id, index) {
  initSlider(id);
  const state  = sliderState[id];
  const thumbs = document.querySelectorAll(`#${id}-thumbs .thumb`);
  const main   = document.getElementById(`${id}-main`);
  if (!thumbs[index]) return;

  main.classList.add('fade');
  setTimeout(() => {
    main.src = thumbs[index].src;
    main.classList.remove('fade');
  }, 150);

  thumbs[state.current].classList.remove('active');
  thumbs[index].classList.add('active');
  thumbs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  state.current = index;
}

// Strelice
function changeSlide(id, direction) {
  initSlider(id);
  const state = sliderState[id];
  let next = state.current + direction;
  if (next < 0)            next = state.total - 1;
  if (next >= state.total) next = 0;
  setSlide(id, next);
}

// ── LIGHTBOX ─────────────────────────────────────────────────────────────────
let lightboxSliderId = null;

function openLightbox(id) {
  initSlider(id);
  lightboxSliderId = id;
  const main = document.getElementById(`${id}-main`);
  document.getElementById('lightbox-img').src = main.src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  lightboxSliderId = null;
}

function lightboxChangeSlide(direction) {
  if (!lightboxSliderId) return;
  changeSlide(lightboxSliderId, direction);
  const main = document.getElementById(`${lightboxSliderId}-main`);
  setTimeout(() => {
    document.getElementById('lightbox-img').src = main.src;
  }, 160);
}

// Zatvori klik na pozadinu
document.addEventListener('DOMContentLoaded', () => {
  const lb = document.getElementById('lightbox');
  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });
});

// Keyboard
document.addEventListener('keydown', (e) => {
  if (document.getElementById('lightbox').classList.contains('open')) {
    if (e.key === 'ArrowLeft')  lightboxChangeSlide(-1);
    if (e.key === 'ArrowRight') lightboxChangeSlide(1);
    if (e.key === 'Escape')     closeLightbox();
  } else {
    if (e.key === 'ArrowLeft')  changeSlide(lastFocusedSlider, -1);
    if (e.key === 'ArrowRight') changeSlide(lastFocusedSlider,  1);
  }
});

let lastFocusedSlider = 'svirka1';
document.querySelectorAll('.slider-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    const main = card.querySelector('[id$="-main"]');
    if (main) lastFocusedSlider = main.id.replace('-main', '');
  });
});
