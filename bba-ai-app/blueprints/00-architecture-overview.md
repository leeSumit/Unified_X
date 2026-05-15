# Blueprint 00 — Architecture Overview

## Old vs New Pipeline

### OLD Pipeline (being removed)

```
User Form
  ↓
POST /api/design-lab
  ↓
Pass 1: Claude Sonnet (via OpenRouter / Anthropic)
  → buildContentPrompt() → 9-type JSON schema
  → Returns: { slides: AnySlide[] } (9 types: title/agenda/content/stats/case-study/quote/takeaways/end/diagram)
  ↓
init SSE event: { total, direction, wb, wrapper: { head, tail } }  ← HTML wrapper shipped to client
  ↓
Pass 2: Per-slide (parallel):
  - content/case-study slides: genImage() → fal-ai/nano-banana-pro (NO TEXT, pure visual)
  - diagram slides: genDiagram() → Claude Haiku → Mermaid SVG
  - other slides: no media
  → renderSlide() → HTML string (CSS + JS embedded)
  → SSE slide event: { index, type, content, html, imageUrl, status }
  ↓
Client: buildFullHtml(slides, wrapper) → <iframe srcDoc={...}> display
         ← iframe with keyboard nav, CSS animations, mermaid.js
Download: HTML file export
```

### NEW Pipeline (this upgrade)

```
User Form
  ↓
POST /api/design-lab
  ↓
Pass 1: Claude Sonnet (via OpenRouter / Anthropic)
  → buildContentPrompt() → 16-type JSON schema + pedagogy instructions
  → Each slide MUST include visualPrompt (actual text + layout + colors)
  → Returns: { slides: AnySlide[] } (16 types, Refer.pdf pedagogy)
  ↓
init SSE event: { total, direction }  ← NO wrapper/wb/html
  ↓
Pass 2: ALL slides in parallel (Promise.all):
  → buildSlideImagePrompt(slide, themeKey, moduleTitle)
      = THEME_STYLE_DESCRIPTORS[theme] + SLIDE_LAYOUT_DESCRIPTORS[type] + moduleTitle + slide.visualPrompt + CRITICAL directive
  → genSlideImage(fullPrompt) → fal-ai/nano-banana-pro (16:9, WITH TEXT)
  → SSE slide event: { index, type, content, imageUrl, status }  ← NO html field
  ↓
Client: <img src={slide.imageUrl}> carousel (currentSlide state, prev/next buttons)
         ← NO iframes, NO HTML assembly, NO mermaid.js
Download: sequential <a download> per PNG image
```

---

## Engine Roles

### Engine 1: Claude Sonnet (`anthropic/claude-sonnet-4-6`)

- **Role**: Content brain and slide outline generator
- **Access**: Primary via OpenRouter (`OPENROUTER_API_KEY`), fallback via Anthropic direct (`ANTHROPIC_API_KEY`)
- **Model string for OpenRouter**: `"anthropic/claude-sonnet-4-6"`
- **Model string for Anthropic direct**: `"claude-sonnet-4-6"`
- **max_tokens**: 8000 (was 6000 — increased to handle 16 types × more fields per slide)
- **Output**: JSON `{ slides: [...] }` where each slide has all typed fields + `visualPrompt`
- **Prompt style**: structured system prompt with all 16 type schemas inline, pedagogy instructions, company examples

### Engine 2: nano-banana-pro (`fal-ai/nano-banana-pro`)

- **Role**: Renders every slide as a complete 16:9 PNG image
- **Access**: fal.ai REST API (`FAL_KEY`)
- **Endpoint**: `https://fal.run/fal-ai/nano-banana-pro`
- **Parameters**: `{ prompt: fullPrompt, image_size: 'landscape_16_9', num_images: 1 }`
- **Timeout**: 90000ms (90 seconds)
- **Critical change from v2**: `image_size` was `landscape_4_3` → now `landscape_16_9`
- **Critical change from v2**: The "NO TEXT" directive is REMOVED. Slides must include visible rendered text.
- **Concurrency**: ALL slide prompts fire simultaneously via Promise.all

---

## Refer.pdf Pedagogical Framework

The Refer.pdf defines a universal slide sequence for any BBA course module using a combination of Design Thinking and Kolb's Experiential Learning.

### 5 Stages → Slide Types Mapping

```
Stage 0: Framing (before experience)
  → title, overview, transition-recap

Stage 1: Empathize / Concrete Experience
  → experience-trigger

Stage 2: Define / Reflective Observation
  → reflection

Stage 3: Ideate / Abstract Conceptualization
  → concept, process-flow, comparison, framework

Stage 4: Prototype / Active Experimentation
  → worked-example, example-case, exercise, prototype-studio

Stage 5: Test / Transfer & Apply
  → test-feedback, summary, checklist
```

