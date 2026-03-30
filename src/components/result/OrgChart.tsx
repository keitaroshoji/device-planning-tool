interface OrgChartProps {
  locationCount: number
  devicesPerLocation: number
  totalDevices: number
  label: string
  variant: 'current' | 'ideal'
}

const MAX_DISPLAY_LOCATIONS = 4
const MAX_DEVICE_ICONS = 6

function DeviceIcon({ filled }: { filled: boolean }) {
  return (
    <span
      className={`inline-block text-base leading-none ${
        filled ? 'opacity-100' : 'opacity-20'
      }`}
      title={filled ? '端末あり' : '端末なし'}
    >
      📱
    </span>
  )
}

function StoreCard({
  index,
  devices,
  maxDevices,
  variant,
}: {
  index: number
  devices: number
  maxDevices: number
  variant: 'current' | 'ideal'
}) {
  const displayDevices = Math.min(devices, MAX_DEVICE_ICONS)
  const displayMax = Math.min(maxDevices, MAX_DEVICE_ICONS)

  return (
    <div
      className={`rounded-xl border-2 px-3 py-2.5 text-center ${
        variant === 'ideal'
          ? 'border-blue-300 bg-blue-50'
          : devices > 0
          ? 'border-slate-300 bg-white'
          : 'border-red-200 bg-red-50'
      }`}
    >
      <div className="text-xs font-semibold text-slate-600 mb-1.5">
        店舗 {index + 1}
      </div>
      {/* Device icons row */}
      <div className="flex flex-wrap justify-center gap-0.5 min-h-[28px] items-center">
        {Array.from({ length: displayMax }).map((_, i) => (
          <DeviceIcon key={i} filled={i < displayDevices} />
        ))}
        {maxDevices > MAX_DEVICE_ICONS && (
          <span className="text-xs text-slate-400 ml-0.5">
            +{maxDevices - MAX_DEVICE_ICONS}
          </span>
        )}
      </div>
      <div
        className={`mt-1.5 text-xs font-bold ${
          variant === 'ideal'
            ? 'text-blue-600'
            : devices > 0
            ? 'text-slate-600'
            : 'text-red-500'
        }`}
      >
        {devices}台
      </div>
    </div>
  )
}

export function OrgChart({
  locationCount,
  devicesPerLocation,
  totalDevices,
  label,
  variant,
}: OrgChartProps) {
  const displayLocations = Math.min(locationCount, MAX_DISPLAY_LOCATIONS)
  const hasMore = locationCount > MAX_DISPLAY_LOCATIONS

  // Spread devices across locations for current state visualization
  const devicesArray = Array.from({ length: displayLocations }).map((_, i) => {
    if (variant === 'ideal') return devicesPerLocation
    // For current: distribute devices across stores, some may be 0
    const base = Math.floor(totalDevices / locationCount)
    const extra = i < (totalDevices % locationCount) ? 1 : 0
    return base + extra
  })

  return (
    <div className="flex flex-col items-center gap-3">
      {/* HQ Box */}
      <div
        className={`rounded-2xl border-2 px-6 py-3 text-center shadow-sm ${
          variant === 'ideal'
            ? 'border-blue-500 bg-blue-600 text-white'
            : 'border-slate-400 bg-slate-700 text-white'
        }`}
      >
        <div className="text-lg">🏢</div>
        <div className="text-sm font-bold mt-0.5">本部・本社</div>
        {variant === 'ideal' && (
          <div className="text-xs text-blue-200 mt-0.5">MDM 一元管理</div>
        )}
      </div>

      {/* Connector line */}
      <div
        className={`w-0.5 h-6 ${
          variant === 'ideal' ? 'bg-blue-400' : 'bg-slate-300'
        }`}
      />

      {/* Horizontal connector */}
      {displayLocations > 1 && (
        <div
          className={`h-0.5 ${
            variant === 'ideal' ? 'bg-blue-400' : 'bg-slate-300'
          }`}
          style={{ width: `${Math.min(displayLocations * 96, 380)}px` }}
        />
      )}

      {/* Store cards */}
      <div className="flex gap-3 flex-wrap justify-center">
        {devicesArray.map((devices, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            {/* Vertical connector from horizontal bar */}
            {displayLocations > 1 && (
              <div
                className={`w-0.5 h-4 ${
                  variant === 'ideal' ? 'bg-blue-400' : 'bg-slate-300'
                }`}
              />
            )}
            <StoreCard
              index={i}
              devices={devices}
              maxDevices={variant === 'ideal' ? devicesPerLocation : Math.max(1, Math.ceil(totalDevices / locationCount))}
              variant={variant}
            />
          </div>
        ))}
        {hasMore && (
          <div className="flex flex-col items-center justify-center gap-1.5">
            {displayLocations > 1 && <div className="w-0.5 h-4 bg-slate-200" />}
            <div className="rounded-xl border-2 border-dashed border-slate-300 px-3 py-2.5 text-center text-slate-400 text-xs">
              他<br />
              <span className="font-bold">{locationCount - MAX_DISPLAY_LOCATIONS}</span>店舗
            </div>
          </div>
        )}
      </div>

      {/* Total label */}
      <div
        className={`mt-1 text-sm font-bold px-4 py-1.5 rounded-full ${
          variant === 'ideal'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-slate-100 text-slate-600'
        }`}
      >
        合計 {totalDevices}台
      </div>
    </div>
  )
}
