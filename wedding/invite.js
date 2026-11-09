(()=>{'use strict';
if(window.__inviteStarted)return;window.__inviteStarted=true;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CFG_KEY='wedding-invite-config-v2',POST_KEY='wedding-invite-share-v2';
const PUBLIC_URL=location.origin+location.pathname;
const editing=!!window.__FORCE_EDIT__||/\/edit\/?$/.test(location.pathname)||/[#&]edit/i.test(location.hash);
let cfg,layers=[],dirty=false,preview=false,selected=null,busy=false,loaded=false;
const originals=new Map($$('.layer').map(el=>[el.dataset.layer,el.innerHTML]));
let toastTimer;function toast(t){$('#toast').textContent=t;$('#toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').style.display='none',4200)}

/* ---------- 本机媒体库（IndexedDB） ---------- */
const DB_NAME='wedding-invite-media';
function openDB(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains('files'))r.result.createObjectStore('files')};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idbSet(key,blob){const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction('files','readwrite');tx.objectStore('files').put(blob,key);tx.oncomplete=()=>res(key);tx.onerror=()=>rej(tx.error)})}
async function idbGet(key){const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction('files','readonly');const rq=tx.objectStore('files').get(key);rq.onsuccess=()=>res(rq.result);rq.onerror=()=>rej(rq.error)})}
const urlCache=new Map();
const isLocal=s=>typeof s==='string'&&s.startsWith('idb:');
const resolveSrc=s=>isLocal(s)?(urlCache.get(s)||s):s;
async function hydrate(){
  const refs=new Set();
  for(const v of Object.values(cfg.images||{}))if(isLocal(v.src))refs.add(v.src);
  if(isLocal(cfg.music))refs.add(cfg.music);
  for(const ref of refs){if(urlCache.has(ref))continue;try{const b=await idbGet(ref.slice(4));if(b)urlCache.set(ref,URL.createObjectURL(b))}catch{}}
}
async function mediaDataURL(ref){
  let b=null;
  try{b=await idbGet(ref.slice(4))}catch{}
  if(!b)return '';
  return await new Promise(res=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=()=>res('');fr.readAsDataURL(b)});
}

/* ---------- 配置读写 ---------- */
function clone(o){return JSON.parse(JSON.stringify(o))}
function loadCfg(){
  try{const raw=localStorage.getItem(CFG_KEY);if(raw)return Object.assign(clone(window.__INVITE_DEFAULT__||{}),JSON.parse(raw))}catch{}
  return clone(window.__INVITE_DEFAULT__||{})
}
function persist(){try{localStorage.setItem(CFG_KEY,JSON.stringify(cfg));return true}catch(e){toast('本机存储空间不足，请减少上传的图片或音乐');return false}}

