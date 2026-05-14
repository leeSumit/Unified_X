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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-brand-purple mb-2">What do you want to generate?</h2>
        <p className="text-gray-600">
          For{' '}
          <span className="font-semibold text-brand-purple">
            Semester {module.semester} · Module {module.module} — {module.title}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {ARTIFACT_TYPES.map((artifact) => (
          <button
            key={artifact.id}
            onClick={() => setSelected(artifact.id)}
            className={`p-5 rounded-xl border-2 text-left transition-all ${
              selected === artifact.id
                ? 'border-brand-purple bg-purple-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-brand-purple hover:shadow-sm'
            }`}
          >
            <span
              className={`inline-block text-xs font-bold text-white px-2 py-0.5 rounded mb-3 ${artifact.chipColor}`}
            >
              {artifact.chip}
            </span>
            <h3 className="font-bold text-gray-900 mb-1.5">{artifact.label}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{artifact.description}</p>
            <p className="text-xs font-semibold text-brand-purple">{artifact.output}</p>

            {selected === artifact.id && (
              <div className="mt-3 text-brand-purple">
                <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200 text-sm text-brand-purple">
          <strong>Note:</strong> Generation streams live — you&rsquo;ll see content appear word by word.
          For full workbooks, generation may take 1–2 minutes.
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-brand-purple transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <button
          onClick={() => selected && onGenerate(selected)}
          disabled={!selected}
          className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-white text-base transition-all ${
            selected
              ? 'bg-brand-purple hover:bg-brand-purple-dark shadow-md hover:shadow-lg'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Generate →
        </button>
      </div>
    </div>
  );
}
