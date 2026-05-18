'use client';

import { useState } from 'react';
import ChatInput from './ChatInput';
import FilePill from './FilePill';
import PreviousArtifacts from './PreviousArtifacts';
import type { ArtifactPreview } from './PreviousArtifacts';
import PreviousModules from './PreviousModules';
import type { ModulePreview } from './PreviousModules';

interface Props {
  onSubmit?: (text: string, file: File | null) => void;
  onRequireAuth?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  isParsing?: boolean;
  serverError?: string | null;
  previousArtifacts?: ArtifactPreview[];
  onOpenArtifact?: (artifact: ArtifactPreview) => void;
  loadingArtifactId?: string | null;
  onShowAllArtifacts?: () => void;
  previousModules?: ModulePreview[];
  onOpenModule?: (module: ModulePreview) => void;
  onShowAllModules?: () => void;
}

export default function ChatLanding({ onSubmit, onRequireAuth, onLogout, isLoggedIn = false, isParsing = false, serverError = null, previousArtifacts, onOpenArtifact, loadingArtifactId, onShowAllArtifacts, previousModules, onOpenModule, onShowAllModules }: Props) {
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(f: File) {
    setFile(f);
    setText('');
    setError(null);
  }

  function handleTextChange(val: string) {
    setText(val);
    if (val) setFile(null);
    setError(null);
  }

  function handleSubmit() {
    if (isParsing) return;
    if (!file && text.trim().length === 0) {
      setError('Please paste your syllabus text or upload a file first.');
      return;
    }
    setError(null);
    onSubmit?.(text, file);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isLoggedIn ? 'flex-start' : 'center',
        background: 'var(--bg-base)',
        position: 'relative',
        paddingTop: isLoggedIn ? 'max(64px, 12vh)' : '24px',
        paddingBottom: isLoggedIn ? 64 : 24,
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {/* Logout button */}
      {isLoggedIn && (
        <button
          onClick={onLogout}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '7px 14px',
            fontSize: 13,
            fontWeight: 500,
            color: '#8892a4',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'background 150ms ease, color 150ms ease',
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.09)';
            (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
            (e.currentTarget as HTMLButtonElement).style.color = '#8892a4';
          }}
        >
          Sign out
        </button>
      )}

      {/* Radial gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, rgba(249,115,22,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 680,
          display: 'flex',
          flexDirection: 'column',
          gap: 56,
          zIndex: 1,
        }}
      >
        {/* Branding */}
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(52px, 7vw, 96px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
            }}
          >
            UN<span style={{ color: '#f97316', fontWeight: 900 }}>AI</span>TED
          </h1>
          <p style={{ fontSize: 18, color: '#8892a4', margin: 0, fontWeight: 400 }}>
            An united workflow for educators
          </p>
        </div>

        {/* Input area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          {file && <FilePill fileName={file.name} onRemove={() => setFile(null)} />}

          <ChatInput
            value={text}
            onChange={handleTextChange}
            onSubmit={handleSubmit}
            onFileSelect={handleFileSelect}
            onFocus={onRequireAuth}
            disabled={isParsing}
            placeholder="Paste your syllabus or upload a PDF..."
            multiline
            fileSelected={!!file}
          />

          {(error || serverError) && (
            <p style={{ fontSize: 13, color: '#ef4444', margin: 0, padding: '6px 2px' }}>
              {error || serverError}
            </p>
          )}

          {isParsing && (
            <p
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                margin: 0,
                textAlign: 'center',
                padding: '4px 0',
              }}
            >
              Parsing syllabus…
            </p>
          )}
        </div>

        {/* Previous artifacts + modules — visible only when logged in and not parsing */}
        {isLoggedIn && !isParsing && (
          <div
            style={{
              width: '100%',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            <PreviousArtifacts
              artifacts={previousArtifacts}
              onOpen={onOpenArtifact}
              loadingId={loadingArtifactId}
              onShowAll={onShowAllArtifacts}
            />
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28 }}>
              <PreviousModules
                modules={previousModules}
                onOpen={onOpenModule}
                onShowAll={onShowAllModules}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
