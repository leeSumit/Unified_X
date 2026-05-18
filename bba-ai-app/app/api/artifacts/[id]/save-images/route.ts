import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Slides are uploaded client-side to Supabase Storage; this route records paths
// plus the slide's structured content so the artifact can be re-opened and
// individual slides can be regenerated later.
interface SlidePayload {
  index: number;
  type: string;
  path: string;
  content?: Record<string, unknown>;
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

  // Verify artifact ownership
  const { data: artifactRow, error: lookupErr } = await supabase
    .from('artifacts')
    .select('id, artifact_type')
    .eq('id', artifactId)
    .eq('user_id', user.id)
    .single();

  if (lookupErr || !artifactRow) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });
  }
  if (artifactRow.artifact_type !== 'pptx') {
    return NextResponse.json({ error: 'Only pptx artifacts support image save' }, { status: 400 });
  }

  // Images were already uploaded to Supabase Storage by the browser.
  // This route only records the paths (and per-slide content for re-open) and marks the artifact complete.
  const assets = slides.map(s => ({
    index: s.index,
    type: s.type,
    path: s.path,
    ...(s.content ? { content: s.content } : {}),
  }));

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
