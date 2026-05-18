'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import ViewAllModal from './ViewAllModal';
import { ArtifactCard, ARTIFACT_TYPE_META, type ArtifactPreview, type ArtifactType } from './PreviousArtifacts';

const PAGE_SIZE = 20;

interface ArtifactRow {
  id: string;
  artifact_type: ArtifactType;
  title: string;
  created_at: string;
  assets: { index: number; type: string; path: string }[] | null;
  modules: { title: string } | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  onOpenArtifact: (a: ArtifactPreview) => void;
  loadingArtifactId: string | null;
}

export default function ArtifactsAllModal({ open, onClose, userId, onOpenArtifact, loadingArtifactId }: Props) {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [rows, setRows] = useState<ArtifactPreview[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // Tracks the most recent fetch — older in-flight responses are discarded.
  const fetchIdRef = useRef(0);

  // Debounce the search input by 250ms.
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  // Reset state whenever the modal opens or the search term changes.
  useEffect(() => {
    if (!open) return;
    setRows([]);
    setPage(0);
    setHasMore(true);
  }, [open, debounced]);

  const fetchPage = useCallback(async (pageIndex: number) => {
    if (!userId) return;
    const myFetchId = ++fetchIdRef.current;
    if (pageIndex === 0) setIsInitialLoading(true);
    else setIsFetchingMore(true);

    try {
      const supabase = createClient();
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from('artifacts')
        .select('id, artifact_type, title, created_at, assets, modules(title)')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (debounced) {
        // Substring match (case-insensitive) on title or content. PostgREST
        // commas must be escaped as %2C; supabase-js handles that internally.
        const escaped = debounced.replace(/[%,]/g, ' ');
        query = query.or(`title.ilike.%${escaped}%,content.ilike.%${escaped}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[artifacts-modal] fetch failed', error);
        return;
      }
      if (myFetchId !== fetchIdRef.current) return; // stale

      const rowsData = (data ?? []) as unknown as ArtifactRow[];

      // Batch-sign first-slide thumbnails for PPT rows in this page.
      const firstPaths: string[] = [];
      const pathByRow = new Map<string, string>();
      for (const r of rowsData) {
        if (r.artifact_type !== 'pptx' || !Array.isArray(r.assets) || r.assets.length === 0) continue;
        const sorted = [...r.assets].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
        const path = sorted[0]?.path;
        if (path) {
          firstPaths.push(path);
          pathByRow.set(r.id, path);
        }
      }
      const urlByPath = new Map<string, string>();
      if (firstPaths.length > 0) {
        const { data: signed } = await supabase.storage
          .from('artifacts')
          .createSignedUrls(firstPaths, 60 * 60 * 6);
        for (const s of signed ?? []) {
          if (s.path && s.signedUrl) urlByPath.set(s.path, s.signedUrl);
        }
      }
      if (myFetchId !== fetchIdRef.current) return;

      const previews: ArtifactPreview[] = rowsData.map(r => {
        const path = pathByRow.get(r.id);
        return {
          id: r.id,
          type: r.artifact_type,
          title: r.title,
          moduleTitle: r.modules?.title ?? '—',
          createdAt: new Date(r.created_at),
          thumbnailUrl: path ? urlByPath.get(path) ?? null : null,
        };
      });

      setRows(prev => pageIndex === 0 ? previews : [...prev, ...previews]);
      setHasMore(rowsData.length === PAGE_SIZE);
      setPage(pageIndex + 1);
    } finally {
      if (myFetchId === fetchIdRef.current) {
        if (pageIndex === 0) setIsInitialLoading(false);
        else setIsFetchingMore(false);
      }
    }
  }, [userId, debounced]);

  // Trigger the first page fetch whenever the modal opens with a new search.
  useEffect(() => {
    if (!open || !userId) return;
    fetchPage(0);
  }, [open, userId, debounced, fetchPage]);

  return (
    <ViewAllModal
      title="All artifacts"
      open={open}
      onClose={onClose}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by title or content…"
      hasMore={hasMore}
      isFetchingMore={isFetchingMore}
      isInitialLoading={isInitialLoading}
      onLoadMore={() => fetchPage(page)}
      emptyMessage={debounced ? `No artifacts match "${debounced}"` : 'No artifacts yet.'}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {rows.map((a) => (
          <ArtifactCard
            key={a.id}
            artifact={a}
            meta={ARTIFACT_TYPE_META[a.type]}
            onOpen={onOpenArtifact}
            isLoading={loadingArtifactId === a.id}
            isDisabled={!!loadingArtifactId && loadingArtifactId !== a.id}
          />
        ))}
      </div>
    </ViewAllModal>
  );
}
