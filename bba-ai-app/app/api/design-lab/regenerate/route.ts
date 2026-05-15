import { NextRequest, NextResponse } from 'next/server';
import type { ParsedModule } from '@/lib/types';
import type { CustomThemeColors } from '@/lib/types';
import { rateLimit, getIp } from '@/lib/rate-limit';
import {
  buildSlideImagePrompt,
  genSlideImage,
  type AnySlide,
} from '@/lib/design-lab.server';

export const maxDuration = 90;

export async function POST(request: NextRequest) {
  const rl = rateLimit(`regen:${getIp(request)}`, 10, 60 * 60 * 1000); // 10/hour
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: `Rate limit reached. Try again in ${Math.ceil(rl.retryAfterSecs / 60)} minute${rl.retryAfterSecs > 120 ? 's' : ''}.` }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(rl.retryAfterSecs) } }
    );
  }

  let slideContent: AnySlide, direction: string, module: ParsedModule;
  try {
    const body = await request.json();
    slideContent = body.slideContent;
    direction = body.direction || 'modern-minimal';
    module = body.module;
    const programName: string = body.programName || 'BBA';
    const universityName: string = body.universityName || '';
    const customThemeColors: CustomThemeColors | undefined = body.customThemeColors;
    if (!slideContent?.type || !module?.title) throw new Error('Missing fields');
    const { prompt: slidePrompt, systemPrompt } = buildSlideImagePrompt(slideContent, direction, module.title, programName, universityName, customThemeColors);
    const imageUrl = await genSlideImage(slidePrompt, systemPrompt);
    return NextResponse.json({
      imageUrl,
      content: slideContent as unknown as Record<string, unknown>,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
