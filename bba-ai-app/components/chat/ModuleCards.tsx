'use client';

import type { ParsedModule } from '@/lib/types';

interface Props {
  modules: ParsedModule[];
  onSelect: (mod: ParsedModule) => void;
}

export default function ModuleCards({ modules, onSelect }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
      {modules.map((mod) => (
        <button
          key={`${mod.semester}-${mod.module}`}
          onClick={() => onSelect(mod)}
          style={{
            width: '100%',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--chat-card-radius)',
            padding: '10px 14px',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            transition: 'transform 150ms ease, box-shadow 150ms ease',
            borderLeft: '4px solid var(--accent)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = 'none';
          }}
        >
          <div
            style={{
              minWidth: 36,
              height: 36,
              borderRadius: 8,
              background: 'var(--accent)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {String(mod.module).padStart(2, '0')}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>
              {mod.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Sem {mod.semester} · {mod.hours} hrs
              {mod.topics.length > 0 && (
                <span style={{ marginLeft: 6 }}>
                  · {mod.topics.slice(0, 3).join(', ')}{mod.topics.length > 3 ? ' …' : ''}
                </span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
