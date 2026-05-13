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
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-brand-purple mb-2">Select a module</h2>
        <p className="text-gray-600">
          {modules.length} module{modules.length !== 1 ? 's' : ''} found. You can only generate one module at a time.
        </p>
      </div>

      <div className="space-y-3">
        {modules.map((mod, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(mod)}
            className="w-full text-left p-5 bg-white rounded-xl border-2 border-transparent hover:border-brand-purple hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-brand-purple bg-purple-100 px-2 py-0.5 rounded-full">
                    Sem {mod.semester} · Mod {mod.module}
                  </span>
                  <span className="text-xs text-gray-400">{mod.hours} hrs</span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-brand-purple transition-colors">
                  {mod.title}
                </h3>
                {mod.topics.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {mod.topics.slice(0, 4).join(' · ')}
                    {mod.topics.length > 4 && ` +${mod.topics.length - 4} more`}
                  </p>
                )}
                <div className="flex gap-2 mt-2 flex-wrap">
                  {mod.indianCaseStudy && (
                    <span className="text-xs bg-orange-100 text-brand-orange px-2 py-0.5 rounded-full font-medium">
                      🇮🇳 {mod.indianCaseStudy}
                    </span>
                  )}
                  {mod.globalCaseStudy && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                      🌐 {mod.globalCaseStudy}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
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
        className="mt-6 text-sm text-gray-500 hover:text-brand-purple transition-colors flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to syllabus
      </button>
    </div>
  );
}
