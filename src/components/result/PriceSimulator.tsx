'use client'

import { useState } from 'react'
import { ProductKey, RentalDuration } from '@/src/types/products'
import { calcTotalPrice, formatPrice } from '@/src/lib/price-calculator'
import { PRODUCTS } from '@/src/data/products'

interface PriceSimulatorProps {
  primaryKey: ProductKey
  additionalKeys: ProductKey[]
  initialDeviceCount: number
  initialMonths: RentalDuration
}

const DURATION_OPTIONS: RentalDuration[] = [1, 3, 6, 12, 24, 36]
const DURATION_LABELS: Record<number, string> = {
  1: '1ヶ月',
  3: '3ヶ月',
  6: '6ヶ月',
  12: '12ヶ月',
  24: '24ヶ月',
  36: '36ヶ月',
}

export function PriceSimulator({
  primaryKey,
  additionalKeys,
  initialDeviceCount,
  initialMonths,
}: PriceSimulatorProps) {
  const [deviceCount, setDeviceCount] = useState(initialDeviceCount)
  const [months, setMonths] = useState<RentalDuration>(initialMonths)

  const primaryProduct = PRODUCTS[primaryKey]
  const availableMonths = DURATION_OPTIONS.filter(
    (m) => primaryProduct?.priceTable[m] !== undefined
  )

  const summary = calcTotalPrice(primaryKey, additionalKeys, months, deviceCount)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
      <h2 className="font-bold text-slate-800 text-lg">料金シミュレーター</h2>

      {/* Duration selector */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">ご利用期間</p>
        <div className="flex flex-wrap gap-2">
          {availableMonths.map((m) => (
            <button
              key={m}
              onClick={() => setMonths(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                months === m
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 text-slate-600 hover:border-blue-300'
              }`}
            >
              {DURATION_LABELS[m]}
            </button>
          ))}
        </div>
      </div>

      {/* Device count */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">
          台数：<span className="text-blue-600 font-bold">{deviceCount}台</span>
        </p>
        <input
          type="range"
          min={1}
          max={100}
          value={deviceCount}
          onChange={(e) => setDeviceCount(parseInt(e.target.value))}
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>1台</span>
          <span>50台</span>
          <span>100台</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-slate-50 rounded-xl p-4 space-y-2">
        {summary.breakdowns.map((b) => (
          <div key={b.productKey} className="flex justify-between text-sm">
            <span className="text-slate-600">{b.productName}</span>
            <span className="font-semibold">{formatPrice(b.monthlySubtotal)}/月</span>
          </div>
        ))}
        <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
          <div className="flex justify-between text-sm text-slate-500">
            <span>初期費用（キッティング）</span>
            <span>{formatPrice(summary.totalInitial)}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-slate-800">
            <span>月額合計（税別）</span>
            <span className="text-blue-600">{formatPrice(summary.totalMonthly)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>月額合計（税込）</span>
            <span>{formatPrice(summary.taxIncludedMonthly)}</span>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-2 mt-2">
          <div className="flex justify-between font-bold text-base">
            <span className="text-slate-700">{months}ヶ月総額（税別）</span>
            <span className="text-blue-700">{formatPrice(summary.grandTotal)}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center">
        ※表示は概算です。詳細は担当者よりご案内します。
      </p>
    </div>
  )
}
