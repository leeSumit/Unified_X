# Blueprint 02 — Phase 2: Server Engine

**Worker mission**: Completely rewrite `lib/design-lab.server.ts` to replace the HTML-rendering pipeline with the image-generation pipeline. Delete all render functions, add theme descriptors, layout descriptors, new image prompt builder, new genSlideImage(), new SLIDE_DISTRIBUTIONS, and new buildContentPrompt().

**Dependency**: Phase 1 must be complete before starting Phase 2.

**Verification gate**: `npx tsc --noEmit` must report 0 errors before marking done.

---

## File: `lib/design-lab.server.ts`

**Full path**: `/Users/sumitsatapathy/Unified_X/bba-ai-app/lib/design-lab.server.ts`

---

## Step 1: DELETE these functions entirely

Remove the following exported and internal functions — every line of their definitions including JSDoc if any:

1. `renderTitle(s: TitleSlide, mod: string, wb: boolean): string`
2. `renderAgenda(s: AgendaSlide, mod: string, wb: boolean = false): string`
3. `renderContent(s: ContentSlide, imgUrl: string|null, mod: string, wb: boolean = false, altLayout = false): string`
4. `renderStats(s: StatsSlide, mod: string, wb: boolean = false): string`
5. `renderCaseStudy(s: CaseStudy, imgUrl: string|null, mod: string): string`
6. `renderQuote(s: QuoteSlide, mod: string): string`
7. `renderTakeaways(s: Takeaways, mod: string, wb: boolean = false): string`
8. `renderEnd(s: EndSlide, mod: string, wb: boolean): string`
9. `renderDiagram(s: DiagramSlide, svgContent: string|null, mod: string): string`
10. `renderSlide(slide: AnySlide, media: string|null, modTitle: string, wb: boolean, altContent = false): string`
11. `buildHtml(sections: string, dir: DirectionConfig, wb: boolean, title: string): string`
12. `buildHtmlWrapper(dir: DirectionConfig, wb: boolean, title: string, darkMode = false): { head: string; tail: string }`
13. `logo(mod: string): string` (internal helper, not exported)
14. `chrome(mod: string): string` (internal helper, not exported)
15. `nav(): string` (internal helper, not exported)
16. `genDiagram(description: string, _primaryColor: string): Promise<string|null>`
17. `genImage(slidePrompt: string, styleAnchor: string, moduleCtx: string): Promise<string|null>`

Also delete the Anthropic client at the top:
```typescript
import Anthropic from '@anthropic-ai/sdk';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
```

The `anthropic` SDK is no longer needed in `lib/design-lab.server.ts` since genDiagram (which used it) is removed. Claude Sonnet calls happen only in the route file.

---

## Step 2: DELETE the old SLIDE_DISTRIBUTIONS

Remove this entire block:
```typescript
// ─── Slide count distributions ────────────────────────────────────────────────
export const SLIDE_DISTRIBUTIONS: Record<number, string[]> = {
  6:  ['title','agenda','content','diagram','takeaways','end'],
  10: ['title','agenda','content','content','stats','diagram','case-study','quote','takeaways','end'],
  15: [...],
  20: [...],
  30: [...],
};
```

---

## Step 3: ADD new SLIDE_DISTRIBUTIONS (replace old one)

Insert at the same location (after the slide type interfaces block, before any function definitions):

```typescript
// ─── Slide count distributions (10 and 20 only — Refer.pdf pedagogy) ─────────
export const SLIDE_DISTRIBUTIONS: Record<number, string[]> = {
  10: [
    'title',
    'overview',
    'experience-trigger',
    'concept',
    'process-flow',
    'worked-example',
    'example-case',
    'exercise',
    'summary',
    'checklist',
  ],
  20: [
    'title',
    'overview',
    'experience-trigger',
    'reflection',
    'concept',
    'process-flow',
    'framework',
    'comparison',
    'transition-recap',
    'worked-example',
    'example-case',
    'reflection',
    'exercise',
    'prototype-studio',
    'example-case',
    'test-feedback',
    'summary',
    'checklist',
    'transition-recap',
    'title',
  ],
};
```

---

## Step 4: ADD THEME_STYLE_DESCRIPTORS

Add this export after SLIDE_DISTRIBUTIONS:

