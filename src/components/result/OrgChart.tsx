interface OrgChartProps {
  locationCount: number
  devicesPerLocation: number
  totalDevices: number
  hqDevices?: number
  label: string
  variant: 'current' | 'ideal'
  staffPerLocation?: number
}

const MAX_DISPLAY_LOCATIONS = 4
const MAX_DEVICE_ICONS = 5

function StoreCard({
  index,
  devices,
  maxDevices,
  variant,
  staffPerLocation,
}: {
  index: number
  devices: number
  maxDevices: number
  variant: 'current' | 'ideal'
  staffPerLocation?: number
}) {
  const displayDevices = Math.min(devices, MAX_DEVICE_ICONS)
  const displayMax = Math.min(maxDevices, MAX_DEVICE_ICONS)
  const isEmpty = devices === 0

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 text-center text-xs ${
        variant === 'ideal'
          ? 'border-blue-200 bg-white'
          : isEmpty
          ? 'border-red-200 bg-red-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="font-medium text-gray-600 mb-1">店舗 {index + 1}</div>
      {staffPerLocation !== undefined && staffPerLocation > 0 && (
        <div className="text-[10px] text-gray-400 mb-1">
          👤 {staffPerLocation}人
        </div>
      )}
      {/* Device icons */}
      <div className="flex flex-wrap justify-center gap-0.5 min-h-[22px] items-center">
        {Array.from({ length: displayMax }).map((_, i) => (
          <span
            key={i}
            className={`text-sm leading-none ${i < displayDevices ? 'opacity-100' : 'opacity-15'}`}
          >
            📱
          </span>
        ))}
        {maxDevices > MAX_DEVICE_ICONS && (
          <span className="text-gray-400 text-xs ml-0.5">+{maxDevices - MAX_DEVICE_ICONS}</span>
        )}
      </div>
      <div
        className={`mt-1.5 font-semibold ${
          variant === 'ideal'
            ? 'text-blue-600'
            : isEmpty
            ? 'text-red-500'
            : 'text-gray-600'
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
  hqDevices = 0,
  variant,
  staffPerLocation,
}: OrgChartProps) {
  const displayLocations = Math.min(locationCount, MAX_DISPLAY_LOCATIONS)
  const hasMore = locationCount > MAX_DISPLAY_LOCATIONS

  const devicesArray = Array.from({ length: displayLocations }).map((_, i) => {
    if (variant === 'ideal') return devicesPerLocation
    const base = Math.floor(totalDevices / locationCount)
    const extra = i < (totalDevices % locationCount) ? 1 : 0
    return base + extra
  })

  const lineColor = variant === 'ideal' ? 'bg-blue-300' : 'bg-gray-300'

  const totalStaff = staffPerLocation !== undefined && staffPerLocation > 0
    ? staffPerLocation * locationCount
    : null

  return (
    <div className="flex flex-col items-center gap-2">
      {/* HQ */}
      <div
        className={`rounded-lg border px-5 py-2.5 text-center text-xs ${
          variant === 'ideal'
            ? 'border-blue-400 bg-blue-600 text-white'
            : 'border-gray-400 bg-gray-700 text-white'
        }`}
      >
        <div className="font-semibold">🏢 本部・本社</div>
        {hqDevices > 0 && (
          <div className={`mt-1 font-semibold text-sm ${variant === 'ideal' ? 'text-white' : 'text-gray-100'}`}>
            {hqDevices}台
          </div>
        )}
        {variant === 'ideal' && (
          <div className={`mt-0.5 text-[10px] ${hqDevices > 0 ? 'text-blue-200' : 'text-blue-200'}`}>MDM 一元管理</div>
        )}
      </div>

      {/* Vertical line */}
      <div className={`w-px h-4 ${lineColor}`} />

      {/* Horizontal bar */}
      {displayLocations > 1 && (
        <div
          className={`h-px ${lineColor}`}
          style={{ width: `${Math.min(displayLocations * 88, 360)}px` }}
        />
      )}

      {/* Store cards */}
      <div className="flex gap-2.5 flex-wrap justify-center">
        {devicesArray.map((devices, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            {displayLocations > 1 && <div className={`w-px h-3 ${lineColor}`} />}
            <StoreCard
              index={i}
              devices={devices}
              maxDevices={variant === 'ideal' ? devicesPerLocation : Math.max(1, Math.ceil(totalDevices / locationCount))}
              variant={variant}
              staffPerLocation={staffPerLocation}
            />
          </div>
        ))}
        {hasMore && (
          <div className="flex flex-col items-center gap-1.5">
            {displayLocations > 1 && <div className="w-px h-3 bg-gray-200" />}
            <div className="rounded-lg border border-dashed border-gray-300 px-3 py-2.5 text-center text-gray-400 text-xs">
              他<br />
              <span className="font-semibold">{locationCount - MAX_DISPLAY_LOCATIONS}</span>店舗
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      <div
        className={`mt-1 text-xs font-semibold px-3 py-1 rounded-full ${
          variant === 'ideal'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        合計 {totalDevices + hqDevices}台
        {hqDevices > 0 && (
          <span className="font-normal text-[10px] ml-1 opacity-70">
            （本部{hqDevices}＋店舗{totalDevices}）
          </span>
        )}
      </div>

      {/* Staff total */}
      {totalStaff !== null && (
        <div className="text-[10px] text-gray-400">
          👤 店舗スタッフ合計 {totalStaff}人（{staffPerLocation}人 × {locationCount}拠点）
        </div>
      )}
    </div>
  )
}
