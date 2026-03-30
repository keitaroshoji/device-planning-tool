'use client'

import Link from 'next/link'
import { AppSidebar } from '@/src/components/ui/AppSidebar'
import { PasswordGate } from '@/src/components/ui/PasswordGate'

export default function Home() {
  return (
    <PasswordGate>
      <div className="min-h-screen bg-gray-50 flex">
        <AppSidebar activePage="home" />

        {/* ===== MAIN AREA ===== */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 h-14 flex items-center px-8 gap-4">
            <h1 className="text-sm font-semibold text-gray-700">デバイスプランニング</h1>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm text-gray-400">Studist デバイスサービス</span>
            <div className="ml-auto">
              <Link
                href="/wizard?step=1"
                className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="text-base leading-none">+</span>
                診断を開始する
              </Link>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">

              {/* Page title */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  デバイスプランニング 診断ツール
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  6つの質問に答えるだけで、貴社に最適なデバイス活用プランと現状のギャップを可視化します
                </p>
              </div>

              {/* Step overview table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">診断ステップ</h3>
                  <span className="text-xs text-gray-400">所要時間 約3分</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {[
                    { step: 'Step 1', label: '業種・事業形態', desc: '業種とFC/非FC事業の確認', icon: '🏢' },
                    { step: 'Step 2', label: '業務の課題', desc: '現在抱えている課題を選択（複数可）', icon: '📋' },
                    { step: 'Step 3', label: '想定される活用シーン', desc: '端末・機材の利用目的を選択', icon: '📱' },
                    { step: 'Step 4', label: '端末の種類と利用環境', desc: '運用する端末の種類と特殊環境条件を選択', icon: '🖥️' },
                    { step: 'Step 5', label: 'マニュアルの品質', desc: 'コンテンツ作成のスタイルを選択', icon: '📝' },
                    { step: 'Step 6', label: '運用スタイルと現状確認', desc: '理想の運用スタイルと本部・店舗の台数を入力', icon: '📊' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                      <span className="text-xl w-8 text-center">{s.icon}</span>
                      <div className="w-20 shrink-0">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {s.step}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">{s.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Result preview + CTA grid */}
              <div className="grid grid-cols-3 gap-6">
                {/* CTA card */}
                <div className="col-span-1 bg-blue-600 rounded-xl p-6 text-white flex flex-col justify-between">
                  <div>
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">
                      無料診断
                    </p>
                    <h3 className="text-xl font-bold leading-snug">
                      最適なデバイスプランを
                      <br />診断する
                    </h3>
                    <p className="text-blue-200 text-sm mt-3">
                      ヒアリング結果から現状と理想のギャップを可視化し、具体的なプランをご提案します。
                    </p>
                  </div>
                  <Link
                    href="/wizard?step=1"
                    className="mt-6 block bg-white text-blue-600 text-center text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    診断を開始する →
                  </Link>
                </div>

                {/* Feature cards */}
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: '📊',
                      title: '現状 vs 理想の比較',
                      desc: '現在の端末台数と理想の配置を組織図で視覚化。本部・店舗別のギャップを一目で把握できます。',
                    },
                    {
                      icon: '💰',
                      title: '料金シミュレーター',
                      desc: '追加必要台数と契約期間（1〜36ヶ月）に応じたレンタル料金をその場で試算。',
                    },
                    {
                      icon: '🔒',
                      title: 'MDM管理込みで安心',
                      desc: '遠隔ロック・アプリ配信・セキュリティポリシーを一括設定。紛失リスクを最小化。',
                    },
                    {
                      icon: '🚀',
                      title: 'キッティング済みで即日稼働',
                      desc: 'アプリ設定・MDM登録済みで到着。設定の手間ゼロで現場がすぐ使えます。',
                    },
                  ].map((f) => (
                    <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-5">
                      <span className="text-2xl">{f.icon}</span>
                      <h4 className="text-sm font-semibold text-gray-800 mt-2">{f.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </PasswordGate>
  )
}
