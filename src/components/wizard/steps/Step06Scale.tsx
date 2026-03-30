'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { Button } from '@/src/components/ui/Button'

const DEVICE_COUNT_OPTIONS = [1, 3, 5, 10, 20, 50]
const LOCATION_COUNT_OPTIONS = [1, 2, 5, 10, 20, 50]

export function Step06Scale() {
  const router = useRouter()
  const { answers, updateAnswers, nextStep } = useWizardStore()

  function handleNext() {
    nextStep()
    router.push('/wizard?step=7')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">規模・台数を教えてください</h1>
        <p className="mt-1 text-slate-500 text-sm">概算で構いません</p>
      </div>

      {/* 端末台数 */}
      <div className="space-y-3">
        <p className="font-semibold text-slate-700">
          必要な端末台数
          <span className="ml-2 text-blue-600 font-bold">{answers.deviceCount}台</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DEVICE_COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => updateAnswers({ deviceCount: n })}
              className={`
                py-2.5 rounded-xl border-2 font-semibold text-sm transition-all
                ${
                  answers.deviceCount === n
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-blue-300'
                }
              `}
            >
              {n}台
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-500 shrink-0">台数を入力:</label>
          <input
            type="number"
            min={1}
            max={9999}
            value={answers.deviceCount}
            onChange={(e) =>
              updateAnswers({ deviceCount: Math.max(1, parseInt(e.target.value) || 1) })
            }
            className="w-24 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-sm text-slate-500">台</span>
        </div>
      </div>

      {/* 拠点数 */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <p className="font-semibold text-slate-700">
          拠点・店舗数
          <span className="ml-2 text-blue-600 font-bold">{answers.locationCount}拠点</span>
        </p>
        <div className="grid grid-cols-3 gap-2">
          {LOCATION_COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => updateAnswers({ locationCount: n })}
              className={`
                py-2.5 rounded-xl border-2 font-semibold text-sm transition-all
                ${
                  answers.locationCount === n
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-blue-300'
                }
              `}
            >
              {n}拠点
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-500 shrink-0">拠点数を入力:</label>
          <input
            type="number"
            min={1}
            max={9999}
            value={answers.locationCount}
            onChange={(e) =>
              updateAnswers({ locationCount: Math.max(1, parseInt(e.target.value) || 1) })
            }
            className="w-24 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-sm text-slate-500">拠点</span>
        </div>
      </div>

      {answers.deviceCount >= 10 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
          🎉 10台以上のご導入は<strong>ボリュームディスカウント</strong>のご相談が可能です。
        </div>
      )}

      <div className="pt-2">
        <Button size="lg" className="w-full" onClick={handleNext}>
          次へ →
        </Button>
      </div>
    </div>
  )
}
