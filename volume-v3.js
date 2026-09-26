(() => {
  'use strict';
  const body=document.body;
  if(!body.classList.contains('archive-page')&&!body.classList.contains('archive-home')) return;

  const progress=document.createElement('div');
  progress.className='archive-page-progress';
  progress.innerHTML='<i></i>';
  document.body.appendChild(progress);
  const bar=progress.querySelector('i');
  const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?(scrollY/max)*100:0)+'%';};
  addEventListener('scroll',update,{passive:true}); update();

  const pages=[
    ['Archive Home','The complete volume','index.html','00'],
    ['Love','Care, attention and connection','love.html','01'],
    ['Heartbreak','Change, loss and moving forward','heartbreak.html','02'],
    ['Letters','Words that needed paper first','letters.html','03'],
    ['Thoughts','Field notes from the heart','thoughts.html','04'],
    ['Quotes','Words worth keeping','quotes.html','05'],
    ['About','Why this archive exists','about.html','06']
  ];

  const trigger=document.createElement('button');
  trigger.className='archive-command-trigger';
  trigger.type='button';
  trigger.innerHTML='<b>♥</b> ARCHIVE NAV <span>⌘K</span>';
  trigger.setAttribute('aria-label','Open archive navigator');
  document.body.appendChild(trigger);

  const root=document.createElement('div');
  root.className='archive-command';
  root.setAttribute('aria-hidden','true');
  root.innerHTML='<div class="archive-command-panel" role="dialog" aria-modal="true" aria-label="Archive navigator"><div class="archive-command-head"><span>♥</span><input type="search" placeholder="Find a chapter..." aria-label="Find a chapter"><kbd>ESC</kbd></div><div class="archive-command-list"></div><div class="archive-command-foot">↑↓ NAVIGATE · ENTER OPEN · THE LOVE ARCHIVE / VOL. 01</div></div>';
  document.body.appendChild(root);

  const input=root.querySelector('input'),list=root.querySelector('.archive-command-list');
  let filtered=[...pages],active=0;
  function render(){
    list.innerHTML=filtered.map((p,i)=>'<button class="archive-command-item'+(i===active?' active':'')+'" type="button" data-i="'+i+'"><span><strong>'+p[0]+'</strong><small>'+p[1]+'</small></span><b>'+p[3]+'</b></button>').join('') || '<div style="padding:2rem;color:#776a70;text-align:center">No chapter found.</div>';
  }
  function open(){root.classList.add('open');root.setAttribute('aria-hidden','false');input.value='';filtered=[...pages];active=0;render();setTimeout(()=>input.focus(),20)}
  function close(){root.classList.remove('open');root.setAttribute('aria-hidden','true');}
  function go(p){location.href=p[2];}
  trigger.addEventListener('click',open);
  root.addEventListener('click',e=>{if(e.target===root)close();const b=e.target.closest('.archive-command-item');if(b)go(filtered[+b.dataset.i]);});
  input.addEventListener('input',()=>{const q=input.value.toLowerCase().trim();filtered=pages.filter(p=>(p[0]+' '+p[1]).toLowerCase().includes(q));active=0;render();});
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();root.classList.contains('open')?close():open();return}
    if(!root.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowDown'&&filtered.length){e.preventDefault();active=(active+1)%filtered.length;render();}
    if(e.key==='ArrowUp'&&filtered.length){e.preventDefault();active=(active-1+filtered.length)%filtered.length;render();}
    if(e.key==='Enter'&&filtered[active]){e.preventDefault();go(filtered[active]);}
  });

  if(!matchMedia('(prefers-reduced-motion: reduce)').matches && matchMedia('(pointer:fine)').matches){
    const glow=document.createElement('div');
    Object.assign(glow.style,{position:'fixed',width:'260px',height:'260px',borderRadius:'50%',pointerEvents:'none',zIndex:'0',background:'radial-gradient(circle, rgba(255,49,95,.12), transparent 68%)',transform:'translate(-50%,-50%)',opacity:'0',transition:'opacity .25s'});
    document.body.appendChild(glow);
    addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';glow.style.opacity='1';},{passive:true});
    addEventListener('pointerleave',()=>glow.style.opacity='0');
  }

  document.querySelectorAll('.page-section,.micro-grid article,.timeline article,.letter-slip,.question-deck article,.archive-values article,.home-volume-grid a').forEach(el=>{
    el.style.opacity='0';el.style.transform='translateY(18px)';
  });
  const io=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.style.transition='opacity .7s ease, transform .7s ease';en.target.style.opacity='1';en.target.style.transform='none';io.unobserve(en.target)}}),{threshold:.08});
  document.querySelectorAll('.page-section,.micro-grid article,.timeline article,.letter-slip,.question-deck article,.archive-values article,.home-volume-grid a').forEach(el=>io.observe(el));
  render();
})();