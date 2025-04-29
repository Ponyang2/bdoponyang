'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/war-records/summary', label: '전체 순위' },
  { href: '/war-records/history', label: '전투 기록 보기' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="p-5 w-48 space-y-2">
      <h2 className="text-lg font-semibold mb-4 text-white">
        <span>📋</span> 거점/점령전
      </h2>
      {navItems.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'block px-4 py-2 rounded-md transition-all',
            pathname === href 
              ? 'bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white shadow-md' 
              : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
          )}
        >
          {label}
        </Link>
      ))}
    </aside>
  )
}
