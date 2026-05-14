import type { WizardStep } from '@/lib/types';

const STEPS: { id: WizardStep; label: string }[] = [
  { id: 'input',    label: 'Syllabus' },
  { id: 'modules',  label: 'Module'   },
  { id: 'artifact', label: 'Artifact' },
  { id: 'generate', label: 'Generate' },
];

const ORDER: WizardStep[] = ['input', 'modules', 'artifact', 'generate'];

interface Props { current: WizardStep; }

export default function StepIndicator({ current }: Props) {
  const currentIdx = ORDER.indexOf(current);

  return (
    <div className="flex items-center justify-center gap-0 my-8">
      {STEPS.map((step, idx) => {
        const done   = idx < currentIdx;
        const active = idx === currentIdx;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  borderRadius: '50%',
                  border: `2px solid ${active ? '#FF9900' : done ? '#232F3E' : '#E9EBED'}`,
                  background:   active ? '#FF9900' : done ? '#232F3E' : '#FFFFFF',
                  color:        active ? '#16191F' : done ? '#FFFFFF' : '#8D9BA8',
                  transform:    active ? 'scale(1.1)' : 'scale(1)',
                }}
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
                className="text-xs mt-1.5 font-medium"
                style={{ color: active ? '#FF9900' : done ? '#232F3E' : '#8D9BA8' }}
              >
                {step.label}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className="w-16 mb-5 mx-1 transition-all"
                style={{
                  height: 2,
                  background: idx < currentIdx ? '#FF9900' : '#E9EBED',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
