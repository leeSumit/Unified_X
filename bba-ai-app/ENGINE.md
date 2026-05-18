# Content Generation Engine — How It Works

This document explains the complete internal flow of all three content artifacts the engine produces: **Notes**, **Workbook**, and **PPTX (Design Lab)**. It is written as a technical reference for understanding the engine itself — how data moves, what each layer does, and why.

---

## 0. The Common Entry Point — Syllabus Parsing

Before any artifact can be generated, the engine needs a **structured module object**. That comes from parsing the syllabus.

**Route:** `POST /api/parse`

**What happens:**

1. The user uploads a syllabus file (PDF, DOCX, TXT) or pastes raw text.
2. The server extracts the raw text:
   - **PDF** → `pdf-parse` (or Mistral OCR for scanned/image PDFs)
   - **DOCX** → `mammoth`
   - **TXT** → read directly
3. The first 10,000 characters of extracted text are sent to **Claude Haiku** with a structured extraction prompt.
4. Claude returns a JSON array of `ParsedModule` objects — one per module found in the syllabus.

**`ParsedModule` shape:**
```ts
{
  semester: number
  module: number
  title: string
  hours: number
  topics: string[]        // 8–12 topics
  tools: string[]         // AI tools, software
  indianCaseStudy: string
  globalCaseStudy: string
  learningOutcomes: string[]
}
```

The user then selects one module from the list. That module object is the input for every artifact below.

---

## 1. Notes Generation

**Route:** `POST /api/generate` with `{ module, artifactType: 'notes' }`

### 1a. Prompt Construction (`lib/generation-prompts.ts`)

`buildPrompt('notes', module)` does three things:

1. Calls `formatTopicBlock(module)` to build a structured text block:
   ```
   Semester: 3
   Module: 2
   Title: Digital Marketing
   Contact Hours: 10
   Session Structure: 5 sessions × 2 hours
   Chapter Topics:
     1. SEO & SEM
     2. Social Media Marketing
     ...
   AI Tools Featured: ChatGPT, Jasper
   Indian Case Study: Zomato's hyperlocal campaigns
   Global Case Study: Nike's digital-first pivot
   Learning Outcomes:
     - LO1 (Remember): Recall core digital marketing channels
     ...
   ```

2. Reads the raw prompt template from `prompts/generate-notes.md` off disk.
3. Strips the file header (everything before the first `---`), then injects the topic block into the `{TOPIC_BLOCK}` placeholder.

### 1b. LLM Call — Claude Sonnet 4.6

The assembled prompt is sent to **Claude Sonnet 4.6** with `max_tokens: 8000` and `stream: true`.

**Routing:** OpenRouter is tried first (more reliable on Vercel edge). If it fails or no key is configured, the request falls back to Anthropic's API directly.

**What the notes prompt instructs Claude to produce:**

- **10–12 chapters**, each 1,200–2,200 words
- **Total target:** 14,000–18,000 words
- **Voice:** Teacher-voice — as if speaking directly to a first-year student
- **Double-explanation rule:** Every concept must be explained twice — once as an everyday analogy, once as a business example
- **India-first companies:** Freshworks, Zoho, Razorpay, PhonePe, Swiggy preferred over US examples
- **Specific numbers only:** Never "many" or "some" — always real figures with attribution
- **Chapter structure per chapter:**
  - Headline → Opening narrative
  - Conceptual explanation
  - Deeper mechanics
  - Business application
  - Purple callout box (key insight)
  - Weak vs. strong comparison table
  - Chapter close
- **Required sections at document end:** Career anchors (job titles, salary bands), glossary, references, further reading

### 1c. Streaming to the Frontend

The route parses the upstream SSE stream from either OpenRouter (OpenAI format) or Anthropic (native format) and re-emits only the raw text deltas as a plain `text/plain` stream. The frontend reads `response.body` and appends chunks in real time to the display container.

### 1d. Output Delivery

- Real-time text stream displayed in a scrollable container
- Word count tracked live
- Actions: **Copy**, **Download PDF** (html2pdf.js, client-side — no server), **Edit** (textarea), **Stop**

---

## 2. Workbook Generation

**Route:** `POST /api/generate` with `{ module, artifactType: 'workbook' }`

