'use client';

export type ArtifactType = 'notes' | 'workbook' | 'pptx';

export interface ArtifactPreview {
  id: string;
  type: ArtifactType;
  title: string;
  moduleTitle: string;
  createdAt: Date;
}

interface Props {
  artifacts?: ArtifactPreview[];
  onOpen?: (artifact: ArtifactPreview) => void;
}

const TYPE_META: Record<ArtifactType, { label: string; color: string; bg: string; icon: string }> = {
  notes: {
    label: 'Notes',
    icon: '📝',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.1)',
  },
  workbook: {
    label: 'Workbook',
    icon: '📋',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.1)',
  },
  pptx: {
    label: 'PPT',
    icon: '🎞',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.1)',
  },
};

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

export default function PreviousArtifacts({ artifacts, onOpen }: Props) {
  const items = artifacts ?? [];

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
          <span style={{ fontSize: 13, fontWeight: 600, color: '#8892a4', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Previous Artifacts
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
      </div>

      {/* Artifact grid */}
      {items.length === 0 ? (
        <div
          style={{
            padding: '20px 0 4px',
            color: '#8892a4',
            fontSize: 13,
          }}
        >
          No artifacts generated yet. Parse a syllabus and create your first one.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
          }}
        >
          {items.map((artifact) => {
            const meta = TYPE_META[artifact.type];
            return (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                meta={meta}
                onOpen={onOpen}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ArtifactCard({
  artifact,
  meta,
  onOpen,
}: {
  artifact: ArtifactPreview;
  meta: (typeof TYPE_META)[ArtifactType];
  onOpen?: (a: ArtifactPreview) => void;
}) {
  const clickable = !!onOpen;
  return (
    <button
      onClick={() => onOpen?.(artifact)}
      disabled={!clickable}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: '14px 16px',
        cursor: clickable ? 'pointer' : 'default',
        textAlign: 'left',
        transition: 'background 150ms ease, border-color 150ms ease',
        fontFamily: 'inherit',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        if (!clickable) return;
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.055)';
        el.style.borderColor = 'rgba(255,255,255,0.11)';
      }}
      onMouseLeave={(e) => {
        if (!clickable) return;
        const el = e.currentTarget as HTMLElement;
        el.style.background = 'rgba(255,255,255,0.03)';
        el.style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Type badge */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 11,
          fontWeight: 600,
          color: meta.color,
          background: meta.bg,
          borderRadius: 9999,
          padding: '3px 9px',
          width: 'fit-content',
          letterSpacing: '0.03em',
        }}
      >
        <span style={{ fontSize: 12 }}>{meta.icon}</span>
        {meta.label}
      </span>

      {/* Title */}
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 500,
          color: '#e2e8f0',
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {artifact.title}
      </p>

      {/* Footer: module + date */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: '#8892a4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {artifact.moduleTitle}
        </span>
        <span style={{ fontSize: 11, color: '#8892a4', flexShrink: 0 }}>
          {relativeDate(artifact.createdAt)}
        </span>
      </div>
    </button>
  );
}
