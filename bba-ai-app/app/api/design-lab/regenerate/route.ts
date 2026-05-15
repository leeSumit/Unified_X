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

  const { prompt: slidePrompt, systemPrompt } = buildSlideImagePrompt(slideContent, direction, module.title);
  const imageUrl = await genSlideImage(slidePrompt, systemPrompt);

  return NextResponse.json({
    imageUrl,
    content: slideContent as unknown as Record<string, unknown>,
  });
}