/* ---------- 渲染 ---------- */
function baseText(id,text){const el=$(`[data-layer="${id}"] .text-editor`);if(el)el.textContent=text}
function apply(){
 for(const [id,html] of originals){const el=$(`[data-layer="${id}"]`);if(el&&['text','image'].some(t=>el.classList.contains('layer-'+t)))el.innerHTML=html}
 baseText('copy-1721365169774',cfg.groom);baseText('copy-1721360394649',cfg.bride);
 const raw=cfg.date||'2027-05-20T18:00';const v=raw.split('T'),date=v[0].split('-'),d=new Date(v[0]+'T12:00:00+08:00');
 baseText('copy-1705560167410',date[1]+'/'+date[2]);baseText('copy-1705635629577',date.join('/'));baseText('copy-1705643395600',`${date[0]}年${Number(date[1])}月${Number(date[2])}日 星期${'日一二三四五六'[d.getUTCDay()]}\n${v[1]||''} 婚礼仪式`);baseText('copy-1705648973286',cfg.venue);
 for(const [id,val] of Object.entries(cfg.texts||{})){const el=$(`[data-layer="${id}"] .text-editor`);if(!el)continue;el.textContent=val.text;el.style.fontSize=(parseFloat(el.style.fontSize)*val.scale)+'rem'}
 for(const [id,val] of Object.entries(cfg.images||{})){const wrap=$(`[data-layer="${id}"] .img-wrap`);if(!wrap)continue;if(val.caption){wrap.innerHTML='<div class="caption-replacement"></div>';wrap.firstChild.textContent=val.caption}else{const im=wrap.querySelector('img');if(!im)continue;im.src=resolveSrc(val.src);im.style.cssText=`opacity:1;width:100%;height:100%;left:0;top:0;object-fit:${val.fit};object-position:${val.x}% ${val.y}%`}}
 const dn=$('#demo-note');if(dn)dn.hidden=!cfg.demo;
 const mb=$('#map-button');if(mb){const mi=mb.querySelector('img');if(mi)mi.hidden=!!cfg.address;const ms=mb.querySelector('span');if(ms)ms.textContent=cfg.address?'查看婚礼导航 ↗':'位置示意图 · 地址待填写'}
 document.title=cfg.title;$('.page-title').textContent=cfg.title;countdown();
}
function countdown(){if(!cfg)return;let n=Math.max(0,Math.floor((new Date(cfg.date+'+08:00')-Date.now())/1000));const vals=[Math.floor(n/86400),Math.floor(n/3600)%24,Math.floor(n/60)%60,n%60];vals.forEach((v,i)=>{const el=$('#cd-'+i);if(el)el.textContent=String(v).padStart(2,'0')})}
function changed(){dirty=true;apply();status()}
function status(){const el=$('#save-state');if(el)el.textContent=busy?'正在保存…':dirty?'有未保存的修改':'已保存在本机'}
function jump(top){window.scrollTo({top:top*parseFloat(getComputedStyle(document.documentElement).fontSize)+$('.page-title').offsetHeight+(editing?118:0)-110,behavior:'smooth'})}
$$('[data-jump]').forEach(el=>el.onclick=()=>jump(Number(el.dataset.jump)));
$$('[data-contact]').forEach(el=>el.onclick=()=>{if(!cfg)return;const tel=cfg[el.dataset.contact+'Phone'];if(!tel)return toast('新人尚未填写联系电话');location.href='tel:'+tel.replace(/[^+\d]/g,'')});
$('#map-button').onclick=()=>{if(!cfg?.address)return toast('这是位置示意图，具体地址待新人填写');const link='https://www.amap.com/search?query='+encodeURIComponent(cfg.address);window.open(link,'_blank','noopener')};
async function copy(text){
  try{await navigator.clipboard.writeText(text);return true}catch{}
  try{const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok}catch{return false}
}

/* ---------- 分享 ---------- */
$('#share').onclick=async()=>{
  const url=PUBLIC_URL;
  try{if(navigator.share)await navigator.share({title:cfg?.title||'婚礼请柬',url});else{const ok=await copy(url);toast(ok?'请柬链接已复制，可发给亲友':'请长按地址栏复制链接')}}
  catch(e){if(e.name!=='AbortError')toast('已取消分享')}
};

/* ---------- 回执（静态版：生成回执发回新人） ---------- */
$('#rsvp').onsubmit=async e=>{
  e.preventDefault();
  if(!loaded)return toast('请柬还在加载，请稍后重试');
  if(editing)return toast('编辑模式不提交回执，请从公开链接填写');
  const nameEl=$('#guest-name'),countEl=$('#guest-count'),btn=$('#rsvp-submit');
  const name=(nameEl?.value||'').trim(),count=Number(countEl?.value);
  if(!name)return toast('请填写你的姓名');
  if(!Number.isInteger(count)||count<1||count>20)return toast('请填写 1–20 位出席人数');
  const text=`【赴约回执】\n姓名：${name}\n出席人数：${count} 位\n婚礼：${cfg.groom} & ${cfg.bride}\n时间：${(cfg.date||'').replace('T',' ')}\n地点：${cfg.venue}${cfg.address?'（'+cfg.address+'）':''}`;
  try{localStorage.setItem(POST_KEY,JSON.stringify({name,count,at:Date.now()}))}catch{}
  let done=false;
  try{if(navigator.share){await navigator.share({title:'赴约回执',text});done=true}}
  catch(err){if(err.name==='AbortError')return}
  if(!done)done=await copy(text);
  if(btn){btn.textContent='回执已生成'}
  const st=$('#rsvp-status');if(st)st.textContent='回执已生成，发送给新人即可';
  toast(done?'回执已生成，粘贴发给新人即可':'回执已生成，请手动发送给新人');
};

