'use client';

import { useState, useRef, useCallback } from 'react';
import type { ParsedModule, SlideState, SlideCount } from '@/lib/types';

interface Props {
  module: ParsedModule;
  onBack: () => void;
  onRestart: () => void;
}

const SLIDE_COUNTS: { value: SlideCount; label: string }[] = [
  { value: 6,  label: '6 slides'  },
  { value: 10, label: '10 slides' },
  { value: 15, label: '15 slides' },
  { value: 20, label: '20 slides' },
  { value: 30, label: '30 slides' },
];

const DIRECTIONS = [
  { id: 'modern-minimal', label: 'Modern Minimal', accent: '#3b6cff', bg: '#fff' },
  { id: 'campus-ai',      label: 'Campus AI',      accent: '#5B2D8E', bg: '#F5F0E8' },
  { id: 'editorial',      label: 'Editorial',      accent: '#c0392b', bg: '#fdf8f2' },
  { id: 'tech-dark',      label: 'Tech Dark',      accent: '#58a6ff', bg: '#0d1117' },
  { id: 'whiteboard',     label: 'Whiteboard',     accent: '#4a90d9', bg: '#fafafa' },
  { id: 'kami-serif',     label: 'Kami Serif',     accent: '#1B365D', bg: '#f5f4ed' },
];

const SLIDE_TYPE_LABELS: Record<string, string> = {
  title: 'Title',
  agenda: 'Agenda',
  content: 'Content',
  stats: 'Statistics',
  'case-study': 'Case Study',
  quote: 'Quote',
  takeaways: 'Takeaways',
  end: 'End',
  diagram: 'Diagram',
};

type Status = 'idle' | 'streaming' | 'done' | 'error';

interface WrapperInfo {
  head: string;
  tail: string;
}

function getSlideTitle(s: SlideState): string {
  const c = s.content;
  if (typeof c.title === 'string') return c.title;
  if (typeof c.text === 'string') return c.text.slice(0, 40);
  return SLIDE_TYPE_LABELS[s.type] ?? s.type;
}

function buildFullHtml(slides: (SlideState | undefined)[], wrapper: WrapperInfo): string {
  const sections = slides
    .filter((s): s is SlideState => !!s?.html)
    .sort((a, b) => a.index - b.index)
    .map(s => s.html)
    .join('\n');
  return wrapper.head + sections + wrapper.tail;
}

// ─── Edit form ────────────────────────────────────────────────────────────────
function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}

function EditTextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
      />
    </div>
  );
}

