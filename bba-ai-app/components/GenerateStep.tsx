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
      div.style.cssText = 'font-family:Inter,sans-serif;font-size:14px;line-height:1.7;padding:40px;color:#1a202c;max-width:800px;';
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
      .replace(/^## (.+)$/gm, '<h2 style="font-size:19px;font-weight:800;margin:24px 0 10px;border-bottom:2px solid #e2e8f0;padding-bottom:6px;">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;font-weight:800;margin:0 0 20px;">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:12px;">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #cbd5e0;padding:8px 14px;color:#4a5568;margin:12px 0;">$1</blockquote>')
      .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />')
      .replace(/^- (.+)$/gm, '<li style="margin-bottom:3px;font-size:14px;line-height:1.7;">$1</li>')
      .replace(/\n\n/g, '</p><p style="margin:0 0 10px;line-height:1.7;font-size:14px;">');
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold text-white px-2 py-0.5 rounded ${artifact.chipColor}`}>
              {artifact.chip}
            </span>
            <span className="text-xs text-gray-500">Sem {module.semester} · Mod {module.module}</span>
          </div>
          <h2 className="text-xl font-bold text-brand-purple">{module.title}</h2>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {status === 'streaming' && (
            <span className="flex items-center gap-1.5 text-brand-purple font-medium text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-purple" />
              </span>
              {wordCount.toLocaleString()} words
            </span>
          )}
          {status === 'done' && (
            <span className="text-green-600 font-medium text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Done · {wordCount.toLocaleString()} words
            </span>
          )}
          {status === 'error' && <span className="text-red-600 font-medium text-sm">Error</span>}
        </div>
      </div>

      {/* Content area */}
      {editMode ? (
        <div className="rounded-xl border border-brand-purple shadow-sm overflow-hidden" style={{ height: '60vh' }}>
          <div className="bg-purple-50 border-b border-purple-200 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-purple">Editing — changes apply to download</span>
            <div className="flex gap-2">
              <button
                onClick={() => { setContent(editedContent); setEditMode(false); }}
                className="text-xs px-3 py-1 bg-brand-purple text-white rounded-lg font-medium hover:opacity-90"
              >
                Save & Preview
              </button>
              <button
                onClick={() => { setEditedContent(content); setEditMode(false); }}
                className="text-xs px-3 py-1 bg-white border border-gray-200 text-gray-600 rounded-lg font-medium hover:border-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm text-gray-800 resize-none focus:outline-none bg-white"
            style={{ height: 'calc(100% - 40px)' }}
            spellCheck={false}
          />
        </div>
      ) : (
        <div
          ref={containerRef}
          className="rounded-xl border border-gray-200 shadow-sm overflow-y-auto bg-white"
          style={{ height: '60vh' }}
        >
          {content ? (
            <div className="p-6">
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-brand-purple" fill="none" viewBox="0 0 24 24">
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
            className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-all"
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
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-brand-purple hover:text-brand-purple transition-all disabled:opacity-40"
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
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-brand-purple hover:text-brand-purple transition-all disabled:opacity-40"
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
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-brand-purple hover:text-brand-purple transition-all"
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
          className="text-sm text-gray-500 hover:text-brand-purple transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Change artifact
        </button>

        <button onClick={onRestart} className="text-sm text-gray-500 hover:text-brand-purple transition-colors">
          New module →
        </button>
      </div>
    </div>
  );
}
