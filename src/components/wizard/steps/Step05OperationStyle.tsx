'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { OperationStyle } from '@/src/types/answers'
import {
  OPERATION_STYLE_META,
  recommendOperationStyles,
} from '@/src/lib/operation-style'
import { Button } from '@/src/components/ui/Button'

export function Step05OperationStyle() {
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

  const canProceed =
    answers.operationStyle !== null &&
    answers.locationCount >= 1 &&
    answers.staffPerLocation >= 1

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Step 5</p>
        <h1 className="text-xl font-semibold text-gray-800">運用スタイルを選んでください</h1>
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

                  {/* Expanded detail when selected */}
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
                min={1}
                max={9999}
                value={answers.locationCount}
                onChange={(e) =>
                  updateAnswers({ locationCount: Math.max(1, parseInt(e.target.value) || 1) })
                }
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
                min={1}
                max={9999}
                value={answers.staffPerLocation}
                onChange={(e) =>
                  updateAnswers({ staffPerLocation: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-400 shrink-0">人</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            現在の端末台数（合計）
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={99999}
              value={answers.currentDeviceCount}
              onChange={(e) =>
                updateAnswers({ currentDeviceCount: Math.max(0, parseInt(e.target.value) || 0) })
              }
              className="w-36 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-sm text-gray-400">台（スマホ・タブレット等。なければ 0）</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button size="lg" className="w-full" onClick={handleSubmit} disabled={!canProceed}>
          結果を見る →
        </Button>
      </div>
    </div>
  )
}
