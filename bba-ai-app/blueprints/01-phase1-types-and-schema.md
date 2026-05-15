# Blueprint 01 — Phase 1: Types & Schema

**Worker mission**: Update `lib/types.ts` and add the 16 new slide type interfaces to `lib/design-lab.server.ts`. This is the foundation phase — all subsequent phases depend on these types compiling.

**Verification gate**: `npx tsc --noEmit` must report 0 errors before marking done.

---

## File 1: `lib/types.ts`

**Full path**: `/Users/sumitsatapathy/Unified_X/bba-ai-app/lib/types.ts`

### Change 1: SlideCount type

**Current (line 19)**:
```typescript
export type SlideCount = 6 | 10 | 15 | 20 | 30;
```

**Replace with**:
```typescript
export type SlideCount = 10 | 20;
```

### Change 2: SlideState interface — remove `html` field

**Current (lines 21–28)**:
```typescript
export interface SlideState {
  index: number;
  type: string;
  content: Record<string, unknown>;
  html: string;
  imageUrl: string | null;
  status: 'pending' | 'done' | 'regenerating' | 'error';
}
```

**Replace with**:
```typescript
export interface SlideState {
  index: number;
  type: string;
  content: Record<string, unknown>;
  imageUrl: string | null;
  status: 'pending' | 'done' | 'regenerating' | 'error';
}
```

### No other changes to `lib/types.ts`

The rest of the file (ParsedModule, ArtifactType, TemplateId, WizardStep, ArtifactMeta, ARTIFACT_TYPES) is untouched.

---

## File 2: `lib/design-lab.server.ts` — Slide Type Interfaces

**Full path**: `/Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`

### What to find and replace

**Current block (lines 229–239)**:
```typescript
// ─── Slide type interfaces ────────────────────────────────────────────────────
export interface TitleSlide   { type:'title'; title:string; subtitle:string; badge:string }
export interface AgendaSlide  { type:'agenda'; eyebrow:string; title:string; items:{n:string;label:string;desc:string}[] }
export interface ContentSlide { type:'content'; eyebrow:string; title:string; points:string[]; imagePrompt:string }
export interface StatsSlide   { type:'stats'; eyebrow:string; title:string; stats:{value:string;label:string}[] }
export interface CaseStudy    { type:'case-study'; tag:string; company:string; headline:string; story:string; result:string; imagePrompt:string }
export interface QuoteSlide   { type:'quote'; text:string; author:string; role:string }
export interface Takeaways    { type:'takeaways'; title:string; items:string[] }
export interface EndSlide     { type:'end'; title:string; next:string }
export interface DiagramSlide { type:'diagram'; eyebrow:string; title:string; description:string; svgContent?:string }
export type AnySlide = TitleSlide|AgendaSlide|ContentSlide|StatsSlide|CaseStudy|QuoteSlide|Takeaways|EndSlide|DiagramSlide;
```

**Replace with the entire block below** (16 interfaces + new AnySlide union):

