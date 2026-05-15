import { NextRequest } from 'next/server';
import type { ParsedModule } from '@/lib/types';
import type { CustomThemeColors } from '@/lib/types';
import { rateLimit, getIp } from '@/lib/rate-limit';
import {
  SLIDE_DISTRIBUTIONS,
  buildContentPrompt,
  buildSlideImagePrompt,
  genSlideImage,
  recommendSlideCount,
  type AnySlide,
} from '@/lib/design-lab.server';

export const maxDuration = 180;

// ─── Claude Sonnet via OpenRouter (primary) ───────────────────────────────────
async function generateSlides(
  module: ParsedModule,
  slideSequence: string[],
  customPrompt: string,
  resolvedCount: number,
  programName: string,
  universityName: string,
): Promise<AnySlide[]> {
  // ~650 tokens per slide + 2000 buffer; claude-sonnet-4-6 supports up to 64k output
  const maxTokens = Math.min(64000, Math.max(6000, resolvedCount * 650 + 2000));
  // Scale timeout: 60s base + 3s per slide, capped at 3 minutes
  const timeoutMs = Math.min(180000, 60000 + resolvedCount * 3000);

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
    programName,
    universityName,
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
          max_tokens: maxTokens,
        }),
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) {
        const data = await res.json();
        const raw: string = data.choices?.[0]?.message?.content ?? '';
        const parsed = extractJson(raw);
        if (parsed?.slides?.length) return parsed.slides;
      }
    } catch (err) {
      console.error('[OpenRouter] failed, falling back to Anthropic:', err instanceof Error ? err.message : err);
    }
  }

  // Fallback: Claude Sonnet direct via Anthropic API
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: maxTokens,
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
  let module: ParsedModule, direction: string, rawSlideCount: number | 'auto', customPrompt: string, resolvedCount: number, programName: string, universityName: string, customThemeColors: CustomThemeColors | undefined;
  const rl = rateLimit(`design-lab:${getIp(request)}`, 3, 60 * 60 * 1000); // 3/hour
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: `Rate limit reached. You can generate up to 3 decks per hour. Try again in ${Math.ceil(rl.retryAfterSecs / 60)} minute${rl.retryAfterSecs > 120 ? 's' : ''}.` }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfterSecs) } }
    );
  }

  try {
    const body = await request.json();
    module = body.module;
    direction = body.direction || 'modern-minimal';
    rawSlideCount = body.slideCount ?? 'auto';
    customPrompt = body.customPrompt || '';
    programName = body.programName || 'BBA';
    universityName = body.universityName || '';
    customThemeColors = body.customThemeColors;
    if (!module?.title) throw new Error('Missing module');
    resolvedCount = rawSlideCount === 'auto'
      ? recommendSlideCount(module.topics ?? [], module.hours ?? 3)
      : Number(rawSlideCount);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const slideSequence = SLIDE_DISTRIBUTIONS[resolvedCount] ?? SLIDE_DISTRIBUTIONS[10];

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  (async () => {
    try {
      // Pass 1: content generation (Claude Sonnet)
      let slides: AnySlide[];
      try {
        slides = await generateSlides(module, slideSequence, customPrompt, resolvedCount, programName, universityName);
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
        resolvedCount,
      }));

      // Pass 2: generate ALL slide images in parallel
      await Promise.all(
        slides.map((slide, i) =>
          (({ prompt: slidePrompt, systemPrompt }) => genSlideImage(slidePrompt, systemPrompt))(buildSlideImagePrompt(slide, direction, module.title, programName, universityName, customThemeColors))
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
