'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import StepIndicator from '@/components/StepIndicator';
import SyllabusStep from '@/components/SyllabusStep';
import ModuleStep from '@/components/ModuleStep';
import ArtifactStep from '@/components/ArtifactStep';
import GenerateStep from '@/components/GenerateStep';
import type { ParsedModule, ArtifactType, WizardStep } from '@/lib/types';

export default function Home() {
  const [step, setStep] = useState<WizardStep>('input');
  const [modules, setModules] = useState<ParsedModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<ParsedModule | null>(null);
  const [artifactType, setArtifactType] = useState<ArtifactType | null>(null);

  function handleModulesExtracted(mods: ParsedModule[]) {
    setModules(mods);
    setStep('modules');
  }

  function handleModuleSelect(mod: ParsedModule) {
    setSelectedModule(mod);
    setStep('artifact');
  }

  function handleGenerate(type: ArtifactType) {
    setArtifactType(type);
    setStep('generate');
  }

  function handleRestart() {
    setStep('input');
    setModules([]);
    setSelectedModule(null);
    setArtifactType(null);
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />

      <main className="max-w-5xl mx-auto px-6 pb-16">
        <StepIndicator current={step} />

        {step === 'input' && (
          <SyllabusStep onModulesExtracted={handleModulesExtracted} />
        )}

        {step === 'modules' && (
          <ModuleStep
            modules={modules}
            onSelect={handleModuleSelect}
            onBack={() => setStep('input')}
          />
        )}

        {step === 'artifact' && selectedModule && (
          <ArtifactStep
            module={selectedModule}
            onGenerate={handleGenerate}
            onBack={() => setStep('modules')}
          />
        )}

        {step === 'generate' && selectedModule && artifactType && (
          <GenerateStep
            module={selectedModule}
            artifactType={artifactType}
            onBack={() => setStep('artifact')}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
