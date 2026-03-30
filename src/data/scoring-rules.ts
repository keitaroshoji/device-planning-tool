import { ScoringRule } from '@/src/types/recommendation'

export const SCORING_RULES: ScoringRule[] = [
  // === ネットワーク環境 ===
  {
    condition: (a) => a.networkEnvironment === 'has_wifi',
    scores: { mobile_wifi: 20, mobile_cellular: 5 },
    reason: 'Wi-Fi環境あり → Wi-Fiモデルで十分',
  },
  {
    condition: (a) => a.networkEnvironment === 'no_wifi',
    scores: { mobile_cellular: 40 },
    reason: 'Wi-Fi環境なし → セルラーモデル必須',
  },
  {
    condition: (a) => a.networkEnvironment === 'mixed',
    scores: { mobile_cellular: 30, mobile_wifi: 10 },
    reason: '混在環境 → セルラーモデルを推奨',
  },

  // === 活用シーン：動画撮影 ===
  {
    condition: (a) => a.useCases.includes('video_shooting'),
    scores: { camera_wearable: 20 },
    reason: '動画撮影ユースケースあり',
  },
  {
    condition: (a) =>
      a.useCases.includes('video_shooting') &&
      a.shootingEnvironment === 'noisy',
    scores: { camera_wearable_mic: 50, camera_wearable: -10 },
    reason: '騒音環境 → マイク付きウェアラブルカメラ推奨',
  },
  {
    condition: (a) =>
      a.useCases.includes('video_shooting') &&
      a.shootingEnvironment === 'quiet' &&
      a.shootingViewpoint === 'pov',
    scores: { camera_head_mount: 40 },
    reason: '静音・一人称視点 → ヘッドマウントカメラ推奨',
  },
  {
    condition: (a) =>
      a.useCases.includes('video_shooting') &&
      a.shootingEnvironment === 'quiet' &&
      (a.shootingViewpoint === 'third_person' || a.shootingViewpoint === 'both'),
    scores: { camera_wearable: 40 },
    reason: '静音・三人称視点 → ウェアラブルカメラ推奨',
  },

  // === 活用シーン：マニュアル閲覧 ===
  {
    condition: (a) => a.useCases.includes('manual_viewing'),
    scores: { mobile_wifi: 15, mobile_cellular: 15 },
    reason: 'マニュアル閲覧 → モバイル端末',
  },

  // === 活用シーン：顧客向けディスプレイ ===
  {
    condition: (a) => a.useCases.includes('customer_display'),
    scores: { smart_monitor: 40 },
    reason: '顧客向けディスプレイ → スマートモニター推奨',
  },

  // === マニュアル品質 ===
  {
    condition: (a) => a.manualQuality === 'rich',
    scores: { camera_wearable_mic: 15, camera_wearable: 10, camera_head_mount: 10 },
    reason: 'リッチなマニュアルを作りたい → 動画撮影機材を追加推奨',
  },

  // === MDM状況 ===
  {
    condition: (a) => a.mdmStatus === 'has_mdm',
    scores: { mdm_only: 30, mobile_wifi: -10, mobile_cellular: -10 },
    reason: 'すでにMDMあり → MDM単体プランを検討',
  },
  {
    condition: (a) => a.mdmStatus === 'no_mdm',
    scores: { mobile_wifi: 15, mobile_cellular: 15 },
    reason: 'MDM未導入 → 端末セット（MDM込み）を推奨',
  },

  // === 既存デバイス ===
  {
    condition: (a) => a.currentDevices.includes('no_device'),
    scores: { mobile_wifi: 25, mobile_cellular: 25 },
    reason: 'デバイスなし → 端末セット提案',
  },
  {
    condition: (a) =>
      a.currentDevices.includes('company_smartphone') ||
      a.currentDevices.includes('company_tablet'),
    scores: { mdm_only: 20 },
    reason: '法人端末あり → MDM単体プランも選択肢',
  },

  // === フランチャイズ ===
  {
    condition: (a) => a.isFranchise === true,
    scores: { mobile_cellular: 20 },
    reason: 'FC事業者 → 全店舗統一管理のためセルラー推奨',
  },
  {
    condition: (a) => a.isFranchise === true && a.locationCount >= 5,
    scores: { mobile_cellular: 15 },
    reason: '多店舗FC → 更にセルラー優先度アップ',
  },

  // === 課題：セキュリティ ===
  {
    condition: (a) => a.challenges.includes('security'),
    scores: { mobile_cellular: 15, mobile_wifi: 15, mdm_only: 25 },
    reason: 'セキュリティ課題 → MDM管理が重要',
  },

  // === 課題：コスト削減 ===
  {
    condition: (a) => a.challenges.includes('cost_reduction'),
    scores: { mobile_wifi: 10 },
    reason: 'コスト削減 → Wi-Fiモデルでコスト最小化',
  },

  // === 課題：多店舗管理 ===
  {
    condition: (a) => a.challenges.includes('multi_store'),
    scores: { mobile_cellular: 20 },
    reason: '多店舗管理 → セルラーで統一管理',
  },

  // === 購入意向：トライアル ===
  {
    condition: (a) => a.purchaseIntent === 'trial',
    scores: { mobile_wifi: 5 },
    reason: 'まずトライアルから → 低コストのWi-Fiモデルから',
  },
]
