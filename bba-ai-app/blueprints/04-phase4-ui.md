# Blueprint 04 — Phase 4: UI (DesignLab.tsx)

**Worker mission**: Rewrite `components/DesignLab.tsx` to replace iframe-based display with an image carousel. Remove WrapperInfo, buildFullHtml, and all HTML assembly. Add currentSlide navigation state, keyboard nav, image carousel, updated slide count selector, updated SlideEditForm for all 16 types, and PNG download.

**Dependency**: Phase 2 must be complete (types must be updated). Phase 3 is recommended but not strictly required (the UI changes are independent of route logic).

**Verification gate**: `npx tsc --noEmit` must pass. Additionally, start `npm run dev` and verify: slides render as `<img>` tags, keyboard arrows navigate, fullscreen is an image carousel, download produces PNGs.

---

## File: `components/DesignLab.tsx`

**Full path**: `/Users/sumitsatapathy/Unified_X/bba-ai-app/components/DesignLab.tsx`

---

## Complete Replacement

Replace the entire file with the following:

```typescript
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ParsedModule, SlideState, SlideCount } from '@/lib/types';

interface Props {
  module: ParsedModule;
  onBack: () => void;
  onRestart: () => void;
}

const SLIDE_COUNTS: { value: SlideCount; label: string; description: string }[] = [
  { value: 10, label: '10 slides', description: 'Quick overview — all topics, concise' },
  { value: 20, label: '20 slides', description: 'Deep dive — full pedagogical treatment' },
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
  'title': 'Title',
  'overview': 'Overview',
  'experience-trigger': 'Experience',
  'reflection': 'Reflection',
  'concept': 'Concept',
  'process-flow': 'Process',
  'comparison': 'Comparison',
  'framework': 'Framework',
  'worked-example': 'Worked Example',
  'example-case': 'Case Study',
  'exercise': 'Exercise',
  'prototype-studio': 'Studio',
  'test-feedback': 'Feedback',
  'summary': 'Summary',
  'checklist': 'Checklist',
  'transition-recap': 'Transition',
};

type Status = 'idle' | 'streaming' | 'done' | 'error';

function getSlideTitle(s: SlideState): string {
  const c = s.content;
  if (typeof c.title === 'string') return c.title;
  if (typeof c.scenarioTitle === 'string') return c.scenarioTitle;
  if (typeof c.modelName === 'string') return c.modelName;
  if (typeof c.brief === 'string') return String(c.brief).slice(0, 40);
  return SLIDE_TYPE_LABELS[s.type] ?? s.type;
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

function EditTextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
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

  const VisualPromptField = () => (
    <EditTextArea
      label="Visual Prompt (edit to change image)"
      value={String(c.visualPrompt ?? '')}
      onChange={v => set('visualPrompt', v)}
      rows={4}
    />
  );

  switch (slide.type) {
    case 'title':
      return (
        <>
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          <EditField label="Subtitle" value={String(c.subtitle ?? '')} onChange={v => set('subtitle', v)} />
          <EditField label="Badge" value={String(c.badge ?? '')} onChange={v => set('badge', v)} />
          <VisualPromptField />
        </>
      );

    case 'overview':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.goals as string[]) ?? []).map((g, i) => (
            <EditField key={i} label={`Goal ${i + 1}`} value={g} onChange={v => setArrayItem('goals', i, v)} />
          ))}
          {((c.agendaItems as string[]) ?? []).map((item, i) => (
            <EditField key={i} label={`Agenda Item ${i + 1}`} value={item} onChange={v => setArrayItem('agendaItems', i, v)} />
          ))}
          <VisualPromptField />
        </>
      );

    case 'experience-trigger':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Scenario Title" value={String(c.scenarioTitle ?? '')} onChange={v => set('scenarioTitle', v)} />
          <EditTextArea label="Scenario" value={String(c.scenario ?? '')} onChange={v => set('scenario', v)} />
          <EditField label="Question" value={String(c.question ?? '')} onChange={v => set('question', v)} />
          <VisualPromptField />
        </>
      );

    case 'reflection':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.discussionQuestions as string[]) ?? []).map((q, i) => (
            <EditField key={i} label={`Question ${i + 1}`} value={q} onChange={v => setArrayItem('discussionQuestions', i, v)} />
          ))}
          <EditTextArea label="Insight" value={String(c.insight ?? '')} onChange={v => set('insight', v)} />
          <VisualPromptField />
        </>
      );

    case 'concept':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          <EditTextArea label="Definition" value={String(c.definition ?? '')} onChange={v => set('definition', v)} />
          {((c.bullets as string[]) ?? []).map((b, i) => (
            <EditField key={i} label={`Bullet ${i + 1}`} value={b} onChange={v => setArrayItem('bullets', i, v)} />
          ))}
          <VisualPromptField />
        </>
      );

    case 'process-flow':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.steps as Array<{ label: string; summary: string }>) ?? []).map((step, i) => (
            <div key={i} className="mb-3 pl-3 border-l-2 border-orange-200">
              <p className="text-xs text-gray-400 mb-1">Step {i + 1}</p>
              <EditField label="Label" value={step.label} onChange={v => {
                const steps = [...(c.steps as typeof step[])];
                steps[i] = { ...step, label: v };
                set('steps', steps);
              }} />
              <EditField label="Summary" value={step.summary} onChange={v => {
                const steps = [...(c.steps as typeof step[])];
                steps[i] = { ...step, summary: v };
                set('steps', steps);
              }} />
            </div>
          ))}
          <VisualPromptField />
        </>
      );

    case 'comparison':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.columns as Array<{ heading: string; points: string[] }>) ?? []).map((col, ci) => (
            <div key={ci} className="mb-3 pl-3 border-l-2 border-orange-200">
              <p className="text-xs text-gray-400 mb-1">Column {ci + 1}</p>
              <EditField label="Heading" value={col.heading} onChange={v => {
                const cols = [...(c.columns as typeof col[])];
                cols[ci] = { ...col, heading: v };
                set('columns', cols);
              }} />
              {col.points.map((pt, pi) => (
                <EditField key={pi} label={`Point ${pi + 1}`} value={pt} onChange={v => {
                  const cols = [...(c.columns as typeof col[])];
                  const pts = [...col.points];
                  pts[pi] = v;
                  cols[ci] = { ...col, points: pts };
                  set('columns', cols);
                }} />
              ))}
            </div>
          ))}
          <VisualPromptField />
        </>
      );

    case 'framework':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          <EditField label="Model Name" value={String(c.modelName ?? '')} onChange={v => set('modelName', v)} />
          {((c.segments as Array<{ label: string; description: string }>) ?? []).map((seg, i) => (
            <div key={i} className="mb-3 pl-3 border-l-2 border-orange-200">
              <p className="text-xs text-gray-400 mb-1">Segment {i + 1}</p>
              <EditField label="Label" value={seg.label} onChange={v => {
                const segs = [...(c.segments as typeof seg[])];
                segs[i] = { ...seg, label: v };
                set('segments', segs);
              }} />
              <EditField label="Description" value={seg.description} onChange={v => {
                const segs = [...(c.segments as typeof seg[])];
                segs[i] = { ...seg, description: v };
                set('segments', segs);
              }} />
            </div>
          ))}
          <VisualPromptField />
        </>
      );

    case 'worked-example':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          <EditTextArea label="Problem" value={String(c.problem ?? '')} onChange={v => set('problem', v)} />
          {((c.process as string[]) ?? []).map((p, i) => (
            <EditField key={i} label={`Process Step ${i + 1}`} value={p} onChange={v => setArrayItem('process', i, v)} />
          ))}
          <EditTextArea label="Result" value={String(c.result ?? '')} onChange={v => set('result', v)} />
          <VisualPromptField />
        </>
      );

    case 'example-case':
      return (
        <>
          <EditField label="Tag (India or Global)" value={String(c.tag ?? '')} onChange={v => set('tag', v)} />
          <EditField label="Company" value={String(c.company ?? '')} onChange={v => set('company', v)} />
          <EditTextArea label="Scenario" value={String(c.scenario ?? '')} onChange={v => set('scenario', v)} />
          <EditField label="Question" value={String(c.question ?? '')} onChange={v => set('question', v)} />
          <EditField label="Outcome" value={String(c.outcome ?? '')} onChange={v => set('outcome', v)} />
          <VisualPromptField />
        </>
      );

    case 'exercise':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          <EditTextArea label="Task Instructions" value={String(c.taskInstructions ?? '')} onChange={v => set('taskInstructions', v)} />
          {((c.steps as string[]) ?? []).map((s, i) => (
            <EditField key={i} label={`Step ${i + 1}`} value={s} onChange={v => setArrayItem('steps', i, v)} />
          ))}
          <EditField label="Time Allotted" value={String(c.timeAllotted ?? '')} onChange={v => set('timeAllotted', v)} />
          <VisualPromptField />
        </>
      );

    case 'prototype-studio':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditTextArea label="Brief" value={String(c.brief ?? '')} onChange={v => set('brief', v)} />
          {((c.makingSteps as string[]) ?? []).map((s, i) => (
            <EditField key={i} label={`Making Step ${i + 1}`} value={s} onChange={v => setArrayItem('makingSteps', i, v)} />
          ))}
          {((c.templateBoxes as string[]) ?? []).map((b, i) => (
            <EditField key={i} label={`Template Box ${i + 1}`} value={b} onChange={v => setArrayItem('templateBoxes', i, v)} />
          ))}
          <VisualPromptField />
        </>
      );

    case 'test-feedback':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.criteria as Array<{ label: string; description: string }>) ?? []).map((cr, i) => (
            <div key={i} className="mb-3 pl-3 border-l-2 border-orange-200">
              <p className="text-xs text-gray-400 mb-1">Criterion {i + 1}</p>
              <EditField label="Label" value={cr.label} onChange={v => {
                const crit = [...(c.criteria as typeof cr[])];
                crit[i] = { ...cr, label: v };
                set('criteria', crit);
              }} />
              <EditField label="Description" value={cr.description} onChange={v => {
                const crit = [...(c.criteria as typeof cr[])];
                crit[i] = { ...cr, description: v };
                set('criteria', crit);
              }} />
            </div>
          ))}
          {(() => {
            const fe = (c.feedbackExamples as { good: string; poor: string }) ?? { good: '', poor: '' };
            return (
              <>
                <EditTextArea label="Good Example" value={fe.good} onChange={v => set('feedbackExamples', { ...fe, good: v })} />
                <EditTextArea label="Poor Example" value={fe.poor} onChange={v => set('feedbackExamples', { ...fe, poor: v })} />
              </>
            );
          })()}
          <VisualPromptField />
        </>
      );

    case 'summary':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.takeaways as string[]) ?? []).map((t, i) => (
            <EditField key={i} label={`Takeaway ${i + 1}`} value={t} onChange={v => setArrayItem('takeaways', i, v)} />
          ))}
          <VisualPromptField />
        </>
      );

    case 'checklist':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Title" value={String(c.title ?? '')} onChange={v => set('title', v)} />
          {((c.doItems as string[]) ?? []).map((d, i) => (
            <EditField key={i} label={`Do ${i + 1}`} value={d} onChange={v => setArrayItem('doItems', i, v)} />
          ))}
          {((c.avoidItems as string[]) ?? []).map((a, i) => (
            <EditField key={i} label={`Avoid ${i + 1}`} value={a} onChange={v => setArrayItem('avoidItems', i, v)} />
          ))}
          <VisualPromptField />
        </>
      );

    case 'transition-recap':
      return (
        <>
          <EditField label="Eyebrow" value={String(c.eyebrow ?? '')} onChange={v => set('eyebrow', v)} />
          <EditField label="Recap Title" value={String(c.recapTitle ?? '')} onChange={v => set('recapTitle', v)} />
          {((c.recapPoints as string[]) ?? []).map((p, i) => (
            <EditField key={i} label={`Recap Point ${i + 1}`} value={p} onChange={v => setArrayItem('recapPoints', i, v)} />
          ))}
          <EditField label="Preview Title" value={String(c.previewTitle ?? '')} onChange={v => set('previewTitle', v)} />
          {((c.previewPoints as string[]) ?? []).map((p, i) => (
            <EditField key={i} label={`Preview Point ${i + 1}`} value={p} onChange={v => setArrayItem('previewPoints', i, v)} />
          ))}
          <VisualPromptField />
        </>
      );

    default:
      return <p className="text-xs text-gray-400">No editable fields for this slide type.</p>;
  }
}

// ─── Null image fallback card ────────────────────────────────────────────────
function SlideImageFallback({ slide }: { slide: SlideState }) {
  const c = slide.content;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 p-8">
      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-600 mb-1">
        {SLIDE_TYPE_LABELS[slide.type] ?? slide.type}
      </p>
      {typeof c.title === 'string' && (
        <p className="text-xs text-gray-500 text-center max-w-xs">{c.title}</p>
      )}
      {typeof c.scenarioTitle === 'string' && (
        <p className="text-xs text-gray-500 text-center max-w-xs">{c.scenarioTitle}</p>
      )}
      <p className="text-xs text-orange-400 mt-2">Image generation failed — click edit to regenerate</p>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function DesignLab({ module, onBack, onRestart }: Props) {
  const [direction, setDirection] = useState('modern-minimal');
  const [slideCount, setSlideCount] = useState<SlideCount>(10);
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [slides, setSlides] = useState<(SlideState | undefined)[]>([]);
  const [totalSlides, setTotalSlides] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<Record<string, unknown>>({});
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  const doneSlides = slides.filter((s): s is SlideState => !!s && s.status === 'done');
  const doneCount = doneSlides.length;

  const selectedDir = DIRECTIONS.find(d => d.id === direction)!;

  // ─── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (editingIndex !== null) return; // don't nav when editing
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(prev + 1, doneSlides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doneSlides.length, editingIndex, isFullscreen]);

  // Reset currentSlide when new generation starts
  useEffect(() => {
    if (status === 'streaming') setCurrentSlide(0);
  }, [status]);

  async function handleGenerate() {
    const controller = new AbortController();
    abortRef.current = controller;
    setStatus('streaming');
    setSlides([]);
    setTotalSlides(0);
    setErrorMsg('');
    setEditingIndex(null);
    setCurrentSlide(0);

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
              const total = Number(event.total);
              setTotalSlides(total);
              setSlides(new Array(total).fill(undefined));
            } else if (event.event === 'slide') {
              const idx = Number(event.index);
              setSlides(prev => {
                const next = [...prev];
                next[idx] = {
                  index: idx,
                  type: String(event.type),
                  content: event.content as Record<string, unknown>,
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

  async function handleDownload() {
    if (doneSlides.length === 0) return;
    const slug = module.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    for (let i = 0; i < doneSlides.length; i++) {
      const slide = doneSlides[i];
      if (!slide.imageUrl) continue;
      try {
        const res = await fetch(slide.imageUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${slug}-slide-${String(i + 1).padStart(2, '0')}-${slide.type}.png`;
        a.click();
        URL.revokeObjectURL(url);
        // Small delay to avoid browser blocking multiple downloads
        await new Promise(r => setTimeout(r, 200));
      } catch {
        // Skip slides that fail to download
      }
    }
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
      const data = await res.json() as { imageUrl?: string | null; content?: Record<string, unknown>; error?: string };
      if (data.error) throw new Error(data.error);

      setSlides(prev => {
        const next = [...prev];
        next[editingIndex] = {
          index: editingIndex,
          type: slides[editingIndex]?.type ?? '',
          content: data.content ?? editContent,
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
  const currentDoneSlide = doneSlides[currentSlide];

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
            <div className="flex gap-3 flex-wrap">
              {SLIDE_COUNTS.map(sc => (
                <button
                  key={sc.value}
                  onClick={() => setSlideCount(sc.value)}
                  className={`px-4 py-2.5 rounded-xl border-2 text-left transition-all ${
                    slideCount === sc.value
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-semibold">{sc.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{sc.description}</div>
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
        {status === 'done' && doneCount > 0 && (
          <>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 bg-white transition-all"
            >
              ↓ Download Images
            </button>
            <button
              onClick={() => { setCurrentSlide(0); setIsFullscreen(true); }}
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
                : `${doneCount} slides — click any to preview or edit`}
            </p>
            {status === 'streaming' && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-xs text-orange-600 font-medium">Live</span>
              </div>
            )}
          </div>

          {status === 'streaming' && (
            <div className="h-1 bg-gray-100 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${(doneCount / totalSlides) * 100}%` }}
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {Array.from({ length: totalSlides }).map((_, i) => {
              const slide = slides[i];
              const doneIdx = doneSlides.findIndex(s => s.index === i);
              const isCurrentPreview = doneIdx === currentSlide;
              const isEditing = editingIndex === i;
              const isDone = slide?.status === 'done';
              const isRegen = slide?.status === 'regenerating';

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (isDone && slide) {
                      openEdit(slide);
                      if (doneIdx >= 0) setCurrentSlide(doneIdx);
                    }
                  }}
                  disabled={!isDone}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                    isEditing || isCurrentPreview
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
                      <div className={`w-2 h-2 rounded-full ${slide?.imageUrl ? 'bg-green-400' : 'bg-orange-300'}`} />
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
        <div className="mb-5 p-4 border-2 border-orange-200 rounded-2xl bg-orange-50 max-h-96 overflow-y-auto">
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
                Regenerate Slide Image
              </>
            )}
          </button>
        </div>
      )}

      {/* ── Main preview (image carousel) ── */}
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
            {status === 'done' && `${selectedDir.label} · ${currentSlide + 1} / ${doneSlides.length} · ← → to navigate`}
            {status === 'error' && 'Generation failed'}
          </span>
          {doneSlides.length > 0 && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
                disabled={currentSlide === 0}
                className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-default"
              >
                ←
              </button>
              <span className="text-xs text-gray-500 tabular-nums">
                {currentSlide + 1}/{doneSlides.length}
              </span>
              <button
                onClick={() => setCurrentSlide(prev => Math.min(prev + 1, doneSlides.length - 1))}
                disabled={currentSlide >= doneSlides.length - 1}
                className="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-30 disabled:cursor-default"
              >
                →
              </button>
            </div>
          )}
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
                <p className="text-xs text-gray-400 mt-1">All slide images generate in parallel</p>
              </div>
            )}

            {status === 'streaming' && doneSlides.length === 0 && (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <svg className="animate-spin h-10 w-10 text-brand-purple mb-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm font-semibold text-gray-700">Designing your slides…</p>
                <p className="text-xs text-gray-400 mt-1">Claude is writing content, images will follow</p>
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

            {currentDoneSlide && (
              currentDoneSlide.imageUrl ? (
                <img
                  key={currentDoneSlide.index}
                  src={currentDoneSlide.imageUrl}
                  alt={`Slide ${currentSlide + 1}: ${currentDoneSlide.type}`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              ) : (
                <SlideImageFallback slide={currentDoneSlide} />
              )
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

      {/* ── Fullscreen presentation (image carousel) ── */}
      {isFullscreen && doneSlides.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 bg-black/90 border-b border-white/10 flex-shrink-0">
            <span className="text-white/60 text-xs">
              {module.title} · {selectedDir.label} · {currentSlide + 1} / {doneSlides.length}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
                disabled={currentSlide === 0}
                className="text-white/60 hover:text-white text-xs px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all disabled:opacity-30 disabled:cursor-default"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentSlide(prev => Math.min(prev + 1, doneSlides.length - 1))}
                disabled={currentSlide >= doneSlides.length - 1}
                className="text-white/60 hover:text-white text-xs px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all disabled:opacity-30 disabled:cursor-default"
              >
                Next →
              </button>
              <button
                onClick={handleDownload}
                className="text-white/60 hover:text-white text-xs px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all"
              >
                ↓ Images
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="text-white/60 hover:text-white text-xs px-3 py-1 rounded border border-white/20 hover:border-white/50 transition-all"
              >
                ✕ Exit
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center bg-black">
            {(() => {
              const fs = doneSlides[currentSlide];
              if (!fs) return null;
              return fs.imageUrl ? (
                <img
                  key={fs.index}
                  src={fs.imageUrl}
                  alt={`Slide ${currentSlide + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              ) : (
                <div className="text-white/40 text-sm">No image for this slide</div>
              );
            })()}
          </div>
          {/* Dot navigation */}
          <div className="flex items-center justify-center gap-1 py-2 bg-black/90 flex-shrink-0">
            {doneSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentSlide ? 'bg-white' : 'bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Key changes summary

| Old | New |
|-----|-----|
| `WrapperInfo` interface | Removed |
| `buildFullHtml()` function | Removed |
| `wrapper` state | Removed |
| `fullHtml` computed | Removed |
| `<iframe srcDoc={fullHtml}>` | `<img src={currentDoneSlide.imageUrl}>` |
| Fullscreen: `<iframe>` | Fullscreen: `<img>` carousel with dot nav |
| SLIDE_COUNTS: 6/10/15/20/30 | SLIDE_COUNTS: 10/20 only, with descriptions |
| SLIDE_TYPE_LABELS: 9 entries | SLIDE_TYPE_LABELS: 16 entries |
| init event: reads `wrapper` field | init event: only `total` and `direction` |
| slide event: reads `html` field | slide event: reads only `imageUrl` |
| SlideState has `html` field | SlideState has NO `html` field |
| Download: HTML blob | Download: sequential fetch+download per PNG |
| Download button: "Download HTML" | Download button: "Download Images" |
| No keyboard nav in component | `useEffect` keyboard nav (← → arrows, Escape) |
| No slide position indicator | Counter in toolbar: "3/10" |
| SlideEditForm: 9 cases | SlideEditForm: 16 cases + VisualPromptField on each |
| handleRegenerateSlide: updates `html` | handleRegenerateSlide: only updates `imageUrl` |
| Null imageUrl: no fallback | Null imageUrl: `<SlideImageFallback>` component |

---

## Verification

```bash
cd /Users/sumitsatapathy/Unified_X/bba-ai-app
npx tsc --noEmit
npm run dev
```

Open browser at `http://localhost:3000`. Navigate to Design Lab. Generate a 10-slide deck. Verify:

1. Slides render as `<img>` tags — no iframes
2. ← → buttons in toolbar navigate slides
3. Keyboard arrow keys navigate slides
4. Slide count shows "1/10", "2/10", etc.
5. Fullscreen shows image carousel with dot navigation
6. Download Images triggers sequential PNG downloads
7. Clicking a slide card in the grid opens the edit panel
8. SlideEditForm shows correct fields for each slide type
9. Every edit form has a "Visual Prompt" textarea
10. Null imageUrl slides show the orange fallback card

---

## Git Commit for Phase 4

```
feat: replace iframe slideshow with image carousel, add keyboard nav, 16-type edit forms
```
