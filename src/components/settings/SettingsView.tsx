'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  useSettingsStore,
  DEFAULT_SETTINGS,
  ProductSetting,
} from '@/src/store/settingsStore'
import { ProductKey } from '@/src/types/products'
import { PRODUCTS } from '@/src/data/products'
import { AppSidebar } from '@/src/components/ui/AppSidebar'

const DURATION_OPTIONS = [1, 3, 6, 12, 24, 36]
const DURATION_LABELS: Record<number, string> = {
  1: '1ヶ月', 3: '3ヶ月', 6: '6ヶ月', 12: '12ヶ月', 24: '24ヶ月', 36: '36ヶ月',
}

const CATEGORY_OPTIONS = [
  { value: 'mobile',  label: 'モバイル端末' },
  { value: 'monitor', label: 'モニター' },
  { value: 'camera',  label: 'カメラ' },
  { value: 'mdm',     label: 'MDM' },
  { value: 'other',   label: 'その他' },
]

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  mobile:  { label: 'モバイル端末', color: 'bg-blue-50 text-blue-700' },
  monitor: { label: 'モニター',     color: 'bg-purple-50 text-purple-700' },
  camera:  { label: 'カメラ',       color: 'bg-green-50 text-green-700' },
  mdm:     { label: 'MDM',          color: 'bg-amber-50 text-amber-700' },
  other:   { label: 'その他',        color: 'bg-gray-100 text-gray-600' },
}

const BUILTIN_ORDER: ProductKey[] = [
  'mobile_wifi', 'mobile_cellular', 'smart_monitor',
  'camera_head_mount', 'camera_wearable', 'camera_wearable_mic', 'mdm_only',
]

function formatPrice(n: number | undefined): string {
  if (n === undefined) return ''
  return n.toLocaleString('ja-JP')
}

