'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ViewAllModal from './ViewAllModal';
import { ModuleRow, type ModulePreview } from './PreviousModules';

const PAGE_SIZE = 20;

interface ModuleDbRow {
  id: string;
  created_at: string;
  semester: number;
  module: number;
  title: string;
  hours: number;
  topics: string[] | null;
  source_filename: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  onOpenModule: (m: ModulePreview) => void;
}

export default function ModulesAllModal({ open, onClose, userId, onOpenModule }: Props) {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [rows, setRows] = useState<ModulePreview[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const fetchIdRef = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

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
        .from('modules')
        .select('id, created_at, semester, module, title, hours, topics, source_filename')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (debounced) {
        const escaped = debounced.replace(/[%,]/g, ' ');
        // Search title and source_filename; case-insensitive substring.
        query = query.or(`title.ilike.%${escaped}%,source_filename.ilike.%${escaped}%`);
      }

      const { data, error } = await query;
      if (error) {
        console.error('[modules-modal] fetch failed', error);
        return;
      }
      if (myFetchId !== fetchIdRef.current) return;

      const rowsData = (data ?? []) as ModuleDbRow[];
      const previews: ModulePreview[] = rowsData.map(r => ({
        id: r.id,
        semester: r.semester,
        module: r.module,
        title: r.title,
        hours: r.hours,
        topicCount: r.topics?.length ?? 0,
        sourceFilename: r.source_filename ?? undefined,
        createdAt: new Date(r.created_at),
      }));

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

  useEffect(() => {
    if (!open || !userId) return;
    fetchPage(0);
  }, [open, userId, debounced, fetchPage]);

  return (
    <ViewAllModal
      title="All parsed modules"
      open={open}
      onClose={onClose}
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by title or filename…"
      hasMore={hasMore}
      isFetchingMore={isFetchingMore}
      isInitialLoading={isInitialLoading}
      onLoadMore={() => fetchPage(page)}
      emptyMessage={debounced ? `No modules match "${debounced}"` : 'No modules parsed yet.'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((m) => (
          <ModuleRow key={m.id} module={m} onOpen={onOpenModule} />
        ))}
      </div>
    </ViewAllModal>
  );
}
