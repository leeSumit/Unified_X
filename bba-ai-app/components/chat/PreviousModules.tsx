'use client';

export interface ModulePreview {
  id: string;
  semester: number;
  module: number;
  title: string;
  hours: number;
  topicCount: number;
  sourceFilename?: string;
  createdAt: Date;
}

interface Props {
  modules?: ModulePreview[];
  onOpen?: (module: ModulePreview) => void;
}

function relativeDate(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function PreviousModules({ modules, onOpen }: Props) {
  const items = modules ?? [];

  return (
    <div style={{ width: '100%' }}>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#8892a4',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Parsed Modules
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#8892a4',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 9999,
              padding: '2px 8px',
            }}
          >
            {items.length}
          </span>
        </div>
        <button
          style={{
            fontSize: 12,
            color: '#f97316',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            padding: 0,
            opacity: 0.8,
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.8')}
        >
          View all →
        </button>
      </div>

      {/* Module list */}
      {items.length === 0 ? (
        <div
          style={{
            padding: '20px 0 4px',
            color: '#8892a4',
            fontSize: 13,
          }}
        >
          No modules parsed yet. Upload a syllabus to get started.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((mod) => (
            <ModuleRow key={mod.id} module={mod} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  );
}

function ModuleRow({
  module: mod,
  onOpen,
}: {
  module: ModulePreview;
  onOpen?: (m: ModulePreview) => void;
}) {
  return (
    <button
      onClick={() => onOpen?.(mod)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '12px 14px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 150ms ease, border-color 150ms ease',
        fontFamily: 'inherit',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.055)';
        el.style.borderColor = 'rgba(255,255,255,0.11)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.03)';
        el.style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Module number badge */}
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
        }}
      >
        <span style={{ fontSize: 10, color: '#f97316', fontWeight: 600, letterSpacing: '0.04em' }}>
          M{mod.module}
        </span>
        <span style={{ fontSize: 9, color: 'rgba(249,115,22,0.6)', fontWeight: 500 }}>
          S{mod.semester}
        </span>
      </div>

      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 500,
            color: '#e2e8f0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {mod.title}
        </p>
        <p style={{ margin: '3px 0 0', fontSize: 11, color: '#8892a4' }}>
          {mod.hours}h · {mod.topicCount} topic{mod.topicCount !== 1 ? 's' : ''}
          {mod.sourceFilename && (
            <span style={{ marginLeft: 6, opacity: 0.7 }}>· {mod.sourceFilename}</span>
          )}
        </p>
      </div>

      {/* Date */}
      <span style={{ fontSize: 11, color: '#8892a4', flexShrink: 0 }}>
        {relativeDate(mod.createdAt)}
      </span>
    </button>
  );
}
