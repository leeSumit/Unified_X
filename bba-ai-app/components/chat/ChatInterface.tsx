'use client';

import { useEffect, useRef } from 'react';
import type { ArtifactType, ParsedModule } from '@/lib/types';
import type { ChatMessage, ChatStep } from '@/lib/chat-types';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ModuleCards from './ModuleCards';
import ArtifactCards from './ArtifactCards';
import GeneratingMessage from './GeneratingMessage';
import StreamingBubble from './StreamingBubble';

interface Props {
  messages: ChatMessage[];
  chatStep: ChatStep;
  modules: ParsedModule[];
  selectedModule: ParsedModule | null;
  artifactType: ArtifactType | null;
  onModuleSelect: (mod: ParsedModule) => void;
  onArtifactSelect: (type: ArtifactType) => void;
  onNew?: () => void;
  onRestart: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
  streamContent: string;
  wordCount: number;
  streamDone: boolean;
}

export default function ChatInterface({
  messages,
  chatStep,
  modules,
  selectedModule,
  artifactType,
  onModuleSelect,
  onArtifactSelect,
  onNew,
  onRestart,

  darkMode,
  onToggleDark,
  streamContent,
  wordCount,
  streamDone,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const isTyping = chatStep === 'parsing';

  function renderMessage(msg: ChatMessage) {
    switch (msg.type) {
      case 'typing':
        return <TypingIndicator key={msg.id} visible />;

      case 'module-list':
        return (
          <MessageBubble key={msg.id} message={msg}>
            <ModuleCards modules={msg.modules ?? modules} onSelect={onModuleSelect} />
          </MessageBubble>
        );

      case 'artifact-options':
        return (
          <MessageBubble key={msg.id} message={msg}>
            <ArtifactCards onSelect={onArtifactSelect} />
          </MessageBubble>
        );

      case 'generating':
        return (
          <GeneratingMessage
            key={msg.id}
            artifactType={msg.artifactType ?? (artifactType as ArtifactType)}
          />
        );

      case 'stream':
      case 'stream-done':
        return (
          <StreamingBubble
            key={msg.id}
            streamContent={streamContent}
            wordCount={wordCount}
            done={msg.type === 'stream-done' || streamDone}
            artifactType={msg.artifactType ?? artifactType}
            module={selectedModule}
          />
        );

      default:
        return <MessageBubble key={msg.id} message={msg} />;
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: '#0d0d14',
      }}
    >
      <ChatHeader
        onNew={onNew ?? onRestart}
        darkMode={darkMode}
        onToggleDark={onToggleDark}
      />

      {/* Scrollable message list */}
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          maxWidth: 720,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxSizing: 'border-box',
          background: 'transparent',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
          {messages.map((msg) => renderMessage(msg))}
          {isTyping && <TypingIndicator visible />}
        </div>
      </div>

      {/* Sticky bottom input bar */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#0d0d14',
          padding: '12px 16px',
          maxWidth: 720,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <ChatInput
          value=""
          onChange={() => {}}
          onSubmit={() => {}}
          disabled
          placeholder="Select an option above…"
        />
      </div>
    </div>
  );
}
