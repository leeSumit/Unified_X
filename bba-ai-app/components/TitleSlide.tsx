'use client';

interface TitleSlideProps {
  heading: string;         // e.g. "RACE\nFRAMEWORK"
  subtitle: string;        // e.g. "Prompt Engineering"
  semLabel?: string;       // e.g. "SEM 1"
  modLabel?: string;       // e.g. "MOD 1"
  backgroundImageUrl: string;
}

export default function TitleSlide({
  heading,
  subtitle,
  semLabel = 'SEM 1',
  modLabel = 'MOD 1',
  backgroundImageUrl,
}: TitleSlideProps) {
  const lines = heading.split('\n');

  return (
    <div style={styles.frame}>
      {/* Background image — decorative elements, no text */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={backgroundImageUrl} alt="" style={styles.bg} />

      {/* Text layer */}
      <div style={styles.content}>

        {/* Top-left badge */}
        <div style={styles.badge}>
          <div style={styles.badgeLeft}>
            <span style={styles.badgeLine}>{semLabel}</span>
            <span style={styles.badgeLine}>{modLabel}</span>
          </div>
          <div style={styles.badgeSep} />
          <div style={styles.badgeRight}>
            <span style={styles.badgeDot} />
          </div>
        </div>

        {/* Heading */}
        <div style={styles.headingWrap}>
          {lines.map((line, i) => (
            <span key={i} style={styles.heading}>{line}</span>
          ))}
        </div>

        {/* Subtitle — below wavy underline */}
        <p style={styles.subtitle}>{subtitle}</p>

        {/* Bottom logos */}
        <div style={styles.logos}>
          <span style={styles.logo}>CAMPUS.AI</span>
          <span style={styles.logo}>EUNERATION</span>
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  frame: {
    position: 'relative',
    width: '900px',
    height: '506px',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 12px 48px rgba(0,0,0,.22)',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '32px 60px 28px',
  },
  badge: {
    position: 'absolute',
    top: '22px',
    left: '22px',
    display: 'flex',
    borderRadius: '999px',
    overflow: 'hidden',
    border: '2px solid #555',
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '.04em',
    fontFamily: 'Inter, sans-serif',
  },
  badgeLeft: {
    background: '#4a5568',
    color: '#fff',
    padding: '5px 10px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  badgeLine: {
    display: 'block',
  },
  badgeSep: {
    width: '2px',
    background: '#e53e3e',
    flexShrink: 0,
  },
  badgeRight: {
    background: '#fff',
    color: '#4a5568',
    padding: '5px 10px',
    display: 'flex',
    alignItems: 'center',
  },
  badgeDot: {
    width: '8px',
    height: '8px',
    background: '#e53e3e',
    borderRadius: '50%',
    display: 'inline-block',
  },
  headingWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '55px',
  },
  heading: {
    fontFamily: "'Caveat', cursive",
    fontSize: '112px',
    fontWeight: 700,
    color: '#1a1a1a',
    lineHeight: 0.95,
    textAlign: 'center',
    letterSpacing: '.01em',
    display: 'block',
  },
  subtitle: {
    position: 'absolute',
    top: '62%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: 'Inter, sans-serif',
    fontSize: '18px',
    fontWeight: 400,
    color: '#333',
    whiteSpace: 'nowrap',
    letterSpacing: '.01em',
  },
  logos: {
    position: 'absolute',
    bottom: '18px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  logo: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '.12em',
    textTransform: 'uppercase' as const,
    color: '#777',
  },
};
