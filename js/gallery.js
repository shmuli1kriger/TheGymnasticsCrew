// Vite scans the folder at build time; new numbered images are picked up automatically.
const files = import.meta.glob('../media/gallery/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const images = Object.entries(files)
  .map(([path, url]) => ({ n: parseInt(path.match(/(\d+)\.\w+$/)?.[1], 10), url }))
  .filter((i) => !Number.isNaN(i.n))
  .sort((a, b) => a.n - b.n)
  .map((i) => i.url);

const grid = document.querySelector('#grid');
const lb = document.querySelector('#lightbox');
const lbImg = document.querySelector('#lb-img');
const counter = document.querySelector('#lb-counter');
let index = 0;
let lastFocus = null;

// Grid
images.forEach((url, i) => {
  const img = document.createElement('img');
  img.src = url;
  img.loading = 'lazy';
  img.alt = `Gallery photo ${i + 1}`;
  img.tabIndex = 0;
  img.addEventListener('click', () => open(i));
  img.addEventListener('keydown', (e) => e.key === 'Enter' && open(i));
  grid.appendChild(img);
});

// Lightbox
function show(i) {
  index = (i + images.length) % images.length;
  lbImg.style.opacity = 0;
  lbImg.onload = () => (lbImg.style.opacity = 1);
  lbImg.src = images[index];
  lbImg.alt = `Gallery photo ${index + 1}`;
  counter.textContent = `${index + 1} / ${images.length}`;
  new Image().src = images[(index + 1) % images.length];
  new Image().src = images[(index - 1 + images.length) % images.length];
}

function open(i) {
  lastFocus = document.activeElement;
  lb.hidden = false;
  document.body.classList.add('lb-open');
  show(i);
  lb.querySelector('.lb-close').focus();
}

function close() {
  lb.hidden = true;
  document.body.classList.remove('lb-open');
  lastFocus?.focus();
}

lb.querySelector('.lb-next').onclick = () => show(index + 1);
lb.querySelector('.lb-prev').onclick = () => show(index - 1);
lb.querySelector('.lb-close').onclick = close;
lb.addEventListener('click', (e) => {
  if (e.target === lb) close();
});

document.addEventListener('keydown', (e) => {
  if (lb.hidden) return;
  if (e.key === 'ArrowRight') show(index + 1);
  if (e.key === 'ArrowLeft') show(index - 1);
  if (e.key === 'Escape') close();
});

// Touch swipe
let x0 = null;
lb.addEventListener('touchstart', (e) => (x0 = e.touches[0].clientX), { passive: true });
lb.addEventListener('touchend', (e) => {
  if (x0 === null) return;
  const dx = e.changedTouches[0].clientX - x0;
  if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  x0 = null;
});
