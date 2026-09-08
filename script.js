'use strict';
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 入场动画 */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .1 });
$$('.rv').forEach(el => io.observe(el));

/* 导航高亮 */
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) {
    $$('#nav a.nl').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }
}), { rootMargin: '-40% 0px -55% 0px' });
['top', 'works', 'about', 'timeline', 'contact'].forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });

/* 移动端菜单 */
const menuBtn = $('#menu-btn'), menuPanel = $('#menu-panel');
if (menuBtn) menuBtn.addEventListener('click', () => menuPanel.classList.toggle('open'));
$$('#menu-panel a').forEach(a => a.addEventListener('click', () => menuPanel.classList.remove('open')));

/* 作品分类：把旧项目标签收拢为首页的八个主类别 */
const categoryBySlug = {
  '易店园电商_App': '电商',
  '云舍风土小程序': '酒店',
  '熙康云舍__品牌简介PPT': '品牌IP',
  '百利天下教育': '教育',
  '智行汽车__智能座舱': 'HMI',
  '山海经__五神归位': 'AIGC',
  'AIGC_视觉与商业海报': 'AIGC',
  '睿康口腔__卡皮巴拉_IP': '品牌IP',
  '卡皮巴拉_BALA_IP': '品牌IP',
  'Slow_Club_IP': '品牌IP',
  '雨林营地__自然研学': '酒店',
  '睿康康养__养老与家庭健康': '品牌IP',
  '白马山__商业文旅视觉': '酒店',
  '睿新健康__节气与节日海报': '海报',
  '直播切片__沈阳优选酱': '海报',
  '睿新健康_App__直播与健康管理': '独立开发',
  'Vibe_Coding_小产品': '独立开发'
};
$$('#worksGrid .work').forEach(card => {
  const cat = categoryBySlug[card.dataset.slug] || card.dataset.cat;
  card.dataset.cat = cat;
  const catEl = card.querySelector('.meta .cat');
  if (catEl) catEl.textContent = cat;
  const coverSrc = card.querySelector('.cover-img')?.getAttribute('src');
  if (coverSrc) {
    try {
      const gallery = JSON.parse(card.dataset.gallery || '[]');
      const coverIndex = gallery.indexOf(coverSrc);
      if (coverIndex > 0) {
        gallery.unshift(...gallery.splice(coverIndex, 1));
        card.dataset.gallery = JSON.stringify(gallery);
      }
    } catch (e) {}
  }
});

/* 作品分类筛选 */
const filters = $('#filters');
if (filters) {
  filters.addEventListener('click', e => {
    const btn = e.target.closest('.fbtn');
    if (!btn) return;
    $$('.fbtn').forEach(b => {b.classList.toggle('on', b === btn);b.setAttribute('aria-pressed',String(b===btn));});
    const cat = btn.dataset.cat;
    $$('#worksGrid .work').forEach(w => {
      const show = cat === 'all' || w.dataset.cat === cat;
      w.classList.toggle('hide', !show);
    });
    const vibeCollection=$('#vibeCollection');
    if(vibeCollection)vibeCollection.hidden=cat!=='all'&&cat!=='独立开发';
    $('#worksGrid').hidden=cat==='独立开发';
  });
}

/* 提示条 */
function toast(msg) {
  const t = $('#toast'); if (!t) return;
  t.textContent = msg; t.classList.add('show');
  clearTimeout(window.__tt); window.__tt = setTimeout(() => t.classList.remove('show'), 2200);
}

/* 复制 */
function copyText(v, label) {
  const done = () => toast(label + ' 已复制：' + v);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(v).then(done).catch(() => toast(label + '：' + v));
  } else { toast(label + '：' + v); }
}
const wx = $('#wx-btn'), tel = $('#tel-btn');
if (wx) wx.addEventListener('click', function () { copyText(this.dataset.copy, '微信'); });
if (tel) tel.addEventListener('click', function () { copyText(this.dataset.copy, '电话'); });

/* 纸屑礼花 */
const confColors = ['#c9402c', '#d9a05b', '#45b9ad', '#ed719e', '#b7a6d6', '#2b4a75'];
function burst(x, y, n) {
  if (reduceMotion) return;
  for (let i = 0; i < (n || 16); i++) {
    const c = document.createElement('div');
    c.className = 'conf';
    const s = 6 + Math.random() * 10;
    c.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + s + 'px;height:' + (s * 1.35) + 'px;background:' + confColors[Math.random() * confColors.length | 0] + ';transform:rotate(' + (Math.random() * 90 - 45) + 'deg)';
    document.body.appendChild(c);
    const dx = Math.random() * 220 - 110, dy = -(40 + Math.random() * 90), rot = (Math.random() * 540 - 270) | 0;
    const a = c.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: 'translate(' + (dx * .7) + 'px,' + dy + 'px) rotate(' + (rot * .6) + 'deg)', opacity: 1, offset: .45 },
      { transform: 'translate(' + dx + 'px,' + (dy + 190) + 'px) rotate(' + rot + 'deg)', opacity: 0 }
    ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.6,.3,1)' });
    a.onfinish = () => c.remove();
  }
}

