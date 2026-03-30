import { ProductKey } from './products'
import { WizardAnswers } from './answers'

export interface ProductScore {
  key: ProductKey
  score: number
}

export interface ScoringRule {
  condition: (answers: WizardAnswers) => boolean
  scores: Partial<Record<ProductKey, number>>
  reason?: string
}

export interface RecommendedPackage {
  primaryProduct: ProductKey
  additionalProducts: ProductKey[]
  score: number
  reasoning: string[]
  isTeachmeUpsell: boolean
}

export interface Recommendation {
  mainPackage: RecommendedPackage
  alternativePackages: RecommendedPackage[]
  trialPackKey: string | null
  allScores: Record<ProductKey, number>
}