function ProductRow({
  setting,
  defaultSetting,
  onToggle,
  onNameChange,
  onDescriptionChange,
  onPriceChange,
  onInitialCostChange,
  onHasInitialCostChange,
  onReset,
  onDelete,
}: {
  setting: ProductSetting
  defaultSetting?: ProductSetting
  onToggle: () => void
  onNameChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onPriceChange: (months: number, value: string) => void
  onInitialCostChange: (v: string) => void
  onHasInitialCostChange: (v: boolean) => void
  onReset?: () => void
  onDelete?: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const builtinProduct = PRODUCTS[setting.key as ProductKey]
  const catKey = setting.category ?? builtinProduct?.category ?? 'mobile'
  const cat = CATEGORY_LABELS[catKey] ?? CATEGORY_LABELS.other
  const emoji = setting.imageEmoji ?? builtinProduct?.imageEmoji ?? '📱'

  const isModified = defaultSetting && (
    setting.name !== defaultSetting.name ||
    setting.description !== defaultSetting.description ||
    setting.initialCost !== defaultSetting.initialCost ||
    setting.hasInitialCost !== defaultSetting.hasInitialCost ||
    DURATION_OPTIONS.some(
      (m) => (setting.priceTable[m] ?? '') !== (defaultSetting.priceTable[m] ?? '')
    )
  )

  return (
    <div className={`border-b border-gray-100 last:border-0 ${!setting.enabled ? 'opacity-50' : ''}`}>
      {/* Summary row */}
      <div
        className="grid items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer"
        style={{ gridTemplateColumns: '1fr 100px 2fr 80px 80px' }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0">{emoji}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{setting.name}</p>
            {setting.isCustom && (
              <span className="text-xs text-indigo-500 font-medium">カスタム</span>
            )}
            {!setting.isCustom && isModified && (
              <span className="text-xs text-amber-600">変更あり</span>
            )}
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded w-fit ${cat.color}`}>
          {cat.label}
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {DURATION_OPTIONS.filter(m => setting.priceTable[m] !== undefined).map((m) => (
            <span key={m} className="text-xs text-gray-500">
              {DURATION_LABELS[m]}: <span className="font-medium text-gray-700">¥{formatPrice(setting.priceTable[m])}</span>
            </span>
          ))}
          {Object.keys(setting.priceTable).length === 0 && (
            <span className="text-xs text-gray-400 italic">価格未設定</span>
          )}
        </div>
        <div className="flex justify-center" onClick={(e) => { e.stopPropagation(); onToggle() }}>
          <button
            type="button"
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
              setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
              setting.enabled ? 'translate-x-4' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
        <div className="flex justify-end">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded edit panel */}
      {expanded && (
        <div className="px-5 pb-5 pt-2 bg-gray-50 border-t border-gray-100 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">製品名</label>
              <input
                type="text"
                value={setting.name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">説明文</label>
              <input
                type="text"
                value={setting.description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              月額単価（税別・1台あたり）
            </label>
            <div className="grid grid-cols-6 gap-2">
              {DURATION_OPTIONS.map((m) => (
                <div key={m}>
                  <p className="text-xs text-gray-400 mb-1 text-center">{DURATION_LABELS[m]}</p>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">¥</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      placeholder="未設定"
                      value={setting.priceTable[m] ?? ''}
                      onChange={(e) => onPriceChange(m, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-6 pr-2 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">空欄にするとその期間オプションを非表示にします</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`init-${setting.key}`}
                checked={setting.hasInitialCost}
                onChange={(e) => onHasInitialCostChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400"
              />
              <label htmlFor={`init-${setting.key}`} className="text-sm text-gray-700">
                初期費用あり（キッティング）
              </label>
            </div>
            {setting.hasInitialCost && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">金額：</span>
                <div className="relative w-32">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">¥</span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={setting.initialCost}
                    onChange={(e) => onInitialCostChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-6 pr-2 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <span className="text-sm text-gray-400">円 / 台</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            {onDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-red-600">
                    {setting.isCustom
                      ? '本当に削除しますか？'
                      : 'リストから削除します。「すべてデフォルトに戻す」で復元できます。'}
                  </span>
                  <button onClick={onDelete} className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-xs">削除する</button>
                  <button onClick={() => setConfirmDelete(false)} className="text-gray-500 hover:text-gray-700 px-3 py-1 border border-gray-300 rounded-lg text-xs bg-white">キャンセル</button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-xs text-red-500 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  🗑 このメニューを削除
                </button>
              )
            )}
            {!setting.isCustom && isModified && onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-xs text-gray-500 hover:text-red-600 underline transition-colors ml-auto"
              >
                この製品をデフォルトに戻す
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const EMOJI_OPTIONS = ['📱', '💻', '🖥️', '📺', '📷', '🎥', '🔒', '📦', '🖨️', '⌨️', '🖱️', '📡']

function AddProductForm({ onAdd, onCancel }: { onAdd: (s: ProductSetting) => void; onCancel: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('mobile')
  const [emoji, setEmoji] = useState('📱')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    const key = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    onAdd({
      key,
      name: name.trim(),
      description: description.trim(),
      enabled: true,
      priceTable: {},
      initialCost: 0,
      hasInitialCost: false,
      isCustom: true,
      imageEmoji: emoji,
      category,
    })
  }

  return (
    <div className="border-t-2 border-blue-200 bg-blue-50 px-5 py-4 space-y-4">
      <p className="text-sm font-semibold text-blue-700">新しいメニューを追加</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-4 items-end">
          {/* Emoji */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">アイコン</label>
            <select
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="border border-gray-300 rounded-lg px-2 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {EMOJI_OPTIONS.map((em) => (
                <option key={em} value={em}>{em}</option>
              ))}
            </select>
          </div>
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">製品名 <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例：タブレット（大画面）"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">説明文</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例：10インチ以上の大画面タブレット"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">カテゴリ</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-400">※ 価格は追加後に各メニューの詳細から設定できます</p>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={!name.trim()}
            className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            追加する
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  )
}

export function SettingsView() {
  const {
    productSettings, updateProduct, updatePrice,
    resetProduct, resetAll, addProduct, deleteProduct,
  } = useSettingsStore()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  function handleSaveFlash() {
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }

  function handleResetAll() {
    resetAll()
    setShowResetConfirm(false)
    handleSaveFlash()
  }

  function handleAddProduct(setting: ProductSetting) {
    addProduct(setting)
    setShowAddForm(false)
    handleSaveFlash()
  }

  // 組み込み製品（順序固定）＋カスタム製品（追加順）
  const builtinKeys = BUILTIN_ORDER.filter((k) => productSettings[k])
  const customKeys = Object.keys(productSettings).filter((k) => productSettings[k]?.isCustom)

  const makeHandlers = (key: string) => ({
    onToggle:               () => updateProduct(key, { enabled: !productSettings[key].enabled }),
    onNameChange:           (v: string) => updateProduct(key, { name: v }),
    onDescriptionChange:    (v: string) => updateProduct(key, { description: v }),
    onPriceChange:          (months: number, val: string) => {
      const num = parseInt(val, 10)
      updatePrice(key, months, val === '' || isNaN(num) ? undefined : num)
    },
    onInitialCostChange:    (v: string) => {
      const num = parseInt(v, 10)
      updateProduct(key, { initialCost: isNaN(num) ? 0 : num })
    },
    onHasInitialCostChange: (v: boolean) => updateProduct(key, { hasInitialCost: v }),
  })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AppSidebar activePage="settings" />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-14 flex items-center px-8 gap-4 sticky top-0 z-10">
          <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            ホーム
          </Link>
          <div className="w-px h-4 bg-gray-200" />
          <h1 className="text-sm font-semibold text-gray-700">設定</h1>
          <div className="w-px h-4 bg-gray-200" />
          <span className="text-sm text-gray-400">端末・価格設定</span>
          <div className="ml-auto flex items-center gap-3">
            {savedFlash && (
              <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full font-medium">
                ✓ 保存しました
              </span>
            )}
            <button
              onClick={handleSaveFlash}
              className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              保存する
            </button>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">端末・価格設定</h2>
                <p className="mt-1 text-sm text-gray-500">
                  提供する端末の種類と月額単価を設定します。変更は診断結果の料金シミュレーターに反映されます。
                </p>
              </div>
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-sm text-gray-400 hover:text-red-600 transition-colors"
              >
                すべてデフォルトに戻す
              </button>
            </div>

            {showResetConfirm && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between">
                <p className="text-sm text-red-700">
                  すべての設定をデフォルト値にリセットします。カスタムメニューも削除されます。この操作は取り消せません。
                </p>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <button onClick={() => setShowResetConfirm(false)} className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 border border-gray-300 rounded-lg bg-white">キャンセル</button>
                  <button onClick={handleResetAll} className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg">リセットする</button>
                </div>
              </div>
            )}

            {/* Products table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="grid items-center gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200"
                style={{ gridTemplateColumns: '1fr 100px 2fr 80px 80px' }}
              >
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">製品名</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">カテゴリ</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">月額単価（税別）</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">有効</span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">詳細</span>
              </div>

              {/* Built-in products */}
              {builtinKeys.map((key) => {
                const setting = productSettings[key]
                if (!setting) return null
                const h = makeHandlers(key)
                return (
                  <ProductRow
                    key={key}
                    setting={setting}
                    defaultSetting={DEFAULT_SETTINGS[key]}
                    {...h}
                    onReset={() => resetProduct(key)}
                    onDelete={() => { deleteProduct(key); handleSaveFlash() }}
                  />
                )
              })}

              {/* Custom products */}
              {customKeys.length > 0 && (
                <>
                  <div className="px-5 py-2 bg-indigo-50 border-t border-indigo-100">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">カスタムメニュー</span>
                  </div>
                  {customKeys.map((key) => {
                    const setting = productSettings[key]
                    if (!setting) return null
                    const h = makeHandlers(key)
                    return (
                      <ProductRow
                        key={key}
                        setting={setting}
                        {...h}
                        onDelete={() => { deleteProduct(key); handleSaveFlash() }}
                      />
                    )
                  })}
                </>
              )}

              {/* Add form or add button */}
              {showAddForm ? (
                <AddProductForm onAdd={handleAddProduct} onCancel={() => setShowAddForm(false)} />
              ) : (
                <div className="px-5 py-3 border-t border-dashed border-gray-200 flex">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    メニューを追加する
                  </button>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-700">
              <p className="font-semibold mb-1">設定内容について</p>
              <ul className="space-y-1 text-blue-600 text-xs">
                <li>・変更した設定はブラウザのLocalStorageに保存されます</li>
                <li>・「有効」をオフにした製品は診断結果に表示されません</li>
                <li>・月額単価を空欄にするとその期間オプションが非表示になります</li>
                <li>・初期費用（キッティング費用）は1台あたりの金額です</li>
                <li>・カスタムメニューは追加後に詳細から価格を設定してください</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
