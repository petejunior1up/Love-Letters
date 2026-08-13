/* ==========================================================================
   1. NAVBAR — solid on scroll, mobile toggle
   ========================================================================== */

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ==========================================================================
   2. FLOATING HEARTS
   Spawns small heart glyphs that drift upward and fade. One loop fills the
   whole page (subtle, sparse); a denser loop runs only inside the hero.
   ========================================================================== */

function spawnHeart(container, { dense = false } = {}) {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = '♥';

  const size = 12 + Math.random() * 16;
  const left = Math.random() * 100;
  const duration = 7 + Math.random() * 6;
  const drift = (Math.random() - 0.5) * 120;

  heart.style.left = `${left}%`;
  heart.style.fontSize = `${size}px`;
  heart.style.setProperty('--drift', `${drift}px`);
  heart.style.animationDuration = `${duration}s`;

  container.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 200);
}

const pageHeartLayer = document.getElementById('floatingHearts');
const heroHeartLayer = document.getElementById('heroHearts');

setInterval(() => spawnHeart(pageHeartLayer), 2200);
setInterval(() => spawnHeart(heroHeartLayer, { dense: true }), 900);

/* ==========================================================================
   3. SCROLL REVEALS — timeline items + memory cards fade/slide in once visible
   ========================================================================== */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.25 }
);

document.querySelectorAll('.timeline-item').forEach((el) => revealObserver.observe(el));

/* ==========================================================================
   4. MEMORY GRID — built from data so swapping in real photos is a one-line
   edit per memory (set `src` and it renders an <img> instead of a placeholder)
   ========================================================================== */

const memories = [
  { caption: 'Add a photo from the day you met', src: null },
  { caption: 'Add a photo from your favorite trip', src: null },
  { caption: 'Add a photo from a lazy Sunday', src: null },
  { caption: 'Add a photo from a celebration', src: null },
  { caption: 'Add a photo that makes you both laugh', src: null },
  { caption: 'Add a photo you never posted anywhere', src: null },
];

const memoryGrid = document.getElementById('memoryGrid');

memories.forEach((memory) => {
  const card = document.createElement('div');
  card.className = 'memory-card';

  if (memory.src) {
    const img = document.createElement('img');
    img.src = memory.src;
    img.alt = memory.caption;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    card.appendChild(img);
  } else {
    const icon = document.createElement('div');
    icon.className = 'placeholder-icon';
    icon.textContent = '♥';
    card.appendChild(icon);
  }

  const caption = document.createElement('div');
  caption.className = 'memory-caption';
  caption.textContent = memory.caption;
  card.appendChild(caption);

  memoryGrid.appendChild(card);
  revealObserver.observe(card);
});

/* ==========================================================================
   5. QUOTE CAROUSEL
   ========================================================================== */

const quotes = [
  'You are my favorite “what if” that turned into my favorite “what is.”',
  'Home stopped being a place the day it became a person.',
  'I didn’t fall in love. I walked in, wide awake, and stayed.',
  'Some hearts just recognize each other, before a single word is said.',
  'Every ordinary day feels different with you in it.',
  'You are the calm I didn’t know I was looking for.',
];

const quoteTextEl = document.getElementById('quoteText');
const quoteIndexEl = document.getElementById('quoteIndex');
const quoteDotsEl = document.getElementById('quoteDots');

let quoteIdx = 0;
let quoteTimer = null;

function renderQuote(i) {
  quoteTextEl.classList.remove('visible');
  setTimeout(() => {
    quoteTextEl.textContent = `“${quotes[i]}”`;
    quoteIndexEl.textContent = `${i + 1} / ${quotes.length}`;
    quoteTextEl.classList.add('visible');
    [...quoteDotsEl.children].forEach((dot, di) => dot.classList.toggle('active', di === i));
  }, 220);
}

function goToQuote(i) {
  quoteIdx = (i + quotes.length) % quotes.length;
  renderQuote(quoteIdx);
}

function restartQuoteTimer() {
  clearInterval(quoteTimer);
  quoteTimer = setInterval(() => goToQuote(quoteIdx + 1), 6000);
}

quotes.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Show quote ${i + 1}`);
  dot.addEventListener('click', () => { goToQuote(i); restartQuoteTimer(); });
  quoteDotsEl.appendChild(dot);
});

renderQuote(quoteIdx);
restartQuoteTimer();

/* ==========================================================================
   6. HIDDEN MESSAGE REVEAL
   ========================================================================== */

const revealInner = document.getElementById('revealInner');
revealInner.addEventListener('click', () => {
  const justRevealed = !revealInner.classList.contains('flipped');
  revealInner.classList.toggle('flipped');
  if (justRevealed) burstHearts();
});

function burstHearts() {
  const rect = revealInner.getBoundingClientRect();
  for (let i = 0; i < 14; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = '♥';
      heart.style.left = `${((rect.left + rect.width / 2) / window.innerWidth) * 100 + (Math.random() - 0.5) * 12}%`;
      heart.style.bottom = `${window.innerHeight - rect.top}px`;
      heart.style.fontSize = `${10 + Math.random() * 14}px`;
      heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`);
      heart.style.animationDuration = '3.2s';
      pageHeartLayer.appendChild(heart);
      setTimeout(() => heart.remove(), 3400);
    }, i * 40);
  }
}

/* ==========================================================================
   7. LEAVE A LOVE MESSAGE — validated form, persisted wall via localStorage
   ========================================================================== */

const STORAGE_KEY = 'loveLettersMessages';
const messageForm = document.getElementById('messageForm');
const nameInput = document.getElementById('msgName');
const textInput = document.getElementById('msgText');
const formError = document.getElementById('formError');
const messageWall = document.getElementById('messageWall');

function loadMessages() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function renderWall() {
  const messages = loadMessages();
  messageWall.innerHTML = '';

  if (messages.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'message-wall-empty';
    empty.textContent = 'No messages yet — be the first to leave one.';
    empty.style.listStyle = 'none';
    messageWall.appendChild(empty);
    return;
  }

  messages.slice().reverse().forEach((m) => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.className = 'msg-text';
    p.textContent = m.text;
    const span = document.createElement('span');
    span.className = 'msg-name';
    span.textContent = `— ${m.name}`;
    li.appendChild(p);
    li.appendChild(span);
    messageWall.appendChild(li);
  });
}

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) {
    formError.hidden = false;
    return;
  }
  formError.hidden = true;

  const messages = loadMessages();
  messages.push({ name, text, date: new Date().toISOString() });
  saveMessages(messages);
  renderWall();

  nameInput.value = '';
  textInput.value = '';
});

[nameInput, textInput].forEach((el) => {
  el.addEventListener('input', () => { formError.hidden = true; });
});

renderWall();