/* ---------- 音乐 ---------- */
let ac,musicTimer,audio,playing=false,note=0;const notes=[261.63,329.63,392,523.25,392,329.63,293.66,392,440,587.33,440,392,220,329.63,440,523.25,440,329.63,246.94,293.66,392,493.88,392,293.66];
function tone(){if(!ac)return;const osc=ac.createOscillator(),g=ac.createGain();osc.type='sine';osc.frequency.value=notes[note++%notes.length];g.gain.setValueAtTime(0,ac.currentTime);g.gain.linearRampToValueAtTime(.045,ac.currentTime+.025);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+1.6);osc.connect(g);g.connect(ac.destination);osc.start();osc.stop(ac.currentTime+1.7)}
$('#music').onclick=async()=>{try{if(playing){audio?.pause();clearInterval(musicTimer);await ac?.suspend();playing=false}else{if(cfg?.music){audio??=new Audio();const src=resolveSrc(cfg.music);if(audio.src!==new URL(src,location.href).href)audio.src=src;audio.loop=true;await audio.play()}else{ac??=new(window.AudioContext||window.webkitAudioContext)();await ac.resume();tone();musicTimer=setInterval(tone,450)}playing=true}$('#music').classList.toggle('playing',playing);$('#music').setAttribute('aria-label',playing?'暂停音乐':'播放轻音乐')}catch{toast('暂时无法播放音乐，请再点一次')}};

/* ---------- 灯箱 ---------- */
$('#lightbox button').onclick=()=>$('#lightbox').close();$('#lightbox').onclick=e=>{if(e.target===$('#lightbox'))$('#lightbox').close()};
$('#scene').addEventListener('click',e=>{const layer=e.target.closest('.layer');if(!layer)return;if(editing&&!preview){const item=layers.find(x=>x.id===layer.dataset.layer);if(item){e.preventDefault();editItem(item)}return}if(layer.classList.contains('layer-image')){const im=layer.querySelector('img');if(im){$('#lightbox img').src=im.src;$('#lightbox').showModal()}}});