```typescript
// ─── Theme → image prompt style descriptors ───────────────────────────────────
export const THEME_STYLE_DESCRIPTORS: Record<string, string> = {
  'modern-minimal': 'Clean Swiss editorial layout, white/off-white background, strong blue-violet accent color #3b6cff, generous negative space, asymmetric composition, museum-quality typography hierarchy. ',
  'campus-ai': 'Warm cream parchment background #F5F0E8, deep academic purple #5B2D8E and energetic orange #E8681A accents, modern Indian university aesthetic, collegial and inviting, clean sans-serif hierarchy. ',
  'editorial': 'Warm ivory paper #fdf8f2 background, bold coral-red #c0392b accent, classical editorial newspaper aesthetic, serif display type feel, ink-and-paper mood, refined and authoritative. ',
  'tech-dark': 'Deep dark background #0d1117, glowing blue #58a6ff and green #3fb950 neon accents, circuit-board organic shapes, data visualization aesthetic, futuristic minimal, high-contrast. ',
  'whiteboard': 'Clean chalk-white background, navy blue #1a3a6b and gold #c9a44a marker colors, hand-drawn infographic aesthetic, flat vector educational illustration, primary color pops, textbook diagram warmth. ',
  'kami-serif': 'Warm parchment #f5f4ed background, deep ink-blue #1B365D and antique gold #8B6914 accents, classical scholarly aesthetic, Garamond serif mood, authoritative academic gravitas, timeless. ',
};
```

---

## Step 5: ADD SLIDE_LAYOUT_DESCRIPTORS (not exported — internal)

Add this immediately after THEME_STYLE_DESCRIPTORS:

```typescript
// ─── Slide layout descriptors (internal — used by buildSlideImagePrompt) ──────
const SLIDE_LAYOUT_DESCRIPTORS: Record<string, string> = {
  'title': 'Full-bleed presentation title slide, 16:9. Left two-thirds: large bold title text area, subtitle below. Right third: abstract decorative shape/illustration. Logo placeholder bottom-left.',
  'overview': 'Agenda/overview slide, 16:9. Left half: numbered goal list (3-4 items) with icon placeholders. Right half: abstract cluster diagram or icon grid showing topics.',
  'experience-trigger': 'Opening scenario slide, 16:9. Top 60%: full-width immersive scene illustration. Bottom panel: scenario title and hook question text areas.',
  'reflection': 'Discussion/reflection slide, 16:9. Center-left: large question mark motif or thought-bubble visual. Right: 2-3 discussion question text blocks with connecting visual lines.',
  'concept': 'Concept definition slide, 16:9. Left 55%: eyebrow label, title, definition paragraph, 3 bullet points. Right 45%: conceptual diagram or icon illustration representing the concept.',
  'process-flow': 'Process flow slide, 16:9. Horizontal arrow flow diagram with 4-5 numbered stages, each with label and one-line summary below. Clean linear progression left to right.',
  'comparison': 'Comparison slide, 16:9. 2-3 equal columns separated by thin divider lines. Each column: header label, 3-4 bullet points. Background alternates lightly.',
  'framework': 'Framework model slide, 16:9. Large central labeled diagram (quadrant, layered ring, or matrix) occupying right 55%. Left 45%: framework name title and 4 bullet annotations.',
  'worked-example': 'Worked example slide, 16:9. Three-panel horizontal layout. Left panel (input/problem): shaded background. Center panel (process/reasoning): arrows and steps. Right panel (output/result): highlighted conclusion.',
  'example-case': 'Case study slide, 16:9. Top: company/case name with tag badge. Left 50%: scenario paragraph and question text. Right 50%: timeline storyboard or contextual scene illustration.',
  'exercise': 'Exercise/activity slide, 16:9. Top: bold task instruction banner. Center: numbered checklist steps with checkbox visuals. Bottom-right: time allocation badge.',
  'prototype-studio': 'Studio/making slide, 16:9. Top strip: brief text. Below: 3-4 equal-width template boxes with dashed borders (workspace placeholders). Process arrow flow between boxes.',
  'test-feedback': 'Rubric/feedback slide, 16:9. Left half: criteria/rubric table with 3-4 rows and rating scale. Right half: good vs poor example cards, color-coded green/red.',
  'summary': 'Key takeaways slide, 16:9. Left-center: large numbered list (3-5 items) with icon accents. Right: abstract summary visual or upward-arrow motif. Clean warm closure feel.',
  'checklist': 'Do vs Avoid slide, 16:9. Two-column layout. Left column (Do/Best Practice): green-accented list. Right column (Avoid/Pitfall): red-accented list. Center divider line.',
  'transition-recap': 'Transition slide, 16:9. Left half (slightly darker bg): Recap heading + 2-3 bullet points. Right half (lighter bg): Preview heading + 2-3 bullet points. Vertical divider with arrow motif.',
};
```

