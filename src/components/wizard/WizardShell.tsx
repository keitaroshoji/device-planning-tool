'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { StepProgress } from '@/src/components/ui/StepProgress'
import { StepRouter } from './StepRouter'

export function WizardShell() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentStep, setStep, prevStep, isComplete, answers } = useWizardStore()

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

  // 完了後のリダイレクトは Step6 の handleSubmit が明示的に行うため、ここでは不要

  function handleBack() {
    if (currentStep === 1) {
      router.push('/')
    } else {
      prevStep()
      router.push(`/wizard?step=${currentStep - 1}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar — Teachme-style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center gap-4">
          {/* Back */}
          <button
            onClick={handleBack}
            className="p-1.5 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="戻る"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-sm font-semibold text-gray-700">Studist DS</span>
          </div>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Progress */}
          <div className="flex-1 max-w-sm">
            <StepProgress currentStep={currentStep} />
          </div>
        </div>
      </header>

      {/* Page body */}
      <main className="flex-1 flex justify-center py-10 px-4">
        <div className="w-full max-w-xl bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <StepRouter />
        </div>
      </main>
    </div>
  )
}
