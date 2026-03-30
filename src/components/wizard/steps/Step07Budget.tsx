'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { DurationPreference, BudgetRange, PurchaseIntent } from '@/src/types/answers'
import { ChoiceCard } from '@/src/components/ui/ChoiceCard'
import { Button } from '@/src/components/ui/Button'

const DURATIONS: { key: DurationPreference; label: string; description: string }[] = [
  { key: 1, label: '1ヶ月', description: 'まずお試しで' },
  { key: 3, label: '3ヶ月', description: '短期プロジェクト向け' },
  { key: 6, label: '6ヶ月', description: '半年契約' },
  { key: 12, label: '12ヶ月', description: '1年契約（所有権移転オプションあり）' },
  { key: 24, label: '24ヶ月', description: '2年契約' },
  { key: 36, label: '36ヶ月', description: '3年契約（最もお得）' },
]

const BUDGET_RANGES: { key: BudgetRange; label: string; description: string }[] = [
  { key: 'under_3000', label: '〜¥3,000 / 台・月', description: '36ヶ月プラン相当' },
  { key: '3000_5000', label: '¥3,000〜¥5,000 / 台・月', description: '12〜24ヶ月プラン相当' },
  { key: '5000_10000', label: '¥5,000〜¥10,000 / 台・月', description: '3〜6ヶ月プラン相当' },
  { key: 'over_10000', label: '¥10,000〜 / 台・月', description: '短期・1ヶ月プラン相当' },
]

const PURCHASE_INTENTS: { key: PurchaseIntent; emoji: string; label: string; description: string }[] = [
  { key: 'trial', emoji: '🧪', label: 'まずトライアルから試したい', description: '14泊のお試しパックあり' },
  { key: 'considering', emoji: '🤔', label: '検討中・比較したい', description: '他社との比較・社内稟議中' },
  { key: 'immediate', emoji: '🚀', label: 'すぐに導入したい', description: '担当者と早めに話を進めたい' },
]

export function Step07Budget() {
  const router = useRouter()
  const { answers, updateAnswers, nextStep } = useWizardStore()

  function handleNext() {
    nextStep()
    router.push('/wizard?step=8')
  }

  const canProceed =
    answers.durationPreference !== null && answers.purchaseIntent !== null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">予算・ご利用期間について</h1>
        <p className="mt-1 text-slate-500 text-sm">希望に最も近いものを選んでください</p>
      </div>

      {/* 利用期間 */}
      <div className="space-y-3">
        <p className="font-semibold text-slate-700">希望する利用期間</p>
        <div className="grid grid-cols-2 gap-2">
          {DURATIONS.map((item) => (
            <ChoiceCard
              key={item.key}
              selected={answers.durationPreference === item.key}
              onClick={() => updateAnswers({ durationPreference: item.key })}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* 予算感 */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <p className="font-semibold text-slate-700">1台あたりの月額予算感（任意）</p>
        <div className="grid grid-cols-1 gap-2">
          {BUDGET_RANGES.map((item) => (
            <ChoiceCard
              key={item.key ?? ''}
              selected={answers.budgetRange === item.key}
              onClick={() => updateAnswers({ budgetRange: item.key })}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* 購入意向 */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <p className="font-semibold text-slate-700">導入の検討状況</p>
        <div className="grid grid-cols-1 gap-2">
          {PURCHASE_INTENTS.map((item) => (
            <ChoiceCard
              key={item.key ?? ''}
              selected={answers.purchaseIntent === item.key}
              onClick={() => updateAnswers({ purchaseIntent: item.key })}
              emoji={item.emoji}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
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
