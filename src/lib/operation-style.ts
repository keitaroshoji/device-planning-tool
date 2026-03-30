import { WizardAnswers, OperationStyle } from '@/src/types/answers'

export interface OperationStyleMeta {
  key: OperationStyle
  emoji: string
  label: string
  description: string
  /** 拠点あたりのスタッフ数に対する推奨端末割合 (e.g. 0.1 = 10人に1台) */
  deviceRatio: number
  pros: string[]
  cons: string[]
  /** MDM・集中管理との相性 */
  mdmFit: 'excellent' | 'good' | 'fair' | 'poor'
}

export const OPERATION_STYLE_META: Record<OperationStyle, OperationStyleMeta> = {
  group_training: {
    key: 'group_training',
    emoji: '🎓',
    label: '集合研修タイプ',
    description: '少ない端末で多くの人が集まって閲覧・学習する',
    deviceRatio: 0.1,
    pros: ['端末コストを最小化できる', '共有なので管理が楽', '大画面モニターと組み合わせると効果的'],
    cons: ['マニュアルを個別に確認しにくい', '研修の時間を集めなければならない', '現場でのリアルタイム参照が難しい'],
    mdmFit: 'good',
  },
  group_shared: {
    key: 'group_shared',
    emoji: '👥',
    label: 'グループ共有タイプ',
    description: 'チームや部署ごとに数台の端末を共有して使う',
    deviceRatio: 0.3,
    pros: ['適度なコストで多くのスタッフが利用可能', '必要なときに手に取れる', 'チーム内での情報共有がしやすい'],
    cons: ['同時利用に限界がある', '誰が使っているか把握しにくい', '紛失リスクがある'],
    mdmFit: 'excellent',
  },
  workplace_unit: {
    key: 'workplace_unit',
    emoji: '🏪',
    label: '職場単位タイプ',
    description: '店舗・職場・拠点ごとに端末を固定配置する',
    deviceRatio: 0.5,
    pros: ['拠点ごとに管理しやすい', '現場でいつでも参照できる', '多店舗展開時の標準化に最適'],
    cons: ['拠点間で移動できない', '拠点によって利用頻度に差が出る'],
    mdmFit: 'excellent',
  },
  individual: {
    key: 'individual',
    emoji: '👤',
    label: '個人割り振りタイプ',
    description: 'スタッフ1人に1台を割り当てて業務に活用する',
    deviceRatio: 1.0,
    pros: ['いつでも・どこでも参照できる', '個人の習得度を把握しやすい', '責任の所在が明確'],
    cons: ['端末コストが最も高い', '管理台数が多くなる', 'MDM管理が必須'],
    mdmFit: 'excellent',
  },
  byod: {
    key: 'byod',
    emoji: '📲',
    label: 'BYODタイプ',
    description: 'スタッフ個人のスマートフォンを業務に活用する',
    deviceRatio: 0,
    pros: ['追加端末コストがほぼゼロ', 'スタッフが使い慣れた端末を使える', '導入がスムーズ'],
    cons: ['セキュリティリスクが高い', 'MDM管理が難しい', '私用・業務の切り分けが曖昧になる', '端末の種類・OSがバラバラ'],
    mdmFit: 'poor',
  },
}

/** ヒアリング結果から推奨される運用スタイルを返す（スコア順） */
export function recommendOperationStyles(
  answers: Pick<WizardAnswers, 'useCases' | 'challenges' | 'isFranchise' | 'industry'>
): OperationStyle[] {
  const scores: Record<OperationStyle, number> = {
    group_training: 0,
    group_shared: 0,
    workplace_unit: 0,
    individual: 0,
    byod: 0,
  }

  // 活用シーンから
  if (answers.useCases.includes('manual_viewing')) {
    scores.individual += 15
    scores.group_shared += 10
    scores.workplace_unit += 8
  }
  if (answers.useCases.includes('video_shooting')) {
    scores.individual += 10
    scores.group_shared += 10
  }
  if (answers.useCases.includes('customer_display')) {
    scores.workplace_unit += 20
    scores.group_shared += 5
  }
  if (answers.useCases.includes('team_communication')) {
    scores.individual += 10
    scores.group_shared += 10
  }

  // 課題から
  if (answers.challenges.includes('staff_training')) {
    scores.individual += 10
    scores.group_training += 15
  }
  if (answers.challenges.includes('quality_standardization')) {
    scores.workplace_unit += 15
    scores.individual += 10
  }
  if (answers.challenges.includes('multi_store')) {
    scores.workplace_unit += 20
  }
  if (answers.challenges.includes('cost_reduction')) {
    scores.group_training += 10
    scores.byod += 8
  }
  if (answers.challenges.includes('security')) {
    scores.individual += 10
    scores.byod -= 20
  }
  if (answers.challenges.includes('remote_management')) {
    scores.individual += 10
    scores.workplace_unit += 10
  }

  // FC事業
  if (answers.isFranchise) {
    scores.workplace_unit += 20
    scores.individual += 10
  }

  // 業種
  if (answers.industry === 'food_service' || answers.industry === 'retail') {
    scores.workplace_unit += 10
    scores.group_shared += 5
  }
  if (answers.industry === 'manufacturing' || answers.industry === 'logistics') {
    scores.group_shared += 10
    scores.individual += 5
  }

  // Clamp
  for (const key of Object.keys(scores) as OperationStyle[]) {
    if (scores[key] < 0) scores[key] = 0
  }

  return (Object.keys(scores) as OperationStyle[]).sort((a, b) => scores[b] - scores[a])
}

/** 運用スタイルと規模から理想の端末台数を計算 */
export function calcIdealDeviceCount(
  style: OperationStyle,
  locationCount: number,
  staffPerLocation: number
): number {
  const meta = OPERATION_STYLE_META[style]
  const totalStaff = locationCount * staffPerLocation
  if (style === 'byod') return 0
  if (style === 'workplace_unit') return locationCount * 2 // 拠点あたり2台
  if (style === 'group_training') return Math.max(locationCount, Math.ceil(totalStaff * meta.deviceRatio))
  return Math.ceil(totalStaff * meta.deviceRatio)
}
