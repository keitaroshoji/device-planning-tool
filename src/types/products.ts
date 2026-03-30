export type ProductKey =
  | 'mobile_wifi'
  | 'mobile_cellular'
  | 'smart_monitor'
  | 'camera_head_mount'
  | 'camera_wearable'
  | 'camera_wearable_mic'
  | 'mdm_only'

export type RentalDuration = 1 | 3 | 6 | 12 | 24 | 36

export interface PriceTable {
  [months: number]: number
}

export interface Product {
  key: ProductKey
  name: string
  nameEn: string
  category: 'mobile' | 'monitor' | 'camera' | 'mdm'
  description: string
  features: string[]
  priceTable: PriceTable
  hasInitialCost: boolean
  imageEmoji: string
}

export interface TrialPack {
  key: string
  name: string
  description: string
  price: number
  durationNights: number
  includes: string[]
}
