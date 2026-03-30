'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWizardStore, TOTAL_STEPS } from '@/src/store/wizardStore'
import { StepProgress } from '@/src/components/ui/StepProgress'
import { StepRouter } from './StepRouter'

export function WizardShell() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentStep, setStep, prevStep, isComplete } = useWizardStore()

  // Sync URL param → store on initial load
  useEffect(() => {
    const stepParam = searchParams.get('step')
    if (stepParam) {
      const parsed = parseInt(stepParam, 10)
      if (!isNaN(parsed) && parsed !== currentStep) {
        setStep(parsed)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isComplete) router.push('/result')
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
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center gap-4">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition shrink-0"
            aria-label="戻る"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 max-w-xl">
            <StepProgress currentStep={currentStep} />
          </div>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <span className="text-sm font-semibold text-slate-600 hidden md:block">
              Studist DRS
            </span>
          </div>
        </div>
      </header>

      {/* Body — centered, comfortable width */}
      <main className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          <StepRouter />
        </div>
      </main>
    </div>
  )
}
