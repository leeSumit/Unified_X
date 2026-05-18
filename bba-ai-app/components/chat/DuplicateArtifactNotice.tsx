'use client';

import type { ArtifactType } from '@/lib/types';

const LABELS: Record<ArtifactType, string> = {
  notes: 'Notes',
  pptx: 'PPT',
  workbook: 'Workbook',
};

interface Props {
  artifactType: ArtifactType;
  isOpening?: boolean;
  onOpenExisting: () => void;
  onCreateAnother: () => void;
}

export default function DuplicateArtifactNotice({ artifactType, isOpening, onOpenExisting, onCreateAnother }: Props) {
  const label = LABELS[artifactType];

  return (
    <div
      style={{
        background: 'rgba(232,104,26,0.08)',
        border: '1px solid rgba(232,104,26,0.3)',
        borderRadius: 12,
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <span style={{ fontSize: 16, lineHeight: 1 }}>⚠️</span>
        <div style={{ fontSize: 13, color: '#e2e8f0', lineHeight: 1.5 }}>
          You already have a <strong>{label}</strong> artifact for this module. Open the existing one to continue editing, or create a new one anyway.
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={onOpenExisting}
          disabled={isOpening}
          style={{
            background: 'linear-gradient(135deg,#5B2D8E,#E8681A)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: isOpening ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            opacity: isOpening ? 0.7 : 1,
          }}
        >
          {isOpening ? (
            <>
              <svg className="animate-spin" style={{ width: 12, height: 12 }} fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.85" />
              </svg>
              Opening…
            </>
          ) : (
            <>Open existing {label}</>
          )}
        </button>
        <button
          onClick={onCreateAnother}
          disabled={isOpening}
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#cbd5e1',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: isOpening ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            opacity: isOpening ? 0.5 : 1,
          }}
        >
          Create another anyway
        </button>
      </div>
    </div>
  );
}
