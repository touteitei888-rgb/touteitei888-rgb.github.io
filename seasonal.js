'use strict';
(()=>{
 document.body.classList.add('seasonal-site');
 const profile=document.querySelector('.hero-profile'),about=document.querySelector('#about'),letter=about.querySelector('.letter');
 const layout=document.createElement('div');layout.className='about-layout';about.append(layout);layout.append(profile,letter);profile.classList.remove('rv');profile.classList.add('in');
 document.body.insertBefore(about,document.querySelector('#works'));
 const old=document.querySelector('#top .hero-bio');old.hidden=true;
 document.querySelectorAll('#preview-btn,#m-preview-btn').forEach(b=>b.hidden=true);
 const mark=document.querySelector('.logo-mark');
 const avatar=document.createElement('img');avatar.src='assets/seasons/nav-girl.png';avatar.alt='';avatar.width=36;avatar.height=36;mark.replaceChildren(avatar);
 const scenes=[...document.querySelectorAll('.season-scene')],hero=document.querySelector('#top');
 const touchMode=matchMedia('(hover: none)').matches;
 let current=0,timer,inside=false;
 function choose(index){const scene=scenes[index];if(!scene.complete||!scene.naturalWidth)return;current=index;scenes.forEach((im,i)=>im.classList.toggle('active',i===index));document.body.dataset.season=['spring','summer','autumn','winter'][index];}
 function stop(){clearInterval(timer);timer=null;}
 function start(){stop();timer=setInterval(()=>{if(!document.hidden)choose((current+1)%4);},5500);}
 hero.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;inside=true;choose((current+1)%4);start();});
 hero.addEventListener('pointerleave',()=>{inside=false;if(!touchMode)stop();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(inside||touchMode)start();});
 if(touchMode)start();
})();
