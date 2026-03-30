'use client'

import { useWizardStore } from '@/src/store/wizardStore'
import { Step01Industry } from './steps/Step01Industry'
import { Step02Challenges } from './steps/Step02Challenges'
import { Step03UseCases } from './steps/Step03UseCases'
import { Step04ManualQuality } from './steps/Step04ManualQuality'
import { Step05OperationStyle } from './steps/Step05OperationStyle'

export function StepRouter() {
  const { currentStep } = useWizardStore()

  switch (currentStep) {
    case 1: return <Step01Industry />
    case 2: return <Step02Challenges />
    case 3: return <Step03UseCases />
    case 4: return <Step04ManualQuality />
    case 5: return <Step05OperationStyle />
    default: return <Step01Industry />
  }
}
