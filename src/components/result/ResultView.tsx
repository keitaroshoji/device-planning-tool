'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useWizardStore } from '@/src/store/wizardStore'
import {
  OPERATION_STYLE_META,
  calcIdealDeviceCount,
} from '@/src/lib/operation-style'
import { totalCurrentDevices, totalHQDevices } from '@/src/types/answers'
import { OrgChart } from './OrgChart'
import { GapAnalysis, buildGapItems } from './GapAnalysis'
import { DSPricing } from './DSPricing'
import { Button } from '@/src/components/ui/Button'
import { AppSidebar } from '@/src/components/ui/AppSidebar'

const DEVICE_TYPE_LABELS: Record<string, string> = {
  smartphone: 'スマートフォン',
  tablet: 'タブレット',
  pc: 'パソコン',
  large_monitor: '大型モニター',
}

const ENV_LABELS: Record<string, string> = {
  water: '💧 水・湿気',
  dust: '🌫️ 粉塵・汚れ',
  hygiene: '🧴 衛生管理',
  food_grade: '🏭 食品工場規格',
  outdoor: '☀️ 屋外・直射日光',
  cold: '🧊 低温環境',
  normal: '🏢 通常環境',
}

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
  const { answers, resetWizard, startEdit } = useWizardStore()

  if (!answers.operationStyle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-gray-500">ヒアリングが完了していません</p>
          <Button onClick={() => { resetWizard(); router.push('/wizard?step=1') }}>
            診断を始める
          </Button>
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
  const currentStoreTotal = totalCurrentDevices(answers) * answers.locationCount
  const currentHQTotal = totalHQDevices(answers)
  const currentPerLocation = totalCurrentDevices(answers)
  const additionalDevices = Math.max(0, idealDeviceCount - currentStoreTotal)
  const devicesPerLocation = answers.locationCount > 0
    ? Math.ceil(idealDeviceCount / answers.locationCount)
    : 0

  const gapItems = buildGapItems({
    currentDeviceCount: currentStoreTotal,
    idealDeviceCount,
    locationCount: answers.locationCount,
    operationStyleLabel: styleMeta.label,
    hasByod: answers.operationStyle === 'byod',
  })

  const hasSpecialEnv = answers.environmentConditions.some((e) => e !== 'normal')

  // スライダー台数（初期値 = 算出不足台数、最低1）
  const sliderMax = Math.max(additionalDevices * 3, 50, 10)
  const [sliderDevices, setSliderDevices] = useState(() => Math.max(additionalDevices, 1))

  // 撮影用端末スライダー（video_shooting が選択された場合のみ表示）
  const hasVideoShooting = answers.useCases.includes('video_shooting')
  const [sliderCameras, setSliderCameras] = useState(1)

  // --- 端末種類別 不足台数 ---
  const selectedTypes = answers.deviceTypes ?? []

  // 店舗合計（全拠点）/ 本部 それぞれの現状台数（機種別）
  const currentStoreByType = Object.fromEntries(
    selectedTypes.map((t) => [t, (answers.currentDevicesByType[t] ?? 0) * answers.locationCount])
  )
  const currentHQByType = Object.fromEntries(
    selectedTypes.map((t) => [t, answers.headquartersDevicesByType[t] ?? 0])
  )

  // 理想台数を現状の機種割合で按分（全て0なら均等割り）
  const idealByType = (() => {
    const n = selectedTypes.length
    if (n === 0) return {}
    const storeSum = Object.values(currentStoreByType).reduce((a, b) => a + b, 0)
    if (storeSum === 0) {
      // 均等割り（端数は最初の機種に加算）
      const base = Math.floor(idealDeviceCount / n)
      const rem  = idealDeviceCount - base * n
      return Object.fromEntries(selectedTypes.map((t, i) => [t, base + (i === 0 ? rem : 0)]))
    }
    // 比例按分（端数調整で合計を idealDeviceCount に合わせる）
    const raw = Object.fromEntries(
      selectedTypes.map((t) => [t, idealDeviceCount * (currentStoreByType[t] / storeSum)])
    )
    const floored = Object.fromEntries(selectedTypes.map((t) => [t, Math.floor(raw[t])]))
    let remainder = idealDeviceCount - Object.values(floored).reduce((a, b) => a + b, 0)
    const sorted = [...selectedTypes].sort((a, b) => (raw[b] % 1) - (raw[a] % 1))
    sorted.forEach((t) => { if (remainder > 0) { floored[t]++; remainder-- } })
    return floored
  })()

  // 機種別不足台数（店舗分のみで比較）
  const gapByType = Object.fromEntries(
    selectedTypes.map((t) => [t, Math.max(0, (idealByType[t] ?? 0) - currentStoreByType[t])])
  )
  const hasDeviceTypeData = selectedTypes.length > 0

  function handleReset() {
    resetWizard()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar activePage="result" />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-8 gap-4 sticky top-0 z-10">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            トップへ
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <h1 className="text-sm font-semibold text-gray-700">診断結果</h1>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => { startEdit(1); router.push('/wizard?step=1') }}
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              条件を変更する
            </button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              最初からやり直す
            </Button>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-[1600px] mx-auto space-y-8">

            {/* ===== HEARING SUMMARY ===== */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                  ヒアリング内容サマリー
                </span>
              </div>
              <div className="px-6 py-4 grid grid-cols-3 gap-6 divide-x divide-gray-100">
                <div className="pr-6">
                  <p className="text-xs text-gray-400 mb-1.5">業種・事業形態</p>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {answers.isFranchise ? 'FC事業' : '一般事業'}
                  </p>
                  <p className="text-xs text-gray-400 mb-1.5">業務の課題</p>
                  <div className="flex flex-wrap gap-1">
                    {answers.challenges.map((c) => (
                      <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {CHALLENGE_LABELS[c]}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pl-6 pr-6">
                  <p className="text-xs text-gray-400 mb-1.5">活用シーン</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {answers.useCases.map((u) => (
                      <span key={u} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                        {USE_CASE_LABELS[u]}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mb-1.5">運用する端末</p>
                  <div className="flex flex-wrap gap-1">
                    {answers.deviceTypes.map((d) => (
                      <span key={d} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                        {DEVICE_TYPE_LABELS[d]}
                      </span>
                    ))}
                  </div>
                  {answers.environmentConditions.length > 0 && !answers.environmentConditions.every(e => e === 'normal') && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 mb-1.5">利用環境条件</p>
                      <div className="flex flex-wrap gap-1">
                        {answers.environmentConditions.filter(e => e !== 'normal').map((e) => (
                          <span key={e} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                            {ENV_LABELS[e]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="pl-6">
                  <p className="text-xs text-gray-400 mb-1.5">選択した運用スタイル</p>
                  <p className="text-sm font-medium text-blue-600 mb-3">
                    {styleMeta.emoji} {styleMeta.label}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">規模</p>
                  <p className="text-sm text-gray-700">{answers.locationCount}拠点 / 拠点あたり{answers.staffPerLocation}名</p>
                  <div className="mt-1.5 text-xs text-gray-500 space-y-0.5">
                    <div>🏢 本部端末合計: <span className="font-medium">{currentHQTotal}台</span></div>
                    <div>🏪 店舗端末合計: <span className="font-medium">{currentStoreTotal}台</span></div>
                  </div>
                </div>
              </div>
              {/* Step-by-step edit links */}
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 shrink-0">条件を変更：</span>
                {[
                  { step: 1, label: '業種・事業形態' },
                  { step: 2, label: '業務の課題' },
                  { step: 3, label: '活用シーン' },
                  { step: 4, label: '端末・環境' },
                  { step: 5, label: 'マニュアル品質' },
                  { step: 6, label: '運用スタイル' },
                ].map(({ step, label }) => (
                  <button
                    key={step}
                    onClick={() => { startEdit(step); router.push(`/wizard?step=${step}`) }}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ===== 2-COLUMN COMPARISON ===== */}
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-4">現状 vs 理想の運用比較</h2>
              <div className="grid grid-cols-2 gap-6">

                {/* Current */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                      <span className="text-sm font-semibold text-gray-700">現状の運用</span>
                    </div>
                    <span className="text-xs text-gray-400">
                      本部{currentHQTotal}台 ＋ 店舗{currentStoreTotal}台 / {answers.locationCount}拠点
                    </span>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Org chart */}
                    <div className="flex justify-center py-5 bg-gray-50 rounded-lg">
                      <OrgChart
                        locationCount={answers.locationCount}
                        devicesPerLocation={currentPerLocation}
                        totalDevices={currentStoreTotal}
                        hqDevices={currentHQTotal}
                        label="現状"
                        variant="current"
                        staffPerLocation={answers.staffPerLocation}
                      />
                    </div>

                    {/* Issues */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">現状の課題</p>
                      {currentStoreTotal === 0 ? (
                        <>
                          <IssueRow level="high" text="業務でモバイル端末が使えず、紙・口頭に依存" />
                          <IssueRow level="high" text="マニュアルを現場でリアルタイム参照できない" />
                          <IssueRow level="high" text="スタッフ教育に時間・人手がかかる" />
                        </>
                      ) : idealDeviceCount > currentStoreTotal ? (
                        <>
                          <IssueRow level="high" text={`端末が${additionalDevices}台不足（充足率 ${Math.round((currentStoreTotal / idealDeviceCount) * 100)}%）`} />
                          <IssueRow level="medium" text="端末の取り合いや待ち時間が発生している" />
                          <IssueRow level="medium" text="全員が同時にマニュアルを参照できない" />
                        </>
                      ) : (
                        <>
                          <IssueRow level="ok" text="端末台数は目標を達成しています" />
                          <IssueRow level="medium" text="MDM管理・セキュリティの整備が課題" />
                        </>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <MetricCell label="端末合計" value={`${currentStoreTotal + currentHQTotal}台`} />
                      <MetricCell label="店舗 / 拠点" value={`${currentPerLocation}台`} />
                      <MetricCell
                        label="充足率（店舗）"
                        value={idealDeviceCount > 0 ? `${Math.round((currentStoreTotal / idealDeviceCount) * 100)}%` : '—'}
                        highlight={currentStoreTotal >= idealDeviceCount ? 'green' : 'red'}
                      />
                    </div>
                  </div>
                </div>

                {/* Ideal */}
                <div className="bg-white rounded-xl border border-blue-300 overflow-hidden">
                  <div className="px-5 py-3 border-b border-blue-100 bg-blue-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                      <span className="text-sm font-semibold text-gray-700">理想の運用</span>
                      <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-0.5 rounded ml-1">
                        {styleMeta.label}
                      </span>
                    </div>
                    <span className="text-xs text-blue-500">
                      本部{currentHQTotal}台 ＋ 店舗{idealDeviceCount}台 / {answers.locationCount}拠点 / MDM管理
                    </span>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Org chart */}
                    <div className="flex justify-center py-5 bg-blue-50 rounded-lg">
                      <OrgChart
                        locationCount={answers.locationCount}
                        devicesPerLocation={devicesPerLocation}
                        totalDevices={idealDeviceCount}
                        hqDevices={currentHQTotal}
                        label="理想"
                        variant="ideal"
                        staffPerLocation={answers.staffPerLocation}
                      />
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">理想の状態</p>
                      {[...styleMeta.pros,
                        `全${answers.locationCount}拠点でMDMによる一元管理`,
                        'Teachme Bizでデジタルマニュアルをリアルタイム参照',
                      ].map((p) => (
                        <div key={p} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 shrink-0 mt-0.5 text-xs">✓</span>
                          {p}
                        </div>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <MetricCell label="端末合計" value={`${idealDeviceCount + currentHQTotal}台`} highlight="blue" />
                      <MetricCell label="店舗 / 拠点" value={`${devicesPerLocation}台`} highlight="blue" />
                      <MetricCell label="充足率（店舗）" value="100%" highlight="green" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gap callout */}
              {additionalDevices > 0 && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-5 py-3 flex items-center gap-3">
                  <span className="text-amber-500 text-lg shrink-0">⚠</span>
                  <p className="text-sm text-amber-800">
                    あと <span className="font-bold">{additionalDevices}台</span> 追加することで理想の運用環境が実現します。
                    DSデバイスサービスで必要な台数だけ・必要な期間だけレンタル可能です。
                  </p>
                </div>
              )}
            </div>

            {/* ===== DEVICE TYPE GAP TABLE ===== */}
            {hasDeviceTypeData && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-700">端末種類別 必要台数と不足分</h2>
                  {additionalDevices > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 font-semibold px-2.5 py-1 rounded">
                      合計 {additionalDevices}台 不足
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <th className="text-left px-5 py-3">端末の種類</th>
                        <th className="text-right px-5 py-3">
                          現状<span className="block font-normal normal-case text-gray-400">店舗（全拠点）</span>
                        </th>
                        <th className="text-right px-5 py-3">
                          現状<span className="block font-normal normal-case text-gray-400">本部・本社</span>
                        </th>
                        <th className="text-right px-5 py-3">
                          理想<span className="block font-normal normal-case text-gray-400">店舗（全拠点）</span>
                        </th>
                        <th className="text-right px-5 py-3">
                          不足台数<span className="block font-normal normal-case text-gray-400">店舗分</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {selectedTypes.map((type) => {
                        const gap = gapByType[type] ?? 0
                        return (
                          <tr key={type} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-gray-700">
                              {DEVICE_TYPE_LABELS[type]}
                            </td>
                            <td className="px-5 py-3.5 text-right text-gray-600">
                              {currentStoreByType[type]}台
                            </td>
                            <td className="px-5 py-3.5 text-right text-gray-600">
                              {currentHQByType[type]}台
                            </td>
                            <td className="px-5 py-3.5 text-right text-blue-600 font-medium">
                              {idealByType[type] ?? 0}台
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {gap > 0 ? (
                                <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                                  ▲ {gap}台
                                </span>
                              ) : (
                                <span className="text-green-600 font-medium">充足</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200 bg-gray-50 font-semibold text-sm">
                        <td className="px-5 py-3 text-gray-700">合計</td>
                        <td className="px-5 py-3 text-right text-gray-700">{currentStoreTotal}台</td>
                        <td className="px-5 py-3 text-right text-gray-700">{currentHQTotal}台</td>
                        <td className="px-5 py-3 text-right text-blue-600">{idealDeviceCount}台</td>
                        <td className="px-5 py-3 text-right">
                          {additionalDevices > 0 ? (
                            <span className="text-red-600">▲ {additionalDevices}台</span>
                          ) : (
                            <span className="text-green-600">充足</span>
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {additionalDevices > 0 && (
                  <div className="px-5 py-3 border-t border-gray-100 bg-amber-50 text-xs text-amber-700">
                    ※ 理想台数は選択された運用スタイルと現状の機種割合をもとに按分した概算値です。
                    実際の機種構成は担当者と調整のうえ確定します。
                  </div>
                )}
              </div>
            )}

            {/* ===== GAP ANALYSIS ===== */}
            <div>
              <h2 className="text-base font-semibold text-gray-700 mb-4">現状と理想のギャップ分析</h2>
              <GapAnalysis items={gapItems} />
            </div>

            {/* ===== DS PRICING ===== */}
            {(additionalDevices > 0 || hasSpecialEnv || hasVideoShooting) && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-sm font-semibold text-gray-700">
                    DS デバイスサービス 概算見積
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    スライダーで台数を調整すると月額概算が更新されます
                  </p>
                </div>

                {/* 閲覧用スライダー */}
                {additionalDevices > 0 && (
                  <div className="px-6 pt-5 pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        📱 閲覧用端末（スマートフォン・タブレット・モニターなど）
                      </label>
                      <div className="flex items-center gap-2">
                        {sliderDevices !== additionalDevices && (
                          <button
                            onClick={() => setSliderDevices(additionalDevices)}
                            className="text-xs text-blue-500 hover:underline"
                          >
                            算出値に戻す（{additionalDevices}台）
                          </button>
                        )}
                        <span className="text-2xl font-bold text-blue-600 tabular-nums">
                          {sliderDevices}台
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={sliderMax}
                      value={sliderDevices}
                      onChange={(e) => setSliderDevices(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1台</span>
                      {additionalDevices > 0 && additionalDevices < sliderMax && (
                        <span className="text-amber-500">▲ 算出不足数 {additionalDevices}台</span>
                      )}
                      <span>{sliderMax}台</span>
                    </div>
                  </div>
                )}

                {/* 撮影用スライダー */}
                {hasVideoShooting && (
                  <div className="px-6 pt-4 pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          🎥 撮影用端末（カメラセット）
                        </label>
                        <p className="text-xs text-gray-400 mt-0.5">
                          撮影担当者数・拠点数に応じて設定ください
                        </p>
                      </div>
                      <span className="text-2xl font-bold text-blue-600 tabular-nums">
                        {sliderCameras}台
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={20}
                      value={sliderCameras}
                      onChange={(e) => setSliderCameras(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1台</span>
                      <span>20台</span>
                    </div>
                  </div>
                )}

                <div className="p-6 pt-4">
                  <DSPricing
                    additionalDevices={sliderDevices}
                    cameraCount={hasVideoShooting ? sliderCameras : undefined}
                    environmentConditions={answers.environmentConditions}
                  />
                </div>
              </div>
            )}

            {/* ===== TEACHME UPSELL ===== */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-sm font-semibold text-gray-700">合わせてご提案：Teachme Biz</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-8 items-start">
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    デバイスが揃っても、マニュアルのデジタル化が伴わなければ効果は半減します。
                    <strong className="text-gray-800">Teachme Biz</strong> は現場スタッフが使いやすい動画・テキスト混合のマニュアル共有SaaSです。
                    DSとのセット導入で、端末準備から教育・標準化まで一気通貫で解決できます。
                  </p>
                  <ul className="mt-4 space-y-1.5">
                    {[
                      '現場でスマホからマニュアル即参照',
                      '動画・画像・テキストを組み合わせてリッチなコンテンツ作成',
                      '習得度テスト・進捗管理で教育効果を可視化',
                      'FC本部からの一括配信・全店舗への即時反映',
                      '多言語対応（外国人スタッフへの展開も容易）',
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 shrink-0 mt-0.5 text-xs">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">セット導入の流れ</p>
                  {[
                    { n: '1', label: 'DS', desc: 'キッティング済み端末が届く' },
                    { n: '2', label: 'Teachme Biz', desc: 'マニュアルをデジタル化・共有' },
                    { n: '3', label: 'MDM', desc: '全端末を本部から一元管理' },
                    { n: '4', label: '運用開始', desc: '現場がすぐに使い始められる' },
                  ].map((s) => (
                    <div key={s.n} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
                        {s.n}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-800">{s.label}</span>
                        <span className="text-xs text-gray-400 ml-2">{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== CTA ===== */}
            <div className="bg-blue-600 rounded-xl p-8 text-white">
              <div className="grid grid-cols-3 gap-6 items-start">
                <div className="col-span-1">
                  <h2 className="text-lg font-bold">次のステップへ</h2>
                  <p className="text-blue-200 text-sm mt-1">
                    担当者が詳細なプランを無料でご提案します。通常2営業日以内にご連絡します。
                  </p>
                </div>
                <div className="col-span-2 grid grid-cols-3 gap-3">
                  {[
                    { icon: '📧', label: 'メールで資料請求', desc: 'この診断結果をもとにカスタマイズした提案書をお送りします' },
                    { icon: '💬', label: 'オンライン相談（無料）', desc: '30分で要件整理・最適プランをご提案します' },
                    { icon: '🧪', label: 'トライアルから始める', desc: '14泊のお試しパックで実際に体験できます' },
                  ].map((c) => (
                    <div key={c.label} className="bg-white/10 rounded-lg p-4">
                      <div className="text-xl mb-2">{c.icon}</div>
                      <div className="text-sm font-semibold">{c.label}</div>
                      <div className="text-xs text-blue-200 mt-1">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center pb-4">
              <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 underline">
                最初からやり直す
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// ---- Helpers ----

function IssueRow({ level, text }: { level: 'high' | 'medium' | 'ok'; text: string }) {
  const cfg = {
    high:   { dot: 'bg-red-400',   text: 'text-gray-700' },
    medium: { dot: 'bg-amber-400', text: 'text-gray-600' },
    ok:     { dot: 'bg-green-400', text: 'text-gray-600' },
  }[level]

  return (
    <div className="flex items-start gap-2 text-sm">
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0 mt-1.5`} />
      <span className={cfg.text}>{text}</span>
    </div>
  )
}

function MetricCell({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: 'blue' | 'green' | 'red'
}) {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-500',
  }
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? colors[highlight] : 'text-gray-700'}`}>
        {value}
      </p>
    </div>
  )
}
