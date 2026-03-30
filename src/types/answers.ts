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

export type CurrentDevice =
  | 'company_smartphone'
  | 'company_tablet'
  | 'personal_smartphone'
  | 'pc_only'
  | 'no_device'

export type NetworkEnvironment = 'has_wifi' | 'no_wifi' | 'mixed' | null

export type MdmStatus = 'has_mdm' | 'no_mdm' | 'unknown' | null

export type DurationPreference = 1 | 3 | 6 | 12 | 24 | 36

export type BudgetRange =
  | 'under_3000'
  | '3000_5000'
  | '5000_10000'
  | 'over_10000'
  | null

export type PurchaseIntent = 'trial' | 'immediate' | 'considering' | null

export interface WizardAnswers {
  // Step 1: 業種・事業形態
  industry: Industry | null
  isFranchise: boolean | null

  // Step 2: 事業の課題
  challenges: Challenge[]

  // Step 3: 活用シーン
  useCases: UseCase[]

  // Step 3b: 動画撮影サブ質問
  shootingEnvironment: ShootingEnvironment
  shootingViewpoint: ShootingViewpoint

  // Step 4: マニュアル品質
  manualQuality: ManualQuality

  // Step 5: 端末・通信環境
  currentDevices: CurrentDevice[]
  networkEnvironment: NetworkEnvironment
  mdmStatus: MdmStatus

  // Step 6: 規模・台数
  deviceCount: number
  locationCount: number

  // Step 7: 予算・期間
  durationPreference: DurationPreference | null
  budgetRange: BudgetRange
  purchaseIntent: PurchaseIntent

  // Step 8: お客様情報
  companyName: string
  contactName: string
  email: string
  phoneNumber: string
}

export const INITIAL_ANSWERS: WizardAnswers = {
  industry: null,
  isFranchise: null,
  challenges: [],
  useCases: [],
  shootingEnvironment: null,
  shootingViewpoint: null,
  manualQuality: null,
  currentDevices: [],
  networkEnvironment: null,
  mdmStatus: null,
  deviceCount: 1,
  locationCount: 1,
  durationPreference: null,
  budgetRange: null,
  purchaseIntent: null,
  companyName: '',
  contactName: '',
  email: '',
  phoneNumber: '',
}
