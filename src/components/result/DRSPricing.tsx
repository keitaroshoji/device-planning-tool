import { formatPrice } from '@/src/lib/price-calculator'
import { PRODUCTS, INITIAL_COST_PER_UNIT } from '@/src/data/products'

interface DRSPricingProps {
  additionalDevices: number
}

const PLANS = [
  { months: 1, label: '1ヶ月', tag: 'お試し' },
  { months: 6, label: '6ヶ月', tag: '' },
  { months: 12, label: '12ヶ月', tag: '所有権移転オプションあり' },
  { months: 36, label: '36ヶ月', tag: 'もっともお得' },
] as const

export function DRSPricing({ additionalDevices }: DRSPricingProps) {
  if (additionalDevices <= 0) return null

  const wifiProduct = PRODUCTS['mobile_wifi']
  const cellularProduct = PRODUCTS['mobile_cellular']
  const initCost = INITIAL_COST_PER_UNIT * additionalDevices

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-lg">
          追加 <span className="text-blue-600">{additionalDevices}台</span> のレンタル料金
        </h3>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          初期費用（キッティング） {formatPrice(initCost)}（税別）
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">プラン</th>
              <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                📶 Wi-Fiモデル<br />
                <span className="font-normal text-slate-400 normal-case">（Wi-Fi環境あり）</span>
              </th>
              <th className="text-right px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide">
                📡 セルラーモデル<br />
                <span className="font-normal text-slate-400 normal-case">（SIM付き・どこでも使える）</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {PLANS.map(({ months, label, tag }) => {
              const wifiUnit = wifiProduct.priceTable[months]
              const cellUnit = cellularProduct.priceTable[months]
              return (
                <tr key={months} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-700">{label}</span>
                    {tag && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                        {tag}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-slate-800">
                      {formatPrice(wifiUnit * additionalDevices)}<span className="text-xs font-normal text-slate-400">/月</span>
                    </div>
                    <div className="text-xs text-slate-400">{formatPrice(wifiUnit)}/台・月</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-bold text-slate-800">
                      {formatPrice(cellUnit * additionalDevices)}<span className="text-xs font-normal text-slate-400">/月</span>
                    </div>
                    <div className="text-xs text-slate-400">{formatPrice(cellUnit)}/台・月</div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm">
          <div className="font-semibold text-blue-700 mb-1">📶 Wi-Fiモデルが向いている場合</div>
          <ul className="text-xs text-blue-600 space-y-0.5">
            <li>✓ 全店舗にWi-Fi環境が整っている</li>
            <li>✓ コストを抑えたい</li>
            <li>✓ 固定の場所で使うことが多い</li>
          </ul>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-sm">
          <div className="font-semibold text-indigo-700 mb-1">📡 セルラーモデルが向いている場合</div>
          <ul className="text-xs text-indigo-600 space-y-0.5">
            <li>✓ Wi-Fi環境がない・不安定な拠点がある</li>
            <li>✓ 複数店舗を同一環境で統一したい</li>
            <li>✓ FC・多拠点展開で標準化が必要</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
        <span className="text-2xl shrink-0">💡</span>
        <div>
          <p className="font-semibold text-green-800 text-sm">TCOで考えると端末コストは3割</p>
          <p className="text-xs text-green-700 mt-0.5">
            端末費用はデジタル化の総コストの約31.9%。残り68.1%は管理・教育・業務コストです。
            DRSはMDM管理・サポート・代替機対応をすべて込みにすることで、隠れたコストを大幅に削減します。
          </p>
        </div>
      </div>
    </div>
  )
}
