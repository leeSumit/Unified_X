'use client';

import { useState, useRef } from 'react';

interface Props {
  onModulesExtracted: (modules: import('@/lib/types').ParsedModule[]) => void;
}

export default function SyllabusStep({ onModulesExtracted }: Props) {
  const [tab, setTab]         = useState<'paste' | 'upload'>('paste');
  const [text, setText]       = useState('');
  const [file, setFile]       = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
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
      const res  = await fetch('/api/parse', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Failed to parse syllabus.'); return; }
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
    if (dropped) { setFile(dropped); setTab('upload'); }
  }

  const canSubmit = tab === 'paste' ? text.trim().length > 30 : file !== null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page heading */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#FF9900' }}>Step 1</p>
        <h2 className="text-2xl font-bold" style={{ color: '#16191F' }}>Add your syllabus</h2>
        <p className="mt-1 text-sm" style={{ color: '#545B64' }}>
          Paste the syllabus text or upload a PDF/DOCX file. We&rsquo;ll extract the module list automatically.
        </p>
      </div>

      {/* AWS-style tabs */}
      <div className="flex" style={{ borderBottom: '1px solid #E9EBED', marginBottom: 20 }}>
        {(['paste', 'upload'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-5 py-2.5 text-sm font-semibold capitalize transition-all"
            style={{
              borderBottom:  tab === t ? '2px solid #FF9900' : '2px solid transparent',
              color:         tab === t ? '#16191F' : '#545B64',
              marginBottom:  -1,
              background:    'none',
              cursor:        'pointer',
            }}
          >
            {t === 'paste' ? 'Paste text' : 'Upload file'}
          </button>
        ))}
      </div>

      {/* Paste tab */}
      {tab === 'paste' && (
        <textarea
          className="w-full p-4 text-sm font-mono resize-none transition"
          style={{
            height: 256,
            background: '#FFFFFF',
            border: '1px solid #8D9BA8',
            borderRadius: 2,
            color: '#16191F',
            outline: 'none',
          }}
          onFocus={e => (e.target.style.borderColor = '#0073BB')}
          onBlur={e  => (e.target.style.borderColor = '#8D9BA8')}
          placeholder={`Paste your syllabus here…\n\nExample:\n  Semester 1, Module 1: Prompt Engineering Frameworks (12 hrs)\n  Topics: RACE, AIDA, Chain-of-Thought, Few-Shot…`}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {/* Upload tab */}
      {tab === 'upload' && (
        <div
          className="p-10 text-center cursor-pointer transition-all"
          style={{
            border: `2px dashed ${dragging ? '#0073BB' : file ? '#FF9900' : '#8D9BA8'}`,
            borderRadius: 2,
            background: dragging ? '#F0F7FF' : file ? '#FFF8EE' : '#FFFFFF',
          }}
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
              <div className="text-3xl mb-3">📄</div>
              <p className="font-semibold" style={{ color: '#EC7211' }}>{file.name}</p>
              <p className="text-sm mt-1" style={{ color: '#545B64' }}>{(file.size / 1024).toFixed(1)} KB</p>
              <p className="text-xs mt-3" style={{ color: '#8D9BA8' }}>Click to change file</p>
            </>
          ) : (
            <>
              <div className="text-3xl mb-3">☁</div>
              <p className="font-semibold" style={{ color: '#16191F' }}>Drop your file here, or click to browse</p>
              <p className="text-sm mt-2" style={{ color: '#8D9BA8' }}>PDF, DOCX, or TXT · Max 10 MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 text-sm" style={{ background: '#FDF3F1', border: '1px solid #D13212', borderRadius: 2, color: '#D13212' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleExtract}
        disabled={!canSubmit || loading}
        className="mt-5 w-full py-3 px-6 font-semibold text-sm transition-all flex items-center justify-center gap-2"
        style={{
          borderRadius: 2,
          background:   canSubmit && !loading ? '#FF9900' : '#E9EBED',
          color:        canSubmit && !loading ? '#16191F' : '#8D9BA8',
          border:       'none',
          cursor:       canSubmit && !loading ? 'pointer' : 'not-allowed',
        }}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Extracting modules…
          </>
        ) : (
          'Extract Modules →'
        )}
      </button>
    </div>
  );
}