---

## Step 6: ADD buildSlideImagePrompt()

Add this exported function after SLIDE_LAYOUT_DESCRIPTORS:

```typescript
// ─── Slide image prompt builder ───────────────────────────────────────────────
export function buildSlideImagePrompt(slide: AnySlide, themeKey: string, moduleTitle: string): string {
  const style = THEME_STYLE_DESCRIPTORS[themeKey] ?? THEME_STYLE_DESCRIPTORS['modern-minimal'];
  const layout = SLIDE_LAYOUT_DESCRIPTORS[slide.type] ?? '';
  const visual = (slide as { visualPrompt?: string }).visualPrompt ?? '';
  return [
    style,
    layout,
    `Academic BBA course topic: ${moduleTitle}.`,
    visual,
    `CRITICAL: This is a COMPLETE SLIDE IMAGE. Include ALL text, labels, titles, and content visible as rendered slide text. Render as a polished 16:9 presentation slide. Typography must be legible at presentation scale. No lorem ipsum. Use the actual content described.`,
  ].join(' ');
}
```

---

## Step 7: ADD genSlideImage() (replaces old genImage())

Add this exported function after buildSlideImagePrompt():

```typescript
// ─── Slide image generation (nano-banana-pro — complete slide rendering) ──────
export async function genSlideImage(fullPrompt: string): Promise<string | null> {
  if (!process.env.FAL_KEY) return null;
  try {
    const res = await fetch('https://fal.run/fal-ai/nano-banana-pro', {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: fullPrompt,
        image_size: 'landscape_16_9',
        num_images: 1,
      }),
      signal: AbortSignal.timeout(90000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.images?.[0]?.url as string) ?? null;
  } catch {
    return null;
  }
}
```

**Key differences from old genImage()**:
- Signature: `(fullPrompt: string)` — only one argument (prompt is pre-composed)
- `image_size`: `'landscape_16_9'` (was `'landscape_4_3'`)
- Timeout: `90000ms` (was `60000ms`)
- NO "NO TEXT" directive appended — slides must have visible text
- The `fullPrompt` is built entirely by `buildSlideImagePrompt()` before calling this

---

## Step 8: REWRITE buildContentPrompt()

Replace the entire old buildContentPrompt() function with the new one below. The new function embeds full pedagogy instructions, all 16 type schemas, and visualPrompt guidance.

**Locate and delete**:
```typescript
// ─── Content prompt (for Qwen3 32B via OpenRouter) ────────────────────────────
export function buildContentPrompt(...): string { ... }
```

**Replace with**:

```typescript
// ─── Content prompt (Claude Sonnet — 16-type pedagogy with visualPrompt) ──────
export function buildContentPrompt(
  topics: string[],
  title: string,
  semester: number,
  moduleNum: number,
  hours: number,
  tools: string[],
  indianCase: string | undefined,
  globalCase: string | undefined,
  outcomes: string[] | undefined,
  slideSequence: string[],
  customPrompt: string,
): string {
  const info = [
    `Title: ${title}`,
    `Semester ${semester}, Module ${moduleNum} | ${hours} hours`,
    `Topics: ${topics.join(', ')}`,
    tools.length ? `Tools: ${tools.join(', ')}` : '',
    indianCase ? `India Case Study context: ${indianCase}` : '',
    globalCase ? `Global Case Study context: ${globalCase}` : '',
    outcomes?.length ? `Learning Outcomes: ${outcomes.join('; ')}` : '',
  ].filter(Boolean).join('\n');

  const depthInstruction = slideSequence.length === 10
    ? `DEPTH: 10-slide deck = BREADTH-FIRST coverage. Cover ALL topics concisely. Every input topic must appear at least once. Prioritize breadth over depth. Be concise in each slide.`
    : `DEPTH: 20-slide deck = DEEP-DIVE treatment. Cover ALL topics with full pedagogical depth. Use multiple examples, reflections, and exercises. Expand every concept fully.`;

  const typeSchemas = `SLIDE TYPE SCHEMAS — generate EXACTLY these JSON shapes:

title:
{"type":"title","title":"max 8 words — module name","subtitle":"max 12 words — module hook","badge":"Sem ${semester} · Mod ${moduleNum}","visualPrompt":"FULL SLIDE DESCRIPTION: title text top-left in large bold font, subtitle below in medium weight, right side abstract decorative geometric shape in theme color, bottom-left BBA Online logo area, background color appropriate to theme. Include actual title and subtitle text."}

