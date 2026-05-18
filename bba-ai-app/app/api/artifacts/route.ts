import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ArtifactType } from '@/lib/types';

const VALID_TYPES: ArtifactType[] = ['notes', 'pptx', 'workbook'];

// POST /api/artifacts — create an incomplete row when generation starts.
// Body: { module_id?: string, artifact_type: ArtifactType, title: string }
// Returns: { id }
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  let body: { module_id?: string | null; artifact_type?: ArtifactType; title?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { module_id, artifact_type, title } = body;
  if (!artifact_type || !VALID_TYPES.includes(artifact_type)) {
    return NextResponse.json({ error: 'Invalid artifact_type' }, { status: 400 });
  }
  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Missing title' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('artifacts')
    .insert({
      user_id: user.id,
      module_id: module_id ?? null,
      artifact_type,
      title,
      status: 'incomplete',
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('[artifacts] insert failed', error);
    return NextResponse.json({ error: 'Failed to create artifact' }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}

// PATCH /api/artifacts — mark an artifact complete (and optionally store content).
// Body: { id: string, status?: 'completed' | 'incomplete', content?, word_count?, storage_path?, slide_count?, theme? }
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  let body: {
    id?: string;
    status?: 'completed' | 'incomplete';
    content?: string;
    word_count?: number;
    storage_path?: string;
    slide_count?: number;
    theme?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (body.status !== undefined) update.status = body.status;
  if (body.content !== undefined) update.content = body.content;
  if (body.word_count !== undefined) update.word_count = body.word_count;
  if (body.storage_path !== undefined) update.storage_path = body.storage_path;
  if (body.slide_count !== undefined) update.slide_count = body.slide_count;
  if (body.theme !== undefined) update.theme = body.theme;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabase
    .from('artifacts')
    .update(update)
    .eq('id', body.id)
    .eq('user_id', user.id);

  if (error) {
    console.error('[artifacts] update failed', error);
    return NextResponse.json({ error: 'Failed to update artifact' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
