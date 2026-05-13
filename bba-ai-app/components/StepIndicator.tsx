import type { WizardStep } from '@/lib/types';

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 'input', label: 'Syllabus' },
  { id: 'modules', label: 'Module' },
  { id: 'artifact', label: 'Artifact' },
  { id: 'generate', label: 'Generate' },
];

const ORDER: WizardStep[] = ['input', 'modules', 'artifact', 'generate'];

interface Props {
  current: WizardStep;
}

export default function StepIndicator({ current }: Props) {
  const currentIdx = ORDER.indexOf(current);

  return (
    <div className="flex items-center justify-center gap-0 my-8">
      {STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                  ${active ? 'bg-brand-purple border-brand-purple text-white shadow-lg scale-110' : ''}
                  ${done ? 'bg-brand-orange border-brand-orange text-white' : ''}
                  ${!active && !done ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}
              >
                {done ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium ${
                  active ? 'text-brand-purple' : done ? 'text-brand-orange' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-5 mx-1 transition-all ${
                  idx < currentIdx ? 'bg-brand-orange' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
