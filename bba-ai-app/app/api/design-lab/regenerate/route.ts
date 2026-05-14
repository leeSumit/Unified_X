import { NextRequest, NextResponse } from 'next/server';
import type { ParsedModule } from '@/lib/types';
import {
  DIRECTIONS,
  genImage,
  genDiagram,
  renderSlide,
  type AnySlide,
} from '@/lib/design-lab.server';

export const maxDuration = 60;

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

  const dir = DIRECTIONS[direction] || DIRECTIONS['modern-minimal'];
  const wb = direction === 'whiteboard';
  const modCtx = `Academic subject: ${module.title}. Key topics: ${module.topics.slice(0, 3).join(', ')}.`;

  let media: string | null = null;

  if ((slideContent.type === 'content' || slideContent.type === 'case-study') && 'imagePrompt' in slideContent) {
    media = await genImage(
      (slideContent as { imagePrompt: string }).imagePrompt,
      dir.imageStyleAnchor,
      modCtx,
    );
  } else if (slideContent.type === 'diagram' && 'description' in slideContent) {
    media = await genDiagram(
      (slideContent as { description: string }).description,
      dir.primaryColor,
    );
  }

  const html = renderSlide(slideContent, media, module.title, wb);
  const imageUrl = (slideContent.type === 'content' || slideContent.type === 'case-study') ? media : null;

  return NextResponse.json({ html, imageUrl, content: slideContent as unknown as Record<string, unknown> });
}
