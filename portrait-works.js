'use strict';
(() => {
 // Exact source-derived pages, in their original sequence. Never synthesize
 // a page count or cycle one bitmap through an alleged full project.
 window.portraitWorks=window.pdfArchive;

 // These buckets only arrange the rail. Each poster opens independently;
 // the complete PDF archive below has its own gallery data.
 window.heroSeries=[
  {
   slug:'food-editorial-glimpse',
   title:'食品与生活方式视觉',
   english:'FOOD / LIFESTYLE VISUAL STUDY / 01—04',
   position:'50% 50%',
   bg:'#f6f1e8',
   aiAssisted:true,
   previewPages:[
    {src:'assets/posters/flan.png',title:'桃香焦糖 · 生活方式海报',description:'以温柔的奶油色、静物光线与留白建立高级食品视觉。'},
    {src:'assets/editorial/quiet-tea.png',title:'青梅时节 · 夏日限定',description:'淡鼠尾草绿、米白与单一主体建立安静的日式运营视觉。'},
    {src:'assets/posters/mushroom.png',title:'山野食材 · 质感专辑',description:'粗粝纸张、菌菇与植物形态被收束成克制的生活方式海报。'},
    {src:'assets/posters/pomegranate.png',title:'石榴果冻 · 粉色静物',description:'透亮果冻与柔粉光影形成轻盈、适合社交传播的视觉封面。'}
   ]
  },
  {
   slug:'operations-handwritten-glimpse',
   title:'手写与运营海报',
   english:'HANDWRITTEN / CAMPAIGN VISUAL STUDY / 01—04',
   position:'50% 50%',
   bg:'#f4eee5',
   aiAssisted:true,
   previewPages:[
    {src:'assets/posters/weekend-trail.png',title:'周末，去野！',english:'OUTDOOR / CAMPAIGN POSTER',accent:'#ff3998',description:'把自己还给山风。荧光粉标题、户外摄影与手绘线条，记录一次轻快的周末出走。'},
    {src:'assets/editorial/quiet-autumn.png',title:'月色正好 · 秋日节令',description:'朱红、暖白与非对称留白，把节日情绪收束成清晰的主题海报。'},
    {src:'assets/editorial/quiet-live.png',title:'周末开场 · 生活方式',description:'钴蓝与浅柠檬黄形成互联网识别，用大标题和材质场景承载活动信息。'},
    {src:'assets/posters/forest.png',title:'林间去处 · 户外运营',description:'深绿、雾蓝与远景留白让自然主题更像一张成熟的品牌活动主视觉。'}
   ]
  },
  {
   slug:'digital-products-glimpse',
   title:'产品与互联网视觉',
   english:'PRODUCT / INTERNET VISUAL STUDY / 01—04',
   position:'50% 50%',
   bg:'#f5f7f4',
   aiAssisted:true,
   previewPages:[
    {src:'assets/posters/simmer-story.png',title:'慢火有味',english:'FOOD / SEASONAL TABLE',accent:'#d8b68c',description:'把时间，煨进一碗热气里。深褐色餐桌与米色书法，保留食物的温度和质地。'},
    {src:'assets/posters/field-table.png',title:'田野来信 · 春日有鲜',english:'FOOD / FROM FIELD TO TABLE',accent:'#bcce88',description:'循着时令，吃一口春天。橄榄绿、粗纸边缘与竖排文字，把田野鲜味带上餐桌。'},
    {src:'assets/posters/hmi.png',title:'智行 · 智能座舱界面',description:'深海蓝、冷光导航线与暖色状态点形成安静而有科技感的 HMI 方向。'},
    {src:'assets/posters/mountain.png',title:'山野路线 · 文旅活动视觉',description:'以路线、山体与明亮黄色建立适合户外项目传播的识别系统。'}
   ]
  },
  {
   slug:'ip-seasonal-glimpse',
   title:'IP 与季节叙事',
   english:'IP / SEASONAL STORYTELLING / 01—04',
   position:'50% 50%',
   bg:'#fffaf0',
   aiAssisted:true,
   previewPages:[
    {src:'assets/posters/island-ip.png',title:'月岛来信 · IP 场景设定',description:'把小女孩、星灯与海岛做成温柔的角色叙事，延续首页人物的亲和感。'},
    {src:'assets/slow-club/pear.png',title:'青梨 · 给生活放个小假',description:'用手捏黏土的触感把角色做得有温度，荧光绿与钴蓝建立轻快的视觉识别。'},
    {src:'assets/slow-club/orange.png',title:'橘子 · 戴上耳机',description:'把日常水果转成有节奏的小角色，以橙色、薄荷蓝和手写标题串起系列。'},
    {src:'assets/slow-club/cloud.png',title:'云朵 · 慢一点也可以',description:'让发呆成为一件可以被看见的小事，用柔软轮廓与粗糙材质平衡画面。'}
   ]
  }
 ];
 window.heroPosters=Array.from({length:4},(_,index)=>window.heroSeries.map(series=>({
   ...series.previewPages[index],
   english:series.previewPages[index].english||series.english.replace(' / 01—04',''),
   aiAssisted:true
 }))).flat();
})();
