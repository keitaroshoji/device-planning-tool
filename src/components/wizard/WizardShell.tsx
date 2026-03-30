'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWizardStore, TOTAL_STEPS } from '@/src/store/wizardStore'
import { StepProgress } from '@/src/components/ui/StepProgress'
import { Button } from '@/src/components/ui/Button'
import { StepRouter } from './StepRouter'

export function WizardShell() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentStep, setStep, prevStep, answers, isComplete } = useWizardStore()

  // Sync URL params with store
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam) {
      const parsed = parseInt(stepParam, 10)
      if (!isNaN(parsed) && parsed !== currentStep) {
        setStep(parsed)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect to result if complete
  useEffect(() => {
    if (isComplete) {
      router.push('/result')
    }
  }, [isComplete, router])

  function handleBack() {
    if (currentStep === 1) {
      router.push('/')
    } else {
      prevStep()
      router.push(`/wizard?step=${currentStep - 1}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          aria-label="戻る"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <StepProgress currentStep={currentStep} />
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center py-8 px-4">
        <div className="w-full max-w-xl">
          <StepRouter />
        </div>
      </main>
    </div>
  )
}