/* ---------- 编辑器 ---------- */
function panel(title,html){$('#edit-panel')?.remove();const el=document.createElement('section');el.className='edit-panel';el.id='edit-panel';el.innerHTML=`<div class="panel-head"><h2>${esc(title)}</h2><button id="panel-close" aria-label="关闭面板">×</button></div>${html}`;$('#editor-root').appendChild(el);$('#panel-close').onclick=()=>el.remove();return el}
function buildEditor(){
 document.body.classList.add('edit-mode','editing');
 $('#editor-root').innerHTML=`<div class="editor-bar"><div class="bar-row"><div class="editor-brand">编辑你的请柬<span class="save-state" id="save-state">已保存在本机</span></div><button id="preview">预览</button><button class="primary" id="save">保存</button></div><div class="editor-tabs"><button id="photos">图片</button><button id="texts">文案</button><button id="details">婚礼信息</button><button id="publish">发布</button></div></div><div class="select-hint">点选图片或文字即可修改 · 改完点「保存」</div>`;
 $('#photos').onclick=()=>list('image');$('#texts').onclick=()=>list('text');$('#details').onclick=details;$('#publish').onclick=publish;
 $('#preview').onclick=()=>{preview=!preview;document.body.classList.toggle('editing',!preview);document.body.classList.toggle('edit-preview',preview);$('#preview').textContent=preview?'继续编辑':'预览';$('#edit-panel')?.remove()};
 $('#save').onclick=save;
 status();
}
async function save(){
  if(busy)return;busy=true;$('#save').disabled=true;status();
  const ok=persist();
  dirty=!ok;busy=false;$('#save').disabled=false;status();
  if(ok)toast('已保存到本机浏览器；要发给亲友请用「发布」生成新版本');
}
function list(type){
  selected=null;$$('.selected').forEach(x=>x.classList.remove('selected'));
  const sections=[...new Set(layers.filter(x=>x.type===type).map(x=>x.section))];
  panel(type==='image'?'替换图片':'修改文案',`<p>选择一个内容，也可以关闭面板后直接点页面。</p><select id="section-filter" aria-label="选择段落"><option value="">全部段落</option>${sections.map(s=>`<option>${esc(s)}</option>`).join('')}</select><div class="layer-list ${type==='text'?'text-list':''}" id="layer-list"></div>`);
  const render=()=>{
    $('#layer-list').innerHTML=layers.filter(x=>x.type===type&&(!$('#section-filter').value||x.section===$('#section-filter').value)).map((x,i)=>`<button data-select="${x.id}">${type==='image'?`<img src="${esc(resolveSrc(cfg.images[x.id]?.src||x.src))}" loading="lazy" alt="${esc(x.section)}图片">`:''}<span>${esc(x.section+' · '+(type==='text'?(cfg.texts[x.id]?.text||x.text).split('\n')[0]:'图片 '+(i+1)))}</span></button>`).join('');
    $$('[data-select]').forEach(b=>b.onclick=()=>{const x=layers.find(x=>x.id===b.dataset.select);jump(x.top);editItem(x)});
  };
  $('#section-filter').onchange=render;render();
}
async function upload(file,isAudio=false){
  if(!file)throw new Error('请选择文件');
  let blob=file;
  if(!isAudio){
    if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('请选择 JPG、PNG 或 WebP 图片');
    const url=URL.createObjectURL(file);
    try{
      const im=new Image();im.src=url;await im.decode();
      const scale=Math.min(1,2000/im.width,2000/im.height);
      const c=document.createElement('canvas');c.width=Math.round(im.width*scale);c.height=Math.round(im.height*scale);
      c.getContext('2d').drawImage(im,0,0,c.width,c.height);
      blob=await new Promise(r=>c.toBlob(r,file.type==='image/png'?'image/png':'image/jpeg',.88));
    }finally{URL.revokeObjectURL(url)}
  }else if(blob.size>12*1024*1024)throw new Error('音乐请控制在 12MB 以内');
  if(!blob)throw new Error('无法读取文件');
  const key='m'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
  await idbSet(key,blob);
  const ref='idb:'+key;
  urlCache.set(ref,URL.createObjectURL(blob));
  return ref;
}
function editItem(item){
  selected=item;$$('.selected').forEach(x=>x.classList.remove('selected'));$(`[data-layer="${item.id}"]`)?.classList.add('selected');
  if(item.type==='text'){
    const live=$(`[data-layer="${item.id}"] .text-editor`);const val=cfg.texts[item.id]||{text:live?.textContent||item.text,scale:1};
    panel(item.section+' · 文案',`<label for="text-value">内容（可换行）</label><textarea id="text-value" maxlength="500">${esc(val.text)}</textarea><label for="text-scale">字号大小</label><input id="text-scale" type="range" min=".5" max="1.5" step=".05" value="${val.scale}"><p>建议保持与原文相近的长度，避免与下方图片重叠。</p><div class="actions"><button id="restore">恢复这一项</button><button class="primary" id="done">完成</button></div>`);
    const upd=()=>{cfg.texts[item.id]={text:$('#text-value').value,scale:Number($('#text-scale').value)};changed()};
    $('#text-value').oninput=upd;$('#text-scale').oninput=upd;
    $('#restore').onclick=()=>{delete cfg.texts[item.id];changed();editItem(item)};
  }else{
    const v=cfg.images[item.id]||{src:item.src,fit:'cover',x:50,y:50,caption:''};
    panel(item.section+' · 图片',`<img class="image-preview" id="image-preview" src="${esc(resolveSrc(v.src))}" alt="当前图片"><label for="image-file">从手机相册选择</label><input id="image-file" type="file" accept="image/jpeg,image/png,image/webp"><p id="upload-state">人物抠图建议使用透明 PNG，保留原有拼贴效果。</p><div class="fields"><div><label for="image-fit">显示方式</label><select id="image-fit"><option value="cover" ${v.fit==='cover'?'selected':''}>铺满裁切</option><option value="contain" ${v.fit==='contain'?'selected':''}>显示完整</option></select></div><div><label for="image-x">左右位置</label><input id="image-x" type="range" min="0" max="100" value="${v.x}"></div><div class="span2"><label for="image-y">上下位置</label><input id="image-y" type="range" min="0" max="100" value="${v.y}"></div></div><details><summary>这张图是手写标题？可以改为文字</summary><label for="image-caption">填写后以文字替代图片；清空则显示图片</label><textarea id="image-caption" maxlength="150">${esc(v.caption)}</textarea></details><div class="actions"><button id="restore">恢复原图</button><button class="primary" id="done">完成</button></div>`);
    const upd=()=>{cfg.images[item.id]={...v,fit:$('#image-fit').value,x:Number($('#image-x').value),y:Number($('#image-y').value),caption:$('#image-caption').value};changed()};
    ['image-fit','image-x','image-y','image-caption'].forEach(id=>$('#'+id).oninput=upd);
    $('#image-file').onchange=async e=>{
      const file=e.target.files[0];if(!file)return;
      e.target.disabled=true;$('#upload-state').textContent='正在处理…';
      try{v.src=await upload(file);v.caption='';$('#image-caption').value='';$('#image-preview').src=resolveSrc(v.src);upd();$('#upload-state').textContent='已替换，记得点「保存」'}catch(err){$('#upload-state').textContent=err.message;toast(err.message)}finally{e.target.disabled=false}
    };
    $('#restore').onclick=()=>{delete cfg.images[item.id];changed();editItem(item)};
  }
  $('#done').onclick=()=>$('#edit-panel').remove();
}
function details(){
  const fields=[['title','请柬标题','text'],['groom','新郎姓名','text'],['bride','新娘姓名','text'],['date','婚礼时间（北京时间）','datetime-local'],['venue','场地名称','text'],['address','详细地址（用于导航）','text'],['groomPhone','新郎电话','tel'],['bridePhone','新娘电话','tel']];
  panel('婚礼信息',`<p>姓名和日期会同步更新到请柬对应位置。</p><div class="fields">${fields.map(([id,label,type])=>`<div class="${['title','date','venue','address'].includes(id)?'span2':''}"><label for="field-${id}">${label}</label><input id="field-${id}" type="${type}" value="${esc(cfg[id]||'')}" maxlength="180"></div>`).join('')}</div><label class="check-label"><input id="field-demo" type="checkbox" ${cfg.demo?'checked':''}>显示「参考示例」提示</label><label for="music-file">上传背景音乐（MP3，12 MB 以内）</label><input id="music-file" type="file" accept="audio/mpeg,.mp3"><p id="music-status">${cfg.music?'已上传自选音乐':'默认播放轻柔纯音乐'}</p><button id="music-reset">恢复默认音乐</button><div class="actions"><button class="primary" id="done">完成</button></div>`);
  const map={groom:['copy-1721365169774'],bride:['copy-1721360394649'],date:['copy-1705560167410','copy-1705635629577','copy-1705643395600'],venue:['copy-1705648973286']};
  fields.forEach(([id])=>$('#field-'+id).oninput=e=>{if(id==='date'&&!e.target.value)return;cfg[id]=e.target.value;(map[id]||[]).forEach(k=>delete cfg.texts[k]);changed()});
  $('#field-demo').onchange=e=>{cfg.demo=e.target.checked;changed()};
  $('#music-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;e.target.disabled=true;$('#music-status').textContent='正在处理音乐…';try{cfg.music=await upload(f,true);changed();$('#music-status').textContent='音乐已替换，记得点「保存」'}catch(err){$('#music-status').textContent=err.message}finally{e.target.disabled=false}};
  $('#music-reset').onclick=()=>{cfg.music='';changed();$('#music-status').textContent='已恢复默认音乐'};
  $('#done').onclick=()=>$('#edit-panel').remove();
}

/* ---------- 发布：分享链接 / 导出网页 ---------- */
function b64url(bytes){let s='';for(let i=0;i<bytes.length;i+=0x8000)s+=String.fromCharCode.apply(null,bytes.subarray(i,i+0x8000));return btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
function unb64url(str){const s=str.replace(/-/g,'+').replace(/_/g,'/');const bin=atob(s.padEnd(Math.ceil(s.length/4)*4,'='));const out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out}
async function pack(obj){
  const data=new TextEncoder().encode(JSON.stringify(obj));
  if(!window.CompressionStream)return b64url(data);
  const cs=new CompressionStream('deflate-raw');
  const w=cs.writable.getWriter();w.write(data);w.close();
  const buf=new Uint8Array(await new Response(cs.readable).arrayBuffer());
  return 'z'+b64url(buf);
}
async function unpack(str){
  const raw=str[0]==='z'?str.slice(1):str;
  const bytes=unb64url(raw);
  if(str[0]!=='z'||!window.DecompressionStream)return JSON.parse(new TextDecoder().decode(bytes));
  const ds=new DecompressionStream('deflate-raw');
  const w=ds.writable.getWriter();w.write(bytes);w.close();
  return JSON.parse(new TextDecoder().decode(await new Response(ds.readable).arrayBuffer()));
}
function hasLocalMedia(){return Object.values(cfg.images||{}).some(v=>isLocal(v.src))||isLocal(cfg.music)}
function downloadBlob(blob,name){
  const a=document.createElement('a');const url=URL.createObjectURL(blob);
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),8000);
}
async function exportHtml(){
  const snap=clone(cfg);
  for(const v of Object.values(snap.images||{})){if(isLocal(v.src)){const d=await mediaDataURL(v.src);if(d)v.src=d}}
  if(isLocal(snap.music)){const d=await mediaDataURL(snap.music);snap.music=d||''}
  const res=await fetch('index.html',{cache:'no-store'});
  if(!res.ok)throw new Error('读取页面失败，请确认站点文件完整');
  let html=await res.text();
  const inline='<script>window.__INVITE_DEFAULT__ = '+JSON.stringify(snap).replace(/</g,'\\u003c')+';<\/script>';
  if(!/<script src="config\.js"><\/script>/.test(html))throw new Error('页面结构已变化，无法导出');
  html=html.replace(/<script src="config\.js"><\/script>/,inline);
  downloadBlob(new Blob([html],{type:'text/html;charset=utf-8'}),'婚礼请柬-定制版.html');
}
function publish(){
  panel('发布','<p>纯静态托管没有服务器，改完内容保存在这台设备上。要让亲友也看到更新，用下面任一方式。</p>'+
  '<h3>方式一：生成分享链接</h3><p>把当前版本打包进链接，亲友打开就是你的最新内容。仅适用于使用原站图片的情况。</p><button class="primary" id="make-link">生成分享链接</button>'+
  '<h3>方式二：导出定制网页</h3><p>导出一个包含全部修改（含新上传图片与音乐）的 HTML 文件，替换站点文件即对所有人生效。</p><button id="export">导出定制网页</button>'+
  '<h3>方式三：清空本机修改</h3><p>恢复到站点默认内容。</p><button id="reset">恢复默认内容</button>'+
  '<div id="publish-out"></div>');
  $('#make-link').onclick=async()=>{
    if(hasLocalMedia())return toast('有新上传的图片或音乐，请改用「导出定制网页」');
    try{
      const code=await pack(cfg);
      const url=PUBLIC_URL+'?c='+code;
      const ok=await copy(url);
      $('#publish-out').innerHTML=`<label for="share-url">分享链接（${url.length} 字符）</label><textarea id="share-url" readonly>${esc(url)}</textarea><p>${ok?'已复制到剪贴板':'请长按上方链接复制'}，发到微信或短信即可。</p>`;
    }catch(e){toast('生成失败：'+e.message)}
  };
  $('#export').onclick=async e=>{
    e.target.disabled=true;e.target.textContent='正在打包…';
    try{await exportHtml();toast('已导出，把文件交给站点管理员替换即可')}
    catch(err){toast(err.message)}
    finally{e.target.disabled=false;e.target.textContent='导出定制网页'}
  };
  $('#reset').onclick=()=>{
    if(!confirm('清空本机所有修改，恢复到站点默认内容？'))return;
    localStorage.removeItem(CFG_KEY);
    cfg=clone(window.__INVITE_DEFAULT__||{});dirty=false;apply();status();
    $('#edit-panel')?.remove();toast('已恢复默认内容');
  };
}

