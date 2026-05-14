export interface ParsedModule {
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

export type ArtifactType = 'notes' | 'pptx' | 'workbook';

export type TemplateId = 'campus-ai' | 'clean' | 'whiteboard';

export type WizardStep = 'input' | 'modules' | 'artifact' | 'generate' | 'design-lab';

export type SlideCount = 6 | 10 | 15 | 20 | 30;

export interface SlideState {
  index: number;
  type: string;
  content: Record<string, unknown>;
  html: string;
  imageUrl: string | null;
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
