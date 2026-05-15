'use client';

import { useState } from 'react';
import type { ArtifactType } from '@/lib/types';
import { ARTIFACT_TYPES } from '@/lib/types';

interface Props {
  onSelect: (type: ArtifactType) => void;
}

export default function ArtifactCards({ onSelect }: Props) {
  const [selected, setSelected] = useState<ArtifactType | null>(null);

  function handleSelect(id: ArtifactType) {
    setSelected(id);
    onSelect(id);
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 10,
        marginTop: 8,
      }}
    >
      {ARTIFACT_TYPES.map((artifact) => {
        const isSelected = selected === artifact.id;
        return (
          <button
            key={artifact.id}
            onClick={() => handleSelect(artifact.id)}
            style={{
              background: isSelected ? '#fff7ed' : 'var(--bg-surface)',
              border: isSelected ? '2px solid #f97316' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--chat-card-radius, 16px)',
              padding: '14px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              transition: 'border-color 150ms ease, background 150ms ease, transform 150ms ease',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.borderColor = '#f97316';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
              {artifact.label}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {artifact.description}
            </span>
            <span style={{ fontSize: 11, color: 'var(--accent)', marginTop: 2 }}>
              {artifact.output}
            </span>
          </button>
        );
      })}
    </div>
  );
}
