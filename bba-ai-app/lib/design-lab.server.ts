
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
    primaryColor: '#1a3a6b',
    bg: '#fafafa',
    accent: '#1a3a6b',
    fonts: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Caveat:wght@600&family=Inter:wght@400;500;600&display=swap');`,
    tokens: `--bg:#fdfcf9;--bg-soft:#f8f7f2;--surface:#ffffff;--surface-2:#f5f3ee;--border:#ddd9ce;--text-1:#1a1a2e;--text-2:#4a5068;--text-3:#8892a4;--accent:#1a3a6b;--accent-2:#c9a44a;--accent-3:rgba(26,58,107,.1);--wb-navy:#1a3a6b;--wb-gold:#c9a44a;--wb-yellow:#f1c40f;--wb-green:#2ecc71;--grad:linear-gradient(135deg,#1a3a6b,#c9a44a);--font-sans:'Inter',system-ui,sans-serif;--font-display:'Plus Jakarta Sans',system-ui,sans-serif;--n-size:80px;--n-color:#1a3a6b;`,
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
.slide{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:9% 7% 9%;opacity:0;pointer-events:none;transition:opacity .35s ease,transform .35s ease;transform:translateX(4%);background:var(--bg)}
.slide.active{opacity:1;pointer-events:auto;transform:translateX(0);z-index:2}
.slide.prev{transform:translateX(-4%);opacity:0}
.h1{font-family:var(--font-display);font-size:clamp(34px,5.2vw,68px);line-height:1.05;font-weight:800;letter-spacing:-.04em}
.h2{font-family:var(--font-display);font-size:clamp(22px,3.6vw,48px);line-height:1.1;font-weight:700;letter-spacing:-.03em}
.lede{font-size:clamp(15px,2vw,24px);line-height:1.6;color:var(--text-2);font-weight:400}
.eyebrow{font-size:clamp(11px,1.1vw,13px);font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:10px}
.kicker{font-size:clamp(10px,.9vw,12px);font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);margin-bottom:6px;display:block}
.gradient-text{background:var(--grad);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.accent-bar{width:56px;height:5px;background:var(--grad);border-radius:99px;margin-bottom:16px;display:flex;gap:4px}
.accent-bar::after{content:'';display:block;width:8px;height:5px;background:var(--accent-2);border-radius:99px;margin-left:6px;opacity:.6}
.metric{display:flex;flex-direction:column;align-items:flex-start}
.metric .n{font-size:var(--n-size,80px);font-weight:800;line-height:1;letter-spacing:-.04em;color:var(--n-color,var(--accent));font-family:var(--font-display)}
.metric .l{font-size:clamp(11px,1.2vw,14px);color:var(--text-2);font-weight:500;margin-top:4px;text-transform:uppercase;letter-spacing:.06em}
.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px;box-shadow:0 1px 4px rgba(0,0,0,.04),0 4px 12px rgba(26,58,107,.04)}
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
.slide-logo{position:absolute;top:14px;left:22px;height:30px;z-index:11;pointer-events:none;display:flex;align-items:center;gap:8px}
.slide-logo-mark{width:30px;height:30px;border-radius:6px;background:var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.slide-logo-mark svg{width:18px;height:18px}
.slide-logo-wordmark{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);font-family:var(--font-sans);line-height:1}
.slide-footer{position:absolute;bottom:0;left:0;right:0;height:26px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;font-size:10px;color:var(--text-3);letter-spacing:.1em;text-transform:uppercase;border-top:1px solid var(--border);z-index:10;pointer-events:none;background:var(--bg)}
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
.content-body{display:flex;gap:4%;align-items:center;height:calc(100% - 110px)}
.content-left{flex:0 0 52%}
.content-right{flex:0 0 44%;height:68%;border-radius:14px;overflow:hidden;background:var(--surface-2);display:flex;align-items:center;justify-content:center;border:1px solid var(--border)}
.content-right img{width:100%;height:100%;object-fit:cover}
.content-right svg{max-width:100%;max-height:100%;padding:12px}
.bullet-list{list-style:none;padding:0;margin-top:14px}
.bullet-list li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)}
.bullet-list li:last-child{border-bottom:none}
.bullet-list li::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--accent-2);flex-shrink:0;margin-top:7px}
.bullet-list li span{font-size:clamp(13px,1.6vw,17px);color:var(--text-2);line-height:1.6}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:22px}
.stat-card{padding:20px 18px;border-radius:14px;border:1px solid var(--border);background:var(--surface);box-shadow:0 2px 8px rgba(26,58,107,.06)}
.cs-body{display:flex;gap:4%;height:calc(100% - 110px);align-items:center}
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
.diagram-body{display:flex;gap:4%;align-items:center;height:calc(100% - 110px)}
.diagram-left{flex:0 0 34%}
.diagram-right{flex:1;height:80%;border-radius:14px;overflow:hidden;background:var(--surface-2);display:flex;align-items:center;justify-content:center;border:1px solid var(--border);padding:16px}
.diagram-right svg{max-width:100%;max-height:100%}
.wb-dot-grid{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(26,58,107,.06) 1px,transparent 1px);background-size:28px 28px;pointer-events:none;z-index:0}
.tk-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
.tk-card-2{padding:16px 20px;border-radius:12px;background:var(--surface);border:1px solid var(--border);display:flex;align-items:flex-start;gap:12px}
.tk-num-2{font-size:clamp(24px,3.2vw,38px);font-weight:800;color:var(--accent);line-height:1;font-family:var(--font-display);flex-shrink:0;width:36px}
.tk-text-2{font-size:clamp(12px,1.4vw,15px);color:var(--text-2);line-height:1.5;padding-top:4px}`;

export const WB_EXTRA_CSS = `.h1{font-family:'Plus Jakarta Sans',system-ui,sans-serif!important;font-weight:800!important;letter-spacing:-.04em!important;color:#1a3a6b!important}
.h2{font-family:'Plus Jakarta Sans',system-ui,sans-serif!important;font-weight:700!important;letter-spacing:-.03em!important;color:#1a3a6b!important}
.agenda-num{font-family:'Plus Jakarta Sans',system-ui,sans-serif!important;font-size:clamp(28px,4vw,52px)!important;color:#1a3a6b!important;font-weight:800!important}
.metric .n{font-family:'Plus Jakarta Sans',system-ui,sans-serif!important;color:#1a3a6b!important;font-weight:800!important}
.end-title{font-family:'Plus Jakarta Sans',system-ui,sans-serif!important;font-weight:800!important}
.tk-num{font-family:'Plus Jakarta Sans',system-ui,sans-serif!important;color:#1a3a6b!important;font-weight:800!important}
.quote-text{font-family:'Plus Jakarta Sans',system-ui,sans-serif!important;font-size:clamp(22px,3.5vw,46px)!important;font-weight:600!important;font-style:italic!important}
.quote-mark{color:#c9a44a!important;opacity:.5!important}
.card,.tk-card,.stat-card{border:1px solid rgba(26,58,107,.12)!important;border-radius:12px!important;box-shadow:0 2px 10px rgba(26,58,107,.06)!important}
.card-accent{border-left:4px solid #1a3a6b!important}
.card-soft,.agenda-item{background:var(--surface-2)!important;border:1px solid rgba(26,58,107,.08)!important;box-shadow:none!important}
.bullet-list li::before{background:#c9a44a!important}
.accent-bar{background:linear-gradient(90deg,#1a3a6b,#c9a44a)!important}
.eyebrow,.kicker{color:#1a3a6b!important;letter-spacing:.2em!important}
.cs-result{background:rgba(201,164,74,.12)!important;color:#8b6914!important;border-color:rgba(201,164,74,.3)!important}
.nbtn:hover{background:#1a3a6b!important;border-color:#1a3a6b!important}
.content-right,.cs-right{border:1px solid rgba(26,58,107,.12)!important;background:rgba(201,164,74,.04)!important}`;

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

// ─── Slide type interfaces (16 types — Refer.pdf pedagogy) ───────────────────
export interface TitleSlide { type: 'title'; title: string; subtitle: string; badge: string; visualPrompt: string; }
export interface OverviewSlide { type: 'overview'; eyebrow: string; title: string; goals: string[]; agendaItems: string[]; visualPrompt: string; }
export interface ExperienceTriggerSlide { type: 'experience-trigger'; eyebrow: string; scenarioTitle: string; scenario: string; question: string; visualPrompt: string; }
export interface ReflectionSlide { type: 'reflection'; eyebrow: string; title: string; discussionQuestions: string[]; insight: string; visualPrompt: string; }
export interface ConceptSlide { type: 'concept'; eyebrow: string; title: string; definition: string; bullets: string[]; visualPrompt: string; }
export interface ProcessFlowSlide { type: 'process-flow'; eyebrow: string; title: string; steps: { label: string; summary: string }[]; visualPrompt: string; }
export interface ComparisonSlide { type: 'comparison'; eyebrow: string; title: string; columns: { heading: string; points: string[] }[]; visualPrompt: string; }
export interface FrameworkSlide { type: 'framework'; eyebrow: string; title: string; modelName: string; segments: { label: string; description: string }[]; visualPrompt: string; }
export interface WorkedExampleSlide { type: 'worked-example'; eyebrow: string; title: string; problem: string; process: string[]; result: string; visualPrompt: string; }
export interface ExampleCaseSlide { type: 'example-case'; tag: string; company: string; scenario: string; question: string; outcome: string; visualPrompt: string; }
export interface ExerciseSlide { type: 'exercise'; eyebrow: string; title: string; taskInstructions: string; steps: string[]; timeAllotted: string; visualPrompt: string; }
export interface PrototypeStudioSlide { type: 'prototype-studio'; eyebrow: string; brief: string; makingSteps: string[]; templateBoxes: string[]; visualPrompt: string; }
export interface TestFeedbackSlide { type: 'test-feedback'; eyebrow: string; title: string; criteria: { label: string; description: string }[]; feedbackExamples: { good: string; poor: string }; visualPrompt: string; }
export interface SummarySlide { type: 'summary'; eyebrow: string; title: string; takeaways: string[]; visualPrompt: string; }
export interface ChecklistSlide { type: 'checklist'; eyebrow: string; title: string; doItems: string[]; avoidItems: string[]; visualPrompt: string; }
export interface TransitionRecapSlide { type: 'transition-recap'; eyebrow: string; recapTitle: string; recapPoints: string[]; previewTitle: string; previewPoints: string[]; visualPrompt: string; }

export type AnySlide =
  | TitleSlide | OverviewSlide | ExperienceTriggerSlide | ReflectionSlide
  | ConceptSlide | ProcessFlowSlide | ComparisonSlide | FrameworkSlide
  | WorkedExampleSlide | ExampleCaseSlide | ExerciseSlide | PrototypeStudioSlide
  | TestFeedbackSlide | SummarySlide | ChecklistSlide | TransitionRecapSlide;

// ─── Slide count distributions (10 and 20 only — Refer.pdf pedagogy) ─────────
export const SLIDE_DISTRIBUTIONS: Record<number, string[]> = {
  10: [
    'title',
    'overview',
    'experience-trigger',
    'concept',
    'process-flow',
    'worked-example',
    'example-case',
    'exercise',
    'summary',
    'checklist',
  ],
  20: [
    'title',
    'overview',
    'experience-trigger',
    'reflection',
    'concept',
    'process-flow',
    'framework',
    'comparison',
    'transition-recap',
    'worked-example',
    'example-case',
    'reflection',
    'exercise',
    'prototype-studio',
    'example-case',
    'test-feedback',
    'summary',
    'checklist',
    'transition-recap',
    'title',
  ],
};

// ─── Theme → image prompt style descriptors ───────────────────────────────────
export const THEME_STYLE_DESCRIPTORS: Record<string, string> = {
  'modern-minimal': 'Clean Swiss editorial layout, white/off-white background, strong blue-violet accent color #3b6cff, generous negative space, asymmetric composition, museum-quality typography hierarchy. ',
  'campus-ai': 'Warm cream parchment background #F5F0E8, deep academic purple #5B2D8E and energetic orange #E8681A accents, modern Indian university aesthetic, collegial and inviting, clean sans-serif hierarchy. ',
  'editorial': 'Warm ivory paper #fdf8f2 background, bold coral-red #c0392b accent, classical editorial newspaper aesthetic, serif display type feel, ink-and-paper mood, refined and authoritative. ',
  'tech-dark': 'Deep dark background #0d1117, glowing blue #58a6ff and green #3fb950 neon accents, circuit-board organic shapes, data visualization aesthetic, futuristic minimal, high-contrast. ',
  'whiteboard': 'Clean chalk-white background, navy blue #1a3a6b and gold #c9a44a marker colors, hand-drawn infographic aesthetic, flat vector educational illustration, primary color pops, textbook diagram warmth. ',
  'kami-serif': 'Warm parchment #f5f4ed background, deep ink-blue #1B365D and antique gold #8B6914 accents, classical scholarly aesthetic, Garamond serif mood, authoritative academic gravitas, timeless. ',
};

// ─── Slide layout descriptors (internal — used by buildSlideImagePrompt) ──────
const SLIDE_LAYOUT_DESCRIPTORS: Record<string, string> = {
  'title': 'Full-bleed presentation title slide, 16:9. Left two-thirds: large bold title text area, subtitle below. Right third: abstract decorative shape/illustration. Logo placeholder bottom-left.',
  'overview': 'Agenda/overview slide, 16:9. Left half: numbered goal list (3-4 items) with icon placeholders. Right half: abstract cluster diagram or icon grid showing topics.',
  'experience-trigger': 'Opening scenario slide, 16:9. Top 60%: full-width immersive scene illustration. Bottom panel: scenario title and hook question text areas.',
  'reflection': 'Discussion/reflection slide, 16:9. Center-left: large question mark motif or thought-bubble visual. Right: 2-3 discussion question text blocks with connecting visual lines.',
  'concept': 'Concept definition slide, 16:9. Left 55%: eyebrow label, title, definition paragraph, 3 bullet points. Right 45%: conceptual diagram or icon illustration representing the concept.',
  'process-flow': 'Process flow slide, 16:9. Horizontal arrow flow diagram with 4-5 numbered stages, each with label and one-line summary below. Clean linear progression left to right.',
  'comparison': 'Comparison slide, 16:9. 2-3 equal columns separated by thin divider lines. Each column: header label, 3-4 bullet points. Background alternates lightly.',
  'framework': 'Framework model slide, 16:9. Large central labeled diagram (quadrant, layered ring, or matrix) occupying right 55%. Left 45%: framework name title and 4 bullet annotations.',
  'worked-example': 'Worked example slide, 16:9. Three-panel horizontal layout. Left panel (input/problem): shaded background. Center panel (process/reasoning): arrows and steps. Right panel (output/result): highlighted conclusion.',
  'example-case': 'Case study slide, 16:9. Top: company/case name with tag badge. Left 50%: scenario paragraph and question text. Right 50%: timeline storyboard or contextual scene illustration.',
  'exercise': 'Exercise/activity slide, 16:9. Top: bold task instruction banner. Center: numbered checklist steps with checkbox visuals. Bottom-right: time allocation badge.',
  'prototype-studio': 'Studio/making slide, 16:9. Top strip: brief text. Below: 3-4 equal-width template boxes with dashed borders (workspace placeholders). Process arrow flow between boxes.',
  'test-feedback': 'Rubric/feedback slide, 16:9. Left half: criteria/rubric table with 3-4 rows and rating scale. Right half: good vs poor example cards, color-coded green/red.',
  'summary': 'Key takeaways slide, 16:9. Left-center: large numbered list (3-5 items) with icon accents. Right: abstract summary visual or upward-arrow motif. Clean warm closure feel.',
  'checklist': 'Do vs Avoid slide, 16:9. Two-column layout. Left column (Do/Best Practice): green-accented list. Right column (Avoid/Pitfall): red-accented list. Center divider line.',
  'transition-recap': 'Transition slide, 16:9. Left half (slightly darker bg): Recap heading + 2-3 bullet points. Right half (lighter bg): Preview heading + 2-3 bullet points. Vertical divider with arrow motif.',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function esc(s: string): string {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Slide image prompt builder ───────────────────────────────────────────────
export function buildSlideImagePrompt(slide: AnySlide, themeKey: string, moduleTitle: string): string {
  const style = THEME_STYLE_DESCRIPTORS[themeKey] ?? THEME_STYLE_DESCRIPTORS['modern-minimal'];
  const layout = SLIDE_LAYOUT_DESCRIPTORS[slide.type] ?? '';
  const visual = (slide as { visualPrompt?: string }).visualPrompt ?? '';
  return [
    style,
    layout,
    `Academic BBA course topic: ${moduleTitle}.`,
    visual,
    `CRITICAL: This is a COMPLETE SLIDE IMAGE. Include ALL text, labels, titles, and content visible as rendered slide text. Render as a polished 16:9 presentation slide. Typography must be legible at presentation scale. No lorem ipsum. Use the actual content described.`,
  ].join(' ');
}

// ─── Slide image generation (nano-banana-pro — complete slide rendering) ──────
export async function genSlideImage(fullPrompt: string): Promise<string | null> {
  if (!process.env.FAL_KEY) return null;
  try {
    const res = await fetch('https://fal.run/fal-ai/nano-banana-pro', {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        image_size: 'landscape_16_9',
        num_images: 1,
      }),
      signal: AbortSignal.timeout(90000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.images?.[0]?.url as string) ?? null;
  } catch {
    return null;
  }
}

// ─── Content prompt (Claude Sonnet — 16-type pedagogy with visualPrompt) ──────
export function buildContentPrompt(
  topics: string[],
  title: string,
  semester: number,
  moduleNum: number,
  hours: number,
  tools: string[],
  indianCase: string | undefined,
  globalCase: string | undefined,
  outcomes: string[] | undefined,
  slideSequence: string[],
  customPrompt: string,
): string {
  const info = [
    `Title: ${title}`,
    `Semester ${semester}, Module ${moduleNum} | ${hours} hours`,
    `Topics: ${topics.join(', ')}`,
    tools.length ? `Tools: ${tools.join(', ')}` : '',
    indianCase ? `India Case Study context: ${indianCase}` : '',
    globalCase ? `Global Case Study context: ${globalCase}` : '',
    outcomes?.length ? `Learning Outcomes: ${outcomes.join('; ')}` : '',
  ].filter(Boolean).join('\n');

  const depthInstruction = slideSequence.length === 10
    ? `DEPTH: 10-slide deck = BREADTH-FIRST coverage. Cover ALL topics concisely. Every input topic must appear at least once. Prioritize breadth over depth. Be concise in each slide.`
    : `DEPTH: 20-slide deck = DEEP-DIVE treatment. Cover ALL topics with full pedagogical depth. Use multiple examples, reflections, and exercises. Expand every concept fully.`;

  const typeSchemas = `SLIDE TYPE SCHEMAS — generate EXACTLY these JSON shapes:

title:
{"type":"title","title":"max 8 words — module name","subtitle":"max 12 words — module hook","badge":"Sem ${semester} · Mod ${moduleNum}","visualPrompt":"FULL SLIDE DESCRIPTION: title text top-left in large bold font, subtitle below in medium weight, right side abstract decorative geometric shape in theme color, bottom-left BBA Online logo area, background color appropriate to theme. Include actual title and subtitle text."}

overview:
{"type":"overview","eyebrow":"COURSE OVERVIEW","title":"max 6 words","goals":["goal 1 max 8 words","goal 2","goal 3","goal 4"],"agendaItems":["topic 1","topic 2","topic 3","topic 4","topic 5"],"visualPrompt":"FULL SLIDE DESCRIPTION: left half numbered goal list with 4 items rendered as text, right half topic cluster diagram with topic names visible as node labels, theme color accents. Include actual goal text and topic names."}

experience-trigger:
{"type":"experience-trigger","eyebrow":"REAL-WORLD SCENARIO","scenarioTitle":"max 6 words","scenario":"2-3 sentences describing a real business scenario involving the topic","question":"One provocative discussion question?","visualPrompt":"FULL SLIDE DESCRIPTION: top 60% immersive illustration of the scenario setting (office, market, factory, etc), bottom panel has scenario title text and question text visible, dark overlay on illustration for text legibility. Include actual scenario title and question text."}

reflection:
{"type":"reflection","eyebrow":"REFLECT","title":"max 6 words","discussionQuestions":["question 1?","question 2?","question 3?"],"insight":"1-2 sentence key insight","visualPrompt":"FULL SLIDE DESCRIPTION: large thought-bubble or question-mark visual motif on left 40%, right 60% shows 3 discussion questions as styled text cards with question marks, insight text at bottom, theme color background. Include actual question text."}

concept:
{"type":"concept","eyebrow":"KEY CONCEPT","title":"concept name max 5 words","definition":"clear 1-2 sentence definition of the concept","bullets":["application or example 1","application or example 2","application or example 3"],"visualPrompt":"FULL SLIDE DESCRIPTION: left 55% has eyebrow label, large concept title, definition paragraph, 3 bullet points all as visible text; right 45% has conceptual diagram, icon cluster, or metaphor illustration. Include actual definition and bullet text."}

process-flow:
{"type":"process-flow","eyebrow":"THE PROCESS","title":"max 6 words","steps":[{"label":"Step 1 Name","summary":"one-line description"},{"label":"Step 2 Name","summary":"one-line description"},{"label":"Step 3 Name","summary":"one-line description"},{"label":"Step 4 Name","summary":"one-line description"}],"visualPrompt":"FULL SLIDE DESCRIPTION: horizontal left-to-right arrow flow diagram with 4 numbered stage boxes, each box shows step label text and summary text below, connecting arrows between boxes, theme accent color. Include actual step names and summaries."}

comparison:
{"type":"comparison","eyebrow":"COMPARE","title":"max 6 words","columns":[{"heading":"Option A Name","points":["point 1","point 2","point 3"]},{"heading":"Option B Name","points":["point 1","point 2","point 3"]}],"visualPrompt":"FULL SLIDE DESCRIPTION: 2 equal-width columns with thin divider, each column shows heading text in accent color, 3 bullet points as readable text, light alternating column backgrounds, comparison title at top. Include actual column headings and points."}

framework:
{"type":"framework","eyebrow":"FRAMEWORK","title":"framework name max 6 words","modelName":"full model name e.g. SWOT Analysis","segments":[{"label":"Segment 1","description":"1-sentence description"},{"label":"Segment 2","description":"1-sentence description"},{"label":"Segment 3","description":"1-sentence description"},{"label":"Segment 4","description":"1-sentence description"}],"visualPrompt":"FULL SLIDE DESCRIPTION: right 55% shows large 2x2 quadrant matrix or 4-segment ring diagram with each segment labeled with visible text; left 45% shows framework name title, 4 annotation bullets with segment names. Include actual segment labels and descriptions."}

worked-example:
{"type":"worked-example","eyebrow":"WORKED EXAMPLE","title":"max 6 words","problem":"1-2 sentences describing the problem or input","process":["reasoning step 1 max 10 words","reasoning step 2 max 10 words","reasoning step 3 max 10 words"],"result":"the outcome or solution in 1-2 sentences","visualPrompt":"FULL SLIDE DESCRIPTION: 3-panel horizontal layout — left panel (shaded) shows Problem text, center panel shows numbered process steps with arrows, right panel (highlighted in theme accent) shows Result text. All text visible and readable. Include actual problem and result text."}

example-case:
{"type":"example-case","tag":"India","company":"real Indian company e.g. Zomato, Infosys, Tata Motors","scenario":"2-3 sentence real scenario description","question":"one discussion question?","outcome":"metric or business result achieved","visualPrompt":"FULL SLIDE DESCRIPTION: top-left company name in bold, India/Global badge pill, left 50% shows scenario text and question text, right 50% shows contextual illustration (office scene, product, market), outcome text in accent-colored badge at bottom. Include actual company name and scenario text."}

exercise:
{"type":"exercise","eyebrow":"ACTIVITY","title":"exercise title max 6 words","taskInstructions":"1-2 sentences describing the task","steps":["step 1 instruction","step 2 instruction","step 3 instruction","step 4 instruction"],"timeAllotted":"e.g. 15 minutes","visualPrompt":"FULL SLIDE DESCRIPTION: bold activity title at top, task instruction text below, numbered checklist with 4 steps each with checkbox visual, time badge in bottom-right corner (e.g. '15 MIN'), theme accent colors. Include actual step instructions and time."}

prototype-studio:
{"type":"prototype-studio","eyebrow":"STUDIO","brief":"1-2 sentence creative brief for what to make","makingSteps":["making step 1","making step 2","making step 3","making step 4"],"templateBoxes":["Box 1 label","Box 2 label","Box 3 label","Box 4 label"],"visualPrompt":"FULL SLIDE DESCRIPTION: brief text at top, below 4 equal dashed-border workspace template boxes labeled with box names, process arrows connecting boxes left to right, template boxes have dotted/dashed outlines suggesting blank workspace. Include actual brief text and box labels."}

test-feedback:
{"type":"test-feedback","eyebrow":"EVALUATE","title":"max 6 words","criteria":[{"label":"Criterion 1","description":"what to assess"},{"label":"Criterion 2","description":"what to assess"},{"label":"Criterion 3","description":"what to assess"},{"label":"Criterion 4","description":"what to assess"}],"feedbackExamples":{"good":"example of strong response","poor":"example of weak response"},"visualPrompt":"FULL SLIDE DESCRIPTION: left half shows rubric table with 4 rows (criterion labels visible), right half shows two cards — green-tinted Good Example card and red-tinted Poor Example card, both showing example text. Include actual criterion names and example text."}

summary:
{"type":"summary","eyebrow":"KEY TAKEAWAYS","title":"max 6 words","takeaways":["takeaway 1 max 10 words","takeaway 2","takeaway 3","takeaway 4","takeaway 5"],"visualPrompt":"FULL SLIDE DESCRIPTION: left-center large numbered list with 5 takeaways rendered as readable text with accent-color numbers, right side abstract upward-arrow or ascending graph motif, warm closure visual mood. Include actual takeaway text."}

checklist:
{"type":"checklist","eyebrow":"DO'S AND DON'TS","title":"max 6 words","doItems":["do item 1 max 8 words","do item 2","do item 3","do item 4"],"avoidItems":["avoid item 1 max 8 words","avoid item 2","avoid item 3","avoid item 4"],"visualPrompt":"FULL SLIDE DESCRIPTION: two-column layout with vertical center divider — left column (green accent) shows DO list with checkmarks, right column (red accent) shows AVOID list with X marks, all items visible as text. Include actual do and avoid items."}

transition-recap:
{"type":"transition-recap","eyebrow":"RECAP & PREVIEW","recapTitle":"What We Covered","recapPoints":["recap point 1","recap point 2","recap point 3"],"previewTitle":"Coming Up Next","previewPoints":["preview point 1","preview point 2","preview point 3"],"visualPrompt":"FULL SLIDE DESCRIPTION: left half (slightly darker background) shows Recap heading text and 3 recap bullet points, right half (lighter background) shows Preview heading text and 3 preview bullet points, vertical divider line with right-pointing arrow motif in center. Include actual recap and preview text."}`;

  return `You are generating BBA university course presentation slides following the Design Thinking + Kolb Experiential Learning pedagogy framework. Return ONLY valid JSON. No markdown, no explanation, no <think> tags.

MODULE INFORMATION:
${info}

SLIDE SEQUENCE — generate EXACTLY ${slideSequence.length} slides in this exact order:
${slideSequence.map((t, i) => `${i + 1}. ${t}`).join('\n')}

${depthInstruction}
${customPrompt ? `\nEXTRA INSTRUCTIONS: ${customPrompt}` : ''}

${typeSchemas}

CRITICAL RULES:
1. Use REAL data: real companies (Infosys, Zomato, Tata Motors, HDFC Bank, Flipkart for India; Apple, McKinsey, Amazon, Google, Unilever for Global), real statistics, real business scenarios.
2. Cover ALL input topics across the slides. Do not skip any topic from the module topics list.
3. visualPrompt MUST describe the COMPLETE RENDERED SLIDE including:
   - Actual title text visible in the image
   - Actual body content (definitions, bullets, steps, etc.) as rendered text
   - Layout description (which elements are where)
   - Visual metaphor or diagram type
   - Color mood and theme
   BAD: "abstract diagram of marketing concepts"
   GOOD: "Slide titled 'What is Digital Marketing?' at top. Left 55%: definition text 'Digital marketing uses online channels to reach target audiences', three bullets: Search & Social Media, Email & Content Marketing, Analytics & ROI. Right 45%: circular interconnected nodes diagram representing digital touchpoints, blue-violet gradient, clean white background."
4. All text content must fit the slide — concise and scannable.
5. Indian example-case slides: use Indian companies. Global example-case slides: use global companies.
6. The visualPrompt for every slide must include the actual text that should appear on that slide.

RETURN THIS EXACT JSON FORMAT:
{"slides":[...all ${slideSequence.length} slides in the exact sequence above...]}`;
}
