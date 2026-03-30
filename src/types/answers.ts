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
 * 運用スタイル
 * group_training  : 集合研修タイプ（少ない端末で多くの人が閲覧）
 * group_shared    : グループ保有タイプ（グループごとに端末を共有）
 * workplace_unit  : 職場単位タイプ（店舗・職場ごとに端末を保持）
 * individual      : 個人割り振りタイプ（スタッフ1人に1台）
 * byod            : BYODタイプ（個人端末を業務活用）
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

  // Step 4: マニュアルの品質
  manualQuality: ManualQuality

  // Step 5: 運用スタイルと現状確認
  operationStyle: OperationStyle | null
  locationCount: number    // 拠点・店舗数
  staffPerLocation: number // 拠点あたりスタッフ数
  currentDeviceCount: number // 現在の端末台数（合計）
}

export const INITIAL_ANSWERS: WizardAnswers = {
  industry: null,
  isFranchise: null,
  challenges: [],
  useCases: [],
  shootingEnvironment: null,
  shootingViewpoint: null,
  manualQuality: null,
  operationStyle: null,
  locationCount: 1,
  staffPerLocation: 5,
  currentDeviceCount: 0,
}