overview:
{"type":"overview","eyebrow":"COURSE OVERVIEW","title":"max 6 words","goals":["goal 1 max 8 words","goal 2","goal 3","goal 4"],"agendaItems":["topic 1","topic 2","topic 3","topic 4","topic 5"],"visualPrompt":"FULL SLIDE DESCRIPTION: left half numbered goal list with 4 items rendered as text, right half topic cluster diagram with topic names visible as node labels, theme color accents. Include actual goal text and topic names."}

experience-trigger:
{"type":"experience-trigger","eyebrow":"REAL-WORLD SCENARIO","scenarioTitle":"max 6 words","scenario":"2-3 sentences describing a real business scenario involving the topic","question":"One provocative discussion question?","visualPrompt":"FULL SLIDE DESCRIPTION: top 60% immersive illustration of the scenario setting (office, market, factory, etc), bottom panel has scenario title text and question text visible, dark overlay on illustration for text legibility. Include actual scenario title and question text."}

reflection:
{"type":"reflection","eyebrow":"REFLECT","title":"max 6 words","discussionQuestions":["question 1?","question 2?","question 3?"],"insight":"1-2 sentence key insight","visualPrompt":"FULL SLIDE DESCRIPTION: large thought-bubble or question-mark visual motif on left 40%, right 60% shows 3 discussion questions as styled text cards with question marks, insight text at bottom, theme color background. Include actual question text."}

concept:
{"type":"concept","eyebrow":"KEY CONCEPT","title":"concept name max 5 words","definition":"clear 1-2 sentence definition of the concept","bullets":["application or example 1","application or example 2","application or example 3"],"visualPrompt":"FULL SLIDE DESCRIPTION: left 55% has eyebrow label, large concept title, definition paragraph, 3 bullet points all as visible text; right 45% has conceptual diagram, icon cluster, or metaphor illustration. Include actual definition and bullet text."}

process-flow:
{"type":"process-flow","eyebrow":"THE PROCESS","title":"max 6 words","steps":[{"label":"Step 1 Name","summary":"one-line description"},{"label":"Step 2 Name","summary":"one-line description"},{"label":"Step 3 Name","summary":"one-line description"},{"label":"Step 4 Name","summary":"one-line description"}],"visualPrompt":"FULL SLIDE DESCRIPTION: horizontal left-to-right arrow flow diagram with 4 numbered stage boxes, each box shows step label text and summary text below, connecting arrows between boxes, theme accent color. Include actual step names and summaries."}

comparison:
{"type":"comparison","eyebrow":"COMPARE","title":"max 6 words","columns":[{"heading":"Option A Name","points":["point 1","point 2","point 3"]},{"heading":"Option B Name","points":["point 1","point 2","point 3"]}],"visualPrompt":"FULL SLIDE DESCRIPTION: 2 equal-width columns with thin divider, each column shows heading text in accent color, 3 bullet points as readable text, light alternating column backgrounds, comparison title at top. Include actual column headings and points."}

framework:
{"type":"framework","eyebrow":"FRAMEWORK","title":"framework name max 6 words","modelName":"full model name e.g. SWOT Analysis","segments":[{"label":"Segment 1","description":"1-sentence description"},{"label":"Segment 2","description":"1-sentence description"},{"label":"Segment 3","description":"1-sentence description"},{"label":"Segment 4","description":"1-sentence description"}],"visualPrompt":"FULL SLIDE DESCRIPTION: right 55% shows large 2x2 quadrant matrix or 4-segment ring diagram with each segment labeled with visible text; left 45% shows framework name title, 4 annotation bullets with segment names. Include actual segment labels and descriptions."}

worked-example:
{"type":"worked-example","eyebrow":"WORKED EXAMPLE","title":"max 6 words","problem":"1-2 sentences describing the problem or input","process":["reasoning step 1 max 10 words","reasoning step 2 max 10 words","reasoning step 3 max 10 words"],"result":"the outcome or solution in 1-2 sentences","visualPrompt":"FULL SLIDE DESCRIPTION: 3-panel horizontal layout — left panel (shaded) shows Problem text, center panel shows numbered process steps with arrows, right panel (highlighted in theme accent) shows Result text. All text visible and readable. Include actual problem and result text."}

