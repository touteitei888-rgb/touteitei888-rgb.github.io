'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function addEnglish(el, text, className = 'bi-en') {
    if (!el || !text || el.querySelector(':scope > .' + className)) return;
    const span = document.createElement('span');
    span.className = className;
    span.lang = 'en';
    span.textContent = text;
    el.append(span);
  }

  function setText(selector, text, root = document) {
    const el = $(selector, root);
    if (el) el.textContent = text;
  }

  const projectCopy = {
    'pdf-ecommerce-app': {
      title: 'Yidianyuan E-commerce App', cat: 'E-commerce',
      desc: 'From product guidelines and shopping journeys to component design and Lunar New Year campaign visuals.',
      pages: ['Project Overview', 'Color System', 'Typography & Layout', 'Component System', 'Home Screen Design', 'Membership System', 'AIGC Campaign Exploration', 'Key Visual Process', 'Lunar New Year Key Visual', 'Campaign Posters', 'Interface Overview']
    },
    'pdf-education': {
      title: 'Bailitop Education Platform', cat: 'Education',
      desc: 'Course, training and assessment flows supported by data visualization, icons and campaign interfaces.',
      pages: ['Project Overview', 'Training Module', 'Stage Assessment', 'Course Design 01', 'Course Design 02', '3D Icons', 'Data Visualization', 'Wireframe Design', 'Campaign Interface', 'Illustrations & Components']
    },
    'pdf-merchant': {
      title: 'Yidianyuan Merchant Dashboard', cat: 'E-commerce',
      desc: 'A complete merchant system covering after-sales management, filters, forms, operations tools and reusable components.',
      pages: ['Project Overview', 'After-sales Management 01', 'After-sales Management 02', 'After-sales Management 03', 'After-sales Management 04', 'Filters & Forms 01', 'Filters & Forms 02', 'Filters & Forms 03', 'Filters & Forms 04', 'Operations Management 01', 'Operations Management 02', 'Icon Guidelines 01', 'Icon Guidelines 02', 'Switch Components', 'Tables, Lists & Pagination']
    },
    'pdf-hmi': {
      title: 'Zhixing Automotive · Smart Cockpit', cat: 'HMI',
      desc: 'Smart-cockpit design spanning clusters, navigation, vehicle controls, ambient lighting and voice assistance.',
      pages: ['Project Overview', 'Inspiration & Direction', 'Instrument Cluster', 'Navigation Experience', 'Seats & Climate', 'Climate Control', 'Ambient Lighting', 'Dora Voice Assistant & Icons', 'Cockpit Interface Overview']
    },
    'pdf-aigc': {
      title: 'AIGC Commercial Posters', cat: 'AIGC',
      desc: 'An AIGC poster series for festivals, seasonal themes and commercial campaigns, shown in its original compositions.',
      pages: ['Series Overview', 'Festival Posters', 'Commercial & Seasonal Posters']
    },
    'pdf-mia': {
      title: 'MIA · Educational IP Design', cat: 'Brand & IP',
      desc: 'Character development from early sketches and identity colors to turnarounds, poses, outfits and accessories.',
      pages: ['Series Overview', 'Character Introduction', 'Character Sketches', 'Logo & Color', 'Character Turnaround', 'Character Poses', 'Outfits & Accessories']
    },
    'pdf-mythology': {
      title: 'Classic of Mountains and Seas · Five Spirits', cat: 'AIGC',
      desc: 'A visual reinterpretation of Eastern mythology presented as a complete themed series of legendary creatures.',
      pages: ['Series Overview', 'Vermilion Bird', 'Nine-tailed Fox', 'Azure Dragon', 'Cloud Chi']
    }
  };

  const filterEnglish = {
    all: 'All', '电商': 'E-commerce', '教育': 'Education', HMI: 'HMI',
    '品牌IP': 'Brand & IP', AIGC: 'AIGC', '独立开发': 'Vibe Coding'
  };

  addEnglish($('#works .sec-sub'), 'Design portfolio and Vibe Coding product practice.');
  $$('#filters .fbtn').forEach(btn => {
    const en = filterEnglish[btn.dataset.cat];
    if (en && btn.textContent.trim() !== en) btn.textContent = btn.textContent.trim() + ' / ' + en;
  });

  $$('#worksGrid .pdf-work').forEach(card => {
    const copy = projectCopy[card.dataset.slug];
    if (!copy) return;
    const zhTitle = card.dataset.title || $('h3', card)?.childNodes[0]?.textContent?.trim() || '';
    const zhDesc = card.dataset.desc || $('.work-desc', card)?.childNodes[0]?.textContent?.trim() || '';
    addEnglish($('.meta h3', card), copy.title, 'work-en-title');
    addEnglish($('.work-desc', card), copy.desc);
    const cat = $('.cat', card);
    if (cat && !cat.textContent.includes(copy.cat)) cat.textContent += ' / ' + copy.cat;
    const count = JSON.parse(card.dataset.gallery || '[]').length;
    setText('.yr', `${count} 页原作 / ${count} Original Pages ↗`, card);
    setText('.count-badge', `${count} 页 / Pages`, card);
    card.dataset.title = `${zhTitle} / ${copy.title}`;
    card.dataset.desc = `${zhDesc} / ${copy.desc}`;
    card.setAttribute('aria-label', `${zhTitle}, ${copy.title}. 查看完整 ${count} 页 / View ${count} original pages`);
    const edit = $('.work-edit', card);
    if (edit) { edit.title = '编辑 / Edit'; edit.setAttribute('aria-label', `编辑 ${zhTitle} / Edit ${copy.title}`); }
  });

  const vibeCopy = {
    'vibe-yicheng-yijuan': { title: 'A City, A Scroll', tags: 'City Walk / Photo-to-Scroll', format: '移动端 · H5 / Mobile H5', desc: 'Choose a city and its landmarks, then blend travel photos into a Chinese-style panoramic scroll.' },
    'vibe-nospend-virtual-delivery': { title: 'No Spend', tags: 'Virtual Ordering / Savings Tracker', format: '移动端 · Web App / Mobile Web App', desc: 'Turn food cravings into virtual orders and keep track of the money saved by not checking out.' },
    'vibe-tangtang-coffee-lab': { title: 'Tangtang Coffee Lab', tags: 'Recipe Exploration / Coffee DIY', format: '网页与移动端 / Web & Mobile', desc: 'Explore coffee recipes, adjust flavor notes and mix a cup that feels entirely your own.' },
    'vibe-wenling-pattern-lab': { title: 'Pattern Spirit', tags: 'Traditional Patterns / Creative Customization', format: '网页端 / Desktop Web', desc: 'Select traditional motifs and colors, combine their meanings and preview them on different products.' },
    'vibe-slot-01': { title: 'Vibe Coding Project 01', tags: '移动端 / Mobile Tool', format: '移动端 · 待添加 / Mobile · Add Later', desc: 'Add the introduction for your next mobile micro-tool here.' },
    'vibe-slot-02': { title: 'Vibe Coding Project 02', tags: '网页端 / HTML Tool', format: '网页端 · 待添加 / Desktop · Add Later', desc: 'Add the introduction for your next desktop or HTML micro-tool here.' }
  };

  $$('#vibeGrid .vibe-work').forEach(card => {
    const copy = vibeCopy[card.dataset.slug];
    if (!copy) return;
    const zhTitle = card.dataset.vibeTitle;
    addEnglish($('.vibe-title-row h3', card), copy.title, 'vibe-en-title');
    const tags = $('.vibe-tags', card);
    if (tags) tags.textContent = `${tags.textContent.trim()} · ${copy.tags}`;
    addEnglish($('.vibe-caption p', card), copy.desc);
    setText('.vibe-format', copy.format, card);
    setText('.vibe-preview-action', card.classList.contains('vibe-work--empty') ? '先编辑内容 / Add Content' : '打开体验 / Launch ↗', card);
    const empty = $('.vibe-empty-copy', card);
    if (empty) {
      setText('span', '上传一张页面预览 / Upload Preview', empty);
      setText('small', '点击编辑添加 / Edit to Add', empty);
    }
    const edit = $('.vibe-edit-btn', card);
    if (edit) { edit.textContent = '✎ 编辑 / Edit'; edit.title = '编辑 / Edit'; }
    const link = $('.vibe-project', card);
    if (link) link.setAttribute('aria-label', `${zhTitle} / ${copy.title}，打开体验 / Launch in a new tab`);
  });

  const vibeEntry = $('#vibe-edit-entry');
  if (vibeEntry) vibeEntry.textContent = '✎ 编辑内容 / Edit Projects';

  addEnglish($('#about .sec-sub'), 'A one-page letter that works as my résumé.');
  const letter = $('#about .letter');
  if (letter) {
    const head = $$('.letter-head span', letter);
    if (head[1]) head[1].textContent = '大连 · 东北大学（日本）交换 / Dalian · Exchange at Tohoku University, Japan';
    const paragraphs = $$(':scope > p', letter);
    addEnglish(paragraphs[0], 'Hi, I’m Tangting. I majored in Japanese and have eight years of UI design experience. I began as a Japanese copywriter and translator for an overseas-education company, then taught myself UI design and later integrated AI into my workflow.');
    addEnglish(paragraphs[1], 'I work across zero-to-one product design, design systems, brand and IP, and campaign visuals. In recent years I have also used AI and Vibe Coding for research, illustration, H5 experiences, rapid prototypes and small products—from idea to delivery.');
    addEnglish(paragraphs[2], 'Friends describe me as gentle, but exacting about craft. That is how I believe a designer should work: a soft touch, with firm standards.');
    addEnglish($('.quote', letter), 'The freedom I value is earned through diligence and self-discipline. I believe in sustained practice, not inspiration that arrives by chance. — Yohji Yamamoto');
    const subheads = $$('.sub-h', letter);
    ['What I Do', 'Tools I Use', 'Selected Numbers', 'Education & Path'].forEach((en, i) => addEnglish(subheads[i], en, 'bi-en-inline'));
    const chips = $$('.chip', letter);
    const chipEnglish = ['UI / UX Design', 'HMI Smart Cockpit', 'Brand & IP', 'AIGC Visuals', 'Design Systems', 'H5 / Campaign Assets', 'Vibe Coding', 'AI Workflow'];
    chipEnglish.forEach((en, i) => { if (chips[i] && !chips[i].textContent.includes(en)) chips[i].textContent += ' / ' + en; });
    const stats = $$('.stat span', letter);
    ['Years in Design', 'Product Lines', 'Complete IP Systems (MIA / Capybara / Dora)', 'JLPT N1 · CET-6 English'].forEach((en, i) => addEnglish(stats[i], en));
    const education = $$(':scope > p.dim', letter).slice(-2);
    addEnglish(education[0], 'B.A. in Japanese, Dalian University of Technology · Exchange at Tohoku University, Japan');
    addEnglish(education[1], 'Self-taught transition into UI and AI product design.');
  }

  const timeline = [
    { role: 'Designer', company: 'Dalian Ruixin Medical & Health Management Co., Ltd.', desc: 'UI design across products including the Yidianyuan e-commerce app and Yunshe Fengtu app; Capybara IP and merchandise for Ruikang Dental; brand campaigns and an offline exhibition of AI-assisted artwork.' },
    { role: 'HMI Designer', company: 'Chexingtianxia Technology Co., Ltd.', desc: 'Designed center-console, passenger and infotainment modules; built high-fidelity navigation prototypes and demos; contributed to visual standards and component libraries for production vehicle programs.' },
    { role: 'Japanese Copywriter & Translator', company: 'Beijing Bailitop Education · Overseas Education', desc: 'Wrote, translated and proofread Japanese-language content for overseas-study programs, supporting communications and campaign materials.' },
    { role: 'B.A. in Japanese', company: 'Dalian University of Technology → Exchange at Tohoku University, Japan', desc: 'B.A. in Japanese. UI design and AI workflows are both self-taught.' }
  ];
  $$('#timeline .tl-card').forEach((card, i) => {
    const copy = timeline[i]; if (!copy) return;
    addEnglish($('h3', card), copy.role, 'tl-role-en');
    const company = $('h3 small', card); if (company) addEnglish(company, copy.company);
    addEnglish($(':scope > p', card), copy.desc);
  });

  addEnglish($('#timeline .sec-sub'), 'Career and learning journey.');
  setText('#wx-btn', 'WeChat：touteitei8（点击复制 / Click to Copy）');
  setText('#tel-btn', '138 9790 9148（点击复制 / Click to Copy）');
  setText('#ipBubble', '嗨，我是婷婷 ✦ / Hi, I’m Tangting');
  [
    ['#preview-btn', '预览整套作品集 / Full Portfolio'], ['#edit-toggle', '编辑 / Edit'],
    ['#m-preview-btn', '预览整套作品集 / Full Portfolio'], ['#m-edit-toggle', '编辑模式 / Edit Mode']
  ].forEach(([selector, text]) => setText(selector, text));

  addEnglish($('#preview-modal .modal-head h3'), 'Portfolio Overview');
  addEnglish($('#preview-modal .modal-head p'), 'Select a cover to browse the complete original project.');
  addEnglish($('#vibe-edit-modal .modal-head h3'), 'Edit Vibe Coding Project');
  addEnglish($('#vibe-edit-modal .modal-head p'), 'Changes are saved in this browser. After deploying in China, paste the new public URL here.');
  addEnglish($('#edit-modal .modal-head h3'), 'Edit Project');
  addEnglish($('#edit-modal .modal-head p'), 'Edit copy, upload images, remove items and reorder them. Changes are saved locally.');

  const bilingualLabels = [
    ['#vibe-edit-title', '项目名称 / Project Name'], ['#vibe-edit-tags', '标签 / Tags'],
    ['#vibe-edit-layout', '展示类型 / Display Type'], ['#vibe-edit-format', '卡片格式文字 / Format Label'],
    ['#vibe-edit-desc', '一句话说明 / Short Description'], ['#vibe-edit-url', '体验网址 / Public URL'],
    ['#vibe-edit-tint', '卡片色调 / Card Color'], ['#edit-title', '标题 / Title'],
    ['#edit-cat', '分类 / Category'], ['#edit-year', '年份 / Year'], ['#edit-desc', '描述 / Description']
  ];
  bilingualLabels.forEach(([selector, label]) => {
    const input = $(selector); const wrapper = input?.closest('label');
    if (wrapper?.firstChild?.nodeType === Node.TEXT_NODE) wrapper.firstChild.nodeValue = label;
  });
  [
    ['#vibe-edit-save', '保存到本机 / Save Locally'], ['#vibe-edit-reset', '恢复默认 / Reset'],
    ['#vibe-edit-export', '导出配置 / Export'], ['#vibe-edit-download', '下载预览图 / Download Preview'],
    ['#edit-save', '保存 / Save'], ['#edit-export', '导出 JSON / Export JSON'],
    ['#edit-dl-images', '下载上传的图 / Download Images'], ['#vibe-upload-btn', '＋ 上传 / 替换 / Upload'],
    ['#edit-upload-btn', '＋ 上传图片 / Upload Images']
  ].forEach(([selector, text]) => setText(selector, text));

  $$('.lb-close, .modal-close').forEach(el => el.setAttribute('aria-label', '关闭 / Close'));
  $('.lb-prev')?.setAttribute('aria-label', '上一张 / Previous');
  $('.lb-next')?.setAttribute('aria-label', '下一张 / Next');
  $('.lb-stage')?.setAttribute('aria-label', '作品展示，左右滑动翻页 / Swipe to browse the project');
  setText('#lbError', '图片暂时无法加载，请尝试下一页。 / Image unavailable. Please try the next page.');

  (window.pdfArchive || []).forEach(work => {
    const copy = projectCopy[work.slug];
    if (!copy) return;
    work.english = copy.title;
    work.desc = `${work.desc} / ${copy.desc}`;
    (work.fullPages || []).forEach((page, i) => {
      const en = copy.pages[i] || `Original Page ${i + 1}`;
      if (!page.title.includes(' / ')) page.title += ` / ${en}`;
      page.description = `原始作品集 · 第 ${page.sourcePage} 张画板 / Original portfolio · Source artwork ${page.sourcePage}`;
    });
  });

  const posterEnglish = {
    'assets/posters/flan.png': ['Peach Caramel · Lifestyle Poster', 'Soft cream tones, still-life lighting and generous negative space shape a refined food visual.'],
    'assets/editorial/quiet-tea.png': ['Green Plum Season · Summer Limited', 'Muted sage, warm white and a single subject create a calm Japanese-inspired campaign visual.'],
    'assets/posters/mushroom.png': ['Wild Ingredients · Textural Editorial', 'Rough paper, mushrooms and botanical forms are composed into a restrained lifestyle poster.'],
    'assets/posters/pomegranate.png': ['Pomegranate Jelly · Pink Still Life', 'Translucent jelly and soft pink light create an airy cover designed for social sharing.'],
    'assets/posters/weekend-trail.png': ['Weekend, Go Wild!', 'Fluorescent pink type, outdoor photography and hand-drawn lines capture an easy weekend escape.'],
    'assets/editorial/quiet-autumn.png': ['Moonlit Autumn · Seasonal Poster', 'Vermilion, warm white and asymmetric space bring a festive mood into a focused composition.'],
    'assets/editorial/quiet-live.png': ['Weekend Live · Lifestyle Campaign', 'Cobalt blue and lemon yellow create digital impact while bold typography carries the event message.'],
    'assets/posters/forest.png': ['Into the Forest · Outdoor Campaign', 'Deep green, misty blue and distant scenery create a mature key visual for a nature-led brand.'],
    'assets/posters/simmer-story.png': ['Slow Simmer, Full Flavor', 'A dark brown table and warm calligraphy preserve the texture and comfort of slow-cooked food.'],
    'assets/posters/field-table.png': ['A Letter from the Field · Spring Table', 'Olive green, torn-paper edges and vertical type bring seasonal freshness to the table.'],
    'assets/posters/hmi.png': ['Zhixing · Smart Cockpit Interface', 'Deep ocean blue, cool navigation light and warm status accents shape a calm, technical HMI direction.'],
    'assets/posters/mountain.png': ['Mountain Route · Cultural Travel Visual', 'Routes, mountain forms and bright yellow build a clear identity for outdoor travel communication.'],
    'assets/posters/island-ip.png': ['Letter from Moon Island · IP Scene', 'A girl, star lanterns and an island become a gentle character story connected to the site’s heroine.'],
    'assets/slow-club/pear.png': ['Pear · Give Life a Little Break', 'Hand-moulded clay texture, fluorescent green and cobalt blue create a playful visual identity.'],
    'assets/slow-club/orange.png': ['Orange · Put on Your Headphones', 'An everyday fruit becomes a rhythmic character through orange, mint blue and handwritten type.'],
    'assets/slow-club/cloud.png': ['Cloud · It’s Okay to Slow Down', 'Soft silhouettes and tactile surfaces turn daydreaming into a small, visible ritual.']
  };
  (window.heroPosters || []).forEach(page => {
    const copy = posterEnglish[page.src];
    if (!copy) return;
    page.english = copy[0];
    page.description = `${page.description} / ${copy[1]}`;
    page.concept = 'AI 辅助视觉概念 · 非商业委托 / AI-assisted visual concept · Non-commercial study';
  });
})();
