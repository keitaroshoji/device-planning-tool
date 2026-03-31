'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { UseCase, ShootingEnvironment, ShootingViewpoint } from '@/src/types/answers'
import { ChoiceCard } from '@/src/components/ui/ChoiceCard'
import { Button } from '@/src/components/ui/Button'

const USE_CASES: { key: UseCase; emoji: string; label: string; description: string }[] = [
  { key: 'manual_viewing', emoji: '📖', label: 'マニュアル・手順書の閲覧', description: '現場でスマホやタブレットからマニュアルを確認' },
  { key: 'video_shooting', emoji: '🎬', label: '動画マニュアルの撮影', description: '作業工程を動画で記録してマニュアル化' },
  { key: 'pos_register', emoji: '🖥️', label: 'POS・レジ・業務アプリ', description: '受発注、在庫管理、シフト管理など' },
  { key: 'customer_display', emoji: '📺', label: '顧客向けメニュー・情報表示', description: 'お客様への商品・メニュー案内に大型モニター' },
  { key: 'team_communication', emoji: '💬', label: 'チームコミュニケーション', description: 'スタッフ間の連絡・情報共有' },
]

const SHOOTING_ENVS: { key: ShootingEnvironment; label: string; description: string }[] = [
  { key: 'quiet', label: '静かな環境（60dB以下）', description: 'オフィス、バックヤードなど' },
  { key: 'noisy', label: '騒音がある環境（60dB以上）', description: 'キッチン、工場ライン、街中など' },
]

const SHOOTING_VIEWPOINTS: { key: ShootingViewpoint; label: string; description: string }[] = [
  { key: 'pov', label: '一人称視点（作業者目線）', description: '手元の作業工程を撮影' },
  { key: 'third_person', label: '三人称視点（全体像）', description: '離れた場所から全体を撮影' },
  { key: 'both', label: '両方使いたい', description: '場面によって使い分け' },
]

export function Step03UseCases() {
  const router = useRouter()
  const { answers, updateAnswers, nextStep } = useWizardStore()

  const hasVideoShooting = answers.useCases.includes('video_shooting')

  function toggleUseCase(key: UseCase) {
    const current = answers.useCases
    if (current.includes(key)) {
      const next = current.filter((u) => u !== key)
      const patch: Partial<typeof answers> = { useCases: next }
      if (key === 'video_shooting') {
        patch.shootingEnvironment = null
        patch.shootingViewpoint = null
        patch.cameraCount = 1
      }
      updateAnswers(patch)
    } else {
      updateAnswers({ useCases: [...current, key] })
    }
  }

  function handleCameraCount(delta: number) {
    const next = Math.min(20, Math.max(1, (answers.cameraCount ?? 1) + delta))
    updateAnswers({ cameraCount: next })
  }

  function handleNext() {
    nextStep()
    router.push('/wizard?step=4')
  }

  const canProceed =
    answers.useCases.length > 0 &&
    (!hasVideoShooting ||
      (answers.shootingEnvironment !== null &&
        answers.shootingViewpoint !== null &&
        (answers.cameraCount ?? 1) >= 1))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Step 3</p>
        <h1 className="text-xl font-semibold text-gray-800">活用シーンを選んでください</h1>
        <p className="mt-1 text-sm text-gray-500">端末・機材の利用目的（複数選択可）</p>
      </div>

      <div className="space-y-2">
        {USE_CASES.map((item) => (
          <ChoiceCard
            key={item.key}
            selected={answers.useCases.includes(item.key)}
            onClick={() => toggleUseCase(item.key)}
            emoji={item.emoji}
            label={item.label}
            description={item.description}
          />
        ))}
      </div>

      {/* Sub-questions for video shooting */}
      {hasVideoShooting && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">撮影環境の騒音レベルは？</p>
            <div className="space-y-2">
              {SHOOTING_ENVS.map((item) => (
                <ChoiceCard
                  key={item.key ?? ''}
                  selected={answers.shootingEnvironment === item.key}
                  onClick={() => updateAnswers({ shootingEnvironment: item.key })}
                  label={item.label}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">どの視点で撮影しますか？</p>
            <div className="space-y-2">
              {SHOOTING_VIEWPOINTS.map((item) => (
                <ChoiceCard
                  key={item.key ?? ''}
                  selected={answers.shootingViewpoint === item.key}
                  onClick={() => updateAnswers({ shootingViewpoint: item.key })}
                  label={item.label}
                  description={item.description}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">カメラセットは合計何台必要ですか？</p>
              <p className="text-xs text-gray-400 mt-0.5">全拠点合計の撮影用台数（閲覧用端末とは別にカウント）</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleCameraCount(-1)}
                disabled={(answers.cameraCount ?? 1) <= 1}
                className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-600 text-lg font-bold flex items-center justify-center hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                −
              </button>
              <div className="text-center min-w-[60px]">
                <span className="text-3xl font-bold text-blue-600 tabular-nums">
                  {answers.cameraCount ?? 1}
                </span>
                <span className="text-sm text-gray-500 ml-1">台</span>
              </div>
              <button
                type="button"
                onClick={() => handleCameraCount(1)}
                disabled={(answers.cameraCount ?? 1) >= 20}
                className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-600 text-lg font-bold flex items-center justify-center hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ＋
              </button>
              <span className="text-xs text-gray-400">（最大20台）</span>
            </div>
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