/* Hero IP 彩蛋：点击跳一下 + 随机语录 + 纸屑 */
const heroArt = $('#hero-art');
const ipImg = $('#ipImg');
const ipBubble = $('#ipBubble');
const quotes = [
  '嗨，我是婷婷 ✦',
  '手要软，标准要硬。',
  '设计师的浪漫，是把复杂变简单。',
  '一万小时，从不相信天上掉馅饼。',
  '温和，但较真。',
  '自由又自律，才扛得起更多。',
  '把 AI 接进工作流，爽。',
  '你点的每一项，都是我剪出来的时间。',
  '今天也要认真活着呀。'
];
if (heroArt && ipImg) {
  heroArt.addEventListener('click', e => {
    ipImg.classList.remove('ip-hop'); void ipImg.offsetWidth; ipImg.classList.add('ip-hop');
    if (ipBubble) {
      ipBubble.textContent = quotes[Math.random() * quotes.length | 0];
      ipBubble.classList.add('is-show');
      clearTimeout(window.__bubble); window.__bubble = setTimeout(() => ipBubble.classList.remove('is-show'), 1800);
    }
    burst(e.clientX, e.clientY, 20);
  });

  /* 鼠标移动视差：形象随光标 3D 倾斜 */
  const heroFrame = heroArt.querySelector('.frame');
  if (heroFrame && !reduceMotion) {
    heroArt.addEventListener('mousemove', e => {
      const r = heroArt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      heroFrame.style.setProperty('--ry', (px * 16).toFixed(2) + 'deg');
      heroFrame.style.setProperty('--rx', (-py * 16).toFixed(2) + 'deg');
    });
    heroArt.addEventListener('mouseleave', () => {
      heroFrame.style.setProperty('--ry', '0deg');
      heroFrame.style.setProperty('--rx', '0deg');
    });
  }
}

/* 全局点击彩蛋：任意位置点击出现小彩带 */
if (!reduceMotion) {
  let lastBurst = 0;
  document.addEventListener('click', e => {
    const now = Date.now();
    if (now - lastBurst < 160) return;
    lastBurst = now;
    burst(e.clientX, e.clientY, 10);
  });
}

/* 鼠标移动光点（跟随光标的小纸光） */
const glow = document.createElement('div');
glow.id = 'cursorGlow';
document.body.appendChild(glow);
if (!reduceMotion && matchMedia('(pointer:fine)').matches) {
  let gx = 0, gy = 0, tx = 0, ty = 0, raf = 0;
  addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; glow.classList.add('on'); if (!raf) loop(); });
  addEventListener('mouseleave', () => glow.classList.remove('on'));
  function loop() {
    gx += (tx - gx) * 0.18; gy += (ty - gy) * 0.18;
    glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)';
    if (Math.abs(tx - gx) > 0.5 || Math.abs(ty - gy) > 0.5) raf = requestAnimationFrame(loop);
    else raf = 0;
  }
}

/* Lightbox */
const lb = $('#lb'), lbImg = $('#lbImg'), lbCount = $('#lbCount'), lbTitle = $('#lbTitle');
let lbList = [], lbIdx = 0;
let lbReturnFocus = null, lbOpenRequest = 0, lbWork = null, lbMode = 'full';
function lbRender() {
  const single=lbMode==='glimpse';
  const stage = $('.lb-stage'), zoom = $('.lb-zoom');
  stage.classList.remove('is-zoomed');
  stage.scrollTop = stage.scrollLeft = 0;
  const page = lbList[lbIdx];
  stage.classList.toggle('is-detail', !!page.detail);
  zoom.textContent = page.detail ? '完整画面 ↙' : '局部细节 ↗'; zoom.setAttribute('aria-pressed', String(!!page.detail));
  $('#lbError').hidden = true;
  lbImg.hidden = false;
  lbImg.onload = () => { lbSetClass(lbImg); stage.classList.toggle('is-wide',lbImg.naturalWidth>lbImg.naturalHeight); };
  lbImg.onerror = () => { lbImg.hidden = true; $('#lbError').hidden = false; };
  lbImg.alt = single ? lbTitle.textContent : lbTitle.textContent + ' · 第 ' + (lbIdx + 1) + ' 页';
  lbImg.src = page.src;lbImg.style.background=page.bg || lbWork?.bg || 'transparent';
  lbImg.draggable = false; lbImg.style.objectPosition = page.position || '50% 50%';
  $('#lbEnglish').textContent = lbWork?.english || 'SELECTED PROJECT';
  $('#lbPageTitle').textContent = page.title || '作品展示';
  $('#lbDescription').textContent = page.description || lbWork?.desc || '';
  $('#lbConcept').textContent = lbWork?.concept || (lbWork?.aiAssisted ? 'AI 辅助视觉概念 · 非商业委托' : '');
  lbCount.textContent = single ? '' : (lbIdx + 1) + ' / ' + lbList.length;
  $('.exhibit-label').textContent = single ? 'POSTER / VISUAL NOTES' : 'SELECTED WORK';
  $('.lb-stage').setAttribute('aria-label',single?'海报放大预览':'作品展示，左右滑动翻页');
  $('.lb-caption').hidden=single;
  $('.lb-prev').hidden=single;$('.lb-next').hidden=single;
  $('#lbDots').hidden=single;
  const captionTitle=$('#lbCaptionTitle'),modeLabel=$('#lbModeLabel');
  if(captionTitle)captionTitle.textContent=lbMode==='full'?(lbWork?.title||lbTitle.textContent):'';
  if(modeLabel)modeLabel.textContent=single?'':'原作完整画板 · 左右翻页';
  $('.lb-prev').disabled = lbIdx === 0; $('.lb-next').disabled = lbIdx === lbList.length-1;
  const firstDot=Math.max(0,Math.min(lbIdx-3,lbList.length-7));
  $('#lbDots').replaceChildren(...(single?[]:lbList.map((_,i)=>{
    if(i<firstDot || i>=firstDot+7)return null;
    const b=document.createElement('button'); b.type='button'; b.setAttribute('aria-label','第 '+(i+1)+' 页'); b.setAttribute('aria-current',String(i===lbIdx));
    b.addEventListener('click',()=>{lbIdx=i;lbRender();});return b;
  }).filter(Boolean)));
}
function lbSetClass(img) {
  if (!img || !img.naturalWidth) return;
  const r = img.naturalHeight / img.naturalWidth;
  img.classList.remove('portrait', 'tall', 'landscape');
  if (r > 1.65) img.classList.add('tall');
  else if (r < 0.72) img.classList.add('landscape');
  else img.classList.add('portrait');
}
/* ===== 上传图片存储：IndexedDB，刷新页面不丢 ===== */
const DB_NAME = 'portfolioUploads', STORE = 'images';
function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(STORE)) r.result.createObjectStore(STORE); };
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function idbPut(key, blob) {
  return openDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(blob, key);
    tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
  }));
}
function idbGet(key) {
  return openDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readonly');
    const rq = tx.objectStore(STORE).get(key);
    rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
  }));
}
function idbDel(key) {
  return openDB().then(db => new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(key);
    tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
  }));
}
/* 'idb:key' -> blob URL；普通路径原样返回 */
const urlCache = new Map();
async function resolveSrc(entry) {
  if (!entry) return entry;
  const s = String(entry);
  if (!s.startsWith('idb:')) return s;
  const key = s.slice(4);
  if (urlCache.has(key)) return urlCache.get(key);
  try {
    const blob = await idbGet(key);
    if (!blob) return s;
    const url = URL.createObjectURL(blob);
    urlCache.set(key, url);
    return url;
  } catch (e) { return s; }
}
async function resolveList(list) { return Promise.all((list || []).map(resolveSrc)); }

