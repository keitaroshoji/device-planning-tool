interface GapItem {
  dimension: string
  current: string
  ideal: string
  severity: 'high' | 'medium' | 'low' | 'ok'
}

interface GapAnalysisProps {
  items: GapItem[]
}

const SEVERITY_CONFIG = {
  high: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500', label: '要対応' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', label: '改善余地あり' },
  low: { bg: 'bg-yellow-50', border: 'border-yellow-100', badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400', label: '軽微' },
  ok: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700', dot: 'bg-green-500', label: '問題なし' },
}

export function GapAnalysis({ items }: GapAnalysisProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1fr_1fr_auto] bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
        <div className="px-4 py-3">評価項目</div>
        <div className="px-4 py-3 border-l border-slate-200 text-red-500">🔴 現状</div>
        <div className="px-4 py-3 border-l border-slate-200 text-blue-500">🔵 理想</div>
        <div className="px-4 py-3 border-l border-slate-200">ギャップ</div>
      </div>

      {/* Rows */}
      {items.map((item, i) => {
        const cfg = SEVERITY_CONFIG[item.severity]
        return (
          <div
            key={i}
            className={`grid grid-cols-[1fr_1fr_1fr_auto] border-b last:border-b-0 border-slate-100 ${cfg.bg}`}
          >
            <div className="px-4 py-3 text-sm font-semibold text-slate-700">
              {item.dimension}
            </div>
            <div className="px-4 py-3 border-l border-slate-200 text-sm text-slate-600">
              {item.current}
            </div>
            <div className="px-4 py-3 border-l border-slate-200 text-sm text-blue-700 font-medium">
              {item.ideal}
            </div>
            <div className="px-4 py-3 border-l border-slate-200 flex items-center">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                {cfg.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** ヒアリング結果からギャップ分析データを生成 */
export function buildGapItems({
  currentDeviceCount,
  idealDeviceCount,
  locationCount,
  operationStyleLabel,
  hasByod,
}: {
  currentDeviceCount: number
  idealDeviceCount: number
  locationCount: number
  operationStyleLabel: string
  hasByod: boolean
}): GapItem[] {
  const deviceGapRatio = idealDeviceCount > 0 ? currentDeviceCount / idealDeviceCount : 1
  const deviceGap = idealDeviceCount - currentDeviceCount

  return [
    {
      dimension: '端末充足率',
      current: currentDeviceCount === 0 ? '端末なし' : `${currentDeviceCount}台 (${Math.round(deviceGapRatio * 100)}%)`,
      ideal: `${idealDeviceCount}台 (100%)`,
      severity: deviceGapRatio >= 1 ? 'ok' : deviceGapRatio >= 0.7 ? 'low' : deviceGapRatio >= 0.4 ? 'medium' : 'high',
    },
    {
      dimension: 'マニュアルアクセス',
      current: currentDeviceCount === 0
        ? '端末がなく現場でのアクセス不可'
        : deviceGapRatio < 0.5
        ? '端末が少なく待ち時間が発生'
        : '一部スタッフは参照できない',
      ideal: `${operationStyleLabel}で全スタッフが必要なタイミングで参照可能`,
      severity: currentDeviceCount === 0 ? 'high' : deviceGapRatio < 0.5 ? 'high' : deviceGapRatio < 0.8 ? 'medium' : 'ok',
    },
    {
      dimension: '端末管理・セキュリティ',
      current: hasByod
        ? '個人端末のため紛失・情報漏えいリスクあり'
        : currentDeviceCount === 0
        ? '管理対象端末なし'
        : 'MDM未導入の可能性あり',
      ideal: 'MDMで全端末を一元管理（遠隔ロック・アプリ配信）',
      severity: hasByod ? 'high' : 'medium',
    },
    {
      dimension: '多拠点展開の標準化',
      current: locationCount > 1 && currentDeviceCount < locationCount
        ? `${locationCount}拠点中、端末のない店舗あり`
        : currentDeviceCount === 0
        ? '端末がなく標準化が困難'
        : '一部拠点に端末が集中している可能性',
      ideal: `全${locationCount}拠点に端末を均一配置し、同一環境で運用`,
      severity: locationCount > 1 && currentDeviceCount < locationCount ? 'high' : 'medium',
    },
    {
      dimension: '教育・研修の効率',
      current: currentDeviceCount === 0
        ? '紙マニュアルや口頭説明に頼った研修'
        : '端末が少なく、集合研修や待ち時間が発生',
      ideal: 'デジタルマニュアルでOJT・自主学習が可能、習得度も管理',
      severity: currentDeviceCount === 0 ? 'high' : 'medium',
    },
  ]
}
