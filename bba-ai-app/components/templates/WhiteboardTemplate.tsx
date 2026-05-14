'use client';

import type { ParsedModule, ArtifactType } from '@/lib/types';

interface Props {
  content: string;
  module: ParsedModule;
  artifactType: ArtifactType;
  heroImageUrl?: string | null;
}

const FONT = "'Caveat', cursive";
const BLACK = '#1A1A1A';
const BLUE = '#5B9BD5';
const RED = '#E8281A';

function parseSlides(markdown: string): Array<{ title: string; body: string; index: number }> {
  const lines = markdown.split('\n');
  const slides: Array<{ title: string; body: string[]; index: number }> = [];
  let current: { title: string; body: string[]; index: number } | null = null;
  let slideIndex = 0;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) slides.push({ title: current.title, body: current.body, index: current.index });
      current = { title: line.replace(/^##\s+/, ''), body: [], index: slideIndex++ };
    } else if (line.startsWith('# ')) {
      if (current) slides.push({ title: current.title, body: current.body, index: current.index });
      current = { title: line.replace(/^#\s+/, ''), body: [], index: slideIndex++ };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) slides.push({ title: current.title, body: current.body, index: current.index });
  return slides.map(s => ({ title: s.title, body: s.body.join('\n'), index: s.index }));
}

function renderBody(body: string): string {
  return body
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#1A1A1A;">$1</strong>')
    .replace(/^[-*]\s+(.+)$/gm, '<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;"><span style="color:#E8281A;font-size:20px;line-height:1.4;">•</span><span>$1</span></div>')
    .replace(/^###\s+(.+)$/gm, '<div style="font-family:Caveat,cursive;font-size:22px;font-weight:700;color:#5B9BD5;margin:14px 0 6px;border-bottom:1px solid #e0e0e0;padding-bottom:4px;">$1</div>')
    .replace(/\n\n/g, '<div style="height:8px;"></div>');
}

const StarYellow = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#F5C518" stroke="#E8A818" strokeWidth="0.5" />
  </svg>
);
const StarBlue = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#5B9BD5" stroke="#4A8BC4" strokeWidth="0.5" />
  </svg>
);
const StarRed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#E8281A" stroke="#C82010" strokeWidth="0.5" />
  </svg>
);
const Lightbulb = () => (
  <svg width="28" height="34" viewBox="0 0 28 34">
    <ellipse cx="14" cy="12" rx="9" ry="10" fill="#F5C518" stroke="#E8A818" strokeWidth="1.5" />
    <path d="M10 22 Q14 26 18 22" stroke="#E8A818" strokeWidth="1.5" fill="none" />
    <line x1="10" y1="24" x2="18" y2="24" stroke="#E8A818" strokeWidth="1.5" />
    <line x1="11" y1="27" x2="17" y2="27" stroke="#E8A818" strokeWidth="1.5" />
    <line x1="14" y1="2" x2="14" y2="4" stroke="#F5C518" strokeWidth="1" opacity="0.7" />
    <line x1="4" y1="5" x2="6" y2="7" stroke="#F5C518" strokeWidth="1" opacity="0.7" />
    <line x1="24" y1="5" x2="22" y2="7" stroke="#F5C518" strokeWidth="1" opacity="0.7" />
  </svg>
);
const Pencil = () => (
  <svg width="18" height="26" viewBox="0 0 18 26">
    <rect x="4" y="2" width="10" height="17" rx="2" fill="#E8281A" />
    <polygon points="4,19 9,26 14,19" fill="#F5C518" />
    <polygon points="6,19 9,23 12,19" fill="#F5C518" opacity="0.7" />
    <rect x="4" y="2" width="10" height="4" rx="2" fill="#DDDDDD" />
  </svg>
);
const Book = () => (
  <svg width="28" height="24" viewBox="0 0 28 24">
    <rect x="2" y="2" width="12" height="20" rx="1" fill="#5B9BD5" stroke="#4A8BC4" strokeWidth="1" />
    <rect x="14" y="2" width="12" height="20" rx="1" fill="#7BB3E0" stroke="#4A8BC4" strokeWidth="1" />
    <line x1="14" y1="2" x2="14" y2="22" stroke="#3A7BC4" strokeWidth="1.5" />
    <line x1="5" y1="7" x2="11" y2="7" stroke="white" strokeWidth="1" opacity="0.6" />
    <line x1="5" y1="10" x2="11" y2="10" stroke="white" strokeWidth="1" opacity="0.6" />
    <line x1="5" y1="13" x2="11" y2="13" stroke="white" strokeWidth="1" opacity="0.4" />
  </svg>
);
const Beaker = () => (
  <svg width="22" height="28" viewBox="0 0 22 28">
    <path d="M7 2 L7 12 L2 24 Q1 27 4 27 H18 Q21 27 20 24 L15 12 L15 2 Z" fill="none" stroke="#5B9BD5" strokeWidth="1.5" />
    <path d="M7 12 L15 12 L18 20 H4 Z" fill="#5B9BD5" opacity="0.3" />
    <circle cx="6" cy="20" r="1.5" fill="#5B9BD5" />
    <circle cx="14" cy="22" r="2" fill="#5B9BD5" opacity="0.6" />
    <line x1="6" y1="2" x2="16" y2="2" stroke="#AAAAAA" strokeWidth="1.5" />
  </svg>
);
const GradCap = () => (
  <svg width="40" height="30" viewBox="0 0 40 30">
    <polygon points="20,4 38,14 20,24 2,14" fill="#1A1A1A" />
    <ellipse cx="20" cy="14" rx="12" ry="6" fill="#333333" />
    <rect x="30" y="14" width="2" height="10" fill="#1A1A1A" />
    <circle cx="31" cy="25" r="2" fill="#F5C518" />
  </svg>
);
const Arrow = () => (
  <svg width="36" height="16" viewBox="0 0 36 16">
    <path d="M2 8 Q18 6 28 8" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M24 3 L32 8 L24 13" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const StarOutline = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
  </svg>
);
const CircleOutline = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="9" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
  </svg>
);

