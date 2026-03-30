import { TOTAL_STEPS } from '@/src/store/wizardStore'

interface StepProgressProps {
  currentStep: number
}

const STEP_LABELS = [
  '業種',
  '課題',
  '活用シーン',
  'マニュアル',
  '端末環境',
  '規模',
  '予算・期間',
  'お客様情報',
]

export function StepProgress({ currentStep }: StepProgressProps) {
  const percent = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
        <span>ステップ {currentStep} / {TOTAL_STEPS}</span>
        <span>{STEP_LABELS[currentStep - 1]}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
