import { ProductKey, RentalDuration } from '@/src/types/products'
import { PRODUCTS, INITIAL_COST_PER_UNIT } from '@/src/data/products'

export interface PriceBreakdown {
  productKey: ProductKey
  productName: string
  unitPrice: number
  unitCount: number
  months: RentalDuration
  monthlySubtotal: number
  initialCost: number
  totalCost: number
}

export interface TotalPriceSummary {
  breakdowns: PriceBreakdown[]
  totalMonthly: number
  totalInitial: number
  grandTotal: number
  taxIncludedMonthly: number
  taxIncludedInitial: number
  taxIncludedGrandTotal: number
}

const TAX_RATE = 0.1

export function calcPrice(
  productKey: ProductKey,
  months: RentalDuration,
  unitCount: number
): PriceBreakdown | null {
  const product = PRODUCTS[productKey]
  if (!product) return null

  const unitPrice = product.priceTable[months]
  if (unitPrice === undefined) return null

  const monthlySubtotal = unitPrice * unitCount
  const initialCost = product.hasInitialCost ? INITIAL_COST_PER_UNIT * unitCount : 0
  const totalCost = monthlySubtotal * months + initialCost

  return {
    productKey,
    productName: product.name,
    unitPrice,
    unitCount,
    months,
    monthlySubtotal,
    initialCost,
    totalCost,
  }
}

export function calcTotalPrice(
  primaryKey: ProductKey,
  additionalKeys: ProductKey[],
  months: RentalDuration,
  deviceCount: number,
  cameraCount?: number
): TotalPriceSummary {
  const breakdowns: PriceBreakdown[] = []

  const primaryBreakdown = calcPrice(primaryKey, months, deviceCount)
  if (primaryBreakdown) breakdowns.push(primaryBreakdown)

  for (const key of additionalKeys) {
    const product = PRODUCTS[key]
    if (!product) continue

    const count = product.category === 'camera' ? (cameraCount ?? 1) : deviceCount
    const breakdown = calcPrice(key, months, count)
    if (breakdown) breakdowns.push(breakdown)
  }

  const totalMonthly = breakdowns.reduce((sum, b) => sum + b.monthlySubtotal, 0)
  const totalInitial = breakdowns.reduce((sum, b) => sum + b.initialCost, 0)
  const grandTotal = breakdowns.reduce((sum, b) => sum + b.totalCost, 0)

  return {
    breakdowns,
    totalMonthly,
    totalInitial,
    grandTotal,
    taxIncludedMonthly: Math.round(totalMonthly * (1 + TAX_RATE)),
    taxIncludedInitial: Math.round(totalInitial * (1 + TAX_RATE)),
    taxIncludedGrandTotal: Math.round(grandTotal * (1 + TAX_RATE)),
  }
}

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString('ja-JP')}`
}
