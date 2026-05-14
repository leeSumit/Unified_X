import { NextRequest } from 'next/server';
import type { ParsedModule } from '@/lib/types';
import {
  DIRECTIONS,
  SLIDE_DISTRIBUTIONS,
  buildHtmlWrapper,
  buildContentPrompt,
  genImage,
  genDiagram,
  renderSlide,
  type AnySlide,
} from '@/lib/design-lab.server';

export const maxDuration = 120;

// ─── Qwen3 32B via OpenRouter (free tier) ─────────────────────────────────────
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

  // Try Qwen3 32B via OpenRouter first (free)
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
          model: 'qwen/qwen3-32b:free',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 6000,
        }),
        signal: AbortSignal.timeout(60000),
      });
      if (res.ok) {
        const data = await res.json();
        const raw: string = data.choices?.[0]?.message?.content ?? '';
        const parsed = extractJson(raw);
        if (parsed?.slides?.length) return parsed.slides;
      }
    } catch { /* fall through to Anthropic */ }
  }

  // Fallback: Claude Sonnet (uses ANTHROPIC_API_KEY)
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
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

  const dir = DIRECTIONS[direction] || DIRECTIONS['modern-minimal'];
  const wb = direction === 'whiteboard';
  const slideSequence = SLIDE_DISTRIBUTIONS[slideCount] || SLIDE_DISTRIBUTIONS[10];
  const modCtx = `Academic subject: ${module.title}. Key topics: ${module.topics.slice(0, 3).join(', ')}.`;
  const wrapper = buildHtmlWrapper(dir, wb, module.title);

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // Run generation async; stream as each slide completes
  (async () => {
    try {
      // Pass 1: content generation (Qwen3 or Claude fallback)
      let slides: AnySlide[];
      try {
        slides = await generateSlides(module, slideSequence, customPrompt);
      } catch (err) {
        await writer.write(sseEvent({ error: `Content generation failed: ${err instanceof Error ? err.message : String(err)}` }));
        await writer.close();
        return;
      }

      // Send init event with wrapper HTML so client can assemble full deck
      await writer.write(sseEvent({
        event: 'init',
        total: slides.length,
        direction,
        wb,
        wrapper,
      }));

      // Pass 2: render slides. No-media slides stream immediately; image/diagram slides
      // all kick off in parallel and stream as they resolve.
      const tasks = slides.map((slide, i) => async () => {
        let media: string | null = null;

        if ((slide.type === 'content' || slide.type === 'case-study') && 'imagePrompt' in slide) {
          media = await genImage(
            (slide as { imagePrompt: string }).imagePrompt,
            dir.imageStyleAnchor,
            modCtx,
          );
        } else if (slide.type === 'diagram') {
          media = await genDiagram(
            (slide as { description: string }).description,
            dir.primaryColor,
          );
        }

        const html = renderSlide(slide, media, module.title, wb);
        await writer.write(sseEvent({
          event: 'slide',
          index: i,
          type: slide.type,
          content: slide as unknown as Record<string, unknown>,
          html,
          imageUrl: (slide.type === 'content' || slide.type === 'case-study') ? media : null,
          status: 'done' as const,
        }));
      });

      // Slides without media can run in parallel with image/diagram slides
      await Promise.all(tasks.map(t => t()));

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
