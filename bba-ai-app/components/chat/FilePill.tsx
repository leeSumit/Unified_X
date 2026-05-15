'use client';

interface Props {
  fileName: string;
  onRemove: () => void;
}

export default function FilePill({ fileName, onRemove }: Props) {
  const truncated = fileName.length > 40 ? fileName.slice(0, 37) + '…' : fileName;

  return (
    <div
      className="inline-flex items-center gap-1.5 text-sm"
      style={{
        background: 'var(--bg-input)',
        borderRadius: 12,
        padding: '4px 10px',
        fontSize: 13,
        color: 'var(--text-primary)',
        maxWidth: '100%',
      }}
    >
      <span>📎</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {truncated}
      </span>
      <button
        onClick={onRemove}
        aria-label="Remove file"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          padding: '0 2px',
          lineHeight: 1,
          fontSize: 14,
        }}
      >
        ✕
      </button>
    </div>
  );
}
