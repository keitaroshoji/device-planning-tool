'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PRODUCTS, INITIAL_COST_PER_UNIT } from '@/src/data/products'
import { ProductKey } from '@/src/types/products'

/** 1製品あたりの設定可能フィールド */
export interface ProductSetting {
  key: string
  name: string
  description: string
  enabled: boolean
  priceTable: Partial<Record<number, number>>
  initialCost: number
  hasInitialCost: boolean
  /** カスタム追加された製品かどうか */
  isCustom?: boolean
  /** カスタム製品用の絵文字アイコン */
  imageEmoji?: string
  /** カスタム製品用のカテゴリ */
  category?: string
}

export interface SettingsState {
  productSettings: Record<string, ProductSetting>
  globalInitialCost: number

  updateProduct: (key: string, patch: Partial<ProductSetting>) => void
  updatePrice: (key: string, months: number, price: number | undefined) => void
  resetProduct: (key: string) => void
  resetAll: () => void
  addProduct: (setting: ProductSetting) => void
  deleteProduct: (key: string) => void
}

function buildDefaultSettings(): Record<string, ProductSetting> {
  const result: Record<string, ProductSetting> = {}
  for (const [key, product] of Object.entries(PRODUCTS)) {
    result[key] = {
      key,
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

      addProduct: (setting) =>
        set((state) => ({
          productSettings: {
            ...state.productSettings,
            [setting.key]: setting,
          },
        })),

      deleteProduct: (key) =>
        set((state) => {
          const next = { ...state.productSettings }
          delete next[key]
          return { productSettings: next }
        }),
    }),
    { name: 'device-service-settings' }
  )
)

/** 設定済みの製品データを Product 型に変換して返す */
export function toProduct(setting: ProductSetting) {
  const base = PRODUCTS[setting.key as ProductKey]
  return {
    key: setting.key,
    name: setting.name,
    nameEn: base?.nameEn ?? '',
    category: setting.category ?? base?.category ?? 'mobile',
    description: setting.description,
    features: base?.features ?? [],
    priceTable: setting.priceTable as Record<number, number>,
    hasInitialCost: setting.hasInitialCost,
    imageEmoji: setting.imageEmoji ?? base?.imageEmoji ?? '📱',
  }
}
