import { Suspense } from 'react'
import { WizardShell } from '@/src/components/wizard/WizardShell'

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">読み込み中...</div>}>
      <WizardShell />
    </Suspense>
  )
}
