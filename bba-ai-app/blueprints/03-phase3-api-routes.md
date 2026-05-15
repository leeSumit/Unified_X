# Blueprint 03 — Phase 3: API Routes

**Worker mission**: Update both API route files to use the new image-generation pipeline. Remove all HTML-rendering imports and logic, wire up `buildSlideImagePrompt` + `genSlideImage`, update SSE event shapes, increase maxDuration and max_tokens.

**Dependency**: Phase 2 must be complete (genSlideImage and buildSlideImagePrompt must exist in lib/design-lab.server.ts).

**Verification gate**: `npx tsc --noEmit` must report 0 errors. Additionally, test with curl to confirm SSE slides arrive as image URLs.

---

## File 1: `app/api/design-lab/route.ts`

**Full path**: `/Users/sumitsatapathy/Unified_X/bba-ai-app/app/api/design-lab/route.ts`

### Complete replacement

Replace the entire file content with the following:

```typescript
import { NextRequest } from 'next/server';
import type { ParsedModule } from '@/lib/types';
import {
  SLIDE_DISTRIBUTIONS,
  buildContentPrompt,
  buildSlideImagePrompt,
  genSlideImage,
  type AnySlide,
} from '@/lib/design-lab.server';

export const maxDuration = 180;

// ─── Claude Sonnet via OpenRouter (primary) ───────────────────────────────────
async function generateSlides(
  module: ParsedModule,
  slideSequence: string[],
  customPrompt: string,
): Promise<AnySlide[]> {
  const prompt = buildContentPrompt(
    module.topics,
    module.title,
    module.semester,
    module.module,
    module.hours,
    module.tools,
    module.indianCaseStudy,
    module.globalCaseStudy,
    module.learningOutcomes,
    slideSequence,
    customPrompt,
  );

  // Primary: Claude Sonnet via OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://bba-ai.vercel.app',
          'X-Title': 'BBA AI Design Lab',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-sonnet-4-6',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 8000,
        }),
        signal: AbortSignal.timeout(90000),
      });
      if (res.ok) {
        const data = await res.json();
        const raw: string = data.choices?.[0]?.message?.content ?? '';
        const parsed = extractJson(raw);
        if (parsed?.slides?.length) return parsed.slides;
      }
    } catch { /* fall through to Anthropic direct */ }
  }

  // Fallback: Claude Sonnet direct via Anthropic API
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  });
  const raw = msg.content
    .filter(b => b.type === 'text')
    .map(b => (b as { type: 'text'; text: string }).text)
    .join('');
  const parsed = extractJson(raw);
  if (!parsed?.slides?.length) throw new Error('Empty slides from Claude fallback');
  return parsed.slides;
}

function extractJson(raw: string): { slides: AnySlide[] } | null {
  try {
    const clean = raw
      .replace(/^```(?:json)?\s*\n?/, '')
      .replace(/\n?```$/, '')
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .trim();
    return JSON.parse(clean);
  } catch {
    const match = raw.match(/\{[\s\S]*"slides"\s*:\s*\[[\s\S]*\]\s*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}

// ─── SSE helpers ──────────────────────────────────────────────────────────────
function sseEvent(data: unknown): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  let module: ParsedModule, direction: string, slideCount: number, customPrompt: string;
  try {
    const body = await request.json();
    module = body.module;
    direction = body.direction || 'modern-minimal';
    slideCount = body.slideCount || 10;
    customPrompt = body.customPrompt || '';
    if (!module?.title) throw new Error('Missing module');
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const slideSequence = SLIDE_DISTRIBUTIONS[slideCount] ?? SLIDE_DISTRIBUTIONS[10];

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  (async () => {
    try {
      // Pass 1: content generation (Claude Sonnet)
      let slides: AnySlide[];
      try {
        slides = await generateSlides(module, slideSequence, customPrompt);
      } catch (err) {
        await writer.write(sseEvent({
          error: `Content generation failed: ${err instanceof Error ? err.message : String(err)}`,
        }));
        await writer.close();
        return;
      }

      // Send init event — no wrapper/wb/html in new pipeline
      await writer.write(sseEvent({
        event: 'init',
        total: slides.length,
        direction,
      }));

      // Pass 2: generate ALL slide images in parallel
      await Promise.all(
        slides.map((slide, i) =>
          genSlideImage(buildSlideImagePrompt(slide, direction, module.title))
            .then(async imageUrl => {
              await writer.write(sseEvent({
                event: 'slide',
                index: i,
                type: slide.type,
                content: slide as unknown as Record<string, unknown>,
                imageUrl,
                status: 'done' as const,
              }));
            })
            .catch(async err => {
              // Individual slide failure is non-fatal — emit null imageUrl
              await writer.write(sseEvent({
                event: 'slide',
                index: i,
                type: slide.type,
                content: slide as unknown as Record<string, unknown>,
                imageUrl: null,
                status: 'done' as const,
              }));
              void err;
            }),
        ),
      );

      await writer.write(sseEvent({ event: 'done', total: slides.length }));
    } catch (err) {
      await writer.write(sseEvent({ error: String(err) }));
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
```

### Key changes from old route.ts

| Old | New |
|-----|-----|
| `import { buildHtmlWrapper, genImage, genDiagram, renderSlide, DIRECTIONS }` | `import { buildSlideImagePrompt, genSlideImage }` — DIRECTIONS removed from import |
| `maxDuration = 120` | `maxDuration = 180` |
| `max_tokens: 6000` | `max_tokens: 8000` |
| `signal: AbortSignal.timeout(60000)` | `signal: AbortSignal.timeout(90000)` |
| init event has `wrapper`, `wb` fields | init event has only `total`, `direction` |
| Pass 2 has conditional logic (if content → genImage, if diagram → genDiagram, then renderSlide) | Pass 2 is pure parallel: all slides → genSlideImage |
| slide event has `html` field | slide event has NO `html` field |
| slide event has `imageUrl` only for content/case-study | slide event has `imageUrl` for EVERY slide |
| Per-slide failure stops all | Per-slide failure emits null imageUrl and continues |

---

## File 2: `app/api/design-lab/regenerate/route.ts`

**Full path**: `/Users/sumitsatapathy/Unified_X/bba-ai-app/app/api/design-lab/regenerate/route.ts`

### Complete replacement

Replace the entire file content with the following:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import type { ParsedModule } from '@/lib/types';
import {
  buildSlideImagePrompt,
  genSlideImage,
  type AnySlide,
} from '@/lib/design-lab.server';

export const maxDuration = 90;

export async function POST(request: NextRequest) {
  let slideContent: AnySlide, direction: string, module: ParsedModule;
  try {
    const body = await request.json();
    slideContent = body.slideContent;
    direction = body.direction || 'modern-minimal';
    module = body.module;
    if (!slideContent?.type || !module?.title) throw new Error('Missing fields');
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const imageUrl = await genSlideImage(
    buildSlideImagePrompt(slideContent, direction, module.title),
  );

  return NextResponse.json({
    imageUrl,
    content: slideContent as unknown as Record<string, unknown>,
  });
}
```

### Key changes from old regenerate/route.ts

| Old | New |
|-----|-----|
| `import { DIRECTIONS, genImage, genDiagram, renderSlide }` | `import { buildSlideImagePrompt, genSlideImage }` |
| Conditional: if content/case-study → genImage, if diagram → genDiagram | Single: always genSlideImage |
| `renderSlide()` called to produce html | No HTML produced |
| Returns `{ html, imageUrl, content }` | Returns `{ imageUrl, content }` — NO html |
| `maxDuration = 60` | `maxDuration = 90` |

---

## SSE Event Shape Reference (for Phase 4 consumer)

### init event
```json
{
  "event": "init",
  "total": 10,
  "direction": "modern-minimal"
}
```
**Removed fields**: `wrapper`, `wb`, `darkMode`

### slide event
```json
{
  "event": "slide",
  "index": 3,
  "type": "concept",
  "content": {
    "type": "concept",
    "eyebrow": "KEY CONCEPT",
    "title": "What is Digital Marketing?",
    "definition": "Digital marketing is the use of online channels...",
    "bullets": ["Search & Social Media", "Email & Content Marketing", "Analytics & ROI"],
    "visualPrompt": "Slide titled 'What is Digital Marketing?' at top..."
  },
  "imageUrl": "https://fal.media/files/xxxx/slide.png",
  "status": "done"
}
```
**Removed fields**: `html`
**New**: `imageUrl` present for EVERY slide type (may be null if generation failed)

### done event
```json
{
  "event": "done",
  "total": 10
}
```
(unchanged)

---

## Curl Test (manual verification)

After deploying locally (`npm run dev`), test with:

```bash
curl -X POST http://localhost:3000/api/design-lab \
  -H "Content-Type: application/json" \
  -d '{
    "module": {
      "semester": 1,
      "module": 1,
      "title": "Introduction to Marketing",
      "hours": 3,
      "topics": ["Marketing Mix", "Customer Segmentation", "Brand Building"],
      "tools": [],
      "indianCaseStudy": "Amul cooperative marketing model",
      "globalCaseStudy": "Apple brand strategy"
    },
    "direction": "modern-minimal",
    "slideCount": 10,
    "customPrompt": ""
  }' \
  --no-buffer 2>&1 | head -200
```

Expected SSE stream:
1. `data: {"event":"init","total":10,"direction":"modern-minimal"}`
2. 10x `data: {"event":"slide","index":N,"type":"...","content":{...},"imageUrl":"https://...","status":"done"}`
3. `data: {"event":"done","total":10}`

Verify:
- NO `wrapper` field in init event
- NO `html` field in slide events
- `imageUrl` is a fal.media URL (or null if FAL_KEY not set)
- All 10 slides arrive (may be out of order due to parallel generation)

---

## Git Commit for Phase 3

```
feat: wire API routes to image pipeline — remove HTML rendering, add parallel genSlideImage, update SSE shapes
```
