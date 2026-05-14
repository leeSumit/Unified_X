'use client';

import { useState, useRef } from 'react';
import type { ParsedModule } from '@/lib/types';

interface Props {
  module: ParsedModule;
  onBack: () => void;
  onRestart: () => void;
}

const SLIDE_TEMPLATES = [
  { id: 'course-module', label: 'Course Module', icon: '📚', desc: '12 slides — concepts, case studies, takeaways' },
  { id: 'problem-solution', label: 'Problem–Solution', icon: '💡', desc: '10 slides — problem, root cause, solution, roadmap' },
  { id: 'workshop', label: 'Workshop', icon: '🛠', desc: '10 slides — theory, demo, exercise, discussion' },
  { id: 'research', label: 'Research', icon: '🔬', desc: '10 slides — methodology, findings, analysis' },
];

const DIRECTIONS = [
  { id: 'modern-minimal', label: 'Modern Minimal', accent: '#3b6cff', bg: '#fff' },
  { id: 'campus-ai', label: 'Campus AI', accent: '#5B2D8E', bg: '#F5F0E8' },
  { id: 'editorial', label: 'Editorial', accent: '#c0392b', bg: '#fdf8f2' },
  { id: 'tech-dark', label: 'Tech Dark', accent: '#58a6ff', bg: '#0d1117' },
  { id: 'whiteboard', label: 'Whiteboard', accent: '#5B9BD5', bg: '#fafafa' },
];

type Status = 'idle' | 'generating' | 'done' | 'error';

