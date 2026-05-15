'use client';

import { useEffect, useRef } from 'react';
import type { ArtifactType, ParsedModule } from '@/lib/types';
import { renderMarkdown } from '@/lib/render-markdown';
import InlineActions from './InlineActions';

interface Props {
  streamContent: string;
  wordCount: number;
  done: boolean;
  artifactType?: ArtifactType | null;
  module?: ParsedModule | null;
}

export default function StreamingBubble({ streamContent, wordCount, done, artifactType, module }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [streamContent]);

  return (
    <div
      ref={ref}
      style={{
        alignSelf: 'flex-start',
        background: 'var(--bg-ai-bubble)',
        color: 'var(--text-ai-bubble)',
        borderRadius: 'var(--chat-bubble-radius-ai)',
        maxWidth: '85%',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-card)',
        position: 'relative',
      }}
    >
      {!done && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            color: 'var(--accent)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'inline-block',
              animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
            }}
          />
          {wordCount > 0 && <span>{wordCount.toLocaleString()} words</span>}
        </div>
      )}

      {streamContent ? (
        <div
          className="prose prose-sm max-w-none"
          style={{ fontSize: 14, lineHeight: 1.7 }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(streamContent) }}
        />
      ) : (
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Starting generation…</div>
      )}

      {done && artifactType && module && (
        <InlineActions content={streamContent} artifactType={artifactType} module={module} />
      )}
    </div>
  );
}
