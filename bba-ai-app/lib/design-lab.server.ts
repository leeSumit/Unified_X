import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Direction config ─────────────────────────────────────────────────────────
export interface DirectionConfig {
  label: string;
  fonts: string;
  tokens: string;
  imageStyleAnchor: string;
  primaryColor: string;
  bg: string;
  accent: string;
}

export const DIRECTIONS: Record<string, DirectionConfig> = {
  'modern-minimal': {
    label: 'Modern Minimal',
    primaryColor: '#3b6cff',
    bg: '#ffffff',
    accent: '#3b6cff',
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');`,
    tokens: `--bg:#ffffff;--bg-soft:#f7f8fa;--surface:#ffffff;--surface-2:#f2f4f8;--border:rgba(0,0,0,.07);--text-1:#0f1117;--text-2:#5a5f72;--text-3:#9499aa;--accent:#3b6cff;--accent-2:#7a5cff;--accent-3:rgba(59,108,255,.1);--grad:linear-gradient(135deg,#3b6cff,#7a5cff);--font-sans:'Inter',system-ui,sans-serif;--font-display:'Inter',system-ui,sans-serif;--n-size:80px;--n-color:#3b6cff;`,
    imageStyleAnchor: `Abstract professional concept art, Swiss editorial composition, warm off-white background, strong asymmetrical composition with generous negative space, museum-like calm, premium visual quality. NO TEXT. NO WORDS. NO LETTERS. NO LABELS. Purely visual illustration.`,
  },
  'campus-ai': {
    label: 'Campus AI',
    primaryColor: '#5B2D8E',
    bg: '#F5F0E8',
    accent: '#5B2D8E',
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');`,
    tokens: `--bg:#F5F0E8;--bg-soft:#EDE8DF;--surface:#fff;--surface-2:#F0EBE2;--border:rgba(91,45,142,.14);--text-1:#1A2550;--text-2:#4a4a6a;--text-3:#999;--accent:#5B2D8E;--accent-2:#E8681A;--accent-3:rgba(91,45,142,.1);--grad:linear-gradient(135deg,#5B2D8E,#E8681A);--font-sans:'Inter',system-ui,sans-serif;--font-display:'Inter',system-ui,sans-serif;--n-size:80px;--n-color:#5B2D8E;`,
    imageStyleAnchor: `Abstract academic concept art, warm cream and purple tones, collegial educational atmosphere, modern Indian university aesthetic, clean inviting composition. NO TEXT. NO WORDS. NO LETTERS. NO LABELS. Purely visual illustration.`,
  },
  'editorial': {
    label: 'Editorial',
    primaryColor: '#c0392b',
    bg: '#fdf8f2',
    accent: '#c0392b',
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,400&family=Inter:wght@300;400;500&display=swap');`,
    tokens: `--bg:#fdf8f2;--bg-soft:#f5ede0;--surface:#fff;--surface-2:#f5ede0;--border:rgba(0,0,0,.1);--text-1:#2c1810;--text-2:#6b4c3b;--text-3:#a07060;--accent:#c0392b;--accent-2:#8b2f22;--accent-3:rgba(192,57,43,.08);--grad:linear-gradient(135deg,#c0392b,#8b2f22);--font-sans:'Inter',system-ui,sans-serif;--font-display:'Playfair Display',Georgia,serif;--n-size:80px;--n-color:#c0392b;`,
    imageStyleAnchor: `Abstract editorial concept art, warm paper tones, classical refined aesthetic, ivory and charcoal palette with coral-red accents, sophisticated literary mood. NO TEXT. NO WORDS. NO LETTERS. NO LABELS. Purely visual illustration.`,
  },
  'tech-dark': {
    label: 'Tech Dark',
    primaryColor: '#58a6ff',
    bg: '#0d1117',
    accent: '#58a6ff',
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`,
    tokens: `--bg:#0d1117;--bg-soft:#161b22;--surface:#161b22;--surface-2:#21262d;--border:rgba(255,255,255,.1);--text-1:#f0f6fc;--text-2:#8b949e;--text-3:#6e7681;--accent:#58a6ff;--accent-2:#3fb950;--accent-3:rgba(88,166,255,.1);--grad:linear-gradient(135deg,#58a6ff,#3fb950);--font-sans:'Space Grotesk',system-ui,sans-serif;--font-display:'Space Grotesk',system-ui,sans-serif;--n-size:80px;--n-color:#58a6ff;`,
    imageStyleAnchor: `Abstract dark tech concept art, circuit board organic shapes, dark background with glowing blue-green neon accents, data-visualization aesthetic, futuristic minimal. NO TEXT. NO WORDS. NO LETTERS. NO LABELS. Purely visual illustration.`,
  },
  'whiteboard': {
    label: 'Whiteboard',
    primaryColor: '#4a90d9',
    bg: '#fafafa',
    accent: '#4a90d9',
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');`,
    tokens: `--bg:#ffffff;--bg-soft:#f8f8f8;--surface:#ffffff;--surface-2:#f5f5f5;--border:#cccccc;--text-1:#1a1a1a;--text-2:#444444;--text-3:#888888;--accent:#4a90d9;--accent-2:#e74c3c;--accent-3:rgba(74,144,217,.1);--wb-red:#e74c3c;--wb-blue:#4a90d9;--wb-yellow:#f1c40f;--wb-green:#2ecc71;--grad:linear-gradient(135deg,#4a90d9,#e74c3c);--font-sans:'Inter',system-ui,sans-serif;--font-display:'Caveat',cursive;--n-size:80px;--n-color:#1a1a1a;`,
    imageStyleAnchor: `Clean educational illustration, textbook diagram style, white background, flat vector subject matter, hand-drawn infographic aesthetic, primary color accents (blue, red, yellow). NO TEXT. NO WORDS. NO LETTERS. NO LABELS. Purely visual illustration.`,
  },
  'kami-serif': {
    label: 'Kami Serif',
    primaryColor: '#1B365D',
    bg: '#f5f4ed',
    accent: '#1B365D',
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500&display=swap');`,
    tokens: `--bg:#f5f4ed;--bg-soft:#ece9df;--surface:#fff;--surface-2:#ece9df;--border:rgba(27,54,93,.12);--text-1:#1a1a1a;--text-2:#4a4a4a;--text-3:#8a8a8a;--accent:#1B365D;--accent-2:#8B6914;--accent-3:rgba(27,54,93,.08);--grad:linear-gradient(135deg,#1B365D,#8B6914);--font-sans:'Inter',system-ui,sans-serif;--font-display:'Cormorant Garamond',Georgia,serif;--n-size:80px;--n-color:#1B365D;`,
    imageStyleAnchor: `Classical academic concept art, warm parchment tones, ink-blue and gold accents, scholarly refined aesthetic, timeless authoritative mood. NO TEXT. NO WORDS. NO LETTERS. NO LABELS. Purely visual illustration.`,
  },
};

