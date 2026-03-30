'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { CurrentDevice, NetworkEnvironment, MdmStatus } from '@/src/types/answers'
import { ChoiceCard } from '@/src/components/ui/ChoiceCard'
import { Button } from '@/src/components/ui/Button'

const CURRENT_DEVICES: { key: CurrentDevice; emoji: string; label: string; description: string }[] = [
  { key: 'company_smartphone', emoji: '📱', label: '会社支給スマートフォン', description: '法人契約の携帯電話' },
  { key: 'company_tablet', emoji: '📟', label: '会社支給タブレット', description: 'iPadなど法人タブレット' },
  { key: 'personal_smartphone', emoji: '👤', label: 'スタッフの個人スマホ（BYOD）', description: '私用端末を業務利用' },
  { key: 'pc_only', emoji: '💻', label: 'PCのみ', description: 'モバイル端末は現状なし' },
  { key: 'no_device', emoji: '❌', label: '端末なし', description: '現場での端末利用なし' },
]

const NETWORK_OPTIONS: { key: NetworkEnvironment; emoji: string; label: string; description: string }[] = [
  { key: 'has_wifi', emoji: '📶', label: 'Wi-Fiあり', description: '全拠点にWi-Fi環境が整っている' },
  { key: 'no_wifi', emoji: '📵', label: 'Wi-Fiなし', description: 'Wi-Fi環境が整っていない' },
  { key: 'mixed', emoji: '🔀', label: '拠点によって異なる', description: 'Wi-Fiがある場所とない場所が混在' },
]

const MDM_OPTIONS: { key: MdmStatus; emoji: string; label: string; description: string }[] = [
  { key: 'has_mdm', emoji: '✅', label: 'すでにMDMを導入済み', description: 'EMM/MDM製品を既に利用中' },
  { key: 'no_mdm', emoji: '❌', label: 'MDMは導入していない', description: '端末の一元管理はしていない' },
  { key: 'unknown', emoji: '❓', label: 'わからない', description: 'MDMについて詳しくない' },
]

export function Step05DeviceEnv() {
  const router = useRouter()
  const { answers, updateAnswers, nextStep } = useWizardStore()

  function toggleDevice(key: CurrentDevice) {
    const current = answers.currentDevices
    if (current.includes(key)) {
      updateAnswers({ currentDevices: current.filter((d) => d !== key) })
    } else {
      updateAnswers({ currentDevices: [...current, key] })
    }
  }

  function handleNext() {
    nextStep()
    router.push('/wizard?step=6')
  }

  const canProceed =
    answers.currentDevices.length > 0 &&
    answers.networkEnvironment !== null &&
    answers.mdmStatus !== null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">現在の端末・通信環境は？</h1>
        <p className="mt-1 text-slate-500 text-sm">現状を教えていただくと最適なプランを提案できます</p>
      </div>

      {/* 現在の端末 */}
      <div className="space-y-3">
        <p className="font-semibold text-slate-700">現在利用している端末（複数選択可）</p>
        <div className="grid grid-cols-1 gap-2">
          {CURRENT_DEVICES.map((item) => (
            <ChoiceCard
              key={item.key}
              selected={answers.currentDevices.includes(item.key)}
              onClick={() => toggleDevice(item.key)}
              emoji={item.emoji}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* Wi-Fi環境 */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <p className="font-semibold text-slate-700">Wi-Fi環境はありますか？</p>
        <div className="grid grid-cols-1 gap-2">
          {NETWORK_OPTIONS.map((item) => (
            <ChoiceCard
              key={item.key ?? ''}
              selected={answers.networkEnvironment === item.key}
              onClick={() => updateAnswers({ networkEnvironment: item.key })}
              emoji={item.emoji}
              label={item.label}
              description={item.description}
            />
          ))}
        </div>
      </div>

      {/* MDM */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <p className="font-semibold text-slate-700">MDM（端末遠隔管理）は導入済みですか？</p>
        <div className="grid grid-cols-1 gap-2">
          {MDM_OPTIONS.map((item) => (
            <ChoiceCard
              key={item.key ?? ''}
              selected={answers.mdmStatus === item.key}
              onClick={() => updateAnswers({ mdmStatus: item.key })}
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
