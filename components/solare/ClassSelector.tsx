// ✅ /components/solare/ClassSelector.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import classList from '@/lib/constants/class-list'

export default function ClassSelector() {
  const pathname = usePathname()
  const router = useRouter()
  const currentClass = decodeURIComponent(pathname.split('/').pop() || '전체')

  const handleClick = (cls: string) => {
    if (cls === '전체') {
      router.push('/solare-league')
    } else {
      router.push(`/solare-league/${encodeURIComponent(cls)}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => handleClick('전체')}
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          currentClass === '전체' ? 'bg-yellow-400 text-black' : 'bg-white text-black'
        }`}
      >
        전체
      </button>
      {classList.map(cls => (
        <button
          key={cls}
          onClick={() => handleClick(cls)}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentClass === cls ? 'bg-yellow-400 text-black' : 'bg-white text-black'
          }`}
        >
          {cls}
        </button>
      ))}
    </div>
  )
}
