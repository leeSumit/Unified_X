'use client';

import type { ArtifactType } from '@/lib/types';
import { ARTIFACT_TYPES } from '@/lib/types';

interface Props {
  artifactType: ArtifactType;
}

const LABELS: Record<ArtifactType, string> = {
  notes: 'Notes',
  pptx: 'PPTX',
  workbook: 'Workbook',
};

export default function GeneratingMessage({ artifactType }: Props) {
  const label = LABELS[artifactType];
  const artifact = ARTIFACT_TYPES.find((a) => a.id === artifactType);

  return (
    <div
      style={{
        alignSelf: 'flex-start',
        background: 'var(--bg-ai-bubble)',
        color: 'var(--text-ai-bubble)',
        borderRadius: 'var(--chat-bubble-radius-ai, 20px 20px 20px 4px)',
        maxWidth: '85%',
        padding: '14px 18px',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg
          className="animate-spin"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          style={{ color: '#f97316', flexShrink: 0 }}
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 500 }}>
          Generating your {label}…
        </span>
      </div>
      {artifactType === 'pptx' && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 30, marginTop: 0 }}>
          Opening Design Lab in a moment…
        </p>
      )}
      {artifact && (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 30 }}>
          {artifact.output}
        </p>
      )}
    </div>
  );
}
