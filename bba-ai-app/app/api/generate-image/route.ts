import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json({ imageUrl: null, reason: 'OPENROUTER_API_KEY not configured' });
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
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://unaited.vercel.app',
        'X-Title': 'UNAITED',
      },
      body: JSON.stringify({
        model: 'google/gemini-3.1-flash-image-preview',
        messages: [
          { role: 'user', content: `${prompt}\n\nGenerate as a 16:9 widescreen presentation slide image.` },
        ],
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const msg = await res.text();
      return NextResponse.json({ imageUrl: null, reason: `OpenRouter error: ${msg}` });
    }

    const data = await res.json();
    const imageUrl: string | null = (data.choices?.[0]?.message?.images?.[0]?.image_url?.url as string) ?? null;
    return NextResponse.json({ imageUrl });
  } catch (err) {
    return NextResponse.json({
      imageUrl: null,
      reason: err instanceof Error ? err.message : 'Image generation failed',
    });
  }
}