example-case:
{"type":"example-case","tag":"India","company":"real Indian company e.g. Zomato, Infosys, Tata Motors","scenario":"2-3 sentence real scenario description","question":"one discussion question?","outcome":"metric or business result achieved","visualPrompt":"FULL SLIDE DESCRIPTION: top-left company name in bold, India/Global badge pill, left 50% shows scenario text and question text, right 50% shows contextual illustration (office scene, product, market), outcome text in accent-colored badge at bottom. Include actual company name and scenario text."}

exercise:
{"type":"exercise","eyebrow":"ACTIVITY","title":"exercise title max 6 words","taskInstructions":"1-2 sentences describing the task","steps":["step 1 instruction","step 2 instruction","step 3 instruction","step 4 instruction"],"timeAllotted":"e.g. 15 minutes","visualPrompt":"FULL SLIDE DESCRIPTION: bold activity title at top, task instruction text below, numbered checklist with 4 steps each with checkbox visual, time badge in bottom-right corner (e.g. '15 MIN'), theme accent colors. Include actual step instructions and time."}

prototype-studio:
{"type":"prototype-studio","eyebrow":"STUDIO","brief":"1-2 sentence creative brief for what to make","makingSteps":["making step 1","making step 2","making step 3","making step 4"],"templateBoxes":["Box 1 label","Box 2 label","Box 3 label","Box 4 label"],"visualPrompt":"FULL SLIDE DESCRIPTION: brief text at top, below 4 equal dashed-border workspace template boxes labeled with box names, process arrows connecting boxes left to right, template boxes have dotted/dashed outlines suggesting blank workspace. Include actual brief text and box labels."}

test-feedback:
{"type":"test-feedback","eyebrow":"EVALUATE","title":"max 6 words","criteria":[{"label":"Criterion 1","description":"what to assess"},{"label":"Criterion 2","description":"what to assess"},{"label":"Criterion 3","description":"what to assess"},{"label":"Criterion 4","description":"what to assess"}],"feedbackExamples":{"good":"example of strong response","poor":"example of weak response"},"visualPrompt":"FULL SLIDE DESCRIPTION: left half shows rubric table with 4 rows (criterion labels visible), right half shows two cards — green-tinted Good Example card and red-tinted Poor Example card, both showing example text. Include actual criterion names and example text."}

summary:
{"type":"summary","eyebrow":"KEY TAKEAWAYS","title":"max 6 words","takeaways":["takeaway 1 max 10 words","takeaway 2","takeaway 3","takeaway 4","takeaway 5"],"visualPrompt":"FULL SLIDE DESCRIPTION: left-center large numbered list with 5 takeaways rendered as readable text with accent-color numbers, right side abstract upward-arrow or ascending graph motif, warm closure visual mood. Include actual takeaway text."}

checklist:
{"type":"checklist","eyebrow":"DO'S AND DON'TS","title":"max 6 words","doItems":["do item 1 max 8 words","do item 2","do item 3","do item 4"],"avoidItems":["avoid item 1 max 8 words","avoid item 2","avoid item 3","avoid item 4"],"visualPrompt":"FULL SLIDE DESCRIPTION: two-column layout with vertical center divider — left column (green accent) shows DO list with checkmarks, right column (red accent) shows AVOID list with X marks, all items visible as text. Include actual do and avoid items."}

transition-recap:
{"type":"transition-recap","eyebrow":"RECAP & PREVIEW","recapTitle":"What We Covered","recapPoints":["recap point 1","recap point 2","recap point 3"],"previewTitle":"Coming Up Next","previewPoints":["preview point 1","preview point 2","preview point 3"],"visualPrompt":"FULL SLIDE DESCRIPTION: left half (slightly darker background) shows Recap heading text and 3 recap bullet points, right half (lighter background) shows Preview heading text and 3 preview bullet points, vertical divider line with right-pointing arrow motif in center. Include actual recap and preview text."}`;

  return `You are generating BBA university course presentation slides following the Design Thinking + Kolb Experiential Learning pedagogy framework. Return ONLY valid JSON. No markdown, no explanation, no <think> tags.

MODULE INFORMATION:
${info}

SLIDE SEQUENCE — generate EXACTLY ${slideSequence.length} slides in this exact order:
${slideSequence.map((t, i) => `${i + 1}. ${t}`).join('\n')}

${depthInstruction}
${customPrompt ? `\nEXTRA INSTRUCTIONS: ${customPrompt}` : ''}

${typeSchemas}

