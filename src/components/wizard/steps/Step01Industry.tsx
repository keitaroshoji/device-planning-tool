'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { Industry } from '@/src/types/answers'
import { ChoiceCard } from '@/src/components/ui/ChoiceCard'
import { Button } from '@/src/components/ui/Button'

const INDUSTRIES: { key: Industry; emoji: string; label: string; description: string }[] = [
  { key: 'food_service', emoji: '🍽️', label: '飲食・フードサービス', description: 'レストラン、カフェ、ファストフードなど' },
  { key: 'retail', emoji: '🛍️', label: '小売・流通', description: 'コンビニ、スーパー、アパレル、専門店など' },
  { key: 'manufacturing', emoji: '🏭', label: '製造・工場', description: '製造ライン、品質管理、倉庫作業など' },
  { key: 'logistics', emoji: '📦', label: '物流・配送', description: '配送センター、倉庫管理、ドライバーなど' },
  { key: 'medical', emoji: '🏥', label: '医療・介護', description: '病院、クリニック、介護施設など' },
  { key: 'beauty', emoji: '💅', label: 'ビューティー・サロン', description: '美容院、ネイルサロン、エステなど' },
  { key: 'education', emoji: '📚', label: '教育・研修', description: '学習塾、研修センター、スクールなど' },
  { key: 'other', emoji: '🏢', label: 'その他', description: '上記以外の業種' },
]

export function Step01Industry() {
  const router = useRouter()
  const { answers, updateAnswers, nextStep } = useWizardStore()

  function handleNext() {
    nextStep()
    router.push('/wizard?step=2')
  }

  const canProceed = answers.industry !== null && answers.isFranchise !== null

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Step 1</p>
        <h1 className="text-xl font-semibold text-gray-800">業種をお教えください</h1>
        <p className="mt-1 text-sm text-gray-500">最も近い業種を選択してください</p>
      </div>

      <div className="space-y-2">
        {INDUSTRIES.map((item) => (
          <ChoiceCard
            key={item.key}
            selected={answers.industry === item.key}
            onClick={() => updateAnswers({ industry: item.key })}
            emoji={item.emoji}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>

      {answers.industry && (
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700">フランチャイズ（FC）事業ですか？</p>
          <div className="grid grid-cols-2 gap-2">
            <ChoiceCard
              selected={answers.isFranchise === true}
              onClick={() => updateAnswers({ isFranchise: true })}
              label="はい（FC事業）"
              description="本部・加盟店がある"
            />
            <ChoiceCard
              selected={answers.isFranchise === false}
              onClick={() => updateAnswers({ isFranchise: false })}
              label="いいえ"
              description="独立した事業"
            />
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button size="lg" className="w-full" onClick={handleNext} disabled={!canProceed}>
          次へ
        </Button>
      </div>
    </div>
  )
}
