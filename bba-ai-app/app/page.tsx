'use client';

import { useState, useEffect, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import DesignLab from '@/components/DesignLab';
import { makeUserMessage, makeAiMessage } from '@/lib/chat-state';
import type { ParsedModule, ArtifactType, SlideState } from '@/lib/types';
import type { ChatStep, ChatMessage, ChatMessageType } from '@/lib/chat-types';
import ChatLanding from '@/components/chat/ChatLanding';
import ChatInterface from '@/components/chat/ChatInterface';
import ChatHeader from '@/components/chat/ChatHeader';
import GenerateView from '@/components/chat/GenerateView';
import ArtifactsAllModal from '@/components/chat/ArtifactsAllModal';
import ModulesAllModal from '@/components/chat/ModulesAllModal';
import { getOrCreateSessionId } from '@/lib/session';
import LoginModal from '@/components/auth/LoginModal';
import type { ModulePreview } from '@/components/chat/PreviousModules';
import type { ArtifactPreview, ArtifactType as ArtifactPreviewType } from '@/components/chat/PreviousArtifacts';

interface ArtifactRow {
  id: string;
  artifact_type: ArtifactPreviewType;
  title: string;
  created_at: string;
  assets: { index: number; type: string; path: string }[] | null;
  modules: { title: string } | null;
}

interface ModuleRow {
  id: string;
  created_at: string;
  semester: number;
  module: number;
  title: string;
  hours: number;
  topics: string[] | null;
  tools: string[] | null;
  indian_case_study: string | null;
  global_case_study: string | null;
  learning_outcomes: string[] | null;
  source_filename: string | null;
}

function rowToParsedModule(row: ModuleRow): ParsedModule {
  return {
    id: row.id,
    semester: row.semester,
    module: row.module,
    title: row.title,
    hours: row.hours,
    topics: row.topics ?? [],
    tools: row.tools ?? [],
    indianCaseStudy: row.indian_case_study ?? undefined,
    globalCaseStudy: row.global_case_study ?? undefined,
    learningOutcomes: row.learning_outcomes ?? undefined,
  };
}

function rowToPreview(row: ModuleRow): ModulePreview {
  return {
    id: row.id,
    semester: row.semester,
    module: row.module,
    title: row.title,
    hours: row.hours,
    topicCount: row.topics?.length ?? 0,
    sourceFilename: row.source_filename ?? undefined,
    createdAt: new Date(row.created_at),
  };
}

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
  const [previousModuleRows, setPreviousModuleRows] = useState<ModuleRow[]>([]);
  const [previousArtifacts, setPreviousArtifacts] = useState<ArtifactPreview[]>([]);
  const [currentArtifactId, setCurrentArtifactId] = useState<string | null>(null);
  const [reopenedSlides, setReopenedSlides] = useState<SlideState[] | null>(null);
  const [reopenedDirection, setReopenedDirection] = useState<string | null>(null);
  const [isReopened, setIsReopened] = useState(false);
  const [loadingArtifactId, setLoadingArtifactId] = useState<string | null>(null);
  const [showAllArtifacts, setShowAllArtifacts] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [designLabBusy, setDesignLabBusy] = useState(false);
  const pendingNavRef = useRef<(() => void) | null>(null);
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

  // Fetch the logged-in user's previously parsed modules so they appear on the landing page.
  // Re-fetches whenever the user changes or we return to the landing step (e.g. after a fresh parse).
  useEffect(() => {
    if (!user) {
      setPreviousModuleRows([]);
      return;
    }
    if (chatStep !== 'landing') return;

    const supabase = createClient();
    let cancelled = false;
    supabase
      .from('modules')
      .select(
        'id, created_at, semester, module, title, hours, topics, tools, indian_case_study, global_case_study, learning_outcomes, source_filename'
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('Failed to load previous modules:', error);
          return;
        }
        setPreviousModuleRows((data ?? []) as ModuleRow[]);
      });
    return () => {
      cancelled = true;
    };
  }, [user, chatStep]);

  const previousModulePreviews = previousModuleRows.map(rowToPreview);

  // Fetch completed artifacts for the landing page. Same gating as modules.
  useEffect(() => {
    if (!user) {
      setPreviousArtifacts([]);
      return;
    }
    if (chatStep !== 'landing') return;

    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('artifacts')
        .select('id, artifact_type, title, created_at, assets, modules(title)')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(20);

      if (cancelled) return;
      if (error) {
        console.error('Failed to load previous artifacts:', error);
        return;
      }
      const rows = (data ?? []) as unknown as ArtifactRow[];

      // For PPTs, batch-sign the first slide's storage path for use as a card thumbnail.
      const firstPaths: string[] = [];
      const pathByRow = new Map<string, string>();
      for (const r of rows) {
        if (r.artifact_type !== 'pptx' || !Array.isArray(r.assets) || r.assets.length === 0) continue;
        const sorted = [...r.assets].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
        const path = sorted[0]?.path;
        if (path) {
          firstPaths.push(path);
          pathByRow.set(r.id, path);
        }
      }

      const urlByPath = new Map<string, string>();
      if (firstPaths.length > 0) {
        const { data: signed, error: signErr } = await supabase
          .storage
          .from('artifacts')
          .createSignedUrls(firstPaths, 60 * 60 * 6);
        if (signErr) {
          console.error('Failed to sign artifact thumbnails:', signErr);
        }
        for (const s of signed ?? []) {
          if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl);
        }
      }

      if (cancelled) return;
      setPreviousArtifacts(
        rows.map((r) => {
          const path = pathByRow.get(r.id);
          return {
            id: r.id,
            type: r.artifact_type,
            title: r.title,
            moduleTitle: r.modules?.title ?? '—',
            createdAt: new Date(r.created_at),
            thumbnailUrl: path ? urlByPath.get(path) ?? null : null,
          };
        })
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [user, chatStep]);

  async function handleOpenArtifact(preview: ArtifactPreview) {
    if (loadingArtifactId) return; // ignore double-clicks while a load is in flight
    setLoadingArtifactId(preview.id);
    try {
      const res = await fetch(`/api/artifacts/${preview.id}/load`);
      if (!res.ok) {
        console.error('[open-artifact] load failed', await res.text());
        return;
      }
      const data = await res.json() as {
        artifact: { id: string; artifact_type: ArtifactType; title: string; content: string | null; word_count: number | null; theme: string | null };
        module: {
          id: string; semester: number; module: number; title: string; hours: number;
          topics: string[] | null; tools: string[] | null;
          indian_case_study: string | null; global_case_study: string | null;
          learning_outcomes: string[] | null;
        } | null;
        assets: { index: number; type: string; path: string; content?: Record<string, unknown>; imageUrl: string | null }[];
      };

      // Build a ParsedModule from the linked row, or synthesize a minimal one
      // if the module has been deleted (artifacts.module_id is set null on delete).
      const mod: ParsedModule = data.module
        ? {
            id: data.module.id,
            semester: data.module.semester,
            module: data.module.module,
            title: data.module.title,
            hours: data.module.hours,
            topics: data.module.topics ?? [],
            tools: data.module.tools ?? [],
            indianCaseStudy: data.module.indian_case_study ?? undefined,
            globalCaseStudy: data.module.global_case_study ?? undefined,
            learningOutcomes: data.module.learning_outcomes ?? undefined,
          }
        : { semester: 0, module: 0, title: data.artifact.title, hours: 0, topics: [], tools: [] };

      setSelectedModule(mod);
      setModules([mod]);
      setArtifactType(data.artifact.artifact_type);
      setCurrentArtifactId(data.artifact.id);
      setIsReopened(true);

      if (data.artifact.artifact_type === 'pptx') {
        const slides: SlideState[] = data.assets.map(a => ({
          index: a.index,
          type: a.type,
          content: (a.content ?? {}) as Record<string, unknown>,
          imageUrl: a.imageUrl,
          storagePath: a.path,
          status: 'done',
        }));
        setReopenedSlides(slides);
        setReopenedDirection(data.artifact.theme ?? null);
        setTransitioning(true);
        setChatStep('design-lab');
        setTimeout(() => setTransitioning(false), 350);
      } else {
        // notes / workbook — open the read-only completed view with stored content.
        setReopenedSlides(null);
        setReopenedDirection(null);
        setStreamContent(data.artifact.content ?? '');
        setWordCount(data.artifact.word_count ?? 0);
        setChatStep('generating-done');
      }
    } catch (err) {
      console.error('[open-artifact] error', err);
    } finally {
      setLoadingArtifactId(null);
    }
  }

  async function handleOpenPreviousModule(preview: ModulePreview) {
    let row = previousModuleRows.find((r) => r.id === preview.id);
    // The modal can return modules outside the cached top-20 — fetch by id when needed.
    if (!row) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('modules')
        .select('id, created_at, semester, module, title, hours, topics, tools, indian_case_study, global_case_study, learning_outcomes, source_filename')
        .eq('id', preview.id)
        .single();
      if (error || !data) {
        console.error('[open-module] fetch failed', error);
        return;
      }
      row = data as ModuleRow;
    }
    const mod = rowToParsedModule(row);

    setModules([mod]);
    setSelectedModule(mod);
    setChatStep('selecting-artifact');

    const userMsg = makeUserMessage('text', { content: mod.title });
    setMessages([userMsg]);

    await new Promise<void>((resolve) => setTimeout(resolve, 400));

    const topicsPreview = mod.topics.slice(0, 3).join(', ');
    const hasMore = mod.topics.length > 3;
    const aiText = makeAiMessage('text', {
      content: `**${mod.title}**\nSemester ${mod.semester} · ${mod.hours} hours\nTopics: ${topicsPreview}${hasMore ? '…' : ''}\n\nWhat would you like to create?`,
    });
    const aiArtifacts = makeAiMessage('artifact-options');
    setMessages((prev) => [...prev, aiText, aiArtifacts]);
  }

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

  async function createArtifactRow(type: ArtifactType): Promise<string | null> {
    if (!selectedModule) return null;
    try {
      const res = await fetch('/api/artifacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module_id: selectedModule.id ?? null,
          artifact_type: type,
          title: `${selectedModule.title} — ${type}`,
        }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.id ?? null;
    } catch (err) {
      console.error('Failed to create artifact row:', err);
      return null;
    }
  }

  async function markArtifactCompleted(id: string, extras: { content?: string; word_count?: number } = {}) {
    try {
      await fetch('/api/artifacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'completed', ...extras }),
      });
    } catch (err) {
      console.error('Failed to mark artifact completed:', err);
    }
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

    // Duplicate guard: if a completed artifact of this type already exists for
    // this module, surface a notice instead of silently creating a second one.
    if (selectedModule?.id && user) {
      const supabase = createClient();
      const { data: existing } = await supabase
        .from('artifacts')
        .select('id')
        .eq('user_id', user.id)
        .eq('module_id', selectedModule.id)
        .eq('artifact_type', type)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        await new Promise<void>((resolve) => setTimeout(resolve, 400));
        const notice = makeAiMessage('duplicate-artifact', {
          artifactType: type,
          existingArtifactId: existing.id,
        });
        setMessages((prev) => [...prev, notice]);
        return;
      }
    }

    await proceedWithArtifact(type);
  }

  async function proceedWithArtifact(type: ArtifactType) {
    setArtifactType(type);

    // Starting a fresh generation — drop any rehydrated state from a previous reopen.
    setReopenedSlides(null);
    setReopenedDirection(null);
    setIsReopened(false);

    // Create an incomplete artifact row up-front. Status flips to 'completed'
    // when generation finishes (notes/workbook stream end, or DesignLab onComplete).
    const newArtifactId = await createArtifactRow(type);
    setCurrentArtifactId(newArtifactId);

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
      let words = 0;

      while (true) {
        // Respect stop button — abort signal fired
        if (abortRef.current?.signal.aborted) break;
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        words = full.trim().split(/\s+/).filter(Boolean).length;
        setStreamContent(full);
        setWordCount(words);
      }

      const aborted = abortRef.current?.signal.aborted;
      // Don't override the chat step on abort — the Stop button or the
      // back-confirm flow has already set the desired destination.
      if (!aborted) {
        setChatStep('generating-done');
        if (newArtifactId && full.trim().length > 0) {
          await markArtifactCompleted(newArtifactId, { content: full, word_count: words });
        }
      }
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
    setCurrentArtifactId(null);
    setReopenedSlides(null);
    setReopenedDirection(null);
    setIsReopened(false);
  }

  const isChatStep = CHAT_STEPS.includes(chatStep);
  const isLandingStep = chatStep === 'landing' || chatStep === 'parsing';
  const isGenerateStep = chatStep === 'generate-view' || chatStep === 'generating-notes' || chatStep === 'generating-done';
  const streamDone = chatStep === 'generating-done';

  // True while a generation is mid-flight. We use it to gate the back/new
  // buttons behind a confirmation dialog so the user can't accidentally
  // abandon an in-progress run (the row stays 'incomplete' if they do).
  const isGenerating =
    chatStep === 'generate-view' ||
    (chatStep === 'design-lab' && designLabBusy);

  function guardNavigation(navigate: () => void) {
    if (isGenerating) {
      pendingNavRef.current = () => {
        abortRef.current?.abort();
        abortRef.current = null;
        navigate();
      };
      setConfirmOpen(true);
    } else {
      navigate();
    }
  }

  function handleConfirmCancel() {
    pendingNavRef.current = null;
    setConfirmOpen(false);
  }

  function handleConfirmGoBack() {
    const fn = pendingNavRef.current;
    pendingNavRef.current = null;
    setConfirmOpen(false);
    fn?.();
  }

  // Reopened artifacts have no chat history to return to, so the back action
  // sends the user to the landing page instead of an empty chat shell.
  const goBackToChat = () => {
    if (isReopened) {
      handleRestart();
    } else {
      setChatStep('selecting-artifact');
    }
  };

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
          previousModules={previousModulePreviews}
          onOpenModule={handleOpenPreviousModule}
          previousArtifacts={previousArtifacts}
          onOpenArtifact={handleOpenArtifact}
          loadingArtifactId={loadingArtifactId}
          onShowAllArtifacts={() => setShowAllArtifacts(true)}
          onShowAllModules={() => setShowAllModules(true)}
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
          onOpenExistingArtifact={(id) => handleOpenArtifact({ id, type: artifactType ?? 'pptx', title: '', moduleTitle: '', createdAt: new Date() })}
          onCreateAnotherArtifact={(type) => proceedWithArtifact(type)}
          openingArtifactId={loadingArtifactId}
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
          onRestart={() => guardNavigation(handleRestart)}
          onBackToChat={() => guardNavigation(goBackToChat)}
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
            onNew={() => guardNavigation(handleRestart)}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode((d) => !d)}
            showBackToChat
            onBackToChat={() => guardNavigation(goBackToChat)}
          />
          <div className="flex-1 overflow-auto pt-4 pb-8">
            <DesignLab
              module={selectedModule}
              artifactId={currentArtifactId}
              initialSlides={reopenedSlides ?? undefined}
              initialDirection={reopenedDirection ?? undefined}
              onBack={() => guardNavigation(goBackToChat)}
              onRestart={() => guardNavigation(handleRestart)}
              onGeneratingChange={setDesignLabBusy}
            />
          </div>
        </div>
      )}

      {confirmOpen && (
        <ConfirmBackModal
          onCancel={handleConfirmCancel}
          onConfirm={handleConfirmGoBack}
        />
      )}

      <ArtifactsAllModal
        open={showAllArtifacts}
        onClose={() => setShowAllArtifacts(false)}
        userId={user?.id ?? null}
        onOpenArtifact={(a) => {
          setShowAllArtifacts(false);
          handleOpenArtifact(a);
        }}
        loadingArtifactId={loadingArtifactId}
      />

      <ModulesAllModal
        open={showAllModules}
        onClose={() => setShowAllModules(false)}
        userId={user?.id ?? null}
        onOpenModule={(m) => {
          setShowAllModules(false);
          handleOpenPreviousModule(m);
        }}
      />
    </div>
  );
}

function ConfirmBackModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#15161e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: '22px 22px 18px',
          width: '100%',
          maxWidth: 380,
          boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 600,
            color: '#e2e8f0',
          }}
        >
          Leave this generation?
        </h2>
        <p
          style={{
            margin: '10px 0 22px',
            fontSize: 13,
            color: '#8892a4',
            lineHeight: 1.5,
          }}
        >
          The current changes won&apos;t be saved and you&apos;ll go back to the chat. You can start again any time.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '7px 14px',
              fontSize: 13,
              color: '#cbd5e1',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Keep generating
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: '#ef4444',
              border: '1px solid #ef4444',
              borderRadius: 8,
              padding: '7px 14px',
              fontSize: 13,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Yes, go back
          </button>
        </div>
      </div>
    </div>
  );
}
