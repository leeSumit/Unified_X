'use client';

import { useState } from 'react';
import type { ArtifactType } from '@/lib/types';

interface Props {
  onSelect: (type: ArtifactType) => void;
}

const PILLS: { id: ArtifactType; label: string }[] = [
  { id: 'notes', label: 'Notes' },
  { id: 'pptx', label: 'PPT' },
  { id: 'workbook', label: 'Workbook' },
];

export default function ArtifactCards({ onSelect }: Props) {
  const [selected, setSelected] = useState<ArtifactType | null>(null);

  function handleSelect(id: ArtifactType) {
    setSelected(id);
    onSelect(id);
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
      {PILLS.map(({ id, label }) => {
        const isSelected = selected === id;
        return (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            style={{
              borderRadius: 9999,
              padding: '8px 22px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              border: isSelected ? '1px solid #f97316' : '1px solid rgba(255,255,255,0.1)',
              background: isSelected ? '#f97316' : '#16161e',
              color: isSelected ? '#ffffff' : '#e2e8f0',
              transition: 'all 150ms ease',
              outline: 'none',
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(249,115,22,0.5)';
                el.style.color = '#f97316';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'rgba(255,255,255,0.1)';
                el.style.color = '#e2e8f0';
              }
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
