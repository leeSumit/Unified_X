import type { ChatMessage, ChatMessageType } from './chat-types';
import type { ArtifactType, ParsedModule } from './types';

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function appendMessage(
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  msg: ChatMessage,
): void {
  setMessages((prev) => [...prev, msg]);
}

interface UserMessageOpts {
  content?: string;
  fileName?: string;
}

interface AiMessageOpts {
  content?: string;
  modules?: ParsedModule[];
  artifactType?: ArtifactType;
  existingArtifactId?: string;
  streamContent?: string;
  wordCount?: number;
}

export function makeUserMessage(type: ChatMessageType, opts: UserMessageOpts = {}): ChatMessage {
  return {
    id: generateId(),
    role: 'user',
    type,
    content: opts.content,
    fileName: opts.fileName,
  };
}

export function makeAiMessage(type: ChatMessageType, opts: AiMessageOpts = {}): ChatMessage {
  return {
    id: generateId(),
    role: 'assistant',
    type,
    content: opts.content,
    modules: opts.modules,
    artifactType: opts.artifactType,
    existingArtifactId: opts.existingArtifactId,
    streamContent: opts.streamContent,
    wordCount: opts.wordCount,
  };
}

export function updateLastMessage(
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  updater: (msg: ChatMessage) => ChatMessage
): void {
  setMessages((prev) => {
    if (prev.length === 0) return prev;
    return [...prev.slice(0, -1), updater(prev[prev.length - 1])];
  });
}
