'use client';

export type ArtifactType = 'notes' | 'workbook' | 'pptx';

export interface ArtifactPreview {
  id: string;
  type: ArtifactType;
  title: string;
  moduleTitle: string;
  createdAt: Date;
  thumbnailUrl?: string | null;
}

interface Props {
  artifacts?: ArtifactPreview[];
  onOpen?: (artifact: ArtifactPreview) => void;
  loadingId?: string | null;
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

export default function PreviousArtifacts({ artifacts, onOpen, loadingId }: Props) {
  const items = artifacts ?? [];
  const anyLoading = !!loadingId;

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
                isLoading={loadingId === artifact.id}
                isDisabled={anyLoading && loadingId !== artifact.id}
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
  isLoading = false,
  isDisabled = false,
}: {
  artifact: ArtifactPreview;
  meta: (typeof TYPE_META)[ArtifactType];
  onOpen?: (a: ArtifactPreview) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
}) {
  const clickable = !!onOpen && !isDisabled && !isLoading;
  return (
    <button
      onClick={() => onOpen?.(artifact)}
      disabled={!clickable}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        background: isLoading ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: isLoading
          ? '1px solid rgba(232,104,26,0.5)'
          : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: artifact.thumbnailUrl ? '0 0 14px' : '14px 16px',
        cursor: isLoading ? 'wait' : clickable ? 'pointer' : 'default',
        opacity: isDisabled ? 0.5 : 1,
        textAlign: 'left',
        transition: 'background 150ms ease, border-color 150ms ease, opacity 150ms ease',
        fontFamily: 'inherit',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
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
      {/* Slide thumbnail (PPT only — first slide from storage) */}
      {artifact.thumbnailUrl && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            background: '#0d0d14',
            overflow: 'hidden',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artifact.thumbnailUrl}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: artifact.thumbnailUrl ? '12px 16px 0' : 0,
        }}
      >
      {/* Type badge + loading spinner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
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
        {isLoading && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#E8681A', fontWeight: 600 }}>
            <svg
              className="animate-spin"
              style={{ width: 12, height: 12 }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.85" />
            </svg>
            Loading
          </span>
        )}
      </div>

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
      </div>
    </button>
  );
}
