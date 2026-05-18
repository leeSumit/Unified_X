import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface AssetEntry {
  index: number;
  type: string;
  path: string;
  content?: Record<string, unknown>;
}

// Signed URLs are valid for 6 hours — long enough to edit a deck without
// constantly re-signing, short enough to limit leakage if a link escapes.
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 6;

// GET /api/artifacts/[id]/load
// Returns everything needed to reopen an artifact for editing:
//   - artifact row (type, title, theme, slide_count, content, etc.)
//   - linked module row (or null if it was deleted)
//   - for pptx: each asset enriched with a signed imageUrl
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: artifactId } = await context.params;
  if (!artifactId) {
    return NextResponse.json({ error: 'Missing artifact id' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { data: artifact, error: artifactErr } = await supabase
    .from('artifacts')
    .select('id, artifact_type, title, module_id, content, word_count, storage_path, slide_count, theme, assets, status, created_at')
    .eq('id', artifactId)
    .eq('user_id', user.id)
    .single();

  if (artifactErr || !artifact) {
    return NextResponse.json({ error: 'Artifact not found' }, { status: 404 });
  }

  let module: Record<string, unknown> | null = null;
  if (artifact.module_id) {
    const { data: moduleRow } = await supabase
      .from('modules')
      .select('id, semester, module, title, hours, topics, tools, indian_case_study, global_case_study, learning_outcomes')
      .eq('id', artifact.module_id)
      .eq('user_id', user.id)
      .single();
    module = moduleRow ?? null;
  }

  // For PPT, attach a signed URL to each stored slide image.
  let signedAssets: (AssetEntry & { imageUrl: string | null })[] = [];
  if (artifact.artifact_type === 'pptx' && Array.isArray(artifact.assets)) {
    const assets = artifact.assets as AssetEntry[];
    const paths = assets.map(a => a.path).filter(Boolean);
    if (paths.length > 0) {
      const { data: signed, error: signErr } = await supabase
        .storage
        .from('artifacts')
        .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);
      if (signErr) {
        console.error('[artifacts/load] signing failed', signErr);
      }
      const urlByPath = new Map(
        (signed ?? []).map(s => [s.path ?? '', s.signedUrl ?? null] as const)
      );
      signedAssets = assets.map(a => ({
        ...a,
        imageUrl: urlByPath.get(a.path) ?? null,
      }));
    }
  }

  return NextResponse.json({
    artifact: {
      id: artifact.id,
      artifact_type: artifact.artifact_type,
      title: artifact.title,
      content: artifact.content,
      word_count: artifact.word_count,
      storage_path: artifact.storage_path,
      slide_count: artifact.slide_count,
      theme: artifact.theme,
      status: artifact.status,
      created_at: artifact.created_at,
    },
    module,
    assets: signedAssets,
  });
}
