'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UpdateItem {
  id: number
  title: string
  link: string
  date: string
}

export default function UpdateCard() {
  const [updates, setUpdates] = useState<UpdateItem[]>([])

  useEffect(() => {
    fetch('/api/updates')
      .then(res => res.json())
      .then(data => setUpdates(data))
      .catch(err => console.error('업데이트 불러오기 실패:', err))
  }, [])

  return (
    <div className="bg-zinc-800 rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-1">🛠️ 검은사막 업데이트</h2>
      <div className="border-b border-zinc-600 mb-3" />
      <ul className="space-y-1 list-disc pl-4 text-sm text-white">
        {updates.map((item, idx) => (
          <li key={item.id || idx}>
            <Link
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-400 hover:underline transition-all"
              title={item.title}
            >
              <span className="font-mono text-zinc-300 shrink-0">
                {formatDate(item.date)}
              </span>
              <span className="truncate font-semibold">{stripTitle(item.title)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const day = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]
  return `${mm}.${dd}(${day})`
}

function stripTitle(title: string) {
  return title
    .replace(/^\d+월 \d+일\(.\)\s*/, '') // 날짜 제거
    .replace(/\(최종\s*수정\s*:[^)]+\)/g, '') // 최종 수정 제거
    .trim()
}
