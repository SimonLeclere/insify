// src/components/CreateProjectForm/useProjectMultiStepForm.tsx
import { useState, useCallback } from "react";

type UseFormStepsProps = {
  initialSteps: number[];
  onStepValidation?: (step: number) => Promise<boolean> | boolean;
};

export type UseProjectMultiStepFormReturn = {
  steps: number[];
  currentStep: number;
  currentStepData: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNext: () => Promise<boolean>;
  goToPrevious: () => void;
};

export default function useProjectMultiStepForm({
  initialSteps,
  onStepValidation,
}: UseFormStepsProps): UseProjectMultiStepFormReturn {
  const steps = initialSteps;
  const [currentStep, setCurrentStep] = useState(steps[0]);

  const goToNext = useCallback(async () => {
    if (onStepValidation) {
      const isValid = await onStepValidation(currentStep);
      if (!isValid) return false;
    }
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
      return true;
    }
    return false;
  }, [currentStep, steps, onStepValidation]);

  const goToPrevious = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep, steps]);

  return {
    steps,
    currentStep,
    currentStepData: currentStep,
    progress: ((steps.indexOf(currentStep) + 1) / steps.length) * 100,
    isFirstStep: steps.indexOf(currentStep) === 0,
    isLastStep: steps.indexOf(currentStep) === steps.length - 1,
    goToNext,
    goToPrevious,
  };
}
