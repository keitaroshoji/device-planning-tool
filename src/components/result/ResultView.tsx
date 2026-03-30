'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { computeRecommendation } from '@/src/lib/recommendation-engine'
import { PackageCard } from './PackageCard'
import { PriceSimulator } from './PriceSimulator'
import { TeachmeUpsell } from './TeachmeUpsell'
import { TrialPackBanner } from './TrialPackBanner'
import { ContactCTA } from './ContactCTA'
import { Button } from '@/src/components/ui/Button'
import { RentalDuration } from '@/src/types/products'

export function ResultView() {
  const router = useRouter()
  const { answers, resetWizard } = useWizardStore()

  const recommendation = computeRecommendation(answers)
  const { mainPackage, alternativePackages, trialPackKey } = recommendation

  const months: RentalDuration = (answers.durationPreference ?? 6) as RentalDuration

  function handleReset() {
    resetWizard()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
              デバイスプランニング結果
            </div>
            <h1 className="text-lg font-bold text-slate-800 mt-0.5">
              {answers.companyName || 'お客様'} へのおすすめプラン
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            やり直す
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Trial pack banner */}
        {trialPackKey && (
          <TrialPackBanner trialPackKey={trialPackKey} />
        )}

        {/* Main recommendation */}
        <section className="space-y-3">
          <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
            メイン推奨プラン
          </h2>
          <PackageCard
            primaryKey={mainPackage.primaryProduct}
            additionalKeys={mainPackage.additionalProducts}
            months={months}
            deviceCount={answers.deviceCount}
            isMain
          />
        </section>

        {/* Reasoning */}
        {mainPackage.reasoning.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              このプランをおすすめする理由
            </p>
            <ul className="space-y-1">
              {[...new Set(mainPackage.reasoning)].slice(0, 5).map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price simulator */}
        <PriceSimulator
          primaryKey={mainPackage.primaryProduct}
          additionalKeys={mainPackage.additionalProducts}
          initialDeviceCount={answers.deviceCount}
          initialMonths={months}
        />

        {/* Alternative plan */}
        {alternativePackages.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">
              その他のプラン候補
            </h2>
            {alternativePackages.map((pkg) => (
              <PackageCard
                key={pkg.primaryProduct}
                primaryKey={pkg.primaryProduct}
                additionalKeys={pkg.additionalProducts}
                months={months}
                deviceCount={answers.deviceCount}
              />
            ))}
          </section>
        )}

        {/* Teachme upsell */}
        {mainPackage.isTeachmeUpsell && <TeachmeUpsell />}

        {/* Contact CTA */}
        <ContactCTA
          companyName={answers.companyName}
          contactName={answers.contactName}
        />

        {/* Reset */}
        <div className="text-center pb-4">
          <button
            onClick={handleReset}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            最初からやり直す
          </button>
        </div>
      </main>
    </div>
  )
}
