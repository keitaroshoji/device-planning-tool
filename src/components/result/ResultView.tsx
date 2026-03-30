'use client'

import { useRouter } from 'next/navigation'
import { useWizardStore } from '@/src/store/wizardStore'
import {
  OPERATION_STYLE_META,
  calcIdealDeviceCount,
} from '@/src/lib/operation-style'
import { OrgChart } from './OrgChart'
import { GapAnalysis, buildGapItems } from './GapAnalysis'
import { DRSPricing } from './DRSPricing'
import { Button } from '@/src/components/ui/Button'

const CHALLENGE_LABELS: Record<string, string> = {
  manual_creation: 'マニュアル整備',
  staff_training: 'スタッフ教育',
  quality_standardization: '品質標準化',
  cost_reduction: 'コスト削減',
  remote_management: '遠隔管理',
  security: 'セキュリティ',
  multi_store: '多店舗展開',
}

const USE_CASE_LABELS: Record<string, string> = {
  manual_viewing: 'マニュアル閲覧',
  video_shooting: '動画撮影',
  pos_register: 'POS・業務アプリ',
  customer_display: '顧客向け表示',
  team_communication: 'チーム連絡',
}

export function ResultView() {
  const router = useRouter()
  const { answers, resetWizard } = useWizardStore()

  if (!answers.operationStyle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-500">ヒアリングが完了していません</p>
          <Button onClick={() => router.push('/wizard?step=1')}>診断を始める</Button>
        </div>
      </div>
    )
  }

  const styleMeta = OPERATION_STYLE_META[answers.operationStyle]
  const idealDeviceCount = calcIdealDeviceCount(
    answers.operationStyle,
    answers.locationCount,
    answers.staffPerLocation
  )
  const additionalDevices = Math.max(0, idealDeviceCount - answers.currentDeviceCount)
  const devicesPerLocation = answers.locationCount > 0 ? Math.ceil(idealDeviceCount / answers.locationCount) : 0
  const currentPerLocation = answers.locationCount > 0 ? Math.floor(answers.currentDeviceCount / answers.locationCount) : 0

  const gapItems = buildGapItems({
    currentDeviceCount: answers.currentDeviceCount,
    idealDeviceCount,
    locationCount: answers.locationCount,
    operationStyleLabel: styleMeta.label,
    hasByod: answers.operationStyle === 'byod',
  })

  function handleReset() {
    resetWizard()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <div>
              <div className="text-xs text-blue-600 font-semibold uppercase tracking-widest">
                Studist Device Rental Service
              </div>
              <div className="text-lg font-bold text-slate-800 leading-tight">
                デバイスプランニング 診断結果
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            ← やり直す
          </Button>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-8 py-10 space-y-12">

        {/* ===== HEARING SUMMARY ===== */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-5">
            ヒアリング内容サマリー
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-400 mb-1.5">業種</p>
              <p className="font-semibold text-slate-700">
                {answers.isFranchise ? '🏪 FC事業' : '🏢 一般事業'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">業務の課題</p>
              <div className="flex flex-wrap gap-1.5">
                {answers.challenges.map((c) => (
                  <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                    {CHALLENGE_LABELS[c]}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">活用シーン</p>
              <div className="flex flex-wrap gap-1.5">
                {answers.useCases.map((u) => (
                  <span key={u} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                    {USE_CASE_LABELS[u]}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1.5">運用スタイル</p>
              <p className="font-semibold text-blue-700">
                {styleMeta.emoji} {styleMeta.label}
              </p>
            </div>
          </div>
        </section>

        {/* ===== 2-COLUMN COMPARISON ===== */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            現状 vs 理想の運用比較
          </h2>

          <div className="grid grid-cols-2 gap-6">
            {/* ---- CURRENT STATE ---- */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-700 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                  <h3 className="text-white font-bold text-lg">現状の運用</h3>
                </div>
                <p className="text-slate-300 text-sm mt-0.5">
                  端末 {answers.currentDeviceCount}台 ／ {answers.locationCount}拠点 ／ スタッフ約{answers.locationCount * answers.staffPerLocation}名
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Org chart */}
                <div className="flex justify-center py-4 bg-slate-50 rounded-2xl">
                  <OrgChart
                    locationCount={answers.locationCount}
                    devicesPerLocation={currentPerLocation}
                    totalDevices={answers.currentDeviceCount}
                    label="現状"
                    variant="current"
                  />
                </div>

                {/* Current state issues */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-600">現状の課題</p>
                  {answers.currentDeviceCount === 0 ? (
                    <div className="space-y-2">
                      <IssueItem level="high" text="業務でモバイル端末が使えず、紙・口頭に依存" />
                      <IssueItem level="high" text="マニュアルを現場でリアルタイム参照できない" />
                      <IssueItem level="high" text="スタッフ教育に時間・人手がかかる" />
                    </div>
                  ) : idealDeviceCount > answers.currentDeviceCount ? (
                    <div className="space-y-2">
                      <IssueItem
                        level="high"
                        text={`端末が${additionalDevices}台不足（充足率 ${Math.round((answers.currentDeviceCount / idealDeviceCount) * 100)}%）`}
                      />
                      <IssueItem level="medium" text="端末の取り合いや待ち時間が発生している" />
                      <IssueItem level="medium" text="全員が同時にマニュアルを参照できない" />
                      {answers.locationCount > 1 && (
                        <IssueItem level="medium" text="拠点によって端末環境にばらつきがある" />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <IssueItem level="ok" text="端末台数は目標を達成しています" />
                      <IssueItem level="medium" text="MDM管理・セキュリティの整備が課題" />
                    </div>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <MetricCard label="端末台数" value={`${answers.currentDeviceCount}台`} sub="現在" color="slate" />
                  <MetricCard label="1拠点あたり" value={`${currentPerLocation}台`} sub="平均" color="slate" />
                  <MetricCard
                    label="充足率"
                    value={idealDeviceCount > 0 ? `${Math.round((answers.currentDeviceCount / idealDeviceCount) * 100)}%` : '—'}
                    sub="目標比"
                    color={answers.currentDeviceCount >= idealDeviceCount ? 'green' : 'red'}
                  />
                </div>
              </div>
            </div>

            {/* ---- IDEAL STATE ---- */}
            <div className="bg-white rounded-3xl border-2 border-blue-400 overflow-hidden shadow-lg">
              <div className="bg-blue-600 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-200 inline-block" />
                  <h3 className="text-white font-bold text-lg">理想の運用</h3>
                  <span className="ml-auto text-xs bg-blue-500 text-blue-100 font-semibold px-2.5 py-1 rounded-full">
                    {styleMeta.emoji} {styleMeta.label}
                  </span>
                </div>
                <p className="text-blue-200 text-sm mt-0.5">
                  端末 {idealDeviceCount}台 ／ {answers.locationCount}拠点 ／ MDM一元管理
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Org chart */}
                <div className="flex justify-center py-4 bg-blue-50 rounded-2xl">
                  <OrgChart
                    locationCount={answers.locationCount}
                    devicesPerLocation={devicesPerLocation}
                    totalDevices={idealDeviceCount}
                    label="理想"
                    variant="ideal"
                  />
                </div>

                {/* Ideal benefits */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-600">理想の状態</p>
                  <div className="space-y-2">
                    {styleMeta.pros.map((p) => (
                      <div key={p} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="text-blue-500 shrink-0 mt-0.5">✓</span>
                        {p}
                      </div>
                    ))}
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-blue-500 shrink-0 mt-0.5">✓</span>
                      全{answers.locationCount}拠点でMDMによる一元管理・セキュリティ対策
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="text-blue-500 shrink-0 mt-0.5">✓</span>
                      Teachme Bizでデジタルマニュアルを現場でリアルタイム参照
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <MetricCard label="端末台数" value={`${idealDeviceCount}台`} sub="目標" color="blue" />
                  <MetricCard label="1拠点あたり" value={`${devicesPerLocation}台`} sub="均等配置" color="blue" />
                  <MetricCard label="充足率" value="100%" sub="完全対応" color="green" />
                </div>
              </div>
            </div>
          </div>

          {/* Gap badge */}
          {additionalDevices > 0 && (
            <div className="mt-6 flex justify-center">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl px-8 py-4 flex items-center gap-4">
                <span className="text-3xl">📦</span>
                <div>
                  <p className="font-bold text-amber-800 text-lg">
                    あと <span className="text-2xl text-amber-600">{additionalDevices}台</span> 追加することで理想の運用が実現
                  </p>
                  <p className="text-amber-600 text-sm">
                    DRSデバイスレンタルサービスで必要な台数だけ・必要な期間だけレンタル可能
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===== GAP ANALYSIS TABLE ===== */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            現状と理想のギャップ分析
          </h2>
          <GapAnalysis items={gapItems} />
        </section>

        {/* ===== DRS PRICING ===== */}
        {additionalDevices > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">💰</span>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  DRS デバイスレンタルサービスで解決する
                </h2>
                <p className="text-slate-500 text-sm mt-0.5">
                  追加{additionalDevices}台をレンタルすることで、理想の運用環境が整います
                </p>
              </div>
            </div>
            <DRSPricing additionalDevices={additionalDevices} />
          </section>
        )}

        {/* ===== TEACHME UPSELL ===== */}
        <section className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-3xl border border-orange-200 p-8">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div>
              <div className="text-sm font-semibold text-orange-500 uppercase tracking-widest mb-2">
                合わせてご提案
              </div>
              <h2 className="text-2xl font-bold text-slate-800">
                Teachme Biz とのセット導入
              </h2>
              <p className="text-slate-600 mt-3 leading-relaxed">
                デバイスが揃っても、マニュアルのデジタル化が伴わなければ効果は半減します。
                <strong>Teachme Biz</strong> は現場スタッフが使いやすい動画・テキスト混合のマニュアル共有SaaSです。
                DRSとのセット導入で、端末準備から教育・標準化まで一気通貫で解決できます。
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  '現場でスマホからマニュアル即参照',
                  '動画・画像・テキストを組み合わせ',
                  '習得度テスト・進捗管理',
                  '多言語対応（外国人スタッフにも）',
                  'FC本部からの一括配信・管理',
                  'マニュアル更新を即座に全店へ反映',
                ].map((f) => (
                  <div key={f} className="flex items-start gap-1.5 text-sm text-slate-600">
                    <span className="text-orange-500 shrink-0 mt-0.5">✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
              <p className="text-sm font-semibold text-slate-500 mb-4">セット導入イメージ</p>
              <div className="space-y-3">
                {[
                  { step: '1', label: 'DRS', desc: 'キッティング済み端末が届く', icon: '📱' },
                  { step: '2', label: 'Teachme Biz', desc: 'マニュアルをデジタル化・共有', icon: '📚' },
                  { step: '3', label: 'MDM', desc: '全端末を本部から一元管理', icon: '🔒' },
                  { step: '4', label: '運用開始', desc: '現場がすぐに使い始められる', icon: '🚀' },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center shrink-0">
                      {s.step}
                    </div>
                    <span className="text-lg shrink-0">{s.icon}</span>
                    <div>
                      <span className="font-semibold text-slate-700 text-sm">{s.label}</span>
                      <span className="text-slate-400 text-xs ml-2">{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="bg-blue-600 rounded-3xl p-10 text-white text-center space-y-6">
          <div>
            <h2 className="text-3xl font-bold">次のステップへ</h2>
            <p className="text-blue-200 mt-2 text-lg">
              担当者が詳細なプランを無料でご提案します
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: '📧', label: 'メールで資料請求', desc: 'この診断結果をもとにカスタマイズ提案書をお送りします' },
              { icon: '💬', label: 'オンライン相談（無料）', desc: '30分で要件整理・最適プランをご提案します' },
              { icon: '🧪', label: 'トライアルから始める', desc: '14泊のお試しパックで実際に体験できます' },
            ].map((c) => (
              <div key={c.label} className="bg-white/10 backdrop-blur rounded-2xl p-4">
                <div className="text-2xl mb-2">{c.icon}</div>
                <div className="font-semibold text-sm">{c.label}</div>
                <div className="text-xs text-blue-200 mt-1">{c.desc}</div>
              </div>
            ))}
          </div>
          <p className="text-blue-300 text-sm">
            ※ ご連絡は通常2営業日以内に差し上げます
          </p>
        </section>

        <div className="text-center pb-8">
          <button
            onClick={handleReset}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            最初からやり直す
          </button>
        </div>
      </div>
    </div>
  )
}

// ---- Helper components ----

function IssueItem({ level, text }: { level: 'high' | 'medium' | 'ok'; text: string }) {
  const config = {
    high: { bg: 'bg-red-50', border: 'border-red-200', icon: '🔴', text: 'text-red-700' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon: '🟡', text: 'text-amber-700' },
    ok: { bg: 'bg-green-50', border: 'border-green-200', icon: '🟢', text: 'text-green-700' },
  }[level]

  return (
    <div className={`flex items-start gap-2 text-sm px-3 py-2 rounded-xl border ${config.bg} ${config.border}`}>
      <span className="shrink-0 text-sm">{config.icon}</span>
      <span className={config.text}>{text}</span>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string
  value: string
  sub: string
  color: 'slate' | 'blue' | 'green' | 'red'
}) {
  const colors = {
    slate: 'text-slate-700',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-500',
  }
  return (
    <div className="bg-slate-50 rounded-xl p-3 text-center">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${colors[color]}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  )
}
