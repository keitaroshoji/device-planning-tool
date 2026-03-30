'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { DeviceType, EnvironmentCondition } from '@/src/types/answers'
import { ChoiceCard } from '@/src/components/ui/ChoiceCard'
import { Button } from '@/src/components/ui/Button'

const DEVICE_TYPES: {
  key: DeviceType
  emoji: string
  label: string
  description: string
  productHint: string
}[] = [
  {
    key: 'smartphone',
    emoji: '📱',
    label: 'スマートフォン',
    description: 'iPhoneなど。現場での作業確認・連絡・撮影に最適',
    productHint: 'モバイル端末セット（Wi-Fi / セルラー）',
  },
  {
    key: 'tablet',
    emoji: '📟',
    label: 'タブレット',
    description: 'iPadなど。大きな画面でマニュアル閲覧・顧客対応に適している',
    productHint: 'モバイル端末セット（Wi-Fi / セルラー）',
  },
  {
    key: 'large_monitor',
    emoji: '🖥️',
    label: '大型モニター',
    description: '32型など大型ディスプレイ。店頭・休憩室・バックヤードへの情報掲示に',
    productHint: 'スマートモニター（Android 13搭載）',
  },
  {
    key: 'pc',
    emoji: '💻',
    label: 'パソコン',
    description: '管理業務・コンテンツ作成など。現場よりもバックオフィスでの活用に',
    productHint: '※ PCは個別見積もりが必要です',
  },
]

const ENVIRONMENT_CONDITIONS: {
  key: EnvironmentCondition
  emoji: string
  label: string
  description: string
  severity: 'high' | 'medium' | 'low'
}[] = [
  {
    key: 'normal',
    emoji: '🏢',
    label: '通常環境（特別な条件なし）',
    description: '一般的なオフィス・店舗・教室など',
    severity: 'low',
  },
  {
    key: 'water',
    emoji: '💧',
    label: '水・湿気への配慮が必要',
    description: '厨房・調理場・屋外・雨天下での使用。防水・防滴対応が必要',
    severity: 'high',
  },
  {
    key: 'dust',
    emoji: '🌫️',
    label: '粉塵・汚れへの配慮が必要',
    description: '製造ライン・建設現場・農業など。防塵ケースやIP規格への対応が必要',
    severity: 'high',
  },
  {
    key: 'hygiene',
    emoji: '🧴',
    label: '衛生管理が必要',
    description: '医療・介護・食品調理など。定期的なアルコール消毒や抗菌コーティングが必要',
    severity: 'high',
  },
  {
    key: 'food_grade',
    emoji: '🏭',
    label: '食品工場規格への準拠が必要',
    description: 'HACCP・ISO 22000等の規格対応。食品異物混入リスクの管理が必要',
    severity: 'high',
  },
  {
    key: 'outdoor',
    emoji: '☀️',
    label: '屋外・直射日光下での使用',
    description: '屋外作業・配送など。画面の視認性・耐熱性への配慮が必要',
    severity: 'medium',
  },
  {
    key: 'cold',
    emoji: '🧊',
    label: '低温環境での使用',
    description: '冷凍・冷蔵倉庫、寒冷地など。低温でのバッテリー性能・動作保証が必要',
    severity: 'medium',
  },
]

export function Step04DeviceEnv() {
  const router = useRouter()
  const { answers, updateAnswers, nextStep } = useWizardStore()

  function toggleDeviceType(key: DeviceType) {
    const current = answers.deviceTypes ?? []
    if (current.includes(key)) {
      updateAnswers({ deviceTypes: current.filter((d) => d !== key) })
    } else {
      updateAnswers({ deviceTypes: [...current, key] })
    }
  }

  function toggleEnv(key: EnvironmentCondition) {
    const current = answers.environmentConditions ?? []
    if (key === 'normal') {
      // 「通常環境」を選ぶと他をクリア
      updateAnswers({ environmentConditions: ['normal'] })
      return
    }
    const withoutNormal = current.filter((e) => e !== 'normal')
    if (withoutNormal.includes(key)) {
      updateAnswers({ environmentConditions: withoutNormal.filter((e) => e !== key) })
    } else {
      updateAnswers({ environmentConditions: [...withoutNormal, key] })
    }
  }

  function handleNext() {
    nextStep()
    router.push('/wizard?step=5')
  }

  const deviceTypes = answers.deviceTypes ?? []
  const environmentConditions = answers.environmentConditions ?? []

  const canProceed =
    deviceTypes.length > 0 &&
    environmentConditions.length > 0

  const hasSpecialEnv = environmentConditions.some((e) => e !== 'normal')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Step 4</p>
        <h1 className="text-xl font-semibold text-gray-800">端末の種類と利用環境</h1>
        <p className="mt-1 text-sm text-gray-500">
          使用したい端末の種類と、設置・運用環境を教えてください
        </p>
      </div>

      {/* Device type */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">運用する端末の種類（複数選択可）</p>
        <div className="space-y-2">
          {DEVICE_TYPES.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleDeviceType(item.key)}
              className={`w-full text-left rounded-lg border px-4 py-3 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                ${deviceTypes.includes(item.key)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${deviceTypes.includes(item.key) ? 'text-blue-700' : 'text-gray-800'}`}>
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  <p className={`text-xs mt-1 font-medium ${
                    item.key === 'pc' ? 'text-amber-600' : 'text-blue-500'
                  }`}>
                    → {item.productHint}
                  </p>
                </div>
                <div
                  className={`shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 ${
                    deviceTypes.includes(item.key) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                >
                  {deviceTypes.includes(item.key) && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 12 12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Environment conditions */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700">利用環境・付帯条件（複数選択可）</p>
        <p className="text-xs text-gray-400">
          特殊な環境条件がある場合は選択してください。端末の選定や運用提案に反映します。
        </p>
        <div className="space-y-2">
          {ENVIRONMENT_CONDITIONS.map((item) => {
            const selected = environmentConditions.includes(item.key)
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleEnv(item.key)}
                className={`w-full text-left rounded-lg border px-4 py-3 transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                  ${selected
                    ? item.key === 'normal'
                      ? 'border-gray-400 bg-gray-50'
                      : 'border-amber-400 bg-amber-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium text-sm ${
                        selected
                          ? item.key === 'normal' ? 'text-gray-700' : 'text-amber-800'
                          : 'text-gray-800'
                      }`}>
                        {item.label}
                      </p>
                      {item.severity === 'high' && item.key !== 'normal' && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                          要確認
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                  </div>
                  <div
                    className={`shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 ${
                      selected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {selected && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 12 12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Special env warning */}
      {hasSpecialEnv && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-700">
          <p className="font-semibold mb-1">⚠ 特殊環境が検出されました</p>
          <p className="text-xs text-amber-600">
            選択された環境条件に対応した端末・ケース・付属品の選定が必要になる場合があります。
            診断結果ページで詳細な対応方針をご確認ください。担当者が個別にご案内します。
          </p>
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
