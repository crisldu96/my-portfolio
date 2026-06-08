'use client';

import { useRef, useState } from 'react';
import Container from '@mui/material/Container';

import SectionLabel from '../cosmic/SectionLabel';
import { cosmic } from '@/themes/cosmicTokens';
import useLanguage from '@/hooks/useLanguage';
import { PROCESS_STEP_COUNT } from '@/lib/scrollProgressStore';
import { useProcessScrollytelling } from '@/hooks/useProcessScrollytelling';

interface ProcessStep {
  title: string;
  description: string;
}

const ProcessSection = () => {
  const { handleTranslation } = useLanguage();
  const steps = handleTranslation<ProcessStep[]>('processSection.steps') ?? [];
  const total = steps.length || PROCESS_STEP_COUNT;
  const liveTemplate = handleTranslation('processSection.liveTemplate');

  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollToStep } = useProcessScrollytelling({
    rootRef,
    pinRef,
    stepCount: total,
    onStepChange: setActiveStep,
  });

  const liveMessage =
    typeof liveTemplate === 'string' && steps[activeStep]
      ? liveTemplate
          .replace('{n}', String(activeStep + 1))
          .replace('{total}', String(total))
          .replace('{title}', steps[activeStep].title)
      : '';

  return (
    <div ref={rootRef}>
      <a href="#experience" className="process-skip-link">
        {handleTranslation('processSection.skipLabel')}
      </a>

      <Container maxWidth="lg">
        <SectionLabel number="02" label={handleTranslation('processSection.sectionLabel')} />
        <h2 className="section-headline">
          <span className="reveal-on-scroll">
            <span>{handleTranslation('processSection.title')}</span>
          </span>
        </h2>
        <p style={{ color: cosmic.textSecondary, maxWidth: 540, marginTop: 0, marginBottom: 24 }}>
          {handleTranslation('processSection.subtitle')}
        </p>
      </Container>

      <div ref={pinRef} className="process-pin">
        <Container maxWidth="md" className="process-stage">
          {steps.map((step, i) => (
            <article
              key={step.title}
              id={`proceso-step-${i}`}
              className="process-step"
              aria-current={i === activeStep ? 'step' : undefined}
            >
              <span className="process-step__index">
                {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <h3 className="process-step__title">{step.title}</h3>
              <p className="process-step__desc">{step.description}</p>
            </article>
          ))}
        </Container>

        <div className="process-dots" role="group" aria-label={handleTranslation('processSection.sectionLabel')}>
          {steps.map((step, i) => (
            <button
              key={step.title}
              type="button"
              className={`process-dot${i === activeStep ? ' process-dot--active' : ''}`}
              aria-current={i === activeStep ? 'step' : undefined}
              aria-label={`${handleTranslation('processSection.sectionLabel')}: ${i + 1}/${total} ${step.title}`}
              onClick={() => scrollToStep(i)}
            >
              <span className="process-dot__num">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </div>
  );
};

export default ProcessSection;
