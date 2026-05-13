'use client';

import { useState, useRef } from 'react';

interface Props {
  onModulesExtracted: (modules: import('@/lib/types').ParsedModule[]) => void;
}

export default function SyllabusStep({ onModulesExtracted }: Props) {
  const [tab, setTab] = useState<'paste' | 'upload'>('paste');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleExtract() {
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      if (tab === 'upload' && file) {
        formData.append('file', file);
      } else if (tab === 'paste' && text.trim()) {
        formData.append('text', text.trim());
      } else {
        setError('Please paste your syllabus text or upload a file first.');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/parse', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Failed to parse syllabus.');
        return;
      }

      onModulesExtracted(data.modules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setTab('upload');
    }
  }

  const canSubmit = tab === 'paste' ? text.trim().length > 30 : file !== null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-brand-purple mb-2">Add your syllabus</h2>
        <p className="text-gray-600">
          Paste the syllabus text or upload a PDF/DOCX file. We&rsquo;ll extract the module list automatically.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(['paste', 'upload'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
              tab === t
                ? 'border-brand-purple text-brand-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'paste' ? '📋  Paste text' : '📄  Upload file'}
          </button>
        ))}
      </div>

      {/* Paste tab */}
      {tab === 'paste' && (
        <textarea
          className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-brand-purple focus:outline-none resize-none text-sm font-mono bg-white text-gray-800 placeholder-gray-400 transition"
          placeholder={`Paste your syllabus here…\n\nExample:\n  Semester 1, Module 1: Prompt Engineering Frameworks (12 hrs)\n  Topics: RACE, AIDA, Chain-of-Thought, Few-Shot…\n  Module 2: AI-Assisted Writing (12 hrs)\n  Topics: Long-form content, Brand voice…`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {/* Upload tab */}
      {tab === 'upload' && (
        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            dragging
              ? 'border-brand-purple bg-purple-50'
              : file
              ? 'border-brand-orange bg-orange-50'
              : 'border-gray-300 bg-white hover:border-brand-purple hover:bg-purple-50'
          }`}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <>
              <div className="text-4xl mb-3">📄</div>
              <p className="font-semibold text-brand-orange">{file.name}</p>
              <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              <p className="text-xs text-gray-400 mt-3">Click to change file</p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">☁️</div>
              <p className="font-semibold text-gray-700">Drop your file here, or click to browse</p>
              <p className="text-sm text-gray-400 mt-2">PDF, DOCX, or TXT · Max 10 MB</p>
              {!process.env.NEXT_PUBLIC_MISTRAL_CONFIGURED && (
                <p className="text-xs text-amber-600 mt-3 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
                  💡 Set MISTRAL_API_KEY in .env.local for full OCR support
                </p>
              )}
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleExtract}
        disabled={!canSubmit || loading}
        className={`mt-6 w-full py-3.5 px-6 rounded-xl font-bold text-white text-base transition-all ${
          canSubmit && !loading
            ? 'bg-brand-purple hover:bg-brand-purple-dark shadow-md hover:shadow-lg active:scale-98'
            : 'bg-gray-300 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Extracting modules…
          </span>
        ) : (
          'Extract Modules →'
        )}
      </button>
    </div>
  );
}
