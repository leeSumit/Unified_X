'use client';

import { useEffect, useRef, useState } from 'react';
import type { ParsedModule, ArtifactType } from '@/lib/types';
import { ARTIFACT_TYPES } from '@/lib/types';

interface Props {
  module: ParsedModule;
  artifactType: ArtifactType;
  onBack: () => void;
  onRestart: () => void;
}

type Status = 'streaming' | 'done' | 'error';

export default function GenerateStep({ module, artifactType, onBack, onRestart }: Props) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('streaming');
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const artifact = ARTIFACT_TYPES.find((a) => a.id === artifactType)!;
  const displayContent = editMode ? editedContent : content;

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;

    async function stream() {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({ module, artifactType }),
        });

        if (!res.ok) {
          setContent(await res.text() || 'Generation failed.');
          setStatus('error');
          return;
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let full = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          setContent(full);
          setWordCount(full.split(/\s+/).filter(Boolean).length);
        }

        setEditedContent(full);
        setStatus('done');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setContent((prev) => prev + '\n\n**Generation stopped.**');
          setStatus('error');
        }
      }
    }

    stream();
    return () => controller.abort();
  }, [module, artifactType]);

  useEffect(() => {
    if (status === 'streaming' && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content, status]);

  function handleStop() {
    abortRef.current?.abort();
    setStatus('done');
    setEditedContent(content);
  }

  function handleCopy() {
    navigator.clipboard.writeText(displayContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handleDownloadPDF() {
    setIsPdfGenerating(true);
    try {
      const filename = `${module.title.toLowerCase().replace(/\s+/g, '-')}-${artifactType}.pdf`;
      const html2pdf = (await import('html2pdf.js')).default;
      const div = document.createElement('div');
      div.style.cssText = 'font-family:Inter,sans-serif;font-size:14px;line-height:1.7;padding:40px;color:#16191F;max-width:800px;';
      div.innerHTML = renderMarkdown(displayContent);
      document.body.appendChild(div);
      await html2pdf()
        .set({ margin: 10, filename, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4' } })
        .from(div)
        .save();
      document.body.removeChild(div);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  }

  function renderMarkdown(md: string): string {
    return md
      .replace(/^#### (.+)$/gm, '<h4 style="font-size:14px;font-weight:700;margin:14px 0 6px;">$1</h4>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:700;margin:18px 0 8px;">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size:19px;font-weight:800;margin:24px 0 10px;border-bottom:2px solid #E9EBED;padding-bottom:6px;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;font-weight:800;margin:0 0 20px;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:#F2F3F3;padding:1px 5px;border-radius:2px;font-size:12px;">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #FF9900;padding:8px 14px;color:#545B64;margin:12px 0;background:#FFF8EE;">$1</blockquote>')
      .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #E9EBED;margin:20px 0;" />')
      .replace(/^- (.+)$/gm, '<li style="margin-bottom:3px;font-size:14px;line-height:1.7;">$1</li>')
      .replace(/\n\n/g, '</p><p style="margin:0 0 10px;line-height:1.7;font-size:14px;">');
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold text-white px-2 py-0.5"
              style={{ background: '#232F3E', borderRadius: 2 }}
            >
              {artifact.chip}
            </span>
            <span className="text-xs" style={{ color: '#8D9BA8' }}>Sem {module.semester} · Mod {module.module}</span>
          </div>
          <h2 className="text-xl font-bold" style={{ color: '#16191F' }}>{module.title}</h2>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {status === 'streaming' && (
            <span className="flex items-center gap-1.5 font-medium text-sm" style={{ color: '#FF9900' }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#FF9900' }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#FF9900' }} />
              </span>
              {wordCount.toLocaleString()} words
            </span>
          )}
          {status === 'done' && (
            <span className="font-medium text-sm flex items-center gap-1" style={{ color: '#1D8102' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Done · {wordCount.toLocaleString()} words
            </span>
          )}
          {status === 'error' && (
            <span className="font-medium text-sm" style={{ color: '#D13212' }}>Error</span>
          )}
        </div>
      </div>

      {/* Content area */}
      {editMode ? (
        <div style={{ height: '60vh', border: '1px solid #FF9900', borderRadius: 2, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <div
            className="px-4 py-2 flex items-center justify-between"
            style={{ background: '#232F3E', borderBottom: '1px solid #16202D' }}
          >
            <span className="text-xs font-semibold text-white">Editing — changes apply to download</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setContent(editedContent); setEditMode(false); }}
                className="text-xs px-3 py-1 font-medium transition-all"
                style={{ background: '#FF9900', color: '#16191F', borderRadius: 2, border: 'none', cursor: 'pointer' }}
              >
                Save & Preview
              </button>
              <button
                onClick={() => { setEditedContent(content); setEditMode(false); }}
                className="text-xs px-3 py-1 font-medium transition-all"
                style={{ background: '#FFFFFF', color: '#16191F', borderRadius: 2, border: '1px solid #8D9BA8', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-4 font-mono text-sm resize-none focus:outline-none"
            style={{ height: 'calc(100% - 40px)', background: '#FFFFFF', color: '#16191F' }}
            spellCheck={false}
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="overflow-y-auto"
          style={{
            height: '60vh',
            background: '#FFFFFF',
            border: '1px solid #E9EBED',
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          {content ? (
            <div className="p-6">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full" style={{ color: '#8D9BA8' }}>
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3" fill="none" viewBox="0 0 24 24" style={{ color: '#FF9900' }}>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <p className="text-sm">Starting generation…</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {status === 'streaming' && (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: '#FDF3F1',
              border: '1px solid #D13212',
              borderRadius: 2,
              color: '#D13212',
              cursor: 'pointer',
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            Stop
          </button>
        )}

        <button
          onClick={handleCopy}
          disabled={!content}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all disabled:opacity-40"
          style={{
            background: '#FFFFFF',
            border: '1px solid #8D9BA8',
            borderRadius: 2,
            color: '#16191F',
            cursor: content ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (content) { (e.currentTarget as HTMLElement).style.borderColor = '#0073BB'; (e.currentTarget as HTMLElement).style.color = '#0073BB'; } }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#8D9BA8'; (e.currentTarget as HTMLElement).style.color = '#16191F'; }}
        >
          {copied ? '✓ Copied' : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={status === 'streaming' || isPdfGenerating}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all disabled:opacity-40"
          style={{
            background: '#FFFFFF',
            border: '1px solid #8D9BA8',
            borderRadius: 2,
            color: '#16191F',
            cursor: status !== 'streaming' && !isPdfGenerating ? 'pointer' : 'not-allowed',
          }}
          onMouseEnter={e => { if (status !== 'streaming' && !isPdfGenerating) { (e.currentTarget as HTMLElement).style.borderColor = '#0073BB'; (e.currentTarget as HTMLElement).style.color = '#0073BB'; } }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#8D9BA8'; (e.currentTarget as HTMLElement).style.color = '#16191F'; }}
        >
          {isPdfGenerating ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating PDF…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </>
          )}
        </button>

        {status === 'done' && !editMode && (
          <button
            onClick={() => { setEditedContent(content); setEditMode(true); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all"
            style={{
              background: '#FFFFFF',
              border: '1px solid #8D9BA8',
              borderRadius: 2,
              color: '#16191F',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0073BB'; (e.currentTarget as HTMLElement).style.color = '#0073BB'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#8D9BA8'; (e.currentTarget as HTMLElement).style.color = '#16191F'; }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        )}

        <div className="flex-1" />

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
          Change artifact
        </button>

        <button
          onClick={onRestart}
          className="text-sm transition-colors"
          style={{ color: '#545B64', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0073BB')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#545B64')}
        >
          New module →
        </button>
      </div>
    </div>
  );
}
