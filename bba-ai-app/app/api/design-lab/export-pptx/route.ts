import { NextRequest, NextResponse } from 'next/server';
import PptxGenJS from 'pptxgenjs';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  let imageUrls: (string | null)[], title: string;
  try {
    const body = await request.json();
    imageUrls = body.imageUrls ?? [];
    title = body.title ?? 'Slides';
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = title;

  for (const url of imageUrls) {
    if (!url) continue;
    const slide = pptx.addSlide();
    try {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      const b64 = Buffer.from(buf).toString('base64');
      slide.addImage({ data: `image/png;base64,${b64}`, x: 0, y: 0, w: '100%', h: '100%' });
    } catch {
      // skip failed images — leave slide blank
    }
  }

  const buffer = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer;
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return new NextResponse(buffer.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': `attachment; filename="${slug}-slides.pptx"`,
    },
  });
}
