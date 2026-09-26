(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer:fine)').matches;

  const cursor = document.createElement('div');
  cursor.className = 'archive-cursor';
  cursor.setAttribute('aria-hidden','true');
  document.body.appendChild(cursor);
  if (fine && !reduced) {
    document.body.classList.add('archive-pointer');
    addEventListener('pointermove', e => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }, {passive:true});
  }

  const status = document.createElement('div');
  status.className = 'archive-now';
  status.innerHTML = '<i></i><span>ARCHIVE / LIVE</span>';
  document.body.appendChild(status);

  const chapter = document.createElement('div');
  chapter.className = 'archive-chapter-label';
  chapter.textContent = '00 / HEART INDEX';
  document.body.appendChild(chapter);

  const chapters = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      const hit = entries.filter(x => x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (!hit) return;
      const name = hit.target.id.replace(/-/g,' ').toUpperCase();
      const index = String(Math.max(0, chapters.indexOf(hit.target))).padStart(2,'0');
      chapter.textContent = `${index} / ${name}`;
      history.replaceState(null,'',`#${hit.target.id}`);
    }, {rootMargin:'-30% 0px -55%',threshold:[0,.2,.5]});
    chapters.forEach(x=>io.observe(x));
  }

  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'r' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) {
      const target = chapters[Math.floor(Math.random()*chapters.length)];
      target?.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    }
  });
})();
