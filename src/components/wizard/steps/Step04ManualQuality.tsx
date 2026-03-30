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
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Step 4</p>
        <h1 className="text-xl font-semibold text-gray-800">マニュアルの作り方のイメージは？</h1>
        <p className="mt-1 text-sm text-gray-500">コンテンツ作成のスタイルを教えてください</p>
      </div>

      <div className="space-y-2">
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

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-700">
        <span className="font-semibold">Teachme Biz</span> を使えば、スマホ撮影からプロ品質の動画マニュアルまで対応。端末セットとのセット提案も可能です。
      </div>

      <div className="pt-2">
        <Button size="lg" className="w-full" onClick={handleNext} disabled={!canProceed}>
          次へ
        </Button>
      </div>
    </div>
  )
}
