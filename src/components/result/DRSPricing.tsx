import { formatPrice } from '@/src/lib/price-calculator'
import { PRODUCTS, INITIAL_COST_PER_UNIT } from '@/src/data/products'

interface DRSPricingProps {
  additionalDevices: number
}

const PLANS = [
  { months: 1,  label: '1ヶ月',  tag: 'お試し' },
  { months: 6,  label: '6ヶ月',  tag: '' },
  { months: 12, label: '12ヶ月', tag: '所有権移転オプションあり' },
  { months: 36, label: '36ヶ月', tag: 'もっともお得' },
] as const

export function DRSPricing({ additionalDevices }: DRSPricingProps) {
  if (additionalDevices <= 0) return null

  const wifiProduct = PRODUCTS['mobile_wifi']
  const cellularProduct = PRODUCTS['mobile_cellular']
  const initCost = INITIAL_COST_PER_UNIT * additionalDevices

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          追加 <span className="font-semibold text-gray-800">{additionalDevices}台</span> のレンタル月額
        </p>
        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded">
          初期費用（キッティング）{formatPrice(initCost)}（税別）
        </span>
      </div>

      {/* Price table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">プラン</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                📶 Wi-Fiモデル
                <span className="block text-gray-400 normal-case font-normal">Wi-Fi環境あり</span>
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                📡 セルラーモデル
                <span className="block text-gray-400 normal-case font-normal">SIM付き・どこでも使える</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PLANS.map(({ months, label, tag }) => {
              const wifiUnit = wifiProduct.priceTable[months]
              const cellUnit = cellularProduct.priceTable[months]
              return (
                <tr key={months} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-700">{label}</span>
                    {tag && (
                      <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                        {tag}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-gray-800">
                      {formatPrice(wifiUnit * additionalDevices)}
                    </span>
                    <span className="text-xs text-gray-400">/月</span>
                    <div className="text-xs text-gray-400">{formatPrice(wifiUnit)}/台・月</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-gray-800">
                      {formatPrice(cellUnit * additionalDevices)}
                    </span>
                    <span className="text-xs text-gray-400">/月</span>
                    <div className="text-xs text-gray-400">{formatPrice(cellUnit)}/台・月</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Model guide */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">📶 Wi-Fiモデルが向いている場合</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>全店舗にWi-Fi環境が整っている</li>
            <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>コストを抑えたい</li>
            <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>固定の場所で使うことが多い</li>
          </ul>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">📡 セルラーモデルが向いている場合</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>Wi-Fi環境がない・不安定な拠点がある</li>
            <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>複数店舗を同一環境で統一したい</li>
            <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>FC・多拠点展開で標準化が必要</li>
          </ul>
        </div>
      </div>

      {/* TCO note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-600">
        <span className="font-semibold text-gray-700">TCOで考えると端末コストは約31.9%</span>　—
        残り68.1%は管理・教育・業務コスト。DRSはMDM管理・サポート・代替機対応をすべて込みにすることで、隠れたコストを大幅に削減します。
      </div>
    </div>
  )
}