/* ---------- 启动 ---------- */
window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});
async function start(){
  try{
    cfg=loadCfg();
    if(cfg.texts==null)cfg.texts={};if(cfg.images==null)cfg.images={};
    const q=new URLSearchParams(location.search).get('c');
    if(q&&!editing){try{const shared=await unpack(q);cfg=Object.assign(clone(window.__INVITE_DEFAULT__||{}),shared)}catch{toast('分享链接已损坏，显示默认请柬')}}
    await hydrate();
    loaded=true;apply();setInterval(countdown,1000);
    if(editing){
      try{
        const r=await fetch('layers.json',{cache:'no-store'});
        layers=r.ok?await r.json():[];
        if(!Array.isArray(layers)||!layers.length)throw new Error('图层数据缺失');
      }catch(e){
        $('#editor-root').innerHTML=`<div class="editor-login"><div><h2>你的请柬工作室</h2><p>${esc(e.message||'编辑资源未能加载')}</p><p>请确认站点根目录下的 layers.json 完整。</p><a href="/">返回请柬</a></div></div>`;return;
      }
      buildEditor();
    }
  }catch(e){
    if(editing){$('#editor-root').innerHTML=`<div class="editor-login"><div><h2>你的请柬工作室</h2><p>${esc(e.message||'加载失败')}</p><a href="/">返回请柬</a></div></div>`}
    else toast('暂时未能读取内容，请刷新重试');
  }
}
start();
})();
