'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import { Button } from '@/src/components/ui/Button'

export function Step08Contact() {
  const router = useRouter()
  const { answers, updateAnswers, completeWizard } = useWizardStore()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    completeWizard()
    router.push('/result')
  }

  const canProceed =
    answers.companyName.trim() !== '' &&
    answers.contactName.trim() !== '' &&
    answers.email.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">最後にお客様情報をご入力ください</h1>
        <p className="mt-1 text-slate-500 text-sm">提案書の送付・担当者からのご連絡に使用します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            会社名・屋号 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="株式会社◯◯"
            value={answers.companyName}
            onChange={(e) => updateAnswers({ companyName: e.target.value })}
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            ご担当者名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="山田 太郎"
            value={answers.contactName}
            onChange={(e) => updateAnswers({ contactName: e.target.value })}
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="example@company.co.jp"
            value={answers.email}
            onChange={(e) => updateAnswers({ email: e.target.value })}
            required
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            電話番号（任意）
          </label>
          <input
            type="tel"
            placeholder="03-0000-0000"
            value={answers.phoneNumber}
            onChange={(e) => updateAnswers({ phoneNumber: e.target.value })}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500">
          ご入力いただいた情報は、デバイスプランのご提案および担当者からのご連絡にのみ使用し、第三者への提供は行いません。
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!canProceed}
          >
            プランを見る ✨
          </Button>
        </div>
      </form>
    </div>
  )
}
