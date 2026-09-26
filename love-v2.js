/* LOVE ARCHIVE V2 — interaction layer; no copy is replaced */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced && matchMedia('(pointer:fine)').matches) {
    const glow = document.createElement('div');
    glow.className = 'love-cursor';
    glow.setAttribute('aria-hidden','true');
    document.body.appendChild(glow);
    addEventListener('pointermove', e => { glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px'; glow.classList.add('on'); }, {passive:true});
    document.documentElement.addEventListener('mouseleave',()=>glow.classList.remove('on'));
  }
  const live = document.createElement('div');
  live.className='love-now'; live.setAttribute('aria-hidden','true'); live.innerHTML='<i></i><span>ARCHIVE LIVE</span>';
  document.body.appendChild(live);

  const cards = document.querySelectorAll('.letter-card,.article,.thought-grid article');
  if ('IntersectionObserver' in window && !reduced) {
    cards.forEach(el=>{el.style.opacity='0';el.style.transform='translateY(18px)'});
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.transition='opacity .65s ease, transform .65s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, border-color .35s ease';entry.target.style.opacity='1';entry.target.style.transform='';io.unobserve(entry.target)}}),{threshold:.12});
    cards.forEach(el=>io.observe(el));
  }
})();
