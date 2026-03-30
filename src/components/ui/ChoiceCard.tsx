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
        w-full text-left rounded-2xl border-2 p-4 transition-all
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
        disabled:opacity-40 disabled:cursor-not-allowed
        ${
          selected
            ? 'border-blue-500 bg-blue-50 shadow-md'
            : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {emoji && (
          <span className="text-2xl mt-0.5 shrink-0">{emoji}</span>
        )}
        <div className="flex-1 min-w-0">
          <div
            className={`font-semibold text-base ${
              selected ? 'text-blue-700' : 'text-slate-800'
            }`}
          >
            {label}
          </div>
          {description && (
            <div className="mt-0.5 text-sm text-slate-500 leading-snug">
              {description}
            </div>
          )}
        </div>
        <div
          className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
            selected
              ? 'border-blue-500 bg-blue-500'
              : 'border-slate-300'
          }`}
        >
          {selected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 12 12">
              <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}
