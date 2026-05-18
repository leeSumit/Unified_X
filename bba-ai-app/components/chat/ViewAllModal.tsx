'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  searchValue: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  // Whether we have more rows that can be loaded. Used to render the sentinel.
  hasMore: boolean;
  // True while the next page is being fetched (renders a small footer spinner).
  isFetchingMore: boolean;
  // True for the very first fetch (renders a skeleton inside the scroll area).
  isInitialLoading: boolean;
  // Called when the sentinel scrolls into view — modal asks for the next page.
  onLoadMore: () => void;
  // Optional empty-state message when the list is empty AND not loading.
  emptyMessage?: string;
  children: ReactNode;
}

export default function ViewAllModal({
  title,
  open,
  onClose,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  hasMore,
  isFetchingMore,
  isInitialLoading,
  onLoadMore,
  emptyMessage,
  children,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Infinite scroll: observe the sentinel.
  useEffect(() => {
    if (!open) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetchingMore) onLoadMore();
      },
      { root: scrollRef.current, rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [open, hasMore, isFetchingMore, onLoadMore]);

  if (!open) return null;

  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;
  const showEmpty = !isInitialLoading && !hasChildren && !isFetchingMore;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#15161e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 720,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#e2e8f0' }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              color: '#cbd5e1',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 14,
              padding: '4px 10px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder ?? 'Search…'}
            autoFocus
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: '9px 12px',
              fontSize: 13,
              color: '#e2e8f0',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Scrollable body */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 20px 20px',
          }}
        >
          {isInitialLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', color: '#8892a4', fontSize: 13 }}>
              <svg className="animate-spin" style={{ width: 16, height: 16, marginRight: 8 }} fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.85" />
              </svg>
              Loading…
            </div>
          ) : showEmpty ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#8892a4', fontSize: 13 }}>
              {emptyMessage ?? 'Nothing to show.'}
            </div>
          ) : (
            <>
              {children}
              <div ref={sentinelRef} style={{ height: 1 }} />
              {isFetchingMore && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0', color: '#8892a4', fontSize: 12 }}>
                  <svg className="animate-spin" style={{ width: 12, height: 12, marginRight: 6 }} fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" opacity="0.85" />
                  </svg>
                  Loading more…
                </div>
              )}
              {!hasMore && !isFetchingMore && hasChildren && (
                <div style={{ textAlign: 'center', padding: '16px 0 4px', color: '#5f6678', fontSize: 11 }}>
                  End of list
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
