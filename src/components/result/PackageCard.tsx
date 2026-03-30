import { ProductKey } from '@/src/types/products'
import { PRODUCTS } from '@/src/data/products'
import { formatPrice } from '@/src/lib/price-calculator'

interface PackageCardProps {
  primaryKey: ProductKey
  additionalKeys: ProductKey[]
  months: number
  deviceCount: number
  isMain?: boolean
}

export function PackageCard({
  primaryKey,
  additionalKeys,
  months,
  deviceCount,
  isMain = false,
}: PackageCardProps) {
  const primary = PRODUCTS[primaryKey]
  if (!primary) return null

  const unitPrice = primary.priceTable[months] ?? Object.values(primary.priceTable)[0]

  return (
    <div
      className={`rounded-2xl border-2 p-5 ${
        isMain
          ? 'border-blue-500 bg-blue-50 shadow-lg'
          : 'border-slate-200 bg-white'
      }`}
    >
      {isMain && (
        <div className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
          ★ おすすめプラン
        </div>
      )}

      <div className="flex items-start gap-3">
        <span className="text-3xl">{primary.imageEmoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-800 text-base leading-snug">
            {primary.name}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">{primary.description}</p>
        </div>
      </div>

      {/* Price */}
      {unitPrice !== undefined && (
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(unitPrice)}
          </span>
          <span className="text-sm text-slate-500">/ 台・月（税別）</span>
        </div>
      )}

      {/* Features */}
      <ul className="mt-3 space-y-1">
        {primary.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="text-green-500 mt-0.5 shrink-0">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* Additional products */}
      {additionalKeys.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            セット追加オプション
          </p>
          {additionalKeys.map((key) => {
            const prod = PRODUCTS[key]
            if (!prod) return null
            const addPrice = prod.priceTable[months] ?? Object.values(prod.priceTable)[0]
            return (
              <div key={key} className="flex items-center gap-2 text-sm text-slate-700 mb-1">
                <span>{prod.imageEmoji}</span>
                <span className="flex-1">{prod.name}</span>
                {addPrice !== undefined && (
                  <span className="font-semibold">{formatPrice(addPrice)}/月</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