### 10-Slide Distribution (breadth-first, all topics covered concisely)

```
['title','overview','experience-trigger','concept','process-flow',
 'worked-example','example-case','exercise','summary','checklist']
```

### 20-Slide Distribution (full pedagogical depth, all topics expanded)

```
['title','overview','experience-trigger','reflection','concept','process-flow',
 'framework','comparison','transition-recap','worked-example','example-case',
 'reflection','exercise','prototype-studio','example-case','test-feedback',
 'summary','checklist','transition-recap','title']
```

---

## Theme System

Six visual themes remain. They are now expressed as **image prompt style descriptors** for nano-banana-pro rather than CSS token maps.

The CSS token system (DIRECTIONS, DirectionConfig, fonts, tokens, bg, etc.) is PRESERVED in `lib/design-lab.server.ts` for backward compatibility with any other consumers, but it is NOT used by the new image pipeline. The new pipeline uses `THEME_STYLE_DESCRIPTORS` exclusively.

| Theme Key | Aesthetic |
|-----------|-----------|
| `modern-minimal` | Swiss editorial, white/off-white, blue-violet #3b6cff |
| `campus-ai` | Warm cream #F5F0E8, academic purple #5B2D8E, orange #E8681A |
| `editorial` | Ivory #fdf8f2, coral-red #c0392b, newspaper feel |
| `tech-dark` | Dark #0d1117, neon blue #58a6ff, green #3fb950 |
| `whiteboard` | Chalk-white, navy #1a3a6b, gold #c9a44a, hand-drawn |
| `kami-serif` | Parchment #f5f4ed, ink-blue #1B365D, antique gold #8B6914 |

---

## Slide Count Depth Model

### 10 slides → "Quick Overview"

- Breadth-first coverage
- Every input topic appears at least once
- Content is concise, high-signal
- Claude instruction: "Cover ALL topics in exactly 10 slides. Be concise. Prioritize breadth."

### 20 slides → "Full Deep Dive"

- Full pedagogical treatment
- All Kolb stages represented
- Multiple worked examples and reflection pauses
- Claude instruction: "Cover ALL topics in exactly 20 slides. Expand fully. Use all pedagogy types."

### Hard Constraint

SlideCount type: `10 | 20` ONLY. The values 6, 15, 30 are REMOVED from the type definition and UI.

---

## Data Flow Diagram (text)

```
[Browser: DesignLab.tsx]
  │ POST { module, direction, slideCount, customPrompt }
  ▼
[app/api/design-lab/route.ts]
  │ maxDuration: 180s
  │ slideSequence = SLIDE_DISTRIBUTIONS[slideCount]
  │
  │──── Pass 1 ────────────────────────────────────────
  │ buildContentPrompt(topics, title, sem, mod, hours,
  │   tools, indianCase, globalCase, outcomes,
  │   slideSequence, customPrompt)
  │   → POST https://openrouter.ai/api/v1/chat/completions
  │     model: anthropic/claude-sonnet-4-6
  │     max_tokens: 8000
  │   → JSON { slides: AnySlide[] }  (16 types, each with visualPrompt)
  │
  │ SSE: data: {"event":"init","total":N,"direction":"..."}
  │
  │──── Pass 2 (all parallel) ─────────────────────────
  │ Promise.all(slides.map((slide, i) => async () => {
  │   const fullPrompt = buildSlideImagePrompt(slide, direction, module.title)
  │   const imageUrl = await genSlideImage(fullPrompt)
  │   SSE: data: {"event":"slide","index":i,"type":"...","content":{...},"imageUrl":"...","status":"done"}
  │ }))
  │
  │ SSE: data: {"event":"done","total":N}
  ▼
[Browser: DesignLab.tsx]
  │ init event → setTotalSlides(N), setSlides(new Array(N).fill(undefined))
  │ slide event → setSlides(prev → [...prev, slide at index i])
  │ done event → setStatus('done')
  │
  │ Preview: <img src={doneSlides[currentSlide]?.imageUrl} />
  │ Nav: ← currentSlide → (prev/next buttons + keyboard)
  │ Fullscreen: fixed overlay <img> carousel
  │ Download: sequential <a download> per PNG
```

---

## What Is NOT Changing

- The `DIRECTIONS` export and `DirectionConfig` interface (kept for any future use)
- `WB`, `BASE_CSS`, `WB_EXTRA_CSS`, `RUNTIME_JS` constants (kept, just unused by new pipeline)
- `esc()` helper function
- The SSE transport mechanism (TransformStream, writer.write, sseEvent helper)
- The OpenRouter → Anthropic fallback pattern in generateSlides()
- The extractJson() function
- Module parsing and ParsedModule type
- All other artifact types (notes, pptx, workbook) — unaffected