async function lbOpen(rawList, idx, title, mode = 'full', slug = '') {
  const request = ++lbOpenRequest;
  const glimpse=mode==='glimpse';
  const selected=rawList?.[idx||0];
  const pool=window.portraitWorks;
  const work=glimpse?(typeof selected==='object'?selected:{title,src:selected}):pool?.find(w=>slug&&w.slug===slug)||pool?.find(w=>w.title===title);
  // A quick preview always contains exactly the clicked poster. Only the
  // lower archive resolves a project's full source-derived page sequence.
  const entries=glimpse?(selected?[selected]:[]):work?(work.fullPages||[]):(rawList||[]);
  const sourcePages=glimpse?[]:(work?.fullPages||[]);
  const list = await Promise.all(entries.map(async p=>{
    if(typeof p==='object')return {...p,src:await resolveSrc(p.src)};
    const meta=sourcePages.find(page=>page.src===p)||{};
    return {...meta,src:await resolveSrc(p)};
  }));
  if (request !== lbOpenRequest) return;
  lbWork = work; lbMode=mode;lbList = list; lbIdx = glimpse?0:Math.min(idx || 0,list.length-1);
  if (!lbList.length) return;
  lbReturnFocus = document.activeElement;
  lbTitle.textContent = title || '';
  lb.classList.toggle('is-full-project',!glimpse);
  lb.classList.toggle('is-single-preview',glimpse);
  lb.style.setProperty('--poster-accent',work?.accent||'#ceff18');
  lbRender(); lb.inert = false;
  lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('.lb-close').focus({ preventScroll: true });
}
function lbClose() {
  lbOpenRequest++;
  lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true');
  lb.inert = true;
  document.body.style.overflow = document.querySelector('.modal.is-open') ? 'hidden' : '';
  if (lbReturnFocus?.isConnected) lbReturnFocus.focus({ preventScroll: true });
}
function lbShow(dir) {
  if (!lbList.length || lbMode==='glimpse') return;
  lbIdx = Math.max(0,Math.min(lbList.length-1,lbIdx+dir));
  lbRender();
}
if (lb) {
  const stage=$('.lb-stage'); let swipe=null;
  stage.addEventListener('pointerdown',e=>{if(lbMode==='glimpse'||e.button!==0||!e.isPrimary)return;swipe={x:e.clientX,y:e.clientY,id:e.pointerId};stage.setPointerCapture(e.pointerId);});
  stage.addEventListener('pointerup',e=>{if(!swipe||swipe.id!==e.pointerId)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2)lbShow(dx<0?1:-1);swipe=null;});
  stage.addEventListener('pointercancel',()=>{swipe=null;});
  stage.addEventListener('dragstart',e=>e.preventDefault());
  $('.lb-zoom').addEventListener('click', () => {
    const zoomed = $('.lb-stage').classList.toggle('is-detail');
    $('.lb-zoom').textContent = zoomed ? '完整画面 ↙' : '局部细节 ↗';
    $('.lb-zoom').setAttribute('aria-pressed', String(zoomed));
    $('.lb-stage').scrollTop = 0;
  });
  $('.lb-close').addEventListener('click', lbClose);
  $('.lb-prev').addEventListener('click', () => lbShow(-1));
  $('.lb-next').addEventListener('click', () => lbShow(1));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (lb.classList.contains('is-open')) lbClose();
      else if (previewModal && previewModal.classList.contains('is-open')) closePreview();
      else if (editModal && editModal.classList.contains('is-open')) closeEditModal();
      return;
    }
    if (!lb.classList.contains('is-open')) return;
    if (lbMode==='full' && e.key === 'ArrowLeft') { e.preventDefault(); lbShow(-1); }
    if (lbMode==='full' && e.key === 'ArrowRight') { e.preventDefault(); lbShow(1); }
    if (e.key === 'Tab') {
      const controls = [...lb.querySelectorAll('button:not(:disabled), [tabindex="0"]')].filter(el=>!el.hidden&&el.getClientRects().length);
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* 作品卡片点击：有 gallery 的进 lightbox（编辑按钮不触发） */
$$('#worksGrid .work').forEach(card => {
  card.addEventListener('keydown', e => {
    if(e.target !== card || !['Enter',' '].includes(e.key))return;
    e.preventDefault();card.click();
  });
  card.addEventListener('click', e => {
    if (e.target.closest('.work-edit')) return;
    const g = card.dataset.gallery;
    if (g) {
      try {
        const list = JSON.parse(g);
        const title = card.querySelector('.meta h3') ? card.querySelector('.meta h3').textContent : '';
        if (list && list.length) lbOpen(list, 0, title, 'full', card.dataset.slug);
      } catch(e){}
    }
  });
});

/* 作品集归档缩略图点击 */
$$('.a-thumb').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const full = thumb.dataset.full || thumb.src;
    lbOpen([full], 0, thumb.alt);
  });
});

