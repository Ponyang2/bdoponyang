'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type SearchResult = {
  type: 'guild' | 'family'
  name: string
}

export default function Navbar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = query.trim().normalize('NFC')
    if (!trimmed) return

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
      const data: SearchResult[] = await res.json()

      const exact = data.find(
        (item) => item.name.normalize('NFC') === trimmed
      )

      if (exact) {
        router.push(`/${exact.type}/${encodeURIComponent(exact.name)}`)
      } else if (data.length === 1) {
        const result = data[0]
        router.push(`/${result.type}/${encodeURIComponent(result.name)}`)
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`)
      }
    } catch (err) {
      console.error('검색 오류:', err)
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <div className="w-full sticky top-0 z-50 bg-zinc-900">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
        {/* 로고 */}
        <a href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={50}
            height={40}
            className="object-contain rounded"
          />
          <span className="text-2xl font-bold text-white">포냥이</span>
        </a>

        {/* 검색창 */}
        <div className="relative flex-grow mx-8 max-w-2xl">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="가문명 또는 길드명을 입력하세요..."
              className="flex-grow px-4 py-2 rounded-l-md bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-black rounded-r-md hover:bg-yellow-400 transition whitespace-nowrap"
            >
              검색
            </button>
          </form>
        </div>

        {/* 우측 아이콘 */}
        <div className="flex items-center gap-4 text-white text-xl shrink-0">
          <button className="hover:text-yellow-400">🌐</button>
          <button className="hover:text-yellow-400">⚙️</button>
        </div>
      </div>

      {/* 메뉴바 */}
      <div className="bg-zinc-800 border-t border-zinc-700">
        <div className="flex justify-between max-w-6xl mx-auto px-6 py-2 text-base font-semibold text-white">
          <Link href="/" className="px-4 py-2 hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400 transition-all duration-150">
            홈
          </Link>
          <Link href="/war-records" className="px-4 py-2 hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400 transition-all duration-150">
            거점/점령전
          </Link>
          <Link href="/guild-league" className="px-4 py-2 hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400 transition-all duration-150">
            길드 리그
          </Link>
          <Link href="/solare-league" className="px-4 py-2 hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400 transition-all duration-150">
            솔라레의 창
          </Link>
          <a className="px-4 py-2 hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400 transition-all duration-150" href="#">
            통계
          </a>
          <a className="px-4 py-2 hover:text-yellow-400 hover:border-b-2 hover:border-yellow-400 transition-all duration-150" href="#">
            도구
          </a>
        </div>
      </div>
    </div>
  )
}