// ─── Whiteboard SVG doodles ───────────────────────────────────────────────────
export const WB = {
  lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 70" fill="none" width="64" height="74"><circle cx="30" cy="24" r="14" stroke="#f1c40f" stroke-width="2.5"/><path d="M24 38 Q24 46 30 46 Q36 46 36 38" stroke="#f1c40f" stroke-width="2.5" fill="none"/><line x1="25" y1="50" x2="35" y2="50" stroke="#f1c40f" stroke-width="2.5" stroke-linecap="round"/><line x1="30" y1="4" x2="30" y2="8" stroke="#f1c40f" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="10" x2="17" y2="13" stroke="#f1c40f" stroke-width="2" stroke-linecap="round"/><line x1="46" y1="10" x2="43" y2="13" stroke="#f1c40f" stroke-width="2" stroke-linecap="round"/></svg>`,
  book: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" width="66" height="66"><rect x="8" y="10" width="22" height="44" rx="3" stroke="#3498db" stroke-width="2.5"/><rect x="34" y="10" width="22" height="44" rx="3" stroke="#3498db" stroke-width="2.5"/><line x1="30" y1="10" x2="30" y2="54" stroke="#3498db" stroke-width="2.5"/><line x1="14" y1="22" x2="24" y2="22" stroke="#3498db" stroke-width="1.5" stroke-linecap="round"/><line x1="14" y1="28" x2="24" y2="28" stroke="#3498db" stroke-width="1.5" stroke-linecap="round"/><line x1="40" y1="22" x2="50" y2="22" stroke="#3498db" stroke-width="1.5" stroke-linecap="round"/><line x1="40" y1="28" x2="50" y2="28" stroke="#3498db" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  pencil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 64" fill="none" width="50" height="64"><rect x="16" y="4" width="18" height="46" rx="2" stroke="#e74c3c" stroke-width="2.5"/><path d="M16 50 L25 60 L34 50" stroke="#e74c3c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="16" y1="12" x2="34" y2="12" stroke="#e74c3c" stroke-width="1.5"/></svg>`,
  stars: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 70" fill="none" width="80" height="70"><path d="M20 22L22 15L24 22L31 22L26 27L28 34L22 29L16 34L18 27L13 22Z" stroke="#e74c3c" stroke-width="1.5" fill="none"/><path d="M56 12L58 6L60 12L66 12L62 16L64 22L58 18L52 22L54 16L50 12Z" stroke="#f1c40f" stroke-width="1.5" fill="none"/><circle cx="42" cy="32" r="3" stroke="#4a90d9" stroke-width="1.5"/><circle cx="14" cy="50" r="2" stroke="#2ecc71" stroke-width="1.5"/><path d="M65 42L67 36L69 42L73 42L70 45L71 50L67 47L63 50L64 45L61 42Z" stroke="#2ecc71" stroke-width="1.5" fill="none"/></svg>`,
  gradCap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 60" fill="none" width="80" height="60"><path d="M40 12L10 28L40 44L70 28Z" stroke="#3498db" stroke-width="2.5" stroke-linejoin="round" fill="none"/><path d="M56 36L56 52Q56 54 54 54Q40 58 26 54Q24 54 24 52L24 36" stroke="#3498db" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><line x1="70" y1="28" x2="70" y2="46" stroke="#3498db" stroke-width="2.5" stroke-linecap="round"/><circle cx="70" cy="48" r="3" fill="#3498db"/></svg>`,
  underline: `<svg viewBox="0 0 500 14" fill="none" style="display:block;width:min(500px,42vw);height:14px;margin-top:2px;margin-bottom:14px"><path d="M4 8 Q125 3 250 8 Q375 13 496 8" stroke="#e74c3c" stroke-width="3.5" stroke-linecap="round" fill="none"/></svg>`,
};