export default function DesignLab({ module, onBack, onRestart }: Props) {
  const [slideTemplate, setSlideTemplate] = useState('course-module');
  const [direction, setDirection] = useState('modern-minimal');
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [htmlContent, setHtmlContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function handleGenerate() {
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('generating');
    setHtmlContent('');
    setErrorMsg('');

    try {
      const res = await fetch('/api/design-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ module, direction, template: slideTemplate, customPrompt }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || `HTTP ${res.status}`);
        setStatus('error');
        return;
      }

      setHtmlContent(data.html);
      setStatus('done');
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setErrorMsg((err as Error).message || 'Generation failed');
        setStatus('error');
      }
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setStatus('idle');
  }

  function handleDownload() {
    const slug = module.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-slides.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const selectedDir = DIRECTIONS.find((d) => d.id === direction)!;

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold text-white px-2 py-0.5 rounded"
              style={{ background: 'linear-gradient(135deg,#5B2D8E,#E8681A)' }}
            >
              DESIGN LAB
            </span>
            <span className="text-xs text-gray-500">Sem {module.semester} · Mod {module.module}</span>
          </div>
          <h2 className="text-xl font-bold text-brand-purple">{module.title}</h2>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-purple transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* ── Controls row ── */}
      <div className="grid grid-cols-1 gap-4 mb-5 lg:grid-cols-3">

        {/* Slide structure */}
        <div className="lg:col-span-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Slide Structure</p>
          <div className="grid grid-cols-2 gap-2">
            {SLIDE_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setSlideTemplate(t.id)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  slideTemplate === t.id
                    ? 'border-brand-purple bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base">{t.icon}</span>
                  <span className={`text-sm font-semibold ${slideTemplate === t.id ? 'text-brand-purple' : 'text-gray-800'}`}>
                    {t.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-tight">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Visual direction */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Visual Style</p>
          <div className="space-y-1.5">
            {DIRECTIONS.map((dir) => (
              <button
                key={dir.id}
                onClick={() => setDirection(dir.id)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg border-2 text-left transition-all ${
                  direction === dir.id ? 'border-brand-purple shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ background: dir.bg }}
              >
                <div
                  className="w-7 h-7 rounded-md flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${dir.accent},${dir.accent}99)` }}
                />
                <span
                  className="text-xs font-semibold flex-1"
                  style={{ color: dir.bg === '#0d1117' ? '#f0f6fc' : '#1a1a1a' }}
                >
                  {dir.label}
                </span>
                {direction === dir.id && (
                  <svg className="w-3.5 h-3.5 text-brand-purple flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Custom prompt + generate button ── */}
      <div className="flex gap-3 mb-6 items-end">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
            Custom Instructions <span className="font-normal text-gray-400 normal-case">(optional)</span>
          </label>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && status !== 'generating' && handleGenerate()}
            placeholder='e.g. "Focus on AI tools used in India" or "Add a SWOT analysis slide"'
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-700 placeholder-gray-400"
          />
        </div>
        {status === 'generating' ? (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all flex-shrink-0"
          >
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Stop
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:opacity-90 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#5B2D8E,#E8681A)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {status === 'done' ? 'Regenerate' : 'Generate Slides'}
          </button>
        )}
      </div>

      {/* ── 16:9 Slide Preview — centered, full width ── */}
      <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Browser chrome bar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 flex-1 text-center truncate">
            {status === 'idle' && 'Slide preview — 16:9'}
            {status === 'generating' && '⏳ Claude is designing your slides…'}
            {status === 'done' && `${selectedDir.label} · ← → arrow keys or buttons to navigate`}
            {status === 'error' && '❌ Generation failed'}
          </span>
          {status === 'done' && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleDownload}
                className="text-xs text-gray-500 hover:text-brand-purple px-2 py-0.5 rounded border border-gray-200 hover:border-brand-purple transition-all"
              >
                ↓ HTML
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="text-xs text-gray-500 hover:text-brand-purple px-2 py-0.5 rounded border border-gray-200 hover:border-brand-purple transition-all"
              >
                ⤢ Present
              </button>
            </div>
          )}
        </div>

        {/* 16:9 ratio container */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#f8f8f8' }}>
          <div style={{ position: 'absolute', inset: 0 }}>

            {/* IDLE */}
            {status === 'idle' && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg,#5B2D8E1a,#E8681A1a)' }}
                >
                  <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-600">Pick a structure and style, then click Generate</p>
                <p className="text-xs text-gray-400 mt-1">Your slide deck will appear here in 16:9 format</p>
              </div>
            )}

            {/* GENERATING */}
            {status === 'generating' && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <svg className="animate-spin h-12 w-12 text-brand-purple mb-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm font-semibold text-gray-700">Designing your slides…</p>
                <p className="text-xs text-gray-400 mt-1 text-center max-w-xs">
                  Claude is generating a {SLIDE_TEMPLATES.find(t => t.id === slideTemplate)?.label} deck in {selectedDir.label} style
                </p>
              </div>
            )}

            {/* ERROR */}
            {status === 'error' && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-red-700 mb-1">Generation failed</p>
                <p className="text-xs text-red-500 max-w-sm leading-relaxed">{errorMsg}</p>
                <button
                  onClick={handleGenerate}
                  className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* DONE — slide deck in iframe */}
            {status === 'done' && htmlContent && (
              <iframe
                key={htmlContent.length}
                srcDoc={htmlContent}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                sandbox="allow-scripts allow-same-origin"
                title="Slide Deck Preview"
              />
            )}

          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-brand-purple transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to artifact selection
        </button>
        <button onClick={onRestart} className="text-sm text-gray-500 hover:text-brand-purple transition-colors">
          New module →
        </button>
      </div>

      {/* ── Fullscreen presentation ── */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-black/90 border-b border-white/10 flex-shrink-0">
            <span className="text-white/60 text-xs">{module.title} · {selectedDir.label} · Use ← → to navigate</span>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="text-white/60 hover:text-white text-xs px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all"
              >
                Download HTML
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="text-white/60 hover:text-white text-xs px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all"
              >
                ✕ Exit
              </button>
            </div>
          </div>
          <iframe
            key={`fs-${htmlContent.length}`}
            srcDoc={htmlContent}
            className="flex-1 w-full"
            style={{ border: 'none' }}
            sandbox="allow-scripts allow-same-origin"
            title="Fullscreen Presentation"
          />
        </div>
      )}
    </div>
  );
}
