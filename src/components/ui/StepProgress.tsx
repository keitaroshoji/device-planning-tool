import { TOTAL_STEPS } from '@/src/store/wizardStore'

interface StepProgressProps {
  currentStep: number
}

const STEP_LABELS = [
  '業種',
  '業務の課題',
  '活用シーン',
  'マニュアル品質',
  '運用スタイル',
]

export function StepProgress({ currentStep }: StepProgressProps) {
  const percent = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1.5">
        <span>ステップ {currentStep} / {TOTAL_STEPS}</span>
        <span className="text-blue-600 font-medium">{STEP_LABELS[currentStep - 1]}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
