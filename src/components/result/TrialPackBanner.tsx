import { TRIAL_PACKS } from '@/src/data/products'
import { formatPrice } from '@/src/lib/price-calculator'

interface TrialPackBannerProps {
  trialPackKey: string
}

export function TrialPackBanner({ trialPackKey }: TrialPackBannerProps) {
  const pack = TRIAL_PACKS.find((p) => p.key === trialPackKey)
  if (!pack) return null

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <span className="text-3xl">🧪</span>
        <div>
          <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full mb-1">
            トライアル推奨
          </div>
          <h3 className="font-bold text-slate-800">{pack.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5">{pack.description}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold text-purple-600">
              {formatPrice(pack.price)}
            </span>
            <span className="text-sm text-slate-500">/ {pack.durationNights}泊</span>
          </div>
          <ul className="mt-2 space-y-0.5">
            {pack.includes.map((item) => (
              <li key={item} className="text-sm text-slate-600 flex items-center gap-1.5">
                <span className="text-purple-400">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
