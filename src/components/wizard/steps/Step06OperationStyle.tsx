'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { DeviceType, OperationStyle } from '@/src/types/answers'
import {
  OPERATION_STYLE_META,
  recommendOperationStyles,
} from '@/src/lib/operation-style'
import { Button } from '@/src/components/ui/Button'

const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  smartphone: 'スマートフォン',
  tablet: 'タブレット',
  pc: 'パソコン',
  large_monitor: '大型モニター',
}

export function Step06OperationStyle() {
  const router = useRouter()
  const { answers, updateAnswers, completeWizard } = useWizardStore()

  const recommended = recommendOperationStyles({
    useCases: answers.useCases,
    challenges: answers.challenges,
    isFranchise: answers.isFranchise,
    industry: answers.industry,
  })

  function handleSelect(key: OperationStyle) {
    updateAnswers({ operationStyle: key })
  }

  function handleSubmit() {
    completeWizard()
    router.push('/result')
  }

  function handleLocationCountChange(raw: string) {
    const n = parseInt(raw, 10)
    updateAnswers({ locationCount: isNaN(n) ? 0 : n })
  }

  function handleStaffChange(raw: string) {
    const n = parseInt(raw, 10)
    updateAnswers({ staffPerLocation: isNaN(n) ? 0 : n })
  }

  function handleStoreDeviceChange(deviceType: DeviceType, raw: string) {
    const n = parseInt(raw, 10)
    updateAnswers({
      currentDevicesByType: {
        ...answers.currentDevicesByType,
        [deviceType]: isNaN(n) ? 0 : n,
      },
    })
  }

  function handleHQDeviceChange(deviceType: DeviceType, raw: string) {
    const n = parseInt(raw, 10)
    updateAnswers({
      headquartersDevicesByType: {
        ...answers.headquartersDevicesByType,
        [deviceType]: isNaN(n) ? 0 : n,
      },
    })
  }

  const canProceed = answers.operationStyle !== null

  const selectedDeviceTypes = answers.deviceTypes

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Step 6</p>
        <h1 className="text-xl font-semibold text-gray-800">運用スタイルと現在の規模</h1>
        <p className="mt-1 text-sm text-gray-500">
          ヒアリング内容をもとに、おすすめのスタイルを上位に表示しています
        </p>
      </div>

      {/* Style options */}
      <div className="space-y-2">
        {recommended.map((key, i) => {
          const meta = OPERATION_STYLE_META[key]
          const isSelected = answers.operationStyle === key
          const isTop = i < 2

          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              className={`
                w-full text-left rounded-lg border px-4 py-3 transition-colors
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
                ${isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : isTop
                  ? 'border-blue-200 bg-white hover:bg-blue-50'
                  : 'border-gray-200 bg-white hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-base shrink-0 mt-0.5">{meta.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                      {meta.label}
                    </span>
                    {isTop && (
                      <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded">
                        おすすめ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{meta.description}</p>

                  {isSelected && (
                    <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t border-blue-100">
                      <div>
                        <p className="text-xs font-semibold text-green-600 mb-1">メリット</p>
                        <ul className="space-y-0.5">
                          {meta.pros.map((p) => (
                            <li key={p} className="text-xs text-gray-600 flex gap-1">
                              <span className="text-green-500 shrink-0">✓</span>{p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-amber-600 mb-1">注意点</p>
                        <ul className="space-y-0.5">
                          {meta.cons.map((c) => (
                            <li key={c} className="text-xs text-gray-600 flex gap-1">
                              <span className="text-amber-500 shrink-0">!</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                <div
                  className={`shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 ${
                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
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

      {/* Scale inputs */}
      <div className="space-y-4 pt-4 border-t border-gray-100">
        <p className="text-sm font-medium text-gray-700">現在の規模を入力してください</p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">拠点・店舗数</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={answers.locationCount || ''}
                onChange={(e) => handleLocationCountChange(e.target.value)}
                placeholder="例：10"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-400 shrink-0">拠点</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">拠点あたりスタッフ数</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={answers.staffPerLocation || ''}
                onChange={(e) => handleStaffChange(e.target.value)}
                placeholder="例：5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-400 shrink-0">人</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-device-type current counts */}
      {selectedDeviceTypes.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700">現在お持ちの端末台数</p>
          <p className="text-xs text-gray-400">
            端末の種類ごとに、本部・本社と店舗それぞれの台数を入力してください（未使用は0）
          </p>

          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] gap-3 text-xs font-medium text-gray-500 pb-1 border-b border-gray-100">
            <div>端末の種類</div>
            <div className="text-center">🏢 本部・本社</div>
            <div className="text-center">🏪 店舗（1拠点あたり）</div>
          </div>

          {selectedDeviceTypes.map((deviceType) => (
            <div key={deviceType} className="grid grid-cols-[1fr_1fr_1fr] gap-3 items-center">
              <div className="text-sm text-gray-700 font-medium">
                {DEVICE_TYPE_LABELS[deviceType]}
              </div>

              {/* HQ count */}
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={answers.headquartersDevicesByType[deviceType] ?? ''}
                  onChange={(e) => handleHQDeviceChange(deviceType, e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                />
                <span className="text-xs text-gray-400 shrink-0">台</span>
              </div>

              {/* Store count */}
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  value={answers.currentDevicesByType[deviceType] ?? ''}
                  onChange={(e) => handleStoreDeviceChange(deviceType, e.target.value)}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-center"
                />
                <span className="text-xs text-gray-400 shrink-0">台</span>
              </div>
            </div>
          ))}

          {/* Summary */}
          {(Object.keys(answers.currentDevicesByType).length > 0 || Object.keys(answers.headquartersDevicesByType).length > 0) && (
            <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 border border-gray-100">
              <div className="flex gap-6">
                <span>
                  本部合計:{' '}
                  <span className="font-semibold text-gray-700">
                    {Object.values(answers.headquartersDevicesByType).reduce((s, n) => s + (n ?? 0), 0)}台
                  </span>
                </span>
                <span>
                  店舗合計（全拠点）:{' '}
                  <span className="font-semibold text-gray-700">
                    {Object.values(answers.currentDevicesByType).reduce((s, n) => s + (n ?? 0), 0) * answers.locationCount}台
                    <span className="text-gray-400 font-normal ml-1">
                      （{Object.values(answers.currentDevicesByType).reduce((s, n) => s + (n ?? 0), 0)}台/拠点 × {answers.locationCount}拠点）
                    </span>
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="pt-2">
        <Button size="lg" className="w-full" onClick={handleSubmit} disabled={!canProceed}>
          結果を見る →
        </Button>
      </div>
    </div>
  )
}
