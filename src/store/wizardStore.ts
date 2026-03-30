'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WizardAnswers, INITIAL_ANSWERS } from '@/src/types/answers'

export const TOTAL_STEPS = 6

interface WizardState {
  currentStep: number
  answers: WizardAnswers
  isComplete: boolean

  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateAnswers: (partial: Partial<WizardAnswers>) => void
  completeWizard: () => void
  resetWizard: () => void
}

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      currentStep: 1,
      answers: INITIAL_ANSWERS,
      isComplete: false,

      setStep: (step) =>
        set({ currentStep: Math.max(1, Math.min(step, TOTAL_STEPS)) }),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),

      updateAnswers: (partial) =>
        set((state) => ({
          answers: { ...state.answers, ...partial },
        })),

      completeWizard: () => set({ isComplete: true }),

      resetWizard: () =>
        set({ currentStep: 1, answers: INITIAL_ANSWERS, isComplete: false }),
    }),
    { name: 'device-planning-wizard' }
  )
)
