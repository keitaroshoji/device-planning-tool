export type Industry =
  | 'food_service'
  | 'retail'
  | 'manufacturing'
  | 'logistics'
  | 'medical'
  | 'beauty'
  | 'education'
  | 'other'

export type Challenge =
  | 'manual_creation'
  | 'staff_training'
  | 'quality_standardization'
  | 'cost_reduction'
  | 'remote_management'
  | 'security'
  | 'multi_store'

export type UseCase =
  | 'manual_viewing'
  | 'video_shooting'
  | 'pos_register'
  | 'customer_display'
  | 'team_communication'

export type ShootingEnvironment = 'quiet' | 'noisy' | null

export type ShootingViewpoint = 'pov' | 'third_person' | 'both' | null

export type ManualQuality = 'casual' | 'rich' | null

/**
 * 運用する端末の種類
 */
export type DeviceType =
  | 'smartphone'     // スマートフォン
  | 'tablet'         // タブレット
  | 'pc'             // パソコン
  | 'large_monitor'  // 大型モニター

/**
 * 利用環境・付帯条件
 */
export type EnvironmentCondition =
  | 'water'      // 水・湿気（厨房・屋外など）
  | 'dust'       // 粉塵・汚れ（工場・建設など）
  | 'hygiene'    // 衛生管理（医療・食品調理）
  | 'food_grade' // 食品工場規格（HACCP等への準拠が必要）
  | 'outdoor'    // 屋外・直射日光
  | 'cold'       // 低温環境（冷凍・冷蔵倉庫など）
  | 'normal'     // 特別な条件なし（通常オフィス・店舗）

/**
 * 運用スタイル
 */
export type OperationStyle =
  | 'group_training'
  | 'group_shared'
  | 'workplace_unit'
  | 'individual'
  | 'byod'

export interface WizardAnswers {
  // Step 1: 業種・事業形態
  industry: Industry | null
  isFranchise: boolean | null

  // Step 2: 業務の課題
  challenges: Challenge[]

  // Step 3: 活用シーン
  useCases: UseCase[]
  shootingEnvironment: ShootingEnvironment
  shootingViewpoint: ShootingViewpoint

  // Step 4: 端末の種類 & 利用環境
  deviceTypes: DeviceType[]
  environmentConditions: EnvironmentCondition[]

  // Step 5: マニュアルの品質
  manualQuality: ManualQuality

  // Step 6: 運用スタイルと現状確認
  operationStyle: OperationStyle | null
  locationCount: number
  staffPerLocation: number
  /** 店舗・拠点の端末種類ごとの現在の台数 */
  currentDevicesByType: Partial<Record<DeviceType, number>>
  /** 本部・本社の端末種類ごとの現在の台数 */
  headquartersDevicesByType: Partial<Record<DeviceType, number>>
}

/** 店舗・拠点の端末合計 */
export function totalCurrentDevices(a: WizardAnswers): number {
  return Object.values(a.currentDevicesByType).reduce((s, n) => s + (n ?? 0), 0)
}

/** 本部・本社の端末合計 */
export function totalHQDevices(a: WizardAnswers): number {
  return Object.values(a.headquartersDevicesByType).reduce((s, n) => s + (n ?? 0), 0)
}

export const INITIAL_ANSWERS: WizardAnswers = {
  industry: null,
  isFranchise: null,
  challenges: [],
  useCases: [],
  shootingEnvironment: null,
  shootingViewpoint: null,
  deviceTypes: [],
  environmentConditions: [],
  manualQuality: null,
  operationStyle: null,
  locationCount: 1,
  staffPerLocation: 5,
  currentDevicesByType: {},
  headquartersDevicesByType: {},
}
