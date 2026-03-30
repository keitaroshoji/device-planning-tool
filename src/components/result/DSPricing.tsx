'use client'

import { useSettingsStore } from '@/src/store/settingsStore'
import { EnvironmentCondition } from '@/src/types/answers'

interface DSPricingProps {
  additionalDevices: number
  environmentConditions?: EnvironmentCondition[]
}

const PLANS = [
  { months: 1,  label: '1ヶ月',  tag: 'お試し' },
  { months: 6,  label: '6ヶ月',  tag: '' },
  { months: 12, label: '12ヶ月', tag: '所有権移転オプションあり' },
  { months: 36, label: '36ヶ月', tag: 'もっともお得' },
] as const

const ENV_ADDITIONAL_COSTS: Partial<Record<EnvironmentCondition, { label: string; items: string[] }>> = {
  water: {
    label: '💧 水・湿気対応',
    items: ['防水・防滴ケース', '結露対策カバー', 'IP規格対応アクセサリー'],
  },
  dust: {
    label: '🌫️ 粉塵・汚れ対応',
    items: ['防塵カバー・ケース', 'IP規格対応ホルダー', '清掃用品セット'],
  },
  hygiene: {
    label: '🧴 衛生管理対応',
    items: ['抗菌フィルム・ケース', 'アルコール消毒対応素材', '使い捨て保護カバー'],
  },
  food_grade: {
    label: '🏭 食品工場規格対応',
    items: ['食品工場規格対応ケース', '異物混入対策（カラー管理・金属探知対応）', 'HACCP対応アクセサリー'],
  },
  outdoor: {
    label: '☀️ 屋外・直射日光対応',
    items: ['反射低減フィルム・日差し対応保護フィルム', '耐候性ケース・ホルダー', '熱対策（断熱カバー等）'],
  },
  cold: {
    label: '🧊 低温環境対応',
    items: ['断熱ケース', 'バッテリー保温対策グッズ', '低温対応手袋での操作支援（手袋対応フィルム等）'],
  },
}

function fmt(n: number) {
  return `¥${n.toLocaleString('ja-JP')}`
}

