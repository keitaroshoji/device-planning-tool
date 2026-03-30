'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { ManualQuality } from '@/src/types/answers'
import { ChoiceCard } from '@/src/components/ui/ChoiceCard'
import { Button } from '@/src/components/ui/Button'

const OPTIONS: { key: ManualQuality; emoji: string; label: string; description: string }[] = [
  {
    key: 'casual',
    emoji: '📱',
    label: 'かんたんに・手軽に',
    description: 'スマホで撮影した写真・動画をすぐ共有。まずは作ることが大事',
  },
  {
    key: 'rich',
    emoji: '🎬',
    label: 'しっかり・クオリティ高く',
    description: '動画・ナレーション・テロップなどを使ってリッチなマニュアルを作りたい',
  },
]

export function Step04ManualQuality() {
  const router = useRouter()
  const { answers, updateAnswers, nextStep } = useWizardStore()

  function handleNext() {
    nextStep()
    router.push('/wizard?step=5')
  }

  const canProceed = answers.manualQuality !== null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">マニュアルの作り方のイメージは？</h1>
        <p className="mt-1 text-slate-500 text-sm">コンテンツ作成のスタイルを教えてください</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {OPTIONS.map((item) => (
          <ChoiceCard
            key={item.key ?? ''}
            selected={answers.manualQuality === item.key}
            onClick={() => updateAnswers({ manualQuality: item.key })}
            emoji={item.emoji}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        💡 <strong>Teachme Biz</strong> を使えば、スマホ撮影からプロ品質の動画マニュアルまで対応。端末セットとのセット提案もできます。
      </div>

      <div className="pt-2">
        <Button
          size="lg"
          className="w-full"
          onClick={handleNext}
          disabled={!canProceed}
        >
          次へ →
        </Button>
      </div>
    </div>
  )
}
