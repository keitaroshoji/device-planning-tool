import { ScoringRule } from '@/src/types/recommendation'

export const SCORING_RULES: ScoringRule[] = [
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

  // === 運用スタイル ===
  {
    condition: (a) => a.operationStyle === 'individual',
    scores: { mobile_cellular: 20, mobile_wifi: 15 },
    reason: '個人割り振りタイプ → 各自の端末で業務',
  },
  {
    condition: (a) => a.operationStyle === 'workplace_unit',
    scores: { mobile_cellular: 15, mobile_wifi: 15 },
    reason: '職場単位タイプ → 拠点ごとに端末配置',
  },
  {
    condition: (a) => a.operationStyle === 'group_training',
    scores: { smart_monitor: 20, mobile_wifi: 10 },
    reason: '集合研修タイプ → 大型モニターも選択肢',
  },
]
