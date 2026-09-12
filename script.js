const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40), { passive: true });
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// A restrained ambient detail: the page gets a few drifting hearts, not a storm of them.
function spawnHeart(container) {
  const heart = document.createElement('span');
  heart.className = 'floating-heart';
  heart.textContent = '♥';
  const duration = 8 + Math.random() * 5;
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${10 + Math.random() * 10}px`;
  heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 100}px`);
  heart.style.animationDuration = `${duration}s`;
  container.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000 + 200);
}

const pageHeartLayer = document.getElementById('floatingHearts');
setInterval(() => spawnHeart(pageHeartLayer), 5000);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.timeline-item').forEach((el) => revealObserver.observe(el));

const memories = [
  { caption: 'A moment worth keeping', src: null },
  { caption: 'The kind of day you remember', src: null },
  { caption: 'Something that still makes you smile', src: null },
  { caption: 'A chapter worth revisiting', src: null },
  { caption: 'One for the memory box', src: null },
  { caption: 'A moment that belongs here', src: null },
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
    icon.setAttribute('aria-hidden', 'true');
    card.appendChild(icon);
  }
  const caption = document.createElement('div');
  caption.className = 'memory-caption';
  caption.textContent = memory.caption;
  card.appendChild(caption);
  memoryGrid.appendChild(card);
  revealObserver.observe(card);
});

const quotes = [
  'If music be the food of love, play on.',
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
    quoteIndexEl.textContent = `${String(i + 1).padStart(2, '0')} / ${String(quotes.length).padStart(2, '0')}`;
    quoteTextEl.classList.add('visible');
    [...quoteDotsEl.children].forEach((dot, di) => dot.classList.toggle('active', di === i));
  }, 220);
}
function goToQuote(i) { quoteIdx = (i + quotes.length) % quotes.length; renderQuote(quoteIdx); }
function restartQuoteTimer() {
  clearInterval(quoteTimer);
  quoteTimer = setInterval(() => goToQuote(quoteIdx + 1), 6500);
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

const revealInner = document.getElementById('revealInner');
function revealSecret() {
  const justRevealed = !revealInner.classList.contains('flipped');
  revealInner.classList.toggle('flipped');
  if (justRevealed) burstHearts();
}
revealInner.addEventListener('click', revealSecret);
revealInner.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    revealSecret();
  }
});

function burstHearts() {
  const rect = revealInner.getBoundingClientRect();
  for (let i = 0; i < 8; i++) setTimeout(() => {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = '♥';
    heart.style.left = `${((rect.left + rect.width / 2) / window.innerWidth) * 100 + (Math.random() - 0.5) * 10}%`;
    heart.style.bottom = `${window.innerHeight - rect.top}px`;
    heart.style.fontSize = `${9 + Math.random() * 10}px`;
    heart.style.setProperty('--drift', `${(Math.random() - 0.5) * 130}px`);
    heart.style.animationDuration = '3s';
    pageHeartLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 3200);
  }, i * 45);
}

const STORAGE_KEY = 'loveLettersMessages';
const messageForm = document.getElementById('messageForm');
const nameInput = document.getElementById('msgName');
const textInput = document.getElementById('msgText');
const formError = document.getElementById('formError');
const messageWall = document.getElementById('messageWall');

function loadMessages() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveMessages(messages) { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }
function renderWall() {
  const messages = loadMessages();
  messageWall.innerHTML = '';
  if (!messages.length) {
    const empty = document.createElement('li');
    empty.className = 'message-wall-empty';
    empty.textContent = 'No notes yet — leave the first one.';
    messageWall.appendChild(empty);
    return;
  }
  messages.slice().reverse().forEach((message) => {
    const li = document.createElement('li');
    const p = document.createElement('p');
    p.className = 'msg-text';
    p.textContent = message.text;
    const span = document.createElement('span');
    span.className = 'msg-name';
    span.textContent = `— ${message.name}`;
    li.append(p, span);
    messageWall.appendChild(li);
  });
}

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();
  const text = textInput.value.trim();
  if (!name || !text) { formError.hidden = false; return; }
  formError.hidden = true;
  const messages = loadMessages();
  messages.push({ name, text, date: new Date().toISOString() });
  saveMessages(messages);
  renderWall();
  nameInput.value = '';
  textInput.value = '';
});

[nameInput, textInput].forEach((el) => el.addEventListener('input', () => { formError.hidden = true; }));
renderWall();