const frameStyle: React.CSSProperties = {
  border: '2.5px solid #5B9BD5',
  borderRadius: '8px',
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  background: '#FFFFFF',
  position: 'relative',
  aspectRatio: '16/9',
  maxWidth: '960px',
  margin: '0 auto 32px',
  overflow: 'hidden',
};

function TitleSlide({ title, body }: { title: string; body: string }) {
  const subtitle = body.split('\n').find(l => l.trim().length > 0) ?? '';
  return (
    <div style={frameStyle}>
      {/* Corner doodles */}
      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <StarYellow /><Arrow />
      </div>
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        <Lightbulb /><StarBlue />
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 6, alignItems: 'flex-end' }}>
        <Book /><Pencil />
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 12 }}>
        <Beaker />
      </div>
      {/* Center content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 80px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT, fontSize: 'clamp(28px,5vw,64px)', fontWeight: 700, color: BLACK, lineHeight: 1.15, marginBottom: 12 }}>
          {title}
        </div>
        <div style={{ width: '60%', height: 3, background: RED, borderRadius: 2, marginBottom: 16 }} />
        {subtitle && (
          <div style={{ fontFamily: FONT, fontSize: 'clamp(14px,2vw,26px)', fontWeight: 400, color: '#333333' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionOpenerSlide({ title, index }: { title: string; index: number }) {
  return (
    <div style={{ ...frameStyle, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 0 0 1px #e0e0e0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', padding: '32px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ fontFamily: FONT, fontSize: 'clamp(60px,9vw,96px)', fontWeight: 700, color: BLACK, lineHeight: 1 }}>
            {String(index + 1).padStart(2, '0')}
          </div>
          <div style={{ fontFamily: FONT, fontSize: 'clamp(20px,3.5vw,42px)', fontWeight: 700, color: BLACK, lineHeight: 1.2 }}>
            {title}
          </div>
        </div>
        <div style={{ height: 3, background: BLACK, borderRadius: 2, margin: '20px 0' }} />
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Arrow /><StarOutline /><CircleOutline />
        </div>
      </div>
    </div>
  );
}

function ContentSlide({ title, body, heroImageUrl }: { title: string; body: string; heroImageUrl?: string | null }) {
  return (
    <div style={frameStyle}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 32px 20px' }}>
        {/* Title */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontFamily: FONT, fontSize: 'clamp(18px,2.8vw,32px)', fontWeight: 700, color: BLACK }}>{title}</div>
          <div style={{ width: 60, height: 3, background: RED, borderRadius: 2, marginTop: 6 }} />
        </div>
        {/* Body + image side-by-side */}
        <div style={{ display: 'flex', flex: 1, gap: 20, overflow: 'hidden' }}>
          <div
            style={{ flex: 1, fontFamily: FONT, fontSize: 'clamp(13px,1.8vw,20px)', color: '#2A2A2A', lineHeight: 1.55, overflow: 'hidden' }}
            dangerouslySetInnerHTML={{ __html: renderBody(body) }}
          />
          <div style={{ width: '28%', flexShrink: 0 }}>
            {heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: '1.5px dashed #aaa' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', border: '1.5px dashed #BBBBBB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#AAAAAA', fontFamily: FONT, fontSize: 14 }}>
                [ Image Area ]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EndSlide({ title, body }: { title: string; body: string }) {
  const subtitle = body.split('\n').find(l => l.trim().length > 0) ?? '';
  return (
    <div style={frameStyle}>
      {/* Dense corner doodles */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-70%)', display: 'flex', gap: 8 }}>
        <GradCap />
      </div>
      <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
        <StarYellow /><Pencil /><StarBlue />
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
        <Lightbulb /><StarRed />
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', gap: 6, alignItems: 'flex-end' }}>
        <Book /><StarOutline /><Pencil />
      </div>
      <div style={{ position: 'absolute', bottom: 10, right: 10, display: 'flex', gap: 6, alignItems: 'flex-end' }}>
        <Beaker /><StarYellow />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '60px 80px', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT, fontSize: 'clamp(28px,5vw,64px)', fontWeight: 700, color: BLACK, lineHeight: 1.15, marginBottom: 12 }}>
          {title}
        </div>
        <div style={{ width: '50%', height: 3, background: RED, borderRadius: 2, marginBottom: 16 }} />
        {subtitle && (
          <div style={{ fontFamily: FONT, fontSize: 'clamp(14px,2vw,24px)', fontWeight: 400, color: '#333333' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WhiteboardTemplate({ content, module, artifactType: _artifactType, heroImageUrl }: Props) {
  const slides = parseSlides(content);
  const total = slides.length;

  return (
    <div style={{ fontFamily: FONT, background: '#F0F0F0', padding: '32px 24px', minHeight: '100%' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');`}</style>
      {/* Deck header */}
      <div style={{ maxWidth: '960px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 700, color: '#666', letterSpacing: '0.5px' }}>
          WHITEBOARD DECK — {module.title.toUpperCase()} — SEM {module.semester} MOD {module.module}
        </span>
      </div>
      {slides.map((slide, i) => {
        const tl = slide.title.toLowerCase();
        const isTitle = i === 0 || tl.includes('title') || tl.includes('introduction') || tl.includes('welcome');
        const isEnd = i === total - 1 || tl.includes('thank you') || tl.includes('conclusion') || tl.includes('q&a') || tl.includes('questions') || tl.includes('summary');
        const isSection = !isTitle && !isEnd && (/^(slide\s*)?\d/i.test(slide.title) || (slide.title.length < 25 && !slide.body.trim()));
        if (isTitle) return <TitleSlide key={i} title={slide.title} body={slide.body} />;
        if (isEnd && i > 0) return <EndSlide key={i} title={slide.title} body={slide.body} />;
        if (isSection) return <SectionOpenerSlide key={i} title={slide.title} index={i} />;
        return <ContentSlide key={i} title={slide.title} body={slide.body} heroImageUrl={i === 1 ? heroImageUrl : null} />;
      })}
    </div>
  );
}
