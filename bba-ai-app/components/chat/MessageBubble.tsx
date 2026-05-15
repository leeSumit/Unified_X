'use client';

import { useEffect, useState } from 'react';
import type { ChatMessage } from '@/lib/chat-types';

interface Props {
  message: ChatMessage;
  children?: React.ReactNode;
}

function renderSimpleMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function MessageBubble({ message, children }: Props) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(t);
  }, []);

  const isUser = message.role === 'user';

  const bubbleStyle: React.CSSProperties = isUser
    ? {
        alignSelf: 'flex-end',
        background: '#f97316',
        color: '#ffffff',
        borderRadius: '20px 20px 4px 20px',
        maxWidth: '80%',
        padding: '10px 14px',
        fontSize: 15,
        lineHeight: 1.5,
      }
    : {
        alignSelf: 'flex-start',
        background: '#16161e',
        color: '#e2e8f0',
        borderRadius: '4px 20px 20px 20px',
        maxWidth: '85%',
        padding: '12px 16px',
        fontSize: 15,
        lineHeight: 1.5,
        border: '1px solid rgba(255,255,255,0.06)',
      };

  return (
    <div
      style={{
        ...bubbleStyle,
        opacity: entered ? 1 : 0,
        transform: entered ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 200ms ease-out, transform 200ms ease-out',
      }}
    >
      {message.type === 'file-attachment' ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>📎</span>
          <span>{message.fileName ?? 'Attached file'}</span>
        </span>
      ) : message.content ? (
        <span dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(message.content) }} />
      ) : null}
      {children}
    </div>
  );
}