// ─── CSS constants ────────────────────────────────────────────────────────────
export const BASE_CSS = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;overflow:hidden;background:var(--bg);color:var(--text-1);font-family:var(--font-sans);-webkit-font-smoothing:antialiased}
.deck{position:relative;width:100%;height:100%;overflow:hidden}
.slide{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:6% 7% 8%;opacity:0;pointer-events:none;transition:opacity .35s ease,transform .35s ease;transform:translateX(4%);background:var(--bg)}
.slide.active{opacity:1;pointer-events:auto;transform:translateX(0);z-index:2}
.slide.prev{transform:translateX(-4%);opacity:0}
.h1{font-family:var(--font-display);font-size:clamp(34px,5.2vw,68px);line-height:1.05;font-weight:800;letter-spacing:-.04em}
.h2{font-family:var(--font-display);font-size:clamp(22px,3.6vw,48px);line-height:1.1;font-weight:700;letter-spacing:-.03em}
.lede{font-size:clamp(14px,1.9vw,22px);line-height:1.6;color:var(--text-2);font-weight:300}
.eyebrow{font-size:clamp(10px,1vw,12px);font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:10px}
.kicker{font-size:clamp(10px,.9vw,12px);font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;display:block}
.gradient-text{background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.accent-bar{width:44px;height:4px;background:var(--grad);border-radius:99px;margin-bottom:14px}
.metric{display:flex;flex-direction:column;align-items:flex-start}
.metric .n{font-size:var(--n-size,80px);font-weight:800;line-height:1;letter-spacing:-.04em;color:var(--n-color,var(--accent));font-family:var(--font-display)}
.metric .l{font-size:clamp(11px,1.2vw,14px);color:var(--text-2);font-weight:500;margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px}
.card-accent{border-left:4px solid var(--accent)}
.card-soft{background:var(--surface-2);border-color:transparent}
.card-dark{background:var(--accent);color:#fff;border:none}
.pill{display:inline-block;padding:4px 12px;border-radius:999px;font-size:clamp(10px,.9vw,12px);font-weight:600;background:var(--surface-2);color:var(--text-2);border:1px solid var(--border)}
.pill-accent{background:var(--accent-3,rgba(59,108,255,.1));color:var(--accent);border-color:transparent}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.row{display:flex;gap:16px;align-items:flex-start}
.col{display:flex;flex-direction:column;gap:10px}
.fill{flex:1}
.chrome{position:absolute;top:18px;left:28px;right:28px;display:flex;align-items:center;justify-content:space-between;font-size:clamp(9px,.9vw,11px);color:var(--text-3);letter-spacing:.1em;text-transform:uppercase;z-index:10;pointer-events:none}
.counter::before{content:attr(data-n)}
.counter::after{content:" / " attr(data-t)}
.pbar{position:fixed;bottom:0;left:0;right:0;height:3px;z-index:20}
.pbar span{display:block;height:100%;width:0;background:var(--accent);transition:width .3s ease}
.nbtn{position:absolute;bottom:14px;background:var(--surface-2);border:1px solid var(--border);border-radius:8px;padding:5px 16px;cursor:pointer;color:var(--text-2);font-size:clamp(11px,1.1vw,13px);z-index:30;font-family:var(--font-sans);transition:all .15s;font-weight:500}
.nbtn:hover{background:var(--accent);color:#fff;border-color:var(--accent)}
.np{left:calc(50% - 80px)}.nn{left:calc(50% + 12px)}
.slide-title{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:8% 10%}
.slide-title .decor{position:absolute;right:-80px;top:-80px;width:480px;height:480px;border-radius:50%;background:var(--grad);opacity:.07;pointer-events:none}
.slide-title .decor2{position:absolute;right:60px;bottom:-100px;width:280px;height:280px;border-radius:50%;background:var(--accent-2,var(--accent));opacity:.05;pointer-events:none}
.agenda-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
.agenda-item{display:flex;align-items:flex-start;gap:12px;padding:12px 14px;border-radius:10px;background:var(--surface-2);border:1px solid var(--border)}
.agenda-num{font-size:clamp(20px,2.6vw,34px);font-weight:800;line-height:1;color:var(--accent);font-family:var(--font-display);flex-shrink:0;width:38px}
.agenda-label{font-size:clamp(12px,1.4vw,15px);font-weight:600;color:var(--text-1);margin-bottom:2px}
.agenda-desc{font-size:clamp(10px,1.1vw,12px);color:var(--text-2)}
.content-body{display:flex;gap:4%;align-items:center;height:calc(100% - 56px)}
.content-left{flex:0 0 52%}
.content-right{flex:0 0 44%;height:68%;border-radius:14px;overflow:hidden;background:var(--surface-2);display:flex;align-items:center;justify-content:center;border:1px solid var(--border)}
.content-right img{width:100%;height:100%;object-fit:cover}
.content-right svg{max-width:100%;max-height:100%;padding:12px}
.bullet-list{list-style:none;padding:0;margin-top:12px}
.bullet-list li{display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--border)}
.bullet-list li:last-child{border-bottom:none}
.bullet-list li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0;margin-top:6px}
.bullet-list li span{font-size:clamp(12px,1.5vw,16px);color:var(--text-2);line-height:1.5}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:22px}
.stat-card{padding:20px 18px;border-radius:14px;border:1px solid var(--border);background:var(--surface)}
.cs-body{display:flex;gap:4%;height:calc(100% - 56px);align-items:center}
.cs-left{flex:0 0 52%}
.cs-right{flex:0 0 44%;height:68%;border-radius:14px;overflow:hidden;background:var(--surface-2);display:flex;align-items:center;justify-content:center;border:1px solid var(--border)}
.cs-right img{width:100%;height:100%;object-fit:cover}
.cs-company{font-size:clamp(18px,2.4vw,30px);font-weight:700;color:var(--text-1);margin:8px 0 8px}
.cs-headline{font-size:clamp(13px,1.6vw,17px);font-weight:600;color:var(--text-1);line-height:1.4;margin-bottom:10px}
.cs-story{font-size:clamp(11px,1.3vw,14px);color:var(--text-2);line-height:1.6;margin-bottom:12px}
.cs-result{display:inline-block;padding:5px 14px;border-radius:999px;background:var(--accent-3);color:var(--accent);font-size:clamp(11px,1.2vw,14px);font-weight:600;border:1px solid var(--accent-3)}
.quote-mark{font-size:clamp(60px,8vw,120px);line-height:1;color:var(--accent);opacity:.22;margin-bottom:-18px;font-family:Georgia,serif}
.quote-text{font-family:var(--font-display);font-size:clamp(18px,2.8vw,38px);font-weight:600;line-height:1.4;color:var(--text-1);max-width:22ch;margin-bottom:22px}
.quote-author{font-size:clamp(12px,1.4vw,16px);font-weight:600;color:var(--accent)}
.quote-role{font-size:clamp(11px,1.2vw,14px);color:var(--text-3)}
.tk-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:16px}
.tk-card{padding:14px 16px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:flex-start;gap:10px}
.tk-num{font-size:clamp(20px,2.6vw,32px);font-weight:800;color:var(--accent);line-height:1;font-family:var(--font-display);flex-shrink:0;width:28px}
.tk-text{font-size:clamp(11px,1.3vw,14px);color:var(--text-2);line-height:1.5}
.slide-end{background:var(--grad)!important;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:8% 10%}
.end-title{font-family:var(--font-display);font-size:clamp(40px,6vw,78px);font-weight:800;letter-spacing:-.04em;color:#fff;margin-bottom:10px;text-align:center}
.end-sub{font-size:clamp(14px,1.8vw,22px);color:rgba(255,255,255,.75);margin-bottom:28px;text-align:center}
.end-next{font-size:clamp(11px,1.2vw,14px);color:rgba(255,255,255,.45);letter-spacing:.1em;text-transform:uppercase;text-align:center}
.wb-corners{position:absolute;inset:0;pointer-events:none;z-index:1}
.wb-corner{position:absolute;opacity:.9}
.wb-corner.tl{top:14px;left:14px}
.wb-corner.tr{top:14px;right:14px}
.wb-corner.bl{bottom:38px;left:14px}
.wb-corner.br{bottom:38px;right:14px}
.diagram-body{display:flex;gap:4%;align-items:center;height:calc(100% - 56px)}
.diagram-left{flex:0 0 34%}
.diagram-right{flex:1;height:80%;border-radius:14px;overflow:hidden;background:var(--surface-2);display:flex;align-items:center;justify-content:center;border:1px solid var(--border);padding:16px}
.diagram-right svg{max-width:100%;max-height:100%}`;

export const WB_EXTRA_CSS = `.h1,.h2{font-family:'Caveat',cursive!important;letter-spacing:0!important}
.agenda-num{font-family:'Caveat',cursive!important;font-size:clamp(28px,4vw,52px)!important;color:#1a1a1a!important}
.metric .n{font-family:'Caveat',cursive!important;color:#1a1a1a!important}
.end-title{font-family:'Caveat',cursive!important}
.tk-num{font-family:'Caveat',cursive!important;color:#1a1a1a!important}
.quote-text{font-family:'Caveat',cursive!important;font-size:clamp(22px,3.5vw,46px)!important}
.quote-mark{color:#e74c3c!important;opacity:.35!important}
.card,.tk-card,.stat-card{border:2px dashed #4a90d9!important}
.card-accent{border-left:none!important;border:2px dashed #4a90d9!important}
.card-soft,.agenda-item{background:#fafafa!important;border:2px dashed #cccccc!important}
.bullet-list li::before{background:#e74c3c!important}
.accent-bar{background:#e74c3c!important}
.eyebrow,.kicker{color:#e74c3c!important}
.cs-result{background:rgba(74,144,217,.1)!important;color:#4a90d9!important;border-color:rgba(74,144,217,.2)!important}
.nbtn:hover{background:#4a90d9!important;border-color:#4a90d9!important}
.content-right,.cs-right{border:2px dashed #4a90d9!important}`;

export const RUNTIME_JS = `(function(){
var slides=[].slice.call(document.querySelectorAll('.slide'));
if(!slides.length)return;
var cur=0;
var counter=document.querySelector('.counter');
var pb=document.querySelector('.pbar span');
function go(n){
  slides[cur].classList.remove('active');
  slides[cur].classList.add('prev');
  setTimeout(function(){if(slides[cur])slides[cur].classList.remove('prev');},380);
  cur=(n+slides.length)%slides.length;
  slides[cur].classList.add('active');
  if(counter){counter.dataset.n=String(cur+1);counter.dataset.t=String(slides.length);}
  if(pb)pb.style.width=((cur+1)/slides.length*100)+'%';
}
slides[0].classList.add('active');
if(counter){counter.dataset.n='1';counter.dataset.t=String(slides.length);}
if(pb)pb.style.width=(100/slides.length)+'%';
document.addEventListener('keydown',function(e){
  if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key===' '){e.preventDefault();go(cur+1);}
  if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();go(cur-1);}
  if(e.key==='Home')go(0);if(e.key==='End')go(slides.length-1);
});
[].slice.call(document.querySelectorAll('.nn')).forEach(function(b){b.addEventListener('click',function(){go(cur+1);});});
[].slice.call(document.querySelectorAll('.np')).forEach(function(b){b.addEventListener('click',function(){go(cur-1);});});
var tx=0;
document.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
document.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>40)go(d<0?cur+1:cur-1);},{passive:true});
})();`;

// ─── Slide type interfaces ────────────────────────────────────────────────────
export interface TitleSlide   { type:'title'; title:string; subtitle:string; badge:string }
export interface AgendaSlide  { type:'agenda'; eyebrow:string; title:string; items:{n:string;label:string;desc:string}[] }
export interface ContentSlide { type:'content'; eyebrow:string; title:string; points:string[]; imagePrompt:string }
export interface StatsSlide   { type:'stats'; eyebrow:string; title:string; stats:{value:string;label:string}[] }
export interface CaseStudy    { type:'case-study'; tag:string; company:string; headline:string; story:string; result:string; imagePrompt:string }
export interface QuoteSlide   { type:'quote'; text:string; author:string; role:string }
export interface Takeaways    { type:'takeaways'; title:string; items:string[] }
export interface EndSlide     { type:'end'; title:string; next:string }
export interface DiagramSlide { type:'diagram'; eyebrow:string; title:string; description:string; svgContent?:string }
export type AnySlide = TitleSlide|AgendaSlide|ContentSlide|StatsSlide|CaseStudy|QuoteSlide|Takeaways|EndSlide|DiagramSlide;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function esc(s: string): string {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function chrome(title: string): string {
  return `<div class="chrome"><span>${esc(title)}</span><span class="counter"></span></div>`;
}
function nav(): string { return `<button class="nbtn np">←</button><button class="nbtn nn">→</button>`; }

// ─── Slide renderers ──────────────────────────────────────────────────────────
export function renderTitle(s: TitleSlide, mod: string, wb: boolean): string {
  const corners = wb ? `<div class="wb-corners"><span class="wb-corner tl">${WB.stars}</span><span class="wb-corner tr">${WB.lightbulb}</span><span class="wb-corner bl">${WB.book}</span><span class="wb-corner br">${WB.pencil}</span></div>` : '';
  const underline = wb ? WB.underline : '';
  const gradCls = wb ? '' : 'gradient-text';
  const decors = wb ? '' : '<div class="decor"></div><div class="decor2"></div>';
  return `<section class="slide slide-title">
  ${chrome(mod)}${corners}${decors}
  <div style="position:relative;z-index:2">
    <span class="pill pill-accent" style="margin-bottom:18px;display:inline-block">${esc(s.badge)}</span>
    <h1 class="h1 ${gradCls}" style="margin-bottom:${wb?'2px':'14px'}">${esc(s.title)}</h1>
    ${underline}
    <p class="lede">${esc(s.subtitle)}</p>
  </div>
  ${nav()}
</section>`;
}

export function renderAgenda(s: AgendaSlide, mod: string): string {
  const items = (s.items||[]).slice(0,8).map(it=>`
    <div class="agenda-item">
      <div class="agenda-num">${esc(it.n)}</div>
      <div><div class="agenda-label">${esc(it.label)}</div><div class="agenda-desc">${esc(it.desc)}</div></div>
    </div>`).join('');
  return `<section class="slide">
  ${chrome(mod)}
  <span class="eyebrow">${esc(s.eyebrow)}</span>
  <div class="accent-bar"></div>
  <h2 class="h2">${esc(s.title)}</h2>
  <div class="agenda-grid">${items}</div>
  ${nav()}
</section>`;
}

export function renderContent(s: ContentSlide, imgUrl: string|null, mod: string): string {
  const img = imgUrl
    ? `<div class="content-right"><img src="${imgUrl}" alt="visual" loading="lazy"/></div>`
    : `<div class="content-right" style="min-height:180px;font-size:11px;color:#888;padding:16px;text-align:center;display:flex;align-items:center;justify-content:center"><span>Visual panel</span></div>`;
  const bullets = (s.points||[]).slice(0,4).map(p=>`<li><span>${esc(p)}</span></li>`).join('');
  return `<section class="slide">
  ${chrome(mod)}
  <div class="content-body">
    <div class="content-left">
      <span class="eyebrow">${esc(s.eyebrow)}</span>
      <div class="accent-bar"></div>
      <h2 class="h2">${esc(s.title)}</h2>
      <ul class="bullet-list">${bullets}</ul>
    </div>
    ${img}
  </div>
  ${nav()}
</section>`;
}

export function renderStats(s: StatsSlide, mod: string): string {
  const stats = (s.stats||[]).slice(0,3).map(st=>`
    <div class="stat-card">
      <div class="metric"><div class="n">${esc(st.value)}</div><div class="l">${esc(st.label)}</div></div>
    </div>`).join('');
  return `<section class="slide">
  ${chrome(mod)}
  <span class="eyebrow">${esc(s.eyebrow)}</span>
  <div class="accent-bar"></div>
  <h2 class="h2">${esc(s.title)}</h2>
  <div class="stats-grid">${stats}</div>
  ${nav()}
</section>`;
}

export function renderCaseStudy(s: CaseStudy, imgUrl: string|null, mod: string): string {
  const img = imgUrl
    ? `<div class="cs-right"><img src="${imgUrl}" alt="${esc(s.company)}" loading="lazy"/></div>`
    : `<div class="cs-right" style="min-height:180px;font-size:11px;color:#888;padding:16px;text-align:center;display:flex;align-items:center;justify-content:center"><span>Visual panel</span></div>`;
  return `<section class="slide">
  ${chrome(mod)}
  <div class="cs-body">
    <div class="cs-left">
      <span class="pill pill-accent">${esc(s.tag)}</span>
      <div class="cs-company">${esc(s.company)}</div>
      <p class="cs-headline">${esc(s.headline)}</p>
      <p class="cs-story">${esc(s.story)}</p>
      <span class="cs-result">${esc(s.result)}</span>
    </div>
    ${img}
  </div>
  ${nav()}
</section>`;
}

export function renderQuote(s: QuoteSlide, mod: string): string {
  return `<section class="slide" style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:8% 10%">
  ${chrome(mod)}
  <div class="quote-mark">"</div>
  <p class="quote-text">${esc(s.text)}</p>
  <div><div class="quote-author">${esc(s.author)}</div><div class="quote-role">${esc(s.role)}</div></div>
  ${nav()}
</section>`;
}

export function renderTakeaways(s: Takeaways, mod: string): string {
  const items = (s.items||[]).slice(0,6).map((it,i)=>`
    <div class="tk-card">
      <div class="tk-num">${String(i+1).padStart(2,'0')}</div>
      <div class="tk-text">${esc(it)}</div>
    </div>`).join('');
  return `<section class="slide">
  ${chrome(mod)}
  <span class="eyebrow">Summary</span>
  <h2 class="h2">${esc(s.title)}</h2>
  <div class="tk-grid">${items}</div>
  ${nav()}
</section>`;
}

export function renderEnd(s: EndSlide, mod: string, wb: boolean): string {
  const corners = wb ? `<div class="wb-corners"><span class="wb-corner tl">${WB.stars}</span><span class="wb-corner tr">${WB.gradCap}</span><span class="wb-corner bl">${WB.book}</span><span class="wb-corner br">${WB.pencil}</span></div>` : '';
  const underline = wb ? WB.underline : '';
  return `<section class="slide slide-end">
  ${chrome(mod)}${corners}
  <div style="position:relative;z-index:2;text-align:center;width:100%">
    <div class="end-title">${esc(s.title)}</div>
    ${underline}
    <p class="end-sub">${esc(mod)}</p>
    <p class="end-next">${esc(s.next)}</p>
  </div>
  ${nav()}
</section>`;
}

export function renderDiagram(s: DiagramSlide, svgContent: string|null, mod: string): string {
  const svgPanel = svgContent
    ? `<div class="diagram-right">${svgContent}</div>`
    : `<div class="diagram-right" style="font-size:11px;color:#888;display:flex;align-items:center;justify-content:center"><span>Diagram</span></div>`;
  return `<section class="slide">
  ${chrome(mod)}
  <div class="diagram-body">
    <div class="diagram-left">
      <span class="eyebrow">${esc(s.eyebrow)}</span>
      <div class="accent-bar"></div>
      <h2 class="h2">${esc(s.title)}</h2>
      <p class="lede" style="margin-top:12px;font-size:clamp(11px,1.3vw,14px)">${esc(s.description)}</p>
    </div>
    ${svgPanel}
  </div>
  ${nav()}
</section>`;
}

export function renderSlide(slide: AnySlide, media: string|null, modTitle: string, wb: boolean): string {
  switch (slide.type) {
    case 'title':      return renderTitle(slide as TitleSlide, modTitle, wb);
    case 'agenda':     return renderAgenda(slide as AgendaSlide, modTitle);
    case 'content':    return renderContent(slide as ContentSlide, media, modTitle);
    case 'stats':      return renderStats(slide as StatsSlide, modTitle);
    case 'case-study': return renderCaseStudy(slide as CaseStudy, media, modTitle);
    case 'quote':      return renderQuote(slide as QuoteSlide, modTitle);
    case 'takeaways':  return renderTakeaways(slide as Takeaways, modTitle);
    case 'end':        return renderEnd(slide as EndSlide, modTitle, wb);
    case 'diagram':    return renderDiagram(slide as DiagramSlide, media, modTitle);
    default:           return '';
  }
}

// ─── HTML assembler ────────────────────────────────────────────────────────────
export function buildHtml(sections: string, dir: DirectionConfig, wb: boolean, title: string): string {
  return `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
${dir.fonts}
:root{${dir.tokens}}
${BASE_CSS}
${wb ? WB_EXTRA_CSS : ''}
</style></head>
<body><div class="deck">
${sections}
</div>
<div class="pbar"><span></span></div>
<script>${RUNTIME_JS}</script>
</body></html>`;
}

export function buildHtmlWrapper(dir: DirectionConfig, wb: boolean, title: string): { head: string; tail: string } {
  const head = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<style>
${dir.fonts}
:root{${dir.tokens}}
${BASE_CSS}
${wb ? WB_EXTRA_CSS : ''}
</style></head>
<body><div class="deck">
`;
  const tail = `
</div>
<div class="pbar"><span></span></div>
<script>${RUNTIME_JS}</script>
</body></html>`;
  return { head, tail };
}

// ─── Slide count distributions ────────────────────────────────────────────────
export const SLIDE_DISTRIBUTIONS: Record<number, string[]> = {
  6:  ['title','agenda','content','diagram','takeaways','end'],
  10: ['title','agenda','content','content','stats','diagram','case-study','quote','takeaways','end'],
  15: ['title','agenda','content','content','stats','content','diagram','content','case-study','diagram','case-study','quote','takeaways','takeaways','end'],
  20: ['title','agenda','content','content','stats','content','diagram','content','case-study','diagram','case-study','stats','content','diagram','case-study','content','quote','takeaways','takeaways','end'],
  30: ['title','agenda','content','content','stats','content','diagram','content','case-study','diagram','content','case-study','stats','content','diagram','case-study','content','stats','diagram','content','case-study','diagram','quote','content','diagram','case-study','takeaways','takeaways','takeaways','end'],
};

// ─── Image generation (Ideogram v2 — pure visuals, NO TEXT) ──────────────────
export async function genImage(slidePrompt: string, styleAnchor: string, moduleCtx: string): Promise<string|null> {
  if (!process.env.FAL_KEY) return null;
  const fullPrompt = `${styleAnchor}\n\n${moduleCtx}\n\n${slidePrompt}\n\nIMPORTANT: NO TEXT. NO WORDS. NO LETTERS. NO LABELS. NO CAPTIONS. Purely visual.`;
  try {
    const res = await fetch('https://fal.run/fal-ai/ideogram/v2', {
      method: 'POST',
      headers: { Authorization: `Key ${process.env.FAL_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt, aspect_ratio: '4:3', style: 'design', magic_prompt_option: 'OFF' }),
      signal: AbortSignal.timeout(60000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.images?.[0]?.url as string) ?? null;
  } catch { return null; }
}

// ─── SVG diagram generation (Claude Haiku — 100% text-accurate) ───────────────
export async function genDiagram(description: string, primaryColor: string): Promise<string|null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const msg = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: `Generate a clean inline SVG diagram.
ViewBox: 0 0 560 320. Attributes: width="560" height="320".
Topic to diagram: ${description}
Primary color: ${primaryColor}
Rules:
- Use SVG text elements for all labels (accurate, readable, font-family="Arial,sans-serif")
- Use rect, circle, path, line, polygon, arrow markers for structure
- Clean minimal design, adequate whitespace, font-size 11-14px for labels
- Use ${primaryColor} for main accents, lighter tints for fills
- Return ONLY the <svg ...>...</svg> element. No markdown. No explanation.`,
      }],
    });
    const raw = msg.content
      .filter(b => b.type === 'text')
      .map(b => (b as {type:'text';text:string}).text)
      .join('');
    const match = raw.match(/<svg[\s\S]*?<\/svg>/i);
    return match ? match[0] : null;
  } catch { return null; }
}

// ─── Content prompt (for Qwen3 32B via OpenRouter) ────────────────────────────
export function buildContentPrompt(topics: string[], title: string, semester: number, moduleNum: number, hours: number, tools: string[], indianCase: string|undefined, globalCase: string|undefined, outcomes: string[]|undefined, slideSequence: string[], customPrompt: string): string {
  const info = [
    `Title: ${title}`,
    `Semester ${semester}, Module ${moduleNum} | ${hours} hours`,
    `Topics: ${topics.join(', ')}`,
    tools.length ? `Tools: ${tools.join(', ')}` : '',
    indianCase ? `India Case Study context: ${indianCase}` : '',
    globalCase ? `Global Case Study context: ${globalCase}` : '',
    outcomes?.length ? `Learning Outcomes: ${outcomes.join('; ')}` : '',
  ].filter(Boolean).join('\n');

  const typeSchemas = `SLIDE TYPE SCHEMAS (use exactly these fields):
- title: {"type":"title","title":"max 6 words","subtitle":"max 10 words","badge":"Sem ${semester} · Mod ${moduleNum}"}
- agenda: {"type":"agenda","eyebrow":"short uppercase label","title":"agenda title","items":[{"n":"01","label":"max 4 words","desc":"max 8 words"}]}
- content: {"type":"content","eyebrow":"short label","title":"max 6 words","points":["max 7 words each, 4 items"],"imagePrompt":"20-30 words, PURELY VISUAL SCENE, absolutely no text/words/labels described"}
- stats: {"type":"stats","eyebrow":"short label","title":"max 6 words","stats":[{"value":"73M","label":"max 4 words"},{"value":"42%","label":"max 4 words"},{"value":"₹2.3T","label":"max 4 words"}]}
- case-study: {"type":"case-study","tag":"India or Global","company":"real company name","headline":"max 8 words","story":"max 25 words, one sentence","result":"metric or outcome","imagePrompt":"20-30 words, PURELY VISUAL SCENE, no text"}
- quote: {"type":"quote","text":"real quote max 20 words","author":"real person name","role":"title/company"}
- takeaways: {"type":"takeaways","title":"Key Takeaways","items":["max 8 words each, 6 items"]}
- diagram: {"type":"diagram","eyebrow":"short label","title":"max 6 words","description":"what to diagram: e.g. four-stage RACE framework cycle showing Reach, Act, Convert, Engage steps with arrows"}
- end: {"type":"end","title":"Thank You","next":"Next: Module X — topic name"}`;

  return `/no_think
You are generating BBA university course presentation slides. Return ONLY valid JSON. No markdown, no explanation, no <think> tags.

MODULE:
${info}

SLIDE SEQUENCE (generate EXACTLY ${slideSequence.length} slides in this order):
${slideSequence.map((t,i)=>`${i+1}. ${t}`).join('\n')}
${customPrompt ? `\nEXTRA INSTRUCTIONS: ${customPrompt}` : ''}

${typeSchemas}

RULES:
- Use REAL data: real companies, real statistics, real quotes from Indian/global business context
- imagePrompt fields: describe ONLY abstract visual scenes (colors, shapes, textures, mood) — NEVER describe text, labels, charts with text, or UI elements
- All text content must be concise and within word limits
- Indian case studies should use Indian companies (Infosys, Reliance, Flipkart, Zomato, Tata, HDFC, etc.)
- Global case studies use global companies (Apple, Amazon, Google, McKinsey, etc.)

RETURN THIS EXACT JSON:
{"slides":[...all ${slideSequence.length} slides...]}`;
}