```typescript
// ─── Slide type interfaces (16 types — Refer.pdf pedagogy) ───────────────────
export interface TitleSlide {
  type: 'title';
  title: string;
  subtitle: string;
  badge: string;
  visualPrompt: string;
}

export interface OverviewSlide {
  type: 'overview';
  eyebrow: string;
  title: string;
  goals: string[];           // 3–4 items
  agendaItems: string[];     // 3–5 items
  visualPrompt: string;
}

export interface ExperienceTriggerSlide {
  type: 'experience-trigger';
  eyebrow: string;
  scenarioTitle: string;
  scenario: string;          // 2–3 sentences
  question: string;
  visualPrompt: string;
}

export interface ReflectionSlide {
  type: 'reflection';
  eyebrow: string;
  title: string;
  discussionQuestions: string[];  // 2–3 items
  insight: string;
  visualPrompt: string;
}

export interface ConceptSlide {
  type: 'concept';
  eyebrow: string;
  title: string;
  definition: string;        // 1–2 sentences
  bullets: string[];         // exactly 3 items
  visualPrompt: string;
}

export interface ProcessFlowSlide {
  type: 'process-flow';
  eyebrow: string;
  title: string;
  steps: { label: string; summary: string }[];  // 3–6 items
  visualPrompt: string;
}

export interface ComparisonSlide {
  type: 'comparison';
  eyebrow: string;
  title: string;
  columns: { heading: string; points: string[] }[];  // 2–3 columns
  visualPrompt: string;
}

export interface FrameworkSlide {
  type: 'framework';
  eyebrow: string;
  title: string;
  modelName: string;
  segments: { label: string; description: string }[];  // exactly 4 items
  visualPrompt: string;
}

export interface WorkedExampleSlide {
  type: 'worked-example';
  eyebrow: string;
  title: string;
  problem: string;
  process: string[];         // 2–3 items
  result: string;
  visualPrompt: string;
}

export interface ExampleCaseSlide {
  type: 'example-case';
  tag: 'India' | 'Global';
  company: string;
  scenario: string;
  question: string;
  outcome: string;
  visualPrompt: string;
}

export interface ExerciseSlide {
  type: 'exercise';
  eyebrow: string;
  title: string;
  taskInstructions: string;
  steps: string[];           // 3–4 items
  timeAllotted: string;
  visualPrompt: string;
}

export interface PrototypeStudioSlide {
  type: 'prototype-studio';
  eyebrow: string;
  brief: string;
  makingSteps: string[];     // 3–4 items
  templateBoxes: string[];   // 3–4 labels for workspace boxes
  visualPrompt: string;
}

export interface TestFeedbackSlide {
  type: 'test-feedback';
  eyebrow: string;
  title: string;
  criteria: { label: string; description: string }[];  // 3–4 items
  feedbackExamples: { good: string; poor: string };
  visualPrompt: string;
}

export interface SummarySlide {
  type: 'summary';
  eyebrow: string;
  title: string;
  takeaways: string[];       // 3–5 items
  visualPrompt: string;
}

export interface ChecklistSlide {
  type: 'checklist';
  eyebrow: string;
  title: string;
  doItems: string[];         // 3–4 items
  avoidItems: string[];      // 3–4 items
  visualPrompt: string;
}

export interface TransitionRecapSlide {
  type: 'transition-recap';
  eyebrow: string;
  recapTitle: string;
  recapPoints: string[];     // 2–3 items
  previewTitle: string;
  previewPoints: string[];   // 2–3 items
  visualPrompt: string;
}

export type AnySlide =
  | TitleSlide
  | OverviewSlide
  | ExperienceTriggerSlide
  | ReflectionSlide
  | ConceptSlide
  | ProcessFlowSlide
  | ComparisonSlide
  | FrameworkSlide
  | WorkedExampleSlide
  | ExampleCaseSlide
  | ExerciseSlide
  | PrototypeStudioSlide
  | TestFeedbackSlide
  | SummarySlide
  | ChecklistSlide
  | TransitionRecapSlide;
```

---

## What NOT to change in Phase 1

- Everything above the slide interfaces in `lib/design-lab.server.ts` (DIRECTIONS, WB, BASE_CSS, WB_EXTRA_CSS, RUNTIME_JS, DirectionConfig, esc(), logo(), chrome(), nav())
- All render* functions (renderTitle, renderAgenda, etc.) — Phase 2 deletes these
- buildHtml(), buildHtmlWrapper() — Phase 2 deletes these
- SLIDE_DISTRIBUTIONS — Phase 2 replaces this
- genImage(), genDiagram(), buildContentPrompt() — Phase 2 replaces these
- The `esc()` helper function — keep it (still used by old render functions until Phase 2 deletes them)

The only goal of Phase 1 is: new type definitions compile. The old functions referencing old types will typecheck because AnySlide now includes new types — TypeScript is permissive with union expansion.

---

## Verification

After making changes:

```bash
cd /Users/sumitsatapathy/Unified_X/bba-ai-app
npx tsc --noEmit
```

Expected output: 0 errors.

If you see errors about `html` property not existing on `SlideState`, that means Phase 1 types are correct but some consumer still references `html`. Note these errors — they will be fixed in Phase 3 (route) and Phase 4 (UI). Do NOT fix them in Phase 1. Phase 1's job is only to update `lib/types.ts` and `lib/design-lab.server.ts` slide interfaces.

If you see errors about the old AnySlide types (e.g., `AgendaSlide`, `DiagramSlide`) not found, those are expected — Phase 2 will clean them up. The important thing is the new types compile.

---

## Git Commit for Phase 1

```
feat: expand slide types to 16 Refer.pdf pedagogy types, narrow SlideCount to 10|20
```
