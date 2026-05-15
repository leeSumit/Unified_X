'use client';
import { useEffect, useRef } from 'react';
import type { ArtifactType, ParsedModule } from '@/lib/types';
import { renderMarkdown } from '@/lib/render-markdown';
import ChatHeader from './ChatHeader';
import InlineActions from './InlineActions';

interface Props {
  streamContent: string;
  wordCount: number;
  done: boolean;
  artifactType: ArtifactType;
  module: ParsedModule;
  onStop: () => void;
  onRestart: () => void;
  onBackToChat: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function GenerateView({ streamContent, wordCount, done, artifactType, module, onStop, onRestart, onBackToChat, darkMode, onToggleDark }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamContent]);

  const labelMap: Record<ArtifactType, string> = { notes: 'Notes', pptx: 'PPTX', workbook: 'Workbook' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <ChatHeader
        onNew={onRestart}
        darkMode={darkMode}
        onToggleDark={onToggleDark}
        showBackToChat
        onBackToChat={onBackToChat}
      />

      {/* Header bar with module info + word count + stop button */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 860, width: '100%', marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {module.title}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>
            {labelMap[artifactType]}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {wordCount > 0 && (
            <span style={{ fontSize: 12, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
              {wordCount.toLocaleString()} words
            </span>
          )}
          {!done && (
            <button
              onClick={onStop}
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: 8, padding: '5px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span style={{ width: 8, height: 8, background: '#ef4444', display: 'inline-block', borderRadius: 2 }} />
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div
        ref={contentRef}
        className="content-dark"
        style={{ flex: 1, overflowY: 'auto', padding: '24px', maxWidth: 860, width: '100%', marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' }}
      >
        {streamContent ? (
          <div
            className="prose prose-sm prose-invert max-w-none"
            style={{ fontSize: 15, lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(streamContent) }}
          />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)', paddingTop: 40 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
            Generating {labelMap[artifactType]}…
          </div>
        )}

        {done && streamContent && (
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <InlineActions content={streamContent} artifactType={artifactType} module={module} />
          </div>
        )}
      </div>
    </div>
  );
}
