'use client';

import { useState, useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import DesignLab from '@/components/DesignLab';
import { makeUserMessage, makeAiMessage } from '@/lib/chat-state';
import type { ParsedModule, ArtifactType } from '@/lib/types';
import type { ChatStep, ChatMessage, ChatMessageType } from '@/lib/chat-types';
import ChatLanding from '@/components/chat/ChatLanding';
import ChatInterface from '@/components/chat/ChatInterface';
import ChatHeader from '@/components/chat/ChatHeader';
import GenerateView from '@/components/chat/GenerateView';
import { getOrCreateSessionId } from '@/lib/session';
import LoginModal from '@/components/auth/LoginModal';

const CHAT_STEPS: ChatStep[] = [
  'selecting-module',
  'selecting-artifact',
];

export default function Home() {
  const [chatStep, setChatStep] = useState<ChatStep>('landing');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [modules, setModules] = useState<ParsedModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<ParsedModule | null>(null);
  const [artifactType, setArtifactType] = useState<ArtifactType | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isLoggedIn = !!user;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setShowLogin(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  async function handleSyllabusSubmit(text: string, file: File | null) {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    const userMsg: ChatMessage = file
      ? makeUserMessage('file-attachment', { fileName: file.name })
      : makeUserMessage('text', {
          content: text.length > 80 ? text.slice(0, 80) + '…' : text,
        });

    setMessages((prev) => [...prev, userMsg]);
    setParseError(null);
    setChatStep('parsing');

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('text', text);
    }

    try {
      const res = await fetch('/api/parse', { method: 'POST', body: formData, headers: { 'x-session-id': getOrCreateSessionId() } });
      const data = await res.json();

      if (!res.ok || data.error) {
        setParseError(data.error ?? 'Failed to parse syllabus. Please try again.');
        setChatStep('landing');
        setMessages([]);
        return;
      }

      const parsed: ParsedModule[] = data.modules ?? [];

      if (parsed.length === 0) {
        setParseError('No modules found. Make sure your syllabus includes module titles and topics, then try again.');
        setChatStep('landing');
        setMessages([]);
        return;
      }

      setModules(parsed);
      setChatStep('selecting-module');

      const typingMsg = makeAiMessage('typing');
      setMessages((prev) => [...prev, typingMsg]);

      await new Promise<void>((resolve) => setTimeout(resolve, 800));

      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.id !== typingMsg.id);
        const aiText = makeAiMessage('text', {
          content: `I've parsed your syllabus and found ${parsed.length} module${parsed.length !== 1 ? 's' : ''}. Which one would you like to explore?`,
        });
        const aiModules = makeAiMessage('module-list', { modules: parsed });
        return [...withoutTyping, aiText, aiModules];
      });
    } catch (err) {
      console.error('Parse error:', err);
      setParseError('Network error. Please check your connection and try again.');
      setChatStep('landing');
      setMessages([]);
    }
  }

  async function handleModuleSelect(mod: ParsedModule) {
    const userMsg = makeUserMessage('text', { content: mod.title });
    setMessages((prev) => [...prev, userMsg]);
    setSelectedModule(mod);
    setChatStep('selecting-artifact');

    await new Promise<void>((resolve) => setTimeout(resolve, 600));

    const topicsPreview = mod.topics.slice(0, 3).join(', ');
    const hasMore = mod.topics.length > 3;
    const aiText = makeAiMessage('text', {
      content: `**${mod.title}**\nSemester ${mod.semester} · ${mod.hours} hours\nTopics: ${topicsPreview}${hasMore ? '…' : ''}\n\nWhat would you like to create?`,
    });
    const aiArtifacts = makeAiMessage('artifact-options');
    setMessages((prev) => [...prev, aiText, aiArtifacts]);
  }

  async function handleArtifactSelect(type: ArtifactType) {
    const labelMap: Record<ArtifactType, string> = {
      notes: 'Notes',
      pptx: 'PPTX',
      workbook: 'Workbook',
    };
    const userMsg = makeUserMessage('text', { content: labelMap[type] });
    setMessages((prev) => [...prev, userMsg]);
    setArtifactType(type);

    if (type === 'pptx') {
      await new Promise<void>((resolve) => setTimeout(resolve, 400));
      setTransitioning(true);
      setChatStep('design-lab');
      setTimeout(() => setTransitioning(false), 350);
      return;
    }

    setChatStep('generate-view');
    setStreamContent('');
    setWordCount(0);

    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-session-id': getOrCreateSessionId() },
        body: JSON.stringify({ module: selectedModule, artifactType: type }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        if (res.status === 429) {
          const msg = await res.text();
          setChatStep('selecting-artifact');
          setMessages((prev) => [
            ...prev,
            { id: Date.now().toString(), role: 'assistant' as const, type: 'text' as const, content: msg || 'Rate limit reached. Please wait before generating again.' },
          ]);
          return;
        }
        throw new Error('Generation failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        // Respect stop button — abort signal fired
        if (abortRef.current?.signal.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        const words = full.trim().split(/\s+/).filter(Boolean).length;
        setStreamContent(full);
        setWordCount(words);
      }

      setChatStep('generating-done');
    } catch (err) {
      const name = (err as Error).name;
      if (name === 'AbortError' || name === 'TypeError') {
        // Aborted by stop button or network cancel — mark done, keep content
        setChatStep('generating-done');
        return;
      }
      console.error('Generate error:', err);
      // Don't leave user stuck — go back to chat with an error message
      setChatStep('selecting-artifact');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant' as const,
          type: 'text' as const,
          content: 'Generation failed — please try again.',
        },
      ]);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
    abortRef.current = null;
    setChatStep('generating-done');
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: 'local' });
  }

  function handleRestart() {
    abortRef.current?.abort();
    abortRef.current = null;
    setChatStep('landing');
    setMessages([]);
    setModules([]);
    setSelectedModule(null);
    setArtifactType(null);
    setStreamContent('');
    setWordCount(0);
    setParseError(null);
  }

  const isChatStep = CHAT_STEPS.includes(chatStep);
  const isLandingStep = chatStep === 'landing' || chatStep === 'parsing';
  const isGenerateStep = chatStep === 'generate-view' || chatStep === 'generating-notes' || chatStep === 'generating-done';
  const streamDone = chatStep === 'generating-done';

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      {isLandingStep && (
        <ChatLanding
          onSubmit={handleSyllabusSubmit}
          onRequireAuth={() => { if (!isLoggedIn) setShowLogin(true); }}
          onLogout={handleLogout}
          isLoggedIn={isLoggedIn}
          isParsing={chatStep === 'parsing'}
          serverError={parseError}
        />
      )}

      {isChatStep && (
        <ChatInterface
          messages={messages}
          chatStep={chatStep}
          modules={modules}
          selectedModule={selectedModule}
          artifactType={artifactType}
          onModuleSelect={handleModuleSelect}
          onArtifactSelect={handleArtifactSelect}
          onRestart={handleRestart}
          streamContent={streamContent}
          wordCount={wordCount}
          streamDone={streamDone}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
        />
      )}

      {isGenerateStep && selectedModule && artifactType && artifactType !== 'pptx' && (
        <GenerateView
          streamContent={streamContent}
          wordCount={wordCount}
          done={chatStep === 'generating-done'}
          artifactType={artifactType}
          module={selectedModule}
          onStop={handleStop}
          onRestart={handleRestart}
          onBackToChat={() => setChatStep('selecting-artifact')}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((d) => !d)}
        />
      )}

      {chatStep === 'design-lab' && selectedModule && (
        <div
          className={`min-h-screen flex flex-col ${transitioning ? 'designlab-enter' : ''}`}
          style={{ background: 'var(--bg-base)' }}
        >
          <ChatHeader
            onNew={handleRestart}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((d) => !d)}
            showBackToChat
            onBackToChat={() => {
              setChatStep('selecting-artifact');
            }}
          />
          <div className="flex-1 overflow-auto pt-4 pb-8">
            <DesignLab
              module={selectedModule}
              onBack={() => setChatStep('selecting-artifact')}
              onRestart={handleRestart}
            />
          </div>
        </div>
      )}
    </div>
  );
}
