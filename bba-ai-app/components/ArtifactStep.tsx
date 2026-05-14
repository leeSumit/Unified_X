'use client';

import { useState } from 'react';
import type { ParsedModule, ArtifactType } from '@/lib/types';
import { ARTIFACT_TYPES } from '@/lib/types';

interface Props {
  module: ParsedModule;
  onGenerate: (artifactType: ArtifactType) => void;
  onBack: () => void;
}

export default function ArtifactStep({ module, onGenerate, onBack }: Props) {
  const [selected, setSelected] = useState<ArtifactType | null>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#FF9900' }}>Step 3</p>
        <h2 className="text-2xl font-bold" style={{ color: '#16191F' }}>What do you want to generate?</h2>
        <p className="mt-1 text-sm" style={{ color: '#545B64' }}>
          For{' '}
          <span className="font-semibold" style={{ color: '#16191F' }}>
            Semester {module.semester} · Module {module.module} — {module.title}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {ARTIFACT_TYPES.map((artifact) => {
          const isSelected = selected === artifact.id;
          return (
            <button
              key={artifact.id}
              onClick={() => setSelected(artifact.id)}
              className="p-5 text-left transition-all"
              style={{
                background:   '#FFFFFF',
                border:       `2px solid ${isSelected ? '#FF9900' : '#E9EBED'}`,
                borderRadius: 2,
                boxShadow:    isSelected ? '0 2px 8px rgba(255,153,0,0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                cursor:       'pointer',
              }}
            >
              <span
                className="inline-block text-xs font-bold text-white px-2 py-0.5 mb-3"
                style={{ borderRadius: 2, background: '#232F3E' }}
              >
                {artifact.chip}
              </span>
              <h3 className="font-semibold mb-1" style={{ color: '#16191F' }}>{artifact.label}</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#545B64' }}>{artifact.description}</p>
              <p className="text-xs font-semibold" style={{ color: '#0073BB' }}>{artifact.output}</p>

              {isSelected && (
                <div className="mt-3" style={{ color: '#FF9900' }}>
                  <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className="mt-5 p-4 text-sm"
          style={{ background: '#F0F7FF', border: '1px solid #B3D9F5', borderRadius: 2, color: '#0073BB' }}
        >
          <strong>Note:</strong> Generation streams live — you&rsquo;ll see content appear word by word.
          For full workbooks, generation may take 1–2 minutes.
        </div>
      )}

      <div className="mt-5 flex gap-3 items-center">
        <button
          onClick={onBack}
          className="text-sm flex items-center gap-1 transition-colors"
          style={{ color: '#545B64', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0073BB')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#545B64')}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={() => selected && onGenerate(selected)}
          disabled={!selected}
          className="flex-1 py-3 px-6 font-semibold text-sm transition-all"
          style={{
            borderRadius: 2,
            background:   selected ? '#FF9900' : '#E9EBED',
            color:        selected ? '#16191F' : '#8D9BA8',
            border:       'none',
            cursor:       selected ? 'pointer' : 'not-allowed',
          }}
        >
          Generate →
        </button>
      </div>
    </div>
  );
}
