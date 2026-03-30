'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRODUCTS, INITIAL_COST_PER_UNIT } from '@/src/data/products'
import { Product, ProductKey } from '@/src/types/products'

/** 1製品あたりの設定可能フィールド */
export interface ProductSetting {
  key: ProductKey
  name: string
  description: string
  enabled: boolean
  priceTable: Partial<Record<number, number>>
  initialCost: number        // キッティング費用（台あたり）
  hasInitialCost: boolean
}

export interface SettingsState {
  /** 製品ごとの設定（デフォルト値から初期化） */
  productSettings: Record<ProductKey, ProductSetting>
  /** キッティング共通初期費用（個別設定していない製品に適用） */
  globalInitialCost: number

  // Actions
  updateProduct: (key: ProductKey, patch: Partial<ProductSetting>) => void
  updatePrice: (key: ProductKey, months: number, price: number | undefined) => void
  resetProduct: (key: ProductKey) => void
  resetAll: () => void
}

/** デフォルト設定をproducts.tsから生成 */
function buildDefaultSettings(): Record<ProductKey, ProductSetting> {
  const result = {} as Record<ProductKey, ProductSetting>
  for (const [key, product] of Object.entries(PRODUCTS)) {
    result[key as ProductKey] = {
      key: key as ProductKey,
      name: product.name,
      description: product.description,
      enabled: true,
      priceTable: { ...product.priceTable },
      initialCost: INITIAL_COST_PER_UNIT,
      hasInitialCost: product.hasInitialCost,
    }
  }
  return result
}

export const DEFAULT_SETTINGS = buildDefaultSettings()

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      productSettings: buildDefaultSettings(),
      globalInitialCost: INITIAL_COST_PER_UNIT,

      updateProduct: (key, patch) =>
        set((state) => ({
          productSettings: {
            ...state.productSettings,
            [key]: { ...state.productSettings[key], ...patch },
          },
        })),

      updatePrice: (key, months, price) =>
        set((state) => {
          const current = { ...state.productSettings[key].priceTable }
          if (price === undefined) {
            delete current[months]
          } else {
            current[months] = price
          }
          return {
            productSettings: {
              ...state.productSettings,
              [key]: { ...state.productSettings[key], priceTable: current },
            },
          }
        }),

      resetProduct: (key) =>
        set((state) => ({
          productSettings: {
            ...state.productSettings,
            [key]: { ...buildDefaultSettings()[key] },
          },
        })),

      resetAll: () =>
        set({
          productSettings: buildDefaultSettings(),
          globalInitialCost: INITIAL_COST_PER_UNIT,
        }),
    }),
    { name: 'device-service-settings' }
  )
)

/** 設定済みの製品データを Product 型に変換して返す */
export function toProduct(setting: ProductSetting): Product {
  return {
    key: setting.key,
    name: setting.name,
    nameEn: PRODUCTS[setting.key]?.nameEn ?? '',
    category: PRODUCTS[setting.key]?.category ?? 'mobile',
    description: setting.description,
    features: PRODUCTS[setting.key]?.features ?? [],
    priceTable: setting.priceTable as Record<number, number>,
    hasInitialCost: setting.hasInitialCost,
    imageEmoji: PRODUCTS[setting.key]?.imageEmoji ?? '📱',
  }
}
