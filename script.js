const navbar=document.getElementById('navbar');
const navToggle=document.getElementById('navToggle');
const navLinks=document.getElementById('navLinks');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>40),{passive:true});
navToggle.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');navToggle.setAttribute('aria-expanded',String(open));});
navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');navToggle.setAttribute('aria-expanded','false');}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.article,.letter-card,.thought-grid article,.heartbreak-list article').forEach(el=>revealObserver.observe(el));

const quotes=[
  'If music be the food of love, play on.',
  'Love notices what the rest of the world walks past.',
  'Sometimes the bravest thing in love is asking a better question.',
  'A good relationship leaves room for two whole people.',
  'Some endings are painful because what came before them mattered.',
  'To be known is one of the quietest forms of being loved.'
];
const quoteText=document.getElementById('quoteText');
const quoteIndex=document.getElementById('quoteIndex');
const quoteDots=document.getElementById('quoteDots');
let quoteIdx=0,timer;
function renderQuote(i){quoteText.classList.remove('visible');setTimeout(()=>{quoteText.textContent=`“${quotes[i]}”`;quoteIndex.textContent=`${String(i+1).padStart(2,'0')} / ${String(quotes.length).padStart(2,'0')}`;quoteText.classList.add('visible');[...quoteDots.children].forEach((d,n)=>d.classList.toggle('active',n===i));},180);}
function go(i){quoteIdx=(i+quotes.length)%quotes.length;renderQuote(quoteIdx);}
quotes.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Show quote ${i+1}`);b.addEventListener('click',()=>{go(i);restart();});quoteDots.appendChild(b);});
function restart(){clearInterval(timer);timer=setInterval(()=>go(quoteIdx+1),6500);}renderQuote(0);restart();

const letterButtons=document.querySelectorAll('.letter-open');
letterButtons.forEach(button=>button.addEventListener('click',()=>{
  const card=button.closest('.letter-card');
  const open=card.classList.toggle('expanded');
  button.innerHTML=open?'Close letter <span>↖</span>':'Open letter <span>↗</span>';
  if(open) card.scrollIntoView({behavior:'smooth',block:'center'});
}));

const STORAGE_KEY='loveLettersNotes';
const form=document.getElementById('messageForm');
const nameInput=document.getElementById('msgName');
const textInput=document.getElementById('msgText');
const error=document.getElementById('formError');
const wall=document.getElementById('messageWall');
function load(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||[];}catch{return[];}}
function render(){const notes=load();wall.innerHTML='';if(!notes.length){const li=document.createElement('li');li.className='message-wall-empty';li.textContent='No notes yet — leave the first one.';wall.appendChild(li);return;}notes.slice().reverse().forEach(n=>{const li=document.createElement('li');const p=document.createElement('p');p.className='msg-text';p.textContent=n.text;const s=document.createElement('span');s.className='msg-name';s.textContent=`— ${n.name}`;li.append(p,s);wall.appendChild(li);});}
form.addEventListener('submit',e=>{e.preventDefault();const name=nameInput.value.trim(),text=textInput.value.trim();if(!name||!text){error.hidden=false;return;}error.hidden=true;const notes=load();notes.push({name,text,date:new Date().toISOString()});localStorage.setItem(STORAGE_KEY,JSON.stringify(notes));render();form.reset();});
[nameInput,textInput].forEach(el=>el.addEventListener('input',()=>error.hidden=true));
render();
