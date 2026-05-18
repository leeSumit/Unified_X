export interface ParsedModule {
  id?: string;            // DB row id once persisted; undefined for in-memory only
  semester: number;
  module: number;
  title: string;
  hours: number;
  topics: string[];
  tools: string[];
  indianCaseStudy?: string;
  globalCaseStudy?: string;
  learningOutcomes?: string[];
}

export interface CustomThemeColors {
  bg: string;
  primary: string;
  accent: string;
}

export type ArtifactType = 'notes' | 'pptx' | 'workbook';

export type TemplateId = 'campus-ai' | 'clean' | 'whiteboard';

export type WizardStep = 'input' | 'modules' | 'artifact' | 'generate' | 'design-lab';

export type ChatStep =
  | 'landing'
  | 'parsing'
  | 'selecting-module'
  | 'selecting-artifact'
  | 'generating-notes'
  | 'generating-done'
  | 'design-lab';

export type ChatMessageRole = 'user' | 'assistant';

export type ChatMessageType =
  | 'text'
  | 'file-attachment'
  | 'typing'
  | 'module-list'
  | 'artifact-options'
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
  streamContent?: string;
  wordCount?: number;
}

export type SlideCount = 1 | 5 | 6 | 10 | 15 | 20 | 30 | 'auto';

export interface SlideState {
  index: number;
  type: string;
  content: Record<string, unknown>;
  imageUrl: string | null;
  storagePath?: string | null;
  status: 'pending' | 'done' | 'regenerating' | 'error';
}

export interface ArtifactMeta {
  id: ArtifactType;
  label: string;
  description: string;
  output: string;
  chip: string;
  chipColor: string;
}

export const ARTIFACT_TYPES: ArtifactMeta[] = [
  {
    id: 'notes',
    label: 'Student Notes',
    description: 'Full teacher-voice study companion with theory, India-first examples, case studies, and career anchors.',
    output: '14,000–18,000 words · 10–12 chapters',
    chip: 'NOTES',
    chipColor: 'bg-brand-purple',
  },
  {
    id: 'pptx',
    label: 'PPTX Outline',
    description: 'Structured 50-slide outline ready to paste into Kimi Moonshot to generate the visual presentation.',
    output: '50 slides · 7 session decks',
    chip: 'PPTX',
    chipColor: 'bg-brand-orange',
  },
  {
    id: 'workbook',
    label: 'Student Workbook',
    description: 'Interactive classroom workbook with Boot Camps, Projects, Case Studies, Capstone, and Reflection.',
    output: '~35 pages · 5 sessions',
    chip: 'WORKBOOK',
    chipColor: 'bg-teal-600',
  },
];