/* ===== 作品集 PDF 预览弹窗 ===== */
const previewModal = $('#preview-modal'), previewBtn = $('#preview-btn'), mPreviewBtn = $('#m-preview-btn'), previewClose = $('#preview-close');
function renderPreviewGrid() {
  const grid = $('#preview-grid');
  if (!grid || grid.dataset.ready === 'true') return;
  grid.innerHTML = '';
  $$('#worksGrid .work').forEach(card => {
    let list = [];
    try { list = JSON.parse(card.dataset.gallery || '[]'); } catch (e) {}
    const cover = card.querySelector('.cover-img');
    const title = card.querySelector('.meta h3') ? card.querySelector('.meta h3').textContent : '';
    const img = document.createElement('img');
    img.className = 'a-thumb';
    img.src = cover ? cover.getAttribute('src') : (list[0] || '');
    img.alt = title;
    img.loading = 'lazy';
    img.addEventListener('click', () => lbOpen(list, 0, title, 'full', card.dataset.slug));
    grid.appendChild(img);
  });
  grid.dataset.ready = 'true';
}
function openPreview() { renderPreviewGrid(); previewModal.classList.add('is-open'); previewModal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; }
function closePreview() { previewModal.classList.remove('is-open'); previewModal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
if (previewBtn) previewBtn.addEventListener('click', openPreview);
if (mPreviewBtn) mPreviewBtn.addEventListener('click', () => { closeMenu(); openPreview(); });
if (previewClose) previewClose.addEventListener('click', closePreview);
if (previewModal) previewModal.querySelector('.modal-back').addEventListener('click', closePreview);

function closeMenu() { if (menuPanel) menuPanel.classList.remove('open'); }

/* ===== 编辑模式 ===== */
const editToggle = $('#edit-toggle'), mEditToggle = $('#m-edit-toggle');
const editModal = $('#edit-modal'), editClose = $('#edit-close');
let editMode = false;

function toggleEditMode() {
  editMode = !editMode;
  document.body.classList.toggle('edit-mode', editMode);
  if (editToggle) editToggle.classList.toggle('on', editMode);
  if (mEditToggle) mEditToggle.classList.toggle('on', editMode);
  $$('#worksGrid .work').forEach(w => {
    w.setAttribute('draggable', editMode ? 'true' : 'false');
  });
  if (editMode) toast('编辑模式已开启：可拖拽排序，点击 ✎ 编辑作品');
}
if (editToggle) editToggle.addEventListener('click', toggleEditMode);
if (mEditToggle) mEditToggle.addEventListener('click', () => { closeMenu(); toggleEditMode(); });

/* 拖拽排序 */
let dragSrc = null;
function handleDragStart(e) {
  if (!editMode) { e.preventDefault(); return; }
  dragSrc = this;
  this.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}
function handleDragOver(e) {
  if (!editMode) return;
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const target = e.target.closest('#worksGrid .work');
  if (target && target !== dragSrc) target.classList.add('drag-over');
}
function handleDragLeave(e) {
  const target = e.target.closest('#worksGrid .work');
  if (target) target.classList.remove('drag-over');
}
function handleDrop(e) {
  if (!editMode) return;
  e.preventDefault();
  const target = e.target.closest('#worksGrid .work');
  if (target && dragSrc && target !== dragSrc) {
    const grid = $('#worksGrid');
    const cards = [...grid.children];
    const srcIdx = cards.indexOf(dragSrc);
    const tgtIdx = cards.indexOf(target);
    if (srcIdx < tgtIdx) target.after(dragSrc); else target.before(dragSrc);
    saveOrderToStorage();
  }
  $$('.work').forEach(w => w.classList.remove('drag-over'));
}
function handleDragEnd() { this.classList.remove('dragging'); $$('.work').forEach(w => w.classList.remove('drag-over')); }
function bindDrag() {
  $$('#worksGrid .work').forEach(w => {
    w.addEventListener('dragstart', handleDragStart);
    w.addEventListener('dragover', handleDragOver);
    w.addEventListener('dragleave', handleDragLeave);
    w.addEventListener('drop', handleDrop);
    w.addEventListener('dragend', handleDragEnd);
  });
}
bindDrag();

function saveOrderToStorage() {
  const order = [...$$('#worksGrid .work')].map(w => w.dataset.slug);
  localStorage.setItem('portfolioOrder', JSON.stringify(order));
}

/* ===== 编辑单个作品：文字 + 图片上传/删除/排序 ===== */
let editGallery = [];   // 条目：'assets/...' 或 'idb:key'
let editThumbs = [];    // 与 editGallery 一一对应的显示地址
let dragThumb = null;

function renderEditThumbs() {
  const box = $('#edit-thumbs'); if (!box) return;
  box.innerHTML = '';
  editGallery.forEach((entry, i) => {
    const d = document.createElement('div');
    d.className = 'edit-thumb'; d.draggable = true;
    const img = document.createElement('img');
    img.src = editThumbs[i] || entry; img.alt = '';
    const del = document.createElement('button');
    del.type = 'button'; del.className = 'del'; del.textContent = '×'; del.title = '删除这张';
    del.addEventListener('click', async () => {
      const removed = editGallery.splice(i, 1)[0];
      editThumbs.splice(i, 1);
      if (String(removed).startsWith('idb:')) { try { await idbDel(removed.slice(4)); } catch (e) {} }
      renderEditThumbs();
    });
    d.appendChild(img); d.appendChild(del);
    d.addEventListener('dragstart', e => { dragThumb = i; d.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; });
    d.addEventListener('dragover', e => { e.preventDefault(); d.classList.add('over'); });
    d.addEventListener('dragleave', () => d.classList.remove('over'));
    d.addEventListener('drop', e => {
      e.preventDefault(); d.classList.remove('over');
      if (dragThumb === null || dragThumb === i) return;
      const g = editGallery.splice(dragThumb, 1)[0];
      const t = editThumbs.splice(dragThumb, 1)[0];
      editGallery.splice(i, 0, g); editThumbs.splice(i, 0, t);
      dragThumb = null; renderEditThumbs();
    });
    d.addEventListener('dragend', () => { d.classList.remove('dragging'); box.querySelectorAll('.edit-thumb').forEach(x => x.classList.remove('over')); });
    box.appendChild(d);
  });
  const cnt = $('#edit-gal-count'); if (cnt) cnt.textContent = editGallery.length;
}

async function addFiles(files) {
  const arr = [...files].filter(f => f && f.type && f.type.startsWith('image/'));
  if (!arr.length) { toast('请选择图片文件'); return; }
  let n = 0;
  for (const f of arr) {
    const key = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '_' + String(f.name).replace(/[^\w.\-]/g, '_');
    try {
      await idbPut(key, f);
      editGallery.push('idb:' + key);
      editThumbs.push(URL.createObjectURL(f));
      n++;
    } catch (e) { /* 单张失败跳过 */ }
  }
  renderEditThumbs();
  toast(n ? ('已添加 ' + n + ' 张图片') : '图片保存失败，请重试');
}

async function openEditModal(card) {
  if (!card) return;
  $('#edit-idx').value = card.dataset.slug;
  $('#edit-title').value = card.dataset.title || '';
  $('#edit-cat').value = card.dataset.cat || '';
  $('#edit-year').value = card.dataset.year || '';
  $('#edit-desc').value = card.dataset.desc || '';
  let g = [];
  try { g = JSON.parse(card.dataset.gallery || '[]'); } catch(e){}
  editGallery = g.slice();
  editThumbs = await resolveList(editGallery);
  renderEditThumbs();
  editModal.classList.add('is-open'); editModal.setAttribute('aria-hidden', 'false');
}
function closeEditModal() { editModal.classList.remove('is-open'); editModal.setAttribute('aria-hidden', 'true'); }
$$('#worksGrid .work-edit').forEach(btn => {
  btn.addEventListener('click', e => { e.stopPropagation(); openEditModal(btn.closest('.work')); });
});
if (editClose) editClose.addEventListener('click', closeEditModal);
if (editModal) editModal.querySelector('.modal-back').addEventListener('click', closeEditModal);

/* 上传：按钮 / 点击拖拽区 / 拖拽投放 */
(function bindUpload() {
  const fileInput = $('#edit-file'), upBtn = $('#edit-upload-btn'), drop = $('#edit-drop');
  if (fileInput) fileInput.addEventListener('change', () => { addFiles(fileInput.files); fileInput.value = ''; });
  if (upBtn) upBtn.addEventListener('click', () => fileInput && fileInput.click());
  if (drop) {
    drop.addEventListener('click', () => fileInput && fileInput.click());
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', e => { if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files); });
  }
})();

function updateCardFromStorage(slug) {
  const edits = JSON.parse(localStorage.getItem('portfolioEdits') || '{}');
  return edits[slug];
}

if ($('#edit-save')) {
  $('#edit-save').addEventListener('click', async () => {
    const slug = $('#edit-idx').value;
    const card = $(`.work[data-slug="${slug}"]`);
    if (!card) return;
    const title = $('#edit-title').value.trim();
    const cat = $('#edit-cat').value.trim();
    const year = $('#edit-year').value.trim();
    const desc = $('#edit-desc').value.trim();
    const gallery = editGallery.slice();
    card.dataset.title = title; card.dataset.cat = cat; card.dataset.year = year; card.dataset.desc = desc;
    card.dataset.gallery = JSON.stringify(gallery);
    card.setAttribute('data-cat', cat);
    const h3 = card.querySelector('.meta h3'); if (h3) h3.textContent = title;
    const p = card.querySelector('.meta p'); if (p) p.textContent = desc;
    const catSpan = card.querySelector('.meta .cat'); if (catSpan) catSpan.textContent = cat;
    const yrSpan = card.querySelector('.meta .yr'); if (yrSpan) yrSpan.textContent = year;
    const badge = card.querySelector('.count-badge'); if (badge) badge.textContent = gallery.length + ' 张';
    // 封面同步为图集第一张（支持上传图）
    const coverImg = card.querySelector('.cover-img');
    if (coverImg && gallery.length) {
      coverImg.src = await resolveSrc(gallery[0]);
      const pv = card.querySelector('.cover-preview');
      if (pv) pv.remove();
    }
    const edits = JSON.parse(localStorage.getItem('portfolioEdits') || '{}');
    edits[slug] = { title, cat, year, desc, gallery };
    localStorage.setItem('portfolioEdits', JSON.stringify(edits));
    closeEditModal();
    toast('已保存，刷新页面也不会丢');
  });
}

/* 下载这个作品里上传过的图片 */
if ($('#edit-dl-images')) {
  $('#edit-dl-images').addEventListener('click', async () => {
    const ups = editGallery.filter(x => String(x).startsWith('idb:'));
    if (!ups.length) { toast('这个作品还没有上传过图片'); return; }
    for (const e of ups) {
      const key = String(e).slice(4);
      try {
        const blob = await idbGet(key);
        if (!blob) continue;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = key.replace(/^u_\d+_[a-z0-9]+_/, '') || (key + '.jpg');
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      } catch (err) { /* 跳过 */ }
    }
    toast('已下载 ' + ups.length + ' 张上传图片');
  });
}

if ($('#edit-export')) {
  $('#edit-export').addEventListener('click', () => {
    const order = JSON.parse(localStorage.getItem('portfolioOrder') || '[]');
    const edits = JSON.parse(localStorage.getItem('portfolioEdits') || '{}');
    const cards = [...$$('#worksGrid .work')];
    const data = cards.map(c => {
      const slug = c.dataset.slug;
      const e = edits[slug] || {};
      let gallery = [];
      try { gallery = JSON.parse(c.dataset.gallery || '[]'); } catch(err){}
      return {
        title: e.title || c.dataset.title,
        cat: e.cat || c.dataset.cat,
        year: e.year || c.dataset.year,
        desc: e.desc || c.dataset.desc,
        slug: slug,
        gallery: e.gallery || gallery
      };
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'works_metadata.json';
    a.click();
    URL.revokeObjectURL(a.href);
    toast('已导出 works_metadata.json');
  });
}

/* 页面加载时恢复本地排序 */
(function restoreLocalOrder() {
  const order = JSON.parse(localStorage.getItem('portfolioOrder') || '[]');
  if (!order.length) return;
  const grid = $('#worksGrid');
  const map = new Map([...$$('#worksGrid .work')].map(c => [c.dataset.slug, c]));
  order.forEach(slug => { const c = map.get(slug); if (c) grid.appendChild(c); });
})();

/* 页面加载时恢复本地编辑 */
(function restoreLocalEdits() {
  const edits = JSON.parse(localStorage.getItem('portfolioEdits') || '{}');
  Object.entries(edits).forEach(([slug, e]) => {
    const card = $(`.work[data-slug="${slug}"]`);
    if (!card) return;
    if (e.title) { card.dataset.title = e.title; const n = card.querySelector('.meta h3'); if (n) n.textContent = e.title; }
    if (e.desc) { card.dataset.desc = e.desc; const n = card.querySelector('.meta p'); if (n) n.textContent = e.desc; }
    if (e.cat) { card.dataset.cat = e.cat; card.setAttribute('data-cat', e.cat); const n = card.querySelector('.meta .cat'); if (n) n.textContent = e.cat; }
    if (e.year) { card.dataset.year = e.year; const n = card.querySelector('.meta .yr'); if (n) n.textContent = e.year; }
    if (e.gallery) {
      card.dataset.gallery = JSON.stringify(e.gallery);
      const n = card.querySelector('.count-badge'); if (n) n.textContent = e.gallery.length + ' 张';
      // 封面若来自上传图（idb:），恢复成可显示的 blob 地址
      if (e.gallery.length && String(e.gallery[0]).startsWith('idb:')) {
        resolveSrc(e.gallery[0]).then(u => {
          const ci = card.querySelector('.cover-img'); if (ci) ci.src = u;
          const pv = card.querySelector('.cover-preview'); if (pv) pv.remove();
        });
      }
    }
  });
})();

/* ===== Vibe Coding 专用编辑器 =====
   适合网页端、移动端和 HTML 小工具；数据保存在当前浏览器，
   体验网址可以随时替换成国内部署后的地址。 */
const vibeCards = [...$$('#vibeGrid .vibe-work')];
const vibeEditModal = $('#vibe-edit-modal');
let vibeEditCard = null;
let vibeEditPreviewRef = '';
let vibeEditBasePreview = '';
let vibeEditBaseLayout = 'mobile';
let vibeEditBaseCaptureWidth = '100%';

function readVibeEdits() {
  try { return JSON.parse(localStorage.getItem('vibeEdits') || '{}') || {}; }
  catch (e) { return {}; }
}
function writeVibeEdits(data) { localStorage.setItem('vibeEdits', JSON.stringify(data)); }

function vibeBase(card) {
  if (card.__vibeBase) return card.__vibeBase;
  const stage = card.querySelector('.vibe-stage');
  const screen = card.querySelector('.vibe-screen');
  const img = card.querySelector('.vibe-capture');
  const previewAttr = card.dataset.vibePreview;
  card.__vibeBase = {
    title: card.dataset.vibeTitle || card.querySelector('.vibe-title-row h3')?.textContent.trim() || '',
    tags: card.dataset.vibeTags || card.querySelector('.vibe-tags')?.textContent.trim() || '',
    desc: card.dataset.vibeDesc || card.querySelector('.vibe-caption p')?.textContent.trim() || '',
    url: card.dataset.vibeUrl || '',
    format: card.dataset.vibeFormat || card.querySelector('.vibe-format')?.textContent.trim() || '',
    layout: card.dataset.vibeLayout || (stage?.classList.contains('vibe-stage--desktop') ? 'desktop' : 'mobile'),
    tint: card.dataset.vibeTint || '#52606a',
    preview: previewAttr !== undefined ? previewAttr : (img?.getAttribute('src') || ''),
    captureWidth: card.dataset.vibeCaptureWidth || screen?.style.getPropertyValue('--capture-width') || '100%'
  };
  return card.__vibeBase;
}
function getVibeData(card) {
  const base = vibeBase(card);
  const edits = readVibeEdits()[card.dataset.slug] || {};
  return { ...base, ...edits };
}

function makeVibeChrome(device) {
  if (!device || device.querySelector('.vibe-chrome')) return;
  const chrome = document.createElement('div');
  chrome.className = 'vibe-chrome';
  chrome.setAttribute('aria-hidden', 'true');
  chrome.innerHTML = '<i></i><i></i><i></i><span></span>';
  device.prepend(chrome);
}

async function applyVibeCard(card, data) {
  const stage = card.querySelector('.vibe-stage');
  const device = card.querySelector('.vibe-device');
  const screen = card.querySelector('.vibe-screen');
  const img = card.querySelector('.vibe-capture');
  const empty = card.querySelector('.vibe-empty-copy');
  const link = card.querySelector('.vibe-project');
  const action = card.querySelector('.vibe-preview-action');
  const format = card.querySelector('.vibe-format');
  const tags = card.querySelector('.vibe-tags');
  const title = card.querySelector('.vibe-title-row h3');
  const desc = card.querySelector('.vibe-caption p');
  if (!stage || !link) return;

  const isMobile = data.layout !== 'desktop';
  stage.classList.toggle('vibe-stage--mobile', isMobile);
  stage.classList.toggle('vibe-stage--desktop', !isMobile);
  stage.classList.toggle('vibe-stage--empty', !data.preview);
  stage.style.setProperty('--vibe-tint', data.tint || '#52606a');
  if (format) format.textContent = data.format || (isMobile ? '移动端' : '网页端');
  if (tags) tags.textContent = data.tags || 'Vibe Coding';
  if (title) title.textContent = data.title || '未命名项目';
  if (desc) desc.textContent = data.desc || '补充这个 Vibe Coding 项目的说明。';
  if (device) {
    makeVibeChrome(device);
    device.classList.toggle('vibe-device--mobile', isMobile);
    device.classList.toggle('vibe-device--desktop', !isMobile);
    device.hidden = !data.preview;
  }
  if (empty) empty.hidden = Boolean(data.preview);
  if (screen) screen.style.setProperty('--capture-width', data.captureWidth || '100%');
  if (img) {
    img.alt = data.title ? data.title + '页面预览' : 'Vibe Coding 页面预览';
    if (data.preview) {
      img.hidden = false;
      img.src = await resolveSrc(data.preview);
    } else {
      img.hidden = true;
      img.removeAttribute('src');
    }
  }
  if (data.url) {
    link.href = data.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.removeAttribute('aria-disabled');
    if (action) action.textContent = '打开体验 ↗';
  } else {
    link.href = '#';
    link.removeAttribute('target');
    link.removeAttribute('rel');
    link.setAttribute('aria-disabled', 'true');
    if (action) action.textContent = '先编辑内容';
  }
  link.setAttribute('aria-label', data.url ? '打开 ' + (data.title || 'Vibe Coding 项目') + '，在新标签页体验' : '编辑 ' + (data.title || 'Vibe Coding 项目'));
  card.classList.toggle('vibe-work--empty', !data.preview && !data.url);
}

function renderVibeEditorPreview(ref) {
  const box = $('#vibe-upload-preview');
  if (!box) return;
  box.innerHTML = '';
  if (!ref) { box.innerHTML = '<span>还没有预览图</span>'; return; }
  const img = document.createElement('img');
  img.alt = '当前页面预览';
  box.appendChild(img);
  resolveSrc(ref).then(src => { img.src = src; });
}

async function openVibeEditModal(card) {
  if (!card || !vibeEditModal) return;
  vibeEditCard = card;
  const data = getVibeData(card);
  $('#vibe-edit-slug').value = card.dataset.slug;
  $('#vibe-edit-title').value = data.title || '';
  $('#vibe-edit-tags').value = data.tags || '';
  $('#vibe-edit-layout').value = data.layout || 'mobile';
  $('#vibe-edit-format').value = data.format || '';
  $('#vibe-edit-desc').value = data.desc || '';
  $('#vibe-edit-url').value = data.url || '';
  $('#vibe-edit-tint').value = /^#[0-9a-f]{6}$/i.test(data.tint || '') ? data.tint : '#52606a';
  vibeEditPreviewRef = data.preview || '';
  vibeEditBasePreview = data.preview || '';
  vibeEditBaseLayout = data.layout || 'mobile';
  vibeEditBaseCaptureWidth = data.captureWidth || '100%';
  renderVibeEditorPreview(vibeEditPreviewRef);
  vibeEditModal.classList.add('is-open');
  vibeEditModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('#vibe-edit-title').focus({ preventScroll: true });
}
function closeVibeEditModal() {
  if (!vibeEditModal) return;
  vibeEditModal.classList.remove('is-open');
  vibeEditModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = document.querySelector('.modal.is-open') ? 'hidden' : '';
  vibeEditCard = null;
}

vibeCards.forEach(card => {
  vibeBase(card);
  const editBtn = card.querySelector('.vibe-edit-btn');
  if (editBtn) editBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openVibeEditModal(card); });
  const link = card.querySelector('.vibe-project');
  if (link) link.addEventListener('click', e => {
    if (!getVibeData(card).url) { e.preventDefault(); openVibeEditModal(card); }
  });
  applyVibeCard(card, getVibeData(card));
});

const vibeEditEntry = $('#vibe-edit-entry');
if (vibeEditEntry) vibeEditEntry.addEventListener('click', () => {
  if (!document.body.classList.contains('edit-mode')) toggleEditMode();
  $('#vibeCollection')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  toast('Vibe Coding 编辑入口已打开：点击卡片右上角「编辑」');
});
if ($('#vibe-edit-close')) $('#vibe-edit-close').addEventListener('click', closeVibeEditModal);
if (vibeEditModal) vibeEditModal.querySelector('.modal-back').addEventListener('click', closeVibeEditModal);

const vibeFile = $('#vibe-file'), vibeUploadBtn = $('#vibe-upload-btn');
if (vibeUploadBtn) vibeUploadBtn.addEventListener('click', () => vibeFile?.click());
if (vibeFile) vibeFile.addEventListener('change', async () => {
  const file = vibeFile.files?.[0];
  vibeFile.value = '';
  if (!file || !file.type.startsWith('image/')) { toast('请选择一张图片作为页面预览'); return; }
  const key = 'vibe_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '_' + String(file.name).replace(/[^\w.\-]/g, '_');
  try {
    await idbPut(key, file);
    vibeEditPreviewRef = 'idb:' + key;
    renderVibeEditorPreview(vibeEditPreviewRef);
    toast('预览图已添加');
  } catch (e) { toast('图片保存失败，请重试'); }
});

if ($('#vibe-edit-save')) $('#vibe-edit-save').addEventListener('click', async () => {
  if (!vibeEditCard) return;
  const slug = vibeEditCard.dataset.slug;
  const edits = readVibeEdits();
  const previous = edits[slug]?.preview;
  const data = {
    title: $('#vibe-edit-title').value.trim(),
    tags: $('#vibe-edit-tags').value.trim(),
    layout: $('#vibe-edit-layout').value,
    format: $('#vibe-edit-format').value.trim(),
    desc: $('#vibe-edit-desc').value.trim(),
    url: $('#vibe-edit-url').value.trim(),
    tint: $('#vibe-edit-tint').value,
    preview: vibeEditPreviewRef,
    captureWidth: vibeEditPreviewRef === vibeEditBasePreview && $('#vibe-edit-layout').value === vibeEditBaseLayout ? vibeEditBaseCaptureWidth : '100%'
  };
  if (!data.title) { toast('请先填写项目名称'); return; }
  if (previous && previous !== data.preview && String(previous).startsWith('idb:')) {
    try { await idbDel(previous.slice(4)); } catch (e) {}
  }
  edits[slug] = data;
  writeVibeEdits(edits);
  await applyVibeCard(vibeEditCard, data);
  closeVibeEditModal();
  toast('Vibe Coding 项目已保存到本机');
});

if ($('#vibe-edit-reset')) $('#vibe-edit-reset').addEventListener('click', async () => {
  if (!vibeEditCard) return;
  const slug = vibeEditCard.dataset.slug;
  const edits = readVibeEdits();
  const oldPreview = edits[slug]?.preview;
  if (oldPreview && String(oldPreview).startsWith('idb:')) { try { await idbDel(oldPreview.slice(4)); } catch (e) {} }
  delete edits[slug];
  writeVibeEdits(edits);
  vibeEditPreviewRef = vibeBase(vibeEditCard).preview || '';
  await applyVibeCard(vibeEditCard, vibeBase(vibeEditCard));
  closeVibeEditModal();
  toast('已恢复这个项目的默认内容');
});

if ($('#vibe-edit-export')) $('#vibe-edit-export').addEventListener('click', () => {
  const data = vibeCards.map(card => {
    const item = getVibeData(card);
    return { ...item, slug: card.dataset.slug, preview: String(item.preview || '').startsWith('idb:') ? '请从编辑器重新上传预览图' : item.preview };
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'vibe-coding-config.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('已导出 Vibe Coding 配置');
});

if ($('#vibe-edit-download')) $('#vibe-edit-download').addEventListener('click', async () => {
  if (!vibeEditPreviewRef) { toast('这个项目还没有预览图'); return; }
  if (String(vibeEditPreviewRef).startsWith('idb:')) {
    try {
      const blob = await idbGet(vibeEditPreviewRef.slice(4));
      if (blob) {
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (vibeEditCard?.dataset.slug || 'vibe-preview') + '.png'; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        toast('预览图已下载'); return;
      }
    } catch (e) {}
  }
  toast('当前预览图是包内素材，部署包中已经包含');
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && vibeEditModal?.classList.contains('is-open')) closeVibeEditModal();
});