export function DSPricing({ additionalDevices, environmentConditions = [] }: DSPricingProps) {
  const { productSettings } = useSettingsStore()

  const specialEnvConditions = environmentConditions.filter(
    (e) => e !== 'normal' && e in ENV_ADDITIONAL_COSTS
  ) as Exclude<EnvironmentCondition, 'normal'>[]
  const hasSpecialEnv = specialEnvConditions.length > 0

  const wifiSetting     = productSettings['mobile_wifi']
  const cellularSetting = productSettings['mobile_cellular']
  const showWifi        = wifiSetting?.enabled !== false
  const showCellular    = cellularSetting?.enabled !== false
  const hasPriceTable   = (showWifi || showCellular) && additionalDevices > 0

  if (!hasPriceTable && !hasSpecialEnv) return null

  const initCost = (() => {
    if (wifiSetting?.hasInitialCost) return wifiSetting.initialCost
    if (cellularSetting?.hasInitialCost) return cellularSetting.initialCost
    return 0
  })()

  return (
    <div className="space-y-6">

      {/* ===== BASE ESTIMATE ===== */}
      {hasPriceTable ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">① 基本見積（端末レンタル料）</p>
              <p className="text-xs text-gray-400 mt-0.5">
                追加 <span className="font-semibold text-gray-600">{additionalDevices}台</span> のレンタル月額概算
              </p>
            </div>
            {initCost > 0 && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded">
                初期費用（キッティング）{fmt(initCost * additionalDevices)}（税別）
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    プラン
                  </th>
                  {showWifi && (
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      📶 {wifiSetting.name}
                      <span className="block text-gray-400 normal-case font-normal">Wi-Fi環境あり</span>
                    </th>
                  )}
                  {showCellular && (
                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      📡 {cellularSetting.name}
                      <span className="block text-gray-400 normal-case font-normal">SIM付き・どこでも使える</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {PLANS.map(({ months, label, tag }) => {
                  const wifiUnit = wifiSetting?.priceTable[months]
                  const cellUnit = cellularSetting?.priceTable[months]
                  if (!wifiUnit && !cellUnit) return null
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
                      {showWifi && (
                        <td className="px-4 py-3 text-right">
                          {wifiUnit !== undefined ? (
                            <>
                              <span className="font-semibold text-gray-800">{fmt(wifiUnit * additionalDevices)}</span>
                              <span className="text-xs text-gray-400">/月</span>
                              <div className="text-xs text-gray-400">{fmt(wifiUnit)}/台・月</div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      )}
                      {showCellular && (
                        <td className="px-4 py-3 text-right">
                          {cellUnit !== undefined ? (
                            <>
                              <span className="font-semibold text-gray-800">{fmt(cellUnit * additionalDevices)}</span>
                              <span className="text-xs text-gray-400">/月</span>
                              <div className="text-xs text-gray-400">{fmt(cellUnit)}/台・月</div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-300">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Model guide */}
          <div className="grid grid-cols-2 gap-3">
            {showWifi && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  📶 {wifiSetting.name}が向いている場合
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>全店舗にWi-Fi環境が整っている</li>
                  <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>コストを抑えたい</li>
                  <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>固定の場所で使うことが多い</li>
                </ul>
              </div>
            )}
            {showCellular && (
              <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">
                  📡 {cellularSetting.name}が向いている場合
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>Wi-Fi環境がない・不安定な拠点がある</li>
                  <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>複数店舗を同一環境で統一したい</li>
                  <li className="flex gap-1.5"><span className="text-green-500 shrink-0">✓</span>FC・多拠点展開で標準化が必要</li>
                </ul>
              </div>
            )}
          </div>

          {/* TCO note */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs text-gray-600">
            <span className="font-semibold text-gray-700">TCOで考えると端末コストは約31.9%</span>　—
            残り68.1%は管理・教育・業務コスト。MDM管理・サポート・代替機対応をすべて込みにすることで、隠れたコストを大幅に削減します。
          </div>
        </div>
      ) : (
        /* additionalDevices = 0 だが special env あり */
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
          <p className="font-semibold mb-0.5">① 基本見積（端末レンタル料）</p>
          <p className="text-xs text-green-600">現在の端末台数は必要台数を満たしているため、追加レンタルは不要です。</p>
        </div>
      )}

      {/* ===== SPECIAL ENV ADDITIONAL COSTS ===== */}
      {hasSpecialEnv && (
        <div className="border border-amber-300 rounded-xl overflow-hidden">
          <div className="bg-amber-50 px-5 py-3 border-b border-amber-200 flex items-center gap-2">
            <span className="text-amber-600 text-base">⚠</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">② 特殊環境対応 追加費用（別途見積）</p>
              <p className="text-xs text-amber-600 mt-0.5">
                端末台数は①の基本見積から変わりません。環境条件への対応にカバー・アクセサリー等の追加投資が必要です。
              </p>
            </div>
          </div>
          <div className="bg-white px-5 py-4 space-y-4">
            {specialEnvConditions.map((envKey) => {
              const info = ENV_ADDITIONAL_COSTS[envKey]
              if (!info) return null
              return (
                <div key={envKey} className="flex gap-3">
                  <div className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{info.label}</p>
                    <ul className="mt-1 space-y-0.5">
                      {info.items.map((item) => (
                        <li key={item} className="text-xs text-gray-500 flex gap-1.5">
                          <span className="text-amber-400 shrink-0">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
            <div className="pt-3 border-t border-amber-100 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2.5">
              <span className="shrink-0 font-bold">※</span>
              <p>
                上記アクセサリー・対応部材の費用は基本見積（①）には含まれません。
                利用環境・台数・規格要件をもとに<strong>担当者が個別にお見積り</strong>いたします。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
