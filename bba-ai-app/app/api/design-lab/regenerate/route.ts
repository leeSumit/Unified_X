import { NextRequest, NextResponse } from 'next/server';
import type { ParsedModule } from '@/lib/types';
import type { CustomThemeColors } from '@/lib/types';

import {
  buildSlideImagePrompt,
  genSlideImage,
  type AnySlide,
} from '@/lib/design-lab.server';

export const maxDuration = 90;

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch (err) {
    console.error('[regenerate] invalid JSON body', err);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const slideContent = body.slideContent as AnySlide | undefined;
  const direction = (body.direction as string) || 'modern-minimal';
  const module = body.module as ParsedModule | undefined;
  const programName = (body.programName as string) || 'BBA';
  const universityName = (body.universityName as string) || '';
  const customThemeColors = body.customThemeColors as CustomThemeColors | undefined;

  if (!slideContent?.type) {
    return NextResponse.json({ error: 'Missing slideContent.type' }, { status: 400 });
  }
  if (!module?.title) {
    return NextResponse.json({ error: 'Missing module.title' }, { status: 400 });
  }

  try {
    const { prompt: slidePrompt, systemPrompt } = buildSlideImagePrompt(
      slideContent, direction, module.title, programName, universityName, customThemeColors
    );
    const imageUrl = await genSlideImage(slidePrompt, systemPrompt);
    return NextResponse.json({
      imageUrl,
      content: slideContent as unknown as Record<string, unknown>,
    });
  } catch (err) {
    console.error('[regenerate] generation failed', err);
    return NextResponse.json(
      { error: 'Image generation failed', detail: (err as Error)?.message ?? String(err) },
      { status: 500 }
    );
  }
}
