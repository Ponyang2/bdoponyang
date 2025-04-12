'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import classList from '@/lib/constants/class-list'

export default function ClassSelector() {
  const pathname = usePathname()
  const router = useRouter()
  // 'solare-league'는 제외하고 currentClass 값 설정
  const currentClass = decodeURIComponent(pathname.split('/').pop() || '')
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (cls: string) => {
    if (cls === '전체') {
      router.push('/solare-league')
    } else {
      router.push(`/solare-league/${encodeURIComponent(cls)}`)
    }
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-between px-20 py-2 text-sm font-medium text-black bg-white rounded-none border border-gray-300 shadow-sm overflow-hidden text-ellipsis whitespace-nowrap"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* 'solare-league'가 아닌 값만 표시 */}
          {currentClass && currentClass !== 'solare-league' ? currentClass : '전체'}
          <svg
            className="w-5 h-5 ml-2 -mr-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.23a.75.75 0 011.06 0L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 origin-top-right rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 flex flex-col items-center"> {/* flex 및 items-center 추가하여 가운데 정렬 */}
            <button
              className="text-gray-700 block px-20 py-2 text-sm rounded-none overflow-hidden text-ellipsis whitespace-nowrap"
              onClick={() => handleClick('전체')}
            >
              전체
            </button>
            {classList.map(cls => (
              <button
                key={cls}
                className="text-gray-700 block px-18 py-2 text-sm rounded-none overflow-hidden text-ellipsis whitespace-nowrap"
                onClick={() => handleClick(cls)}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
