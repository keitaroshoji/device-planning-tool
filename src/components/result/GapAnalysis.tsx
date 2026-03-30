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
  high:   { badge: 'bg-red-100 text-red-700',    dot: 'bg-red-400',   label: '要対応' },
  medium: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', label: '改善余地あり' },
  low:    { badge: 'bg-yellow-100 text-yellow-700',dot: 'bg-yellow-400',label: '軽微' },
  ok:     { badge: 'bg-green-100 text-green-700', dot: 'bg-green-400', label: '問題なし' },
}

export function GapAnalysis({ items }: GapAnalysisProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1.2fr_1fr_1fr_120px] bg-gray-50 border-b border-gray-200">
        <div className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">評価項目</div>
        <div className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-l border-gray-200">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />現状
          </span>
        </div>
        <div className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-l border-gray-200">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />理想
          </span>
        </div>
        <div className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-l border-gray-200">ギャップ</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-50">
        {items.map((item, i) => {
          const cfg = SEVERITY_CONFIG[item.severity]
          return (
            <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr_120px] hover:bg-gray-50 transition-colors">
              <div className="px-5 py-3.5 text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                {item.dimension}
              </div>
              <div className="px-5 py-3.5 border-l border-gray-100 text-sm text-gray-600">
                {item.current}
              </div>
              <div className="px-5 py-3.5 border-l border-gray-100 text-sm text-gray-700">
                {item.ideal}
              </div>
              <div className="px-5 py-3.5 border-l border-gray-100 flex items-center">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${cfg.badge}`}>
                  {cfg.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

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
  return [
    {
      dimension: '端末充足率',
      current: currentDeviceCount === 0
        ? '端末なし'
        : `${currentDeviceCount}台（${Math.round(deviceGapRatio * 100)}%）`,
      ideal: `${idealDeviceCount}台（100%）`,
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
