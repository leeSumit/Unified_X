'use client';

import { useRef, useEffect } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
  multiline?: boolean;
  fileSelected?: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  onFileSelect,
  disabled = false,
  placeholder = 'Message…',
  multiline = false,
  fileSelected = false,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSubmit = value.trim().length > 30 || fileSelected;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit && !disabled) onSubmit();
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f && onFileSelect) onFileSelect(f);
    e.target.value = '';
  }

  const wrapperStyle: React.CSSProperties = multiline
    ? {
        borderRadius: 20,
        background: '#16161e',
        padding: '8px 8px 8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minHeight: 52,
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }
    : {
        borderRadius: 9999,
        background: '#16161e',
        padding: '6px 8px 6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: '1px solid rgba(255,255,255,0.08)',
      };

  return (
    <div style={wrapperStyle}>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.docx,.txt,.md"
        className="hidden"
        onChange={handleFileChange}
      />

      {!multiline && (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          aria-label="Upload file"
          style={{
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: 4,
            color: 'var(--text-muted)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: 15,
          lineHeight: 1.5,
          color: '#e2e8f0',
          minHeight: undefined,
          maxHeight: multiline ? 300 : 200,
          overflow: 'auto',
          fontFamily: 'inherit',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, flexShrink: 0 }}>
        {multiline && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={disabled}
            aria-label="Upload file"
            style={{
              background: 'none',
              border: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              padding: 4,
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => { if (canSubmit && !disabled) onSubmit(); }}
          disabled={!canSubmit || disabled}
          aria-label="Send"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: canSubmit && !disabled ? '#f97316' : 'rgba(255,255,255,0.08)',
            border: 'none',
            cursor: canSubmit && !disabled ? 'pointer' : 'not-allowed',
            opacity: canSubmit && !disabled ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0,
            transition: 'opacity 100ms ease, background 100ms ease',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
