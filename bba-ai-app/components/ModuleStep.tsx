'use client';

import type { ParsedModule } from '@/lib/types';

interface Props {
  modules: ParsedModule[];
  onSelect: (module: ParsedModule) => void;
  onBack: () => void;
}

export default function ModuleStep({ modules, onSelect, onBack }: Props) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#FF9900' }}>Step 2</p>
        <h2 className="text-2xl font-bold" style={{ color: '#16191F' }}>Select a module</h2>
        <p className="mt-1 text-sm" style={{ color: '#545B64' }}>
          {modules.length} module{modules.length !== 1 ? 's' : ''} found. Select one to generate content for it.
        </p>
      </div>

      <div className="space-y-2">
        {modules.map((mod, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(mod)}
            className="w-full text-left p-4 transition-all group"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E9EBED',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#FF9900';
              (e.currentTarget as HTMLElement).style.boxShadow  = '0 2px 8px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#E9EBED';
              (e.currentTarget as HTMLElement).style.boxShadow  = '0 1px 3px rgba(0,0,0,0.06)';
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold px-2 py-0.5"
                    style={{ background: '#232F3E', color: '#FFFFFF', borderRadius: 2 }}
                  >
                    Sem {mod.semester} · Mod {mod.module}
                  </span>
                  <span className="text-xs" style={{ color: '#8D9BA8' }}>{mod.hours} hrs</span>
                </div>
                <h3 className="font-semibold" style={{ color: '#16191F' }}>{mod.title}</h3>
                {mod.topics.length > 0 && (
                  <p className="text-sm mt-1 truncate" style={{ color: '#545B64' }}>
                    {mod.topics.slice(0, 4).join(' · ')}
                    {mod.topics.length > 4 && ` +${mod.topics.length - 4} more`}
                  </p>
                )}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {mod.indianCaseStudy && (
                    <span
                      className="text-xs px-2 py-0.5 font-medium"
                      style={{ background: '#FFF8EE', color: '#EC7211', borderRadius: 2, border: '1px solid #FFCC80' }}
                    >
                      🇮🇳 {mod.indianCaseStudy}
                    </span>
                  )}
                  {mod.globalCaseStudy && (
                    <span
                      className="text-xs px-2 py-0.5 font-medium"
                      style={{ background: '#F0F7FF', color: '#0073BB', borderRadius: 2, border: '1px solid #B3D9F5' }}
                    >
                      🌐 {mod.globalCaseStudy}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 mt-1" style={{ color: '#FF9900' }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-5 text-sm flex items-center gap-1 transition-colors"
        style={{ color: '#545B64', background: 'none', border: 'none', cursor: 'pointer' }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#0073BB')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#545B64')}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to syllabus
      </button>
    </div>
  );
}