The pipeline is identical to Notes in structure — same `buildPrompt()` function, same LLM call, same streaming route. Only the template is different.

### 2a. Prompt Construction

`buildPrompt('workbook', module)` reads `prompts/generate-workbook.md` and injects two placeholders:
- `{TOPIC_BLOCK}` — same formatted module block as Notes
- `{PASTE_NOTES_HERE}` — if notes were generated already, they'd go here. Currently, this is always replaced with: `(Notes not yet generated — derive everything directly from the topic block and your knowledge of the Campus AI style.)`

### 2b. What the Workbook Prompt Instructs

- **5 sessions × ~7 pages ≈ 35 pages total**
- Each session contains:
  - **Boot Camp** — foundational exercises
  - **Projects** — applied group/individual tasks
  - **Case Studies** — analysis activities
  - **Capstone** — session synthesis task
  - **Reflection** — student self-assessment
- **Layout markup** is embedded throughout for a designer to render:
  - `[PAGE BREAK]` — page boundary
  - `[CHIP: Boot Camp 1]` — section label chip
  - `[RESPONSE BOX]` — blank student response area
  - `[TABLE: ...]` — structured table
  - `[LEFT COLUMN]` / `[CARD: ...]` — layout containers

### 2c. Open Design Integration

Optionally, the generated workbook content can be sent to a local **Open Design daemon** via `POST /api/open-in-design`. This creates a structured design project with the workbook template pre-loaded. Falls back to printed instructions if the daemon is not running.

### 2d. Output Delivery

Same as Notes — streaming display, copy, PDF download (client-side), edit mode.

---

## 3. PPTX — The Design Lab Pipeline

This is a fundamentally different pipeline from Notes/Workbook. It is a **two-pass system** (Claude → Fal AI) with **Server-Sent Events (SSE)** streaming, not a plain text stream.

**Route:** `POST /api/design-lab`

### 3a. User Configuration

Before the request is sent, the user configures the deck in the Design Lab UI:

| Setting | Options | Notes |
|---|---|---|
| Slide count | 5 / 10 / 15 / 20 / 30 / auto | `auto` = `topics.length + hours × 1.5` |
| Theme | Modern Minimal / Campus AI / Editorial / Tech Dark / Whiteboard / Kami Serif | Controls colors and image style |
| Custom prompt | Free text | Injected as `EXTRA INSTRUCTIONS` into Claude's prompt |
| Program name | e.g. `BBA`, `MBA` | Appears in branding on slides |
| University name | Optional | Added to branding and prompt context |

### 3b. Slide Sequence Resolution

Each slide count maps to a pre-defined ordered array of slide types (`SLIDE_DISTRIBUTIONS`). For example, a 10-slide deck might be:

```
['title', 'overview', 'experience-trigger', 'concept', 'process-flow',
 'worked-example', 'example-case', 'exercise', 'summary', 'checklist']
```

This sequence is handed directly to Claude — it is not AI-generated; it is hardcoded pedagogy.

### 3c. Pass 1 — Content Generation (Claude Sonnet 4.6)

`buildContentPrompt()` assembles Claude's prompt from:

1. **Module info block** — same fields as Notes (title, semester, hours, topics, tools, case studies, outcomes)
2. **Slide sequence** — the exact ordered list of slide types to generate
3. **Depth instruction** — scales with slide count:
   - 5 slides → "LIGHTNING overview, one core concept per slide"
   - 10 slides → "BREADTH-FIRST, every input topic appears at least once"
   - 20 slides → "DEEP DIVE, full pedagogical treatment with examples and exercises"
   - 30 slides → "COMPREHENSIVE, complete self-study resource"