function SlideEditForm({
  slide,
  onChange,
}: {
  slide: SlideState;
  onChange: (updated: Record<string, unknown>) => void;
}) {
  const c = slide.content;
  const set = (key: string, val: unknown) => onChange({ ...c, [key]: val });

  const setArrayItem = (key: string, idx: number, val: string) => {
    const arr = [...((c[key] as string[]) ?? [])];
    arr[idx] = val;
    onChange({ ...c, [key]: arr });
  };

  switch (slide.type) {
    case 'title':
      return (
        <>
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          <EditField label="Subtitle" value={String(c.subtitle ?? '')} onChange={v => set('subtitle', v)} />
          <EditField label="Badge" value={String(c.badge ?? '')} onChange={v => set('badge', v)} />
        </>
      );

    case 'agenda':
      return (
        <>
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.items as Array<{ n: string; label: string; desc: string }>) ?? []).map((item, i) => (
            <div key={i} className="mb-3 pl-3 border-l-2 border-orange-200">
              <p className="text-xs text-gray-400 mb-1">Item {i + 1}</p>
              <EditField label="Label" value={item.label} onChange={v => {
                const items = [...(c.items as typeof item[])];
                items[i] = { ...item, label: v };
                set('items', items);
              }} />
              <EditField label="Description" value={item.desc} onChange={v => {
                const items = [...(c.items as typeof item[])];
                items[i] = { ...item, desc: v };
                set('items', items);
              }} />
            </div>
          ))}
        </>
      );

    case 'content':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.points as string[]) ?? []).map((pt, i) => (
            <EditField key={i} label={`Point ${i + 1}`} value={pt} onChange={v => setArrayItem('points', i, v)} />
          ))}
          <EditTextArea label="Image Prompt (visual scene, no text)" value={String(c.imagePrompt ?? '')} onChange={v => set('imagePrompt', v)} />
        </>
      );

    case 'stats':
      return (
        <>
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.stats as Array<{ value: string; label: string }>) ?? []).map((st, i) => (
            <div key={i} className="mb-3 pl-3 border-l-2 border-orange-200">
              <p className="text-xs text-gray-400 mb-1">Stat {i + 1}</p>
              <EditField label="Value" value={st.value} onChange={v => {
                const stats = [...(c.stats as typeof st[])];
                stats[i] = { ...st, value: v };
                set('stats', stats);
              }} />
              <EditField label="Label" value={st.label} onChange={v => {
                const stats = [...(c.stats as typeof st[])];
                stats[i] = { ...st, label: v };
                set('stats', stats);
              }} />
            </div>
          ))}
        </>
      );

    case 'case-study':
      return (
        <>
          <EditField label="Tag" value={String(c.tag ?? '')} onChange={v => set('tag', v)} />
          <EditField label="Company" value={String(c.company ?? '')} onChange={v => set('company', v)} />
          <EditField label="Headline" value={String(c.headline ?? '')} onChange={v => set('headline', v)} />
          <EditTextArea label="Story" value={String(c.story ?? '')} onChange={v => set('story', v)} />
          <EditField label="Result" value={String(c.result ?? '')} onChange={v => set('result', v)} />
          <EditTextArea label="Image Prompt (visual scene, no text)" value={String(c.imagePrompt ?? '')} onChange={v => set('imagePrompt', v)} />
        </>
      );

    case 'quote':
      return (
        <>
          <EditTextArea label="Quote Text" value={String(c.text ?? '')} onChange={v => set('text', v)} />
          <EditField label="Author" value={String(c.author ?? '')} onChange={v => set('author', v)} />
          <EditField label="Role" value={String(c.role ?? '')} onChange={v => set('role', v)} />
        </>
      );

    case 'takeaways':
      return (
        <>
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.items as string[]) ?? []).map((it, i) => (
            <EditField key={i} label={`Takeaway ${i + 1}`} value={it} onChange={v => setArrayItem('items', i, v)} />
          ))}
        </>
      );

    case 'diagram':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          <EditTextArea label="Diagram Description (what to diagram)" value={String(c.description ?? '')} onChange={v => set('description', v)} />
        </>
      );

    case 'end':
      return (
        <>
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          <EditField label="Next Module" value={String(c.next ?? '')} onChange={v => set('next', v)} />
        </>
      );

    default:
      return <p className="text-xs text-gray-400">No editable fields for this slide type.</p>;
  }
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function DesignLab({ module, onBack, onRestart }: Props) {
  const [direction, setDirection] = useState('modern-minimal');
  const [slideCount, setSlideCount] = useState<SlideCount>(10);
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [slides, setSlides] = useState<(SlideState | undefined)[]>([]);
  const [totalSlides, setTotalSlides] = useState(0);
  const [wrapper, setWrapper] = useState<WrapperInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<Record<string, unknown>>({});
  const [isRegenerating, setIsRegenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const doneCount = slides.filter(s => s?.status === 'done').length;
  const fullHtml = wrapper && doneCount > 0 ? buildFullHtml(slides, wrapper) : '';

  const selectedDir = DIRECTIONS.find(d => d.id === direction)!;

  async function handleGenerate() {
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('streaming');
    setSlides([]);
    setTotalSlides(0);
    setWrapper(null);
    setErrorMsg('');
    setEditingIndex(null);

    try {
      const res = await fetch('/api/design-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ module, direction, slideCount, customPrompt }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data as { error?: string }).error || `HTTP ${res.status}`);
        setStatus('error');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
          if (!part.startsWith('data: ')) continue;
          const json = part.slice(6).trim();
          if (!json) continue;

          try {
            const event = JSON.parse(json) as Record<string, unknown>;

            if (event.error) {
              setErrorMsg(String(event.error));
              setStatus('error');
              return;
            }

            if (event.event === 'init') {
              setTotalSlides(Number(event.total));
              setWrapper(event.wrapper as WrapperInfo);
              setSlides(new Array(Number(event.total)).fill(undefined));
            } else if (event.event === 'slide') {
              const idx = Number(event.index);
              setSlides(prev => {
                const next = [...prev];
                next[idx] = {
                  index: idx,
                  type: String(event.type),
                  content: event.content as Record<string, unknown>,
                  html: String(event.html),
                  imageUrl: (event.imageUrl as string | null) ?? null,
                  status: 'done',
                };
                return next;
              });
            } else if (event.event === 'done') {
              setStatus('done');
            }
          } catch { /* skip malformed SSE */ }
        }
      }

      if (status !== 'error') setStatus('done');
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setErrorMsg((err as Error).message || 'Generation failed');
        setStatus('error');
      } else {
        setStatus('idle');
      }
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    setStatus('idle');
  }

  function handleDownload() {
    if (!fullHtml) return;
    const slug = module.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-slides.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const openEdit = useCallback((slide: SlideState) => {
    setEditingIndex(slide.index);
    setEditContent({ ...slide.content });
  }, []);

  async function handleRegenerateSlide() {
    if (editingIndex === null) return;
    setIsRegenerating(true);

    setSlides(prev => {
      const next = [...prev];
      if (next[editingIndex]) next[editingIndex] = { ...next[editingIndex]!, status: 'regenerating' };
      return next;
    });

    try {
      const res = await fetch('/api/design-lab/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideContent: { ...editContent, type: slides[editingIndex]?.type },
          direction,
          module,
        }),
      });
      const data = await res.json() as { html?: string; imageUrl?: string | null; content?: Record<string, unknown>; error?: string };
      if (data.error) throw new Error(data.error);

      setSlides(prev => {
        const next = [...prev];
        next[editingIndex] = {
          index: editingIndex,
          type: slides[editingIndex]?.type ?? '',
          content: data.content ?? editContent,
          html: data.html ?? '',
          imageUrl: data.imageUrl ?? null,
          status: 'done',
        };
        return next;
      });
      setEditContent(data.content ?? editContent);
    } catch (err) {
      setSlides(prev => {
        const next = [...prev];
        if (next[editingIndex]) next[editingIndex] = { ...next[editingIndex]!, status: 'done' };
        return next;
      });
      alert(`Regeneration failed: ${(err as Error).message}`);
    } finally {
      setIsRegenerating(false);
    }
  }

  const editingSlide = editingIndex !== null ? slides[editingIndex] : undefined;

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ background: 'linear-gradient(135deg,#5B2D8E,#E8681A)' }}>
              DESIGN LAB
            </span>
            <span className="text-xs text-gray-500">Sem {module.semester} · Mod {module.module}</span>
          </div>
          <h2 className="text-xl font-bold text-brand-purple">{module.title}</h2>
        </div>
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-purple transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* ── Controls ── */}
      <div className="grid grid-cols-1 gap-4 mb-5 lg:grid-cols-3">

        {/* Slide count + custom prompt */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Slide Count</p>
            <div className="flex gap-2 flex-wrap">
              {SLIDE_COUNTS.map(sc => (
                <button
                  key={sc.value}
                  onClick={() => setSlideCount(sc.value)}
                  className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    slideCount === sc.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Custom Instructions <span className="font-normal text-gray-400 normal-case">(optional)</span>
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && status !== 'streaming' && handleGenerate()}
              placeholder='e.g. "Focus on AI tools used in India" or "Add a SWOT analysis slide"'
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Visual direction */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Visual Style</p>
          <div className="space-y-1.5">
            {DIRECTIONS.map(dir => (
              <button
                key={dir.id}
                onClick={() => setDirection(dir.id)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg border-2 text-left transition-all ${
                  direction === dir.id ? 'border-orange-500 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ background: dir.bg }}
              >
                <div className="w-6 h-6 rounded-md flex-shrink-0" style={{ background: `linear-gradient(135deg,${dir.accent},${dir.accent}88)` }} />
                <span className="text-xs font-semibold flex-1" style={{ color: dir.bg === '#0d1117' ? '#f0f6fc' : '#1a1a1a' }}>
                  {dir.label}
                </span>
                {direction === dir.id && (
                  <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: dir.accent }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Generate button ── */}
      <div className="flex gap-3 mb-5">
        {status === 'streaming' ? (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all"
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
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-md hover:opacity-90"
            style={{ background: 'linear-gradient(135deg,#5B2D8E,#E8681A)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {status === 'done' ? 'Regenerate All' : 'Generate Slides'}
          </button>
        )}
        {status === 'done' && fullHtml && (
          <>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 bg-white transition-all"
            >
              ↓ Download HTML
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 bg-white transition-all"
            >
              ⤢ Present
            </button>
          </>
        )}
      </div>

      {/* ── Streaming progress cards ── */}
      {(status === 'streaming' || status === 'done') && totalSlides > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">
              {status === 'streaming'
                ? `Generating… ${doneCount} / ${totalSlides} slides ready`
                : `${doneCount} slides — click any to edit`}
            </p>
            {status === 'streaming' && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs text-orange-600 font-medium">Live</span>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {status === 'streaming' && (
            <div className="h-1 bg-gray-100 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / totalSlides) * 100}%` }}
              />
            </div>
          )}

          {/* Slide cards grid */}
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {Array.from({ length: totalSlides }).map((_, i) => {
              const slide = slides[i];
              const isEditing = editingIndex === i;
              const isDone = slide?.status === 'done';
              const isRegen = slide?.status === 'regenerating';

              return (
                <button
                  key={i}
                  onClick={() => isDone && slide ? openEdit(slide) : undefined}
                  disabled={!isDone}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    isEditing
                      ? 'border-orange-500 bg-orange-50'
                      : isDone
                      ? 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm cursor-pointer'
                      : 'border-gray-100 bg-gray-50 cursor-default'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {isRegen ? (
                      <svg className="animate-spin w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : isDone ? (
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-200 animate-pulse" />
                    )}
                  </div>
                  {slide ? (
                    <>
                      <div className="text-xs font-semibold text-gray-500 mb-0.5">
                        {SLIDE_TYPE_LABELS[slide.type] ?? slide.type}
                      </div>
                      <div className="text-xs text-gray-700 font-medium leading-tight truncate">
                        {getSlideTitle(slide)}
                      </div>
                    </>
                  ) : (
                    <div className="h-7 rounded bg-gray-100 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Edit panel ── */}
      {editingIndex !== null && editingSlide?.status === 'done' && (
        <div className="mb-5 p-4 border-2 border-orange-200 rounded-2xl bg-orange-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Edit Slide {editingIndex + 1}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                {SLIDE_TYPE_LABELS[editingSlide.type] ?? editingSlide.type}
              </span>
            </div>
            <button
              onClick={() => setEditingIndex(null)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          </div>

          <SlideEditForm
            slide={{ ...editingSlide, content: editContent }}
            onChange={setEditContent}
          />

          <button
            onClick={handleRegenerateSlide}
            disabled={isRegenerating}
            className="mt-1 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#5B2D8E,#E8681A)' }}
          >
            {isRegenerating ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Regenerating slide…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Regenerate Slide
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Main preview ── */}
      <div className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 flex-1 text-center truncate">
            {status === 'idle' && 'Configure above, then click Generate Slides'}
            {status === 'streaming' && `Generating ${selectedDir.label} deck — ${doneCount}/${totalSlides} slides`}
            {status === 'done' && `${selectedDir.label} · ${doneCount} slides · ← → arrow keys to navigate`}
            {status === 'error' && 'Generation failed'}
          </span>
        </div>

        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#f8f8f8' }}>
          <div style={{ position: 'absolute', inset: 0 }}>

            {status === 'idle' && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg,#5B2D8E1a,#E8681A1a)' }}>
                  <svg className="w-8 h-8 text-brand-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-600">Pick a style and slide count, then Generate</p>
                <p className="text-xs text-gray-400 mt-1">Slides stream in progressively as they&apos;re ready</p>
              </div>
            )}

            {status === 'streaming' && !fullHtml && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <svg className="animate-spin h-10 w-10 text-brand-purple mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm font-semibold text-gray-700">Designing your slides…</p>
                <p className="text-xs text-gray-400 mt-1">First slides appear shortly</p>
              </div>
            )}

            {status === 'error' && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-red-700 mb-1">Generation failed</p>
                <p className="text-xs text-red-500 max-w-sm leading-relaxed">{errorMsg}</p>
                <button onClick={handleGenerate} className="mt-4 px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-medium hover:bg-red-700">
                  Try Again
                </button>
              </div>
            )}

            {fullHtml && (
              <iframe
                key={fullHtml.length}
                srcDoc={fullHtml}
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
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-brand-purple transition-colors flex items-center gap-1">
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
      {isFullscreen && fullHtml && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-black/90 border-b border-white/10 flex-shrink-0">
            <span className="text-white/60 text-xs">{module.title} · {selectedDir.label} · Use ← → to navigate</span>
            <div className="flex gap-3">
              <button onClick={handleDownload} className="text-white/60 hover:text-white text-xs px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all">
                Download HTML
              </button>
              <button onClick={() => setIsFullscreen(false)} className="text-white/60 hover:text-white text-xs px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all">
                ✕ Exit
              </button>
            </div>
          </div>
          <iframe
            key={`fs-${fullHtml.length}`}
            srcDoc={fullHtml}
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
