import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60;

interface SlidePayload {
  index: number;
  type: string;
  imageUrl: string | null;
}

interface AssetEntry {
  index: number;
  type: string;
  path: string;
  ts: number;
}

// POST /api/artifacts/[id]/save-images
// Body: { slides: [{ index, type, imageUrl }], theme?: string }
// Fetches each image once, uploads to the 'artifacts' bucket, then writes
// the manifest to artifacts.assets and flips status to 'completed'.
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: artifactId } = await context.params;
  if (!artifactId) {
    return NextResponse.json({ error: 'Missing artifact id' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  let body: { slides?: SlidePayload[]; theme?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const slides = Array.isArray(body.slides) ? body.slides : [];
  if (slides.length === 0) {
    return NextResponse.json({ error: 'No slides provided' }, { status: 400 });
  }

  // Confirm the artifact belongs to this user before we burn bandwidth.
  const { data: artifactRow, error: lookupErr } = await supabase
    .from('artifacts')
    .select('id, user_id, artifact_type')
    .eq('id', artifactId)
    .eq('user_id', user.id)
    .single();

  if (lookupErr || !artifactRow) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });
  }
  if (artifactRow.artifact_type !== 'pptx') {
    return NextResponse.json({ error: 'Only pptx artifacts support image save' }, { status: 400 });
  }

  const ts = Date.now();
  const assets: AssetEntry[] = [];

  for (const slide of slides) {
    if (!slide.imageUrl) continue;

    let buffer: ArrayBuffer;
    try {
      const res = await fetch(slide.imageUrl);
      if (!res.ok) continue;
      buffer = await res.arrayBuffer();
    } catch {
      continue;
    }

    const idxStr = String(slide.index + 1).padStart(2, '0');
    const safeType = slide.type.replace(/[^a-z0-9-]/gi, '-');
    const path = `${user.id}/${artifactId}/slides/${idxStr}-${safeType}-${ts}.png`;

    const { error: uploadErr } = await supabase
      .storage
      .from('artifacts')
      .upload(path, buffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (uploadErr) {
      console.error('[save-images] upload failed', path, uploadErr);
      continue;
    }

    assets.push({ index: slide.index, type: slide.type, path, ts });
  }

  if (assets.length === 0) {
    return NextResponse.json({ error: 'No images were uploaded' }, { status: 502 });
  }

  const update: Record<string, unknown> = {
    assets,
    status: 'completed',
    slide_count: slides.length,
  };
  if (typeof body.theme === 'string') update.theme = body.theme;

  const { error: updateErr } = await supabase
    .from('artifacts')
    .update(update)
    .eq('id', artifactId)
    .eq('user_id', user.id);

  if (updateErr) {
    console.error('[save-images] artifact update failed', updateErr);
    return NextResponse.json({
      error: 'Failed to update artifact',
      detail: updateErr.message,
      code: updateErr.code,
      hint: updateErr.hint,
    }, { status: 500 });
  }

  return NextResponse.json({ ok: true, assets });
}