4. **16 slide type schemas** — exact JSON shapes Claude must output for each type, with `visualPrompt` instructions embedded directly in the examples
5. **Critical rules** appended to the prompt:
   - Use real companies, real years, real numbers — never invented statistics
   - Cover ALL input topics, none can be skipped
   - Every `visualPrompt` must describe the complete rendered slide including actual text content
   - Every concept slide must include a consequence (what goes wrong if a student doesn't understand this)
   - Summary and checklist slides must include job titles, CV keywords, and interview talking points
   - The final slide must always deliver synthesis and closure — never end on a process step

**`max_tokens`** scales with slide count: `min(64000, max(6000, slideCount × 650 + 2000))`

**Timeout** also scales: `min(180s, 60s + slideCount × 3s)`

**Output format:** Claude returns a single JSON blob:
```json
{
  "slides": [
    {
      "type": "title",
      "title": "Digital Marketing Fundamentals",
      "subtitle": "How brands reach the right customer, at the right moment",
      "badge": "Sem 3 · Mod 2",
      "visualPrompt": "FULL SLIDE DESCRIPTION: title text 'Digital Marketing Fundamentals' top-left in large bold Inter font, subtitle below in medium weight, right side abstract geometric nodes diagram in blue-violet, bottom-left BBA · NMIMS branding, white background."
    },
    {
      "type": "concept",
      "eyebrow": "KEY CONCEPT",
      "title": "The Marketing Funnel",
      "definition": "A model describing the customer journey from first awareness to final purchase, used to allocate budget and measure drop-off at each stage.",
      "bullets": [
        "Zomato uses funnel analytics to optimize notification timing by city",
        "McKinsey found 60% of B2B deals are lost at the consideration stage",
        "Funnel inversion: bottom-up community-led growth (Notion, Figma)"
      ],
      "visualPrompt": "FULL SLIDE DESCRIPTION: left 55%: eyebrow 'KEY CONCEPT' in small caps, large heading 'The Marketing Funnel', definition paragraph text, 3 bullet points as text. Right 45%: inverted triangle funnel diagram with 4 labeled stages: Awareness, Interest, Consideration, Purchase, blue-violet accent colors on white background."
    }
    // ... more slides
  ]
}
```

### 3d. The `visualPrompt` — The Bridge Between Claude and Fal AI

This is the critical link. Claude does not just pick a slide type and generate text — it writes a **complete art direction brief** for every slide in the `visualPrompt` field.

The rules Claude follows for `visualPrompt`:
- Must describe the **complete rendered slide** — not just a background illustration
- Must include the **actual text content** that should appear visible in the image (titles, definitions, bullet points, step labels, etc.)
- Must describe the **layout** (which elements are positioned where, approximate proportions)
- Must specify the **diagram or visual type** (funnel, 2×2 matrix, horizontal flow, two-column, etc.)

**Bad:** `"abstract diagram of marketing concepts"`
**Good:** `"Slide titled 'The Marketing Funnel' at top. Left 55%: definition text and 3 bullets as visible text. Right 45%: inverted triangle funnel with 4 labeled stages in blue-violet. White background."`

### 3e. Pass 2 — Image Generation (Fal AI, Parallel)

Once Claude's JSON is parsed, **all slides are dispatched simultaneously** via `Promise.all()`.

**`buildSlideImagePrompt(slide, themeKey, moduleTitle, programName, universityName)`** assembles the Fal AI request for each slide by combining three layers:

```
prompt =
  "Create a presentation slide for a BBA course on 'Digital Marketing'."     ← course context
  + SLIDE_LAYOUT_DESCRIPTORS[slide.type]                                      ← pedagogical intent
  + slide.visualPrompt                                                         ← Claude's art direction

systemPrompt = THEME_STYLE_DESCRIPTORS[themeKey]                              ← theme + PALETTE LOCK
```

**`SLIDE_LAYOUT_DESCRIPTORS`** — hardcoded pedagogical intent per slide type. Example for `concept`:
> "This is a concept definition slide. Show the concept name as a clear heading, provide a precise 1-2 sentence definition, list 3 real-world applications or examples as bullets, and include a supporting visual metaphor that makes the concept intuitive."

**`THEME_STYLE_DESCRIPTORS`** — the system prompt sent to Fal AI. Example for `campus-ai`:
> "You are a professional slide designer for modern Indian university courses. Style: warm cream (#F5F0E8) background, deep purple (#5B2D8E) and vibrant saffron-orange (#E8681A) as accent colors... PALETTE LOCK: Use ONLY #F5F0E8 background, #5B2D8E primary accent, #E8681A secondary accent — never deviate from this palette regardless of any colour suggestion in the prompt text."

The `PALETTE LOCK` instruction is intentional — it ensures the `visualPrompt` content from Claude cannot accidentally override the theme's colors.

**Fal AI call parameters:**
```json
{
  "prompt": "<assembled prompt>",
  "system_prompt": "<theme descriptor>",
  "aspect_ratio": "16:9",
  "resolution": "2K",
  "num_images": 1
}
```

**Model:** `fal-ai/nano-banana-pro`
**Timeout per slide:** 90 seconds
**Failure handling:** Individual slide failures are non-fatal — a failed slide emits `imageUrl: null` and the deck continues.

### 3f. SSE Streaming to the Frontend

The route streams events as slides complete (in any order, since they're parallel):

```
data: {"event":"init","total":10,"direction":"campus-ai","resolvedCount":10}

data: {"event":"slide","index":0,"type":"title","content":{...},"imageUrl":"https://...","status":"done"}
data: {"event":"slide","index":3,"type":"concept","content":{...},"imageUrl":"https://...","status":"done"}
data: {"event":"slide","index":1,"type":"overview","content":{...},"imageUrl":"https://...","status":"done"}
...

data: {"event":"done","total":10}
```

Slides arrive in whichever order Fal AI finishes them. The frontend uses the `index` field to place them in the correct position in the deck.

### 3g. The 16 Slide Types

| Type | Purpose | Key Content Fields |
|---|---|---|
| `title` | Opening slide | title, subtitle, badge |
| `overview` | Agenda / goals | goals[], agendaItems[] |
| `experience-trigger` | Hook scenario | scenarioTitle, scenario, question |
| `reflection` | Discussion questions | discussionQuestions[], insight |
| `concept` | Core concept definition | definition, bullets[] |
| `process-flow` | Sequential steps | steps[]{label, summary} |
| `comparison` | Side-by-side options | columns[]{heading, points[]} |
| `framework` | Model / diagram | modelName, segments[]{label, description} |
| `worked-example` | Problem → solution walkthrough | problem, process[], result |
| `example-case` | Real company case study | company, scenario, question, outcome |
| `exercise` | Classroom activity | taskInstructions, steps[], timeAllotted |
| `prototype-studio` | Creative making session | brief, makingSteps[], templateBoxes[] |
| `test-feedback` | Rubric / evaluation | criteria[], feedbackExamples{good, poor} |
| `summary` | Key takeaways | takeaways[] |
| `checklist` | Do's and Don'ts | doItems[], avoidItems[] |
| `transition-recap` | Section bridge | recapPoints[], previewPoints[] |

### 3h. The 6 Themes

Each theme controls two separate things: the **CSS design tokens** for the in-browser slide preview, and the **system prompt** sent to Fal AI for image generation.

| Theme | Background | Primary | Secondary | Mood |
|---|---|---|---|---|
| Modern Minimal | `#ffffff` | `#3b6cff` | `#7a5cff` | Swiss editorial, consulting |
| Campus AI | `#F5F0E8` | `#5B2D8E` | `#E8681A` | Modern Indian university |
| Editorial | `#fdf8f2` | `#c0392b` | `#8b2f22` | Classical publishing |
| Tech Dark | `#0d1117` | `#58a6ff` | `#3fb950` | Futuristic, data-driven |
| Whiteboard | `#fdfcf9` | `#1a3a6b` | `#c9a44a` | Educational, illustrated |
| Kami Serif | `#f5f4ed` | `#1B365D` | `#8B6914` | Scholarly, timeless |

A custom theme option also exists — the user picks three colors (background, primary, accent) and a custom system prompt is generated from them.

### 3i. PPTX Export

**Route:** `POST /api/design-lab/export-pptx`

The frontend collects all slide image URLs and sends them to the export route. The route:

1. Fetches each image and base64-encodes it
2. Uses **PptxGenJS** to create a `.pptx` file
3. Embeds each image as a full-bleed 16:9 slide background
4. Returns the binary `.pptx` file as a download

---

## 4. LLM Routing — OpenRouter vs Anthropic Direct

All LLM calls (except the image generation) follow the same fallback pattern:

```
1. Try OpenRouter (anthropic/claude-sonnet-4-6)
   → More reliable on Vercel edge (avoids cold-start timeouts)
   → Uses OPENROUTER_API_KEY

2. If OpenRouter fails or key is missing → fall back to Anthropic API directly
   → Uses ANTHROPIC_API_KEY
```

**Models used:**
- Syllabus parsing: `claude-haiku-4-5` (fast, cheap, structured extraction)
- Notes, Workbook, PPTX content: `claude-sonnet-4-6` (quality long-form generation)
- Image generation: `fal-ai/nano-banana-pro` (not Claude — Fal AI's image model)

---

## 5. Rate Limits

| Route | Limit |
|---|---|
| `/api/parse` | 10 requests / hour |
| `/api/generate` (notes/workbook) | 5 requests / hour |
| `/api/design-lab` | 3 requests / hour |

Limits are keyed by IP address.

---

## 6. Architecture Summary

```
User uploads syllabus
        │
        ▼
/api/parse  →  Claude Haiku  →  ParsedModule[]
        │
        ▼
User selects module + artifact type
        │
        ├─── notes / workbook ───────────────────────────────────────────────┐
        │                                                                    │
        │    /api/generate                                                   │
        │    buildPrompt(type, module)                                       │
        │      → readPrompt('generate-notes.md' | 'generate-workbook.md')   │
        │      → inject {TOPIC_BLOCK}                                        │
        │    Claude Sonnet 4.6  (stream: true, max_tokens: 8000)            │
        │    Re-stream text deltas → frontend renders live                  │
        │    Output: plain text / markdown                                   │
        │    Download: html2pdf.js (client-side PDF)                         │
        │                                                                    ◄─┘
        │
        └─── pptx ───────────────────────────────────────────────────────────┐
                                                                             │
             /api/design-lab                                                 │
             Resolve slide count → SLIDE_DISTRIBUTIONS[n]                   │
                                                                             │
             PASS 1: buildContentPrompt(module, slideSequence, ...)         │
               → Claude Sonnet 4.6 (max_tokens: slideCount×650+2000)        │
               → Returns JSON: { slides: [{ type, content, visualPrompt }] }│
                                                                             │
             PASS 2: Promise.all(slides.map(slide =>                        │
               buildSlideImagePrompt(slide, theme)                          │
                 → { prompt, systemPrompt }                                  │
               genSlideImage(prompt, systemPrompt)                          │
                 → fal-ai/nano-banana-pro → imageUrl                        │
             ))                                                              │
                                                                             │
             SSE stream: init → slide events (any order) → done             │
             Frontend places slides by index                                 │
                                                                             │
             Export: /api/design-lab/export-pptx                            │
               → PptxGenJS + base64 images → .pptx download                 │
                                                                             ◄─┘
```

---

## 7. Key Files

| File | Role |
|---|---|
| `app/api/parse/route.ts` | Syllabus extraction and module parsing |
| `app/api/generate/route.ts` | Notes and workbook generation (streaming) |
| `app/api/design-lab/route.ts` | PPTX two-pass pipeline (Claude + Fal AI, SSE) |
| `app/api/design-lab/export-pptx/route.ts` | PptxGenJS export to .pptx file |
| `app/api/open-in-design/route.ts` | Open Design daemon integration |
| `lib/generation-prompts.ts` | `buildPrompt()` — reads templates, injects module data |
| `lib/design-lab.server.ts` | Slide distributions, theme configs, `buildContentPrompt()`, `buildSlideImagePrompt()`, `genSlideImage()` |
| `lib/types.ts` | `ParsedModule`, `ArtifactType`, `AnySlide`, `CustomThemeColors` |
| `lib/rate-limit.ts` | In-memory IP-based rate limiter |
| `prompts/generate-notes.md` | Notes prompt template (14k–18k word teacher-voice chapters) |
| `prompts/generate-workbook.md` | Workbook prompt template (5-session activity workbook) |
| `prompts/generate-pptx-outline.md` | Legacy 50-slide outline prompt (Kimi Moonshot path) |
| `components/DesignLab.tsx` | Design Lab UI — slide gallery, theme picker, export button |
| `components/GenerateStep.tsx` | Notes/workbook generation UI — streaming display, download |
