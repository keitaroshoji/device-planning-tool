import { WizardAnswers } from '@/src/types/answers'
import { ProductKey } from '@/src/types/products'
import { Recommendation, RecommendedPackage } from '@/src/types/recommendation'
import { SCORING_RULES } from '@/src/data/scoring-rules'
import { PRODUCTS, TRIAL_PACKS } from '@/src/data/products'

const ALL_PRODUCT_KEYS: ProductKey[] = [
  'mobile_wifi',
  'mobile_cellular',
  'smart_monitor',
  'camera_head_mount',
  'camera_wearable',
  'camera_wearable_mic',
  'mdm_only',
]

function computeScores(answers: WizardAnswers): Record<ProductKey, number> {
  const scores: Record<ProductKey, number> = {
    mobile_wifi: 0,
    mobile_cellular: 0,
    smart_monitor: 0,
    camera_head_mount: 0,
    camera_wearable: 0,
    camera_wearable_mic: 0,
    mdm_only: 0,
  }

  for (const rule of SCORING_RULES) {
    if (rule.condition(answers)) {
      for (const [key, delta] of Object.entries(rule.scores)) {
        scores[key as ProductKey] = (scores[key as ProductKey] ?? 0) + (delta ?? 0)
      }
    }
  }

  // Clamp negatives to 0
  for (const key of ALL_PRODUCT_KEYS) {
    if (scores[key] < 0) scores[key] = 0
  }

  return scores
}

function buildReasoningMessages(answers: WizardAnswers): string[] {
  const reasons: string[] = []

  const matchedRules = SCORING_RULES.filter(
    (r) => r.condition(answers) && r.reason
  )
  return matchedRules.map((r) => r.reason!)
}

function selectTrialPack(answers: WizardAnswers): string | null {
  if (answers.useCases.includes('video_shooting')) {
    return 'trial_camera'
  }
  if (answers.useCases.includes('manual_viewing')) {
    return 'trial_smartphone'
  }
  return 'trial_all'
}

function buildPackage(
  primaryKey: ProductKey,
  additionalKeys: ProductKey[],
  score: number,
  answers: WizardAnswers
): RecommendedPackage {
  const reasoning = buildReasoningMessages(answers)
  const isTeachmeUpsell =
    answers.useCases.includes('manual_viewing') ||
    answers.challenges.includes('manual_creation') ||
    answers.challenges.includes('staff_training')

  return {
    primaryProduct: primaryKey,
    additionalProducts: additionalKeys,
    score,
    reasoning,
    isTeachmeUpsell,
  }
}

export function computeRecommendation(answers: WizardAnswers): Recommendation {
  const scores = computeScores(answers)

  // Separate camera products from device/mdm products
  const cameraKeys: ProductKey[] = [
    'camera_head_mount',
    'camera_wearable',
    'camera_wearable_mic',
  ]
  const deviceKeys: ProductKey[] = [
    'mobile_wifi',
    'mobile_cellular',
    'smart_monitor',
    'mdm_only',
  ]

  // Sort device-type products by score desc
  const sortedDeviceKeys = deviceKeys.slice().sort((a, b) => scores[b] - scores[a])
  // Sort camera products by score desc
  const sortedCameraKeys = cameraKeys.slice().sort((a, b) => scores[b] - scores[a])

  const topDevice = sortedDeviceKeys[0]

  // Determine if we should add a camera product
  const additionals: ProductKey[] = []
  const topCamera = sortedCameraKeys[0]
  const hasVideoUseCase = answers.useCases.includes('video_shooting')
  if (hasVideoUseCase && scores[topCamera] > 0) {
    additionals.push(topCamera)
  }

  // Add smart monitor if customer_display use case and not already primary
  if (
    answers.useCases.includes('customer_display') &&
    topDevice !== 'smart_monitor' &&
    !additionals.includes('smart_monitor')
  ) {
    additionals.push('smart_monitor')
  }

  const mainPackage = buildPackage(topDevice, additionals, scores[topDevice], answers)

  // Build 1 alternative: second-best device
  const alternativePackages: RecommendedPackage[] = []
  const secondDevice = sortedDeviceKeys[1]
  if (secondDevice && scores[secondDevice] > 0 && secondDevice !== topDevice) {
    alternativePackages.push(
      buildPackage(secondDevice, additionals, scores[secondDevice], answers)
    )
  }

  const trialPackKey = selectTrialPack(answers)

  return {
    mainPackage,
    alternativePackages,
    trialPackKey,
    allScores: scores,
  }
}
