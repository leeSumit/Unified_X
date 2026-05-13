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
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const artifact = ARTIFACT_TYPES.find((a) => a.id === artifactType)!;

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
          const msg = await res.text();
          setContent(msg || 'Generation failed.');
          setStatus('error');
          return;
        }

        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let full = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          setContent(full);
          setWordCount(full.split(/\s+/).filter(Boolean).length);
        }

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

  // Auto-scroll during streaming
  useEffect(() => {
    if (status === 'streaming' && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content, status]);

  function handleCopy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const ext = artifactType === 'pptx' ? 'md' : 'md';
    const filename = `${module.title.toLowerCase().replace(/\s+/g, '-')}-${artifactType}.${ext}`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Simple markdown-to-HTML renderer
  function renderMarkdown(md: string): string {
    return md
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
      .replace(/^---$/gm, '<hr />')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^- (.+)$/gm, '<li>$1</li>');
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold text-white px-2 py-0.5 rounded ${artifact.chipColor}`}>
              {artifact.chip}
            </span>
            <span className="text-xs text-gray-500">
              Sem {module.semester} · Mod {module.module}
            </span>
          </div>
          <h2 className="text-xl font-bold text-brand-purple">{module.title}</h2>
        </div>

        <div className="flex items-center gap-2 text-sm flex-shrink-0">
          {status === 'streaming' && (
            <span className="flex items-center gap-1.5 text-brand-purple font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-purple" />
              </span>
              Generating… {wordCount.toLocaleString()} words
            </span>
          )}
          {status === 'done' && (
            <span className="text-green-600 font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Done · {wordCount.toLocaleString()} words
            </span>
          )}
          {status === 'error' && (
            <span className="text-red-600 font-medium">Error</span>
          )}
        </div>
      </div>

      {/* Content area */}
      <div
        ref={containerRef}
        className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-y-auto"
        style={{ height: '55vh' }}
      >
        {content ? (
          <div
            className="prose prose-sm max-w-none p-6"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-3 text-brand-purple" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p>Starting generation…</p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleCopy}
          disabled={!content}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-brand-purple hover:text-brand-purple transition-all disabled:opacity-40"
        >
          {copied ? (
            <>✓ Copied</>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={status === 'streaming'}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-brand-purple hover:text-brand-purple transition-all disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download .md
        </button>

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

        <button
          onClick={onRestart}
          className="text-sm text-gray-500 hover:text-brand-purple transition-colors"
        >
          New module →
        </button>
      </div>

      {status === 'done' && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <strong>Next step:</strong> Paste this content into the{' '}
          <strong>Open Design</strong> tool to apply the Campus AI visual template. Or generate the
          other two artifacts (Notes → PPTX Outline → Workbook) for the full module kit.
        </div>
      )}
    </div>
  );
}
