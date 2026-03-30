import React from 'react'

interface ChoiceCardProps {
  selected: boolean
  onClick: () => void
  emoji?: string
  label: string
  description?: string
  disabled?: boolean
}

export function ChoiceCard({
  selected,
  onClick,
  emoji,
  label,
  description,
  disabled,
}: ChoiceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left rounded-lg border px-4 py-3 transition-colors
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          selected
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {emoji && (
          <span className="text-lg shrink-0 w-7 text-center">{emoji}</span>
        )}
        <div className="flex-1 min-w-0">
          <div
            className={`font-medium text-sm ${
              selected ? 'text-blue-700' : 'text-gray-800'
            }`}
          >
            {label}
          </div>
          {description && (
            <div className="mt-0.5 text-xs text-gray-500 leading-snug">
              {description}
            </div>
          )}
        </div>
        {/* Checkbox-style indicator */}
        <div
          className={`shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center ${
            selected
              ? 'border-blue-500 bg-blue-500'
              : 'border-gray-300'
          }`}
        >
          {selected && (
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 12 12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}
