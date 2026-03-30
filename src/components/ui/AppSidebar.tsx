import Link from 'next/link'

interface AppSidebarProps {
  activePage?: 'home' | 'wizard' | 'result' | 'settings'
}

const NAV_ITEMS = [
  { key: 'home',     icon: '🏠', href: '/',             label: 'ホーム' },
  { key: 'wizard',   icon: '📋', href: '/wizard?step=1',label: '診断' },
  { key: 'result',   icon: '📊', href: '/result',       label: '結果' },
  { key: 'settings', icon: '⚙️', href: '/settings',     label: '設定' },
] as const

export function AppSidebar({ activePage }: AppSidebarProps) {
  return (
    <aside className="w-16 bg-gray-900 flex flex-col items-center py-5 gap-2 shrink-0 sticky top-0 h-screen z-20">
      {/* Logo */}
      <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center mb-2">
        <span className="text-white font-bold text-base">S</span>
      </div>

      {/* Nav */}
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          title={item.label}
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-base transition-colors
            ${activePage === item.key
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800'
            }`}
        >
          {item.icon}
        </Link>
      ))}

      {/* Bottom user avatar */}
      <div className="mt-auto w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 text-xs font-semibold">
        U
      </div>
    </aside>
  )
}
