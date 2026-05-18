import type { ParsedModule, ArtifactType } from '@/lib/types';

export type ChatStep =
  | 'landing'
  | 'parsing'
  | 'selecting-module'
  | 'selecting-artifact'
  | 'generating-notes'
  | 'generating-done'
  | 'generate-view'
  | 'design-lab';

export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessageType =
  | 'text'
  | 'file-attachment'
  | 'typing'
  | 'module-list'
  | 'artifact-options'
  | 'duplicate-artifact'
  | 'generating'
  | 'stream'
  | 'stream-done';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  type: ChatMessageType;
  content?: string;
  fileName?: string;
  modules?: ParsedModule[];
  artifactType?: ArtifactType;
  existingArtifactId?: string;
  streamContent?: string;
  wordCount?: number;
}

export type { ParsedModule, ArtifactType };