CRITICAL RULES:
1. Use REAL data: real companies (Infosys, Zomato, Tata Motors, HDFC Bank, Flipkart for India; Apple, McKinsey, Amazon, Google, Unilever for Global), real statistics, real business scenarios.
2. Cover ALL input topics across the slides. Do not skip any topic from the module topics list.
3. visualPrompt MUST describe the COMPLETE RENDERED SLIDE including:
   - Actual title text visible in the image
   - Actual body content (definitions, bullets, steps, etc.) as rendered text
   - Layout description (which elements are where)
   - Visual metaphor or diagram type
   - Color mood and theme
   BAD: "abstract diagram of marketing concepts"
   GOOD: "Slide titled 'What is Digital Marketing?' at top. Left 55%: definition text 'Digital marketing uses online channels to reach target audiences', three bullets: Search & Social Media, Email & Content Marketing, Analytics & ROI. Right 45%: circular interconnected nodes diagram representing digital touchpoints, blue-violet gradient, clean white background."
4. All text content must fit the slide — concise and scannable.
5. Indian example-case slides: use Indian companies. Global example-case slides: use global companies.
6. The visualPrompt for every slide must include the actual text that should appear on that slide.

RETURN THIS EXACT JSON FORMAT:
{"slides":[...all ${slideSequence.length} slides in the exact sequence above...]}`;
}
```

---

## Final State of `lib/design-lab.server.ts` After Phase 2

The file structure after all changes:

```
[1] import (no Anthropic import — removed)

[2] // ─── Direction config ─────────────────────────────────────────────────────────
    export interface DirectionConfig { ... }
    export const DIRECTIONS: Record<string, DirectionConfig> = { ... }  ← KEPT

[3] // ─── Whiteboard SVG doodles ───────────────────────────────────────────────────
    export const WB = { ... }  ← KEPT

[4] // ─── CSS constants ────────────────────────────────────────────────────────────
    export const BASE_CSS = `...`  ← KEPT
    export const WB_EXTRA_CSS = `...`  ← KEPT
    export const RUNTIME_JS = `...`  ← KEPT

[5] // ─── Slide type interfaces (16 types — Refer.pdf pedagogy) ───────────────────
    export interface TitleSlide { ... }
    export interface OverviewSlide { ... }
    ... (all 16 interfaces from Phase 1)
    export type AnySlide = ... (union of all 16)

[6] // ─── Slide count distributions (10 and 20 only) ──────────────────────────────
    export const SLIDE_DISTRIBUTIONS: Record<number, string[]> = { 10:[...], 20:[...] }

[7] // ─── Theme → image prompt style descriptors ───────────────────────────────────
    export const THEME_STYLE_DESCRIPTORS: Record<string, string> = { ... }

[8] // ─── Slide layout descriptors (internal) ────────────────────────────────────
    const SLIDE_LAYOUT_DESCRIPTORS: Record<string, string> = { ... }

[9] // ─── Helpers ──────────────────────────────────────────────────────────────────
    export function esc(s: string): string { ... }  ← KEPT (used elsewhere)

[10] // ─── Slide image prompt builder ───────────────────────────────────────────────
     export function buildSlideImagePrompt(slide: AnySlide, themeKey: string, moduleTitle: string): string

[11] // ─── Slide image generation (nano-banana-pro) ─────────────────────────────────
     export async function genSlideImage(fullPrompt: string): Promise<string | null>

[12] // ─── Content prompt (Claude Sonnet) ──────────────────────────────────────────
     export function buildContentPrompt(...): string
```

**DELETED sections** (no longer present):
- All render* functions
- buildHtml()
- buildHtmlWrapper()
- logo(), chrome(), nav() helpers
- genImage()
- genDiagram()
- Old SLIDE_DISTRIBUTIONS

---

## Verification

```bash
cd /Users/sumitsatapathy/Unified_X/bba-ai-app
npx tsc --noEmit
```

Expected: 0 errors.

Common errors to fix:
- If route.ts still imports `genImage`, `genDiagram`, `renderSlide`, `buildHtmlWrapper` — those will be fixed in Phase 3, not Phase 2.
- If DesignLab.tsx still references `html` field on SlideState — will be fixed in Phase 4.
- After Phase 2, there WILL be TypeScript errors in route.ts and DesignLab.tsx about missing exports. This is expected. The goal is that `lib/design-lab.server.ts` itself compiles cleanly, and the new exports (`buildSlideImagePrompt`, `genSlideImage`, `THEME_STYLE_DESCRIPTORS`) are type-correct.

---

## Git Commit for Phase 2

```
feat: replace HTML rendering engine with image-generation pipeline (nano-banana-pro, 16 slide types, Refer.pdf pedagogy)
```
