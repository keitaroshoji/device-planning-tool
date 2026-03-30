'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { Challenge } from '@/src/types/answers'
import { ChoiceCard } from '@/src/components/ui/ChoiceCard'
import { Button } from '@/src/components/ui/Button'

const CHALLENGES: { key: Challenge; emoji: string; label: string; description: string }[] = [
  { key: 'manual_creation', emoji: '📝', label: 'マニュアル・手順書の整備', description: '紙マニュアルが多い、更新が大変' },
  { key: 'staff_training', emoji: '👥', label: 'スタッフ教育・研修の効率化', description: '新人教育に時間がかかる、OJTが属人的' },
  { key: 'quality_standardization', emoji: '🎯', label: '品質・サービスの標準化', description: '店舗・担当者によってばらつきがある' },
  { key: 'cost_reduction', emoji: '💰', label: 'コスト削減', description: '端末・通信・管理コストを下げたい' },
  { key: 'remote_management', emoji: '🌐', label: '遠隔管理・モニタリング', description: '複数拠点を本部から管理したい' },
  { key: 'security', emoji: '🔒', label: 'セキュリティ強化', description: '端末紛失リスク、情報漏えい対策' },
  { key: 'multi_store', emoji: '🏪', label: '多店舗・多拠点展開', description: '横展開・スケールアップをしたい' },
]

export function Step02Challenges() {
  const router = useRouter()
  const { answers, updateAnswers, nextStep } = useWizardStore()

  function toggle(key: Challenge) {
    const current = answers.challenges
    if (current.includes(key)) {
      updateAnswers({ challenges: current.filter((c) => c !== key) })
    } else {
      updateAnswers({ challenges: [...current, key] })
    }
  }

  function handleNext() {
    nextStep()
    router.push('/wizard?step=3')
  }

  const canProceed = answers.challenges.length > 0

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Step 2</p>
        <h1 className="text-xl font-semibold text-gray-800">業務の課題を選んでください</h1>
        <p className="mt-1 text-sm text-gray-500">当てはまるものをすべて選択（複数選択可）</p>
      </div>

      <div className="space-y-2">
        {CHALLENGES.map((item) => (
          <ChoiceCard
            key={item.key}
            selected={answers.challenges.includes(item.key)}
            onClick={() => toggle(item.key)}
            emoji={item.emoji}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>

      {canProceed && (
        <p className="text-xs text-blue-600">{answers.challenges.length}件選択中</p>
      )}

      <div className="pt-2">
        <Button size="lg" className="w-full" onClick={handleNext} disabled={!canProceed}>
          次へ
        </Button>
      </div>
    </div>
  )
}
