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
      <div className="flex justify-between text-xs text-slate-500 mb-1.5">
        <span>ステップ {currentStep} / {TOTAL_STEPS}</span>
        <span className="font-medium text-blue-600">{STEP_LABELS[currentStep - 1]}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-1.5">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`w-2 h-2 rounded-full transition-all ${
              i + 1 < currentStep
                ? 'bg-blue-500'
                : i + 1 === currentStep
                ? 'bg-blue-500 ring-2 ring-blue-200'
                : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
