'use strict';
(() => {
 const filters=document.querySelector('#filters');
 const top=document.querySelector('#top');
 if(!filters||!top||!window.heroPosters)return;

 // The archive filters stay in the lower section; only the hero gets motion.
 filters.replaceChildren(...[
  ['all','全部 / All'],['电商','电商 / E-commerce'],['教育','教育 / Education'],['HMI','HMI'],
  ['品牌IP','品牌 IP / Brand & IP'],['AIGC','AIGC'],['独立开发','Vibe Coding']
 ].map(([cat,label])=>{
   const b=document.createElement('button');b.type='button';b.className='fbtn'+(cat==='all'?' on':'');b.dataset.cat=cat;b.textContent=label;b.setAttribute('aria-pressed',String(cat==='all'));return b;
 }));

 const entries=window.heroPosters;
 const heroRail=document.createElement('div');
 heroRail.className='hero-rail';
 heroRail.dataset.cardCount=String(entries.length);
 heroRail.setAttribute('aria-label','海报快览，点击单张放大 / Poster highlights; select one to enlarge');
 top.append(heroRail);

 const makeCard=page=>{
   const b=document.createElement('button');b.type='button';b.className='reel-card';
   b.setAttribute('aria-label',page.title+' / '+(page.english||'Poster')+'，放大查看 / Enlarge poster');
   const img=document.createElement('img');
   img.src=page.src;img.alt=page.title;img.draggable=false;img.loading='eager';img.decoding='async';
   img.style.objectPosition=page.position||'50% 50%';
   const art=document.createElement('span');art.className='reel-art';
   if(page.bg)art.style.background=page.bg;
   art.append(img);
   b.append(art);
   b.addEventListener('click',()=>lbOpen([page],0,page.title,'glimpse'));
   return b;
 };

 const viewport=document.createElement('div');viewport.className='reel-row';viewport.setAttribute('role','region');viewport.setAttribute('aria-roledescription','轮播 / carousel');viewport.setAttribute('aria-label','自动滚动的海报快览 / Auto-scrolling poster highlights');
 const track=document.createElement('div');track.className='reel-track';
 const first=document.createElement('div');first.className='reel-group';
 entries.forEach(page=>first.append(makeCard(page)));
 track.append(first);viewport.append(track);heroRail.append(viewport);

 const travel=()=>Math.max(0,first.offsetWidth-viewport.clientWidth+parseFloat(getComputedStyle(viewport).paddingLeft)+parseFloat(getComputedStyle(viewport).paddingRight));

 const state={x:0,drag:null,suppress:false,direction:1};
 const render=()=>{track.style.transform='translate3d('+(-state.x).toFixed(2)+'px,0,0)';};
 viewport.addEventListener('pointerdown',e=>{
   if(e.button!==0||!e.isPrimary)return;
   state.drag={x:e.clientX,y:e.clientY,scroll:state.x,id:e.pointerId,moved:false};state.suppress=false;
 });
 viewport.addEventListener('pointermove',e=>{
   const d=state.drag;if(!d||d.id!==e.pointerId)return;
   const dx=e.clientX-d.x,dy=e.clientY-d.y;
   if(!d.moved&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(dy)){d.moved=true;viewport.setPointerCapture(e.pointerId);}
   if(d.moved){
     const width=travel();
     state.x=width?Math.max(0,Math.min(width,d.scroll-dx)):d.scroll-dx;
     render();state.suppress=true;
   }
 });
 const release=()=>{state.drag=null;};
 viewport.addEventListener('pointerup',release);viewport.addEventListener('pointercancel',release);viewport.addEventListener('lostpointercapture',release);
 viewport.addEventListener('click',e=>{if(state.suppress){e.preventDefault();e.stopPropagation();state.suppress=false;}},true);
 viewport.addEventListener('dragstart',e=>e.preventDefault());
 viewport.addEventListener('wheel',e=>{
   if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){
     e.preventDefault();
     const width=travel();
     if(width){state.x=Math.max(0,Math.min(width,state.x+e.deltaX));render();}
   }
 },{passive:false});

 document.body.classList.add('portrait-ready');
 let last=0;
 function frame(now){
   const dt=Math.min(now-last||16,40);last=now;
   const width=travel();
   if(width&&!state.drag&&!document.hidden){
     state.x=Math.min(state.x,width);
     state.x+=dt*.07*state.direction;
     if(state.x>=width){state.x=width;state.direction=-1;}
     if(state.x<=0){state.x=0;state.direction=1;}
     render();
   }
   requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
})();
