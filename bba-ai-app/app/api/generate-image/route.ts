import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (!process.env.FAL_KEY) {
    return NextResponse.json({ imageUrl: null, reason: 'FAL_KEY not configured' });
  }

  let prompt: string;
  try {
    const body = await request.json();
    prompt = body.prompt ?? '';
    if (!prompt) throw new Error('Missing prompt');
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const res = await fetch('https://fal.run/fal-ai/ideogram/v2', {
      method: 'POST',
      headers: {
        Authorization: `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: '16:9',
        style: 'design',
        magic_prompt_option: 'OFF',
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json({ imageUrl: null, reason: `fal.ai error: ${msg}` });
    }

    const data = await res.json();
    const imageUrl: string | null = data.images?.[0]?.url ?? null;
    return NextResponse.json({ imageUrl });
  } catch (err) {
    return NextResponse.json({
      imageUrl: null,
      reason: err instanceof Error ? err.message : 'Image generation failed',
    });
  }
}
