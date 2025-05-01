'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'

interface Streamer {
  nickname: string
  title: string
  isLive: boolean
  viewerCount: number
  thumbnailUrl: string  // 프로필 이미지
  broadcastThumbnail: string  // 방송 화면 썸네일
  url: string
}

const DEFAULT_THUMBNAIL = 'https://ssl.pstatic.net/static/nng/glive/icon/favicon.png'

const ChzzkCard = () => {
  const { data: streamers = [], isLoading, error } = useQuery<Streamer[]>({
    queryKey: ['streamers'],
    queryFn: async () => {
      const res = await fetch('/api/chzzk')
      if (!res.ok) throw new Error('Failed to fetch streamers')
      const data = await res.json()
      return data.sort((a: Streamer, b: Streamer) => {
        if (!a.isLive && b.isLive) return 1
        if (a.isLive && !b.isLive) return -1
        return (b.viewerCount || 0) - (a.viewerCount || 0)
      })
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 5 * 60 * 1000, // 5분
  })

  if (isLoading) {
    return (
      <div className="p-3">
        <div className="h-3 bg-slate-700/50 rounded w-3/4 mb-3 animate-pulse"></div>
        <div className="h-3 bg-slate-700/50 rounded w-1/2 animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-3 text-red-200 text-sm">
        스트리머 정보를 불러오는데 실패했습니다.
      </div>
    )
  }

  return (
    <div>
      <div className="px-3 py-2 border-b border-slate-700/50">
        <h2 className="flex items-center justify-center gap-1.5 text-[16px] text-slate-300 font-bold tracking-wide">
          <span className="text-purple-500 text-[18px]">🎮</span>
          검은사막 LIVE in Chzzk
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 px-2 py-2">
        <div className="space-y-1">
          {streamers.filter((_, i) => i % 2 === 0).map((streamer) => (
            <StreamerItem key={streamer.url} streamer={streamer} />
          ))}
        </div>
        <div className="space-y-1">
          {streamers.filter((_, i) => i % 2 === 1).map((streamer) => (
            <StreamerItem key={streamer.url} streamer={streamer} />
          ))}
        </div>
      </div>
    </div>
  )
}

const StreamerItem = ({ streamer }: { streamer: Streamer }) => (
  <a
    href={streamer.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group block"
  >
    <div className="flex flex-col gap-1">
      {streamer.isLive && (
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <img
            src={streamer.broadcastThumbnail || DEFAULT_THUMBNAIL}
            alt={`${streamer.nickname}의 방송`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-1 left-1">
            <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
              LIVE
            </span>
          </div>
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <div className="relative flex-shrink-0">
          <img
            src={streamer.thumbnailUrl || DEFAULT_THUMBNAIL}
            alt={streamer.nickname}
            className="w-7 h-7 rounded-full object-cover"
          />
        </div>
        <p className="text-[11px] font-medium text-slate-200 tracking-wide group-hover:text-purple-400 transition-colors whitespace-nowrap overflow-hidden text-ellipsis">
          {streamer.nickname}
        </p>
      </div>
    </div>
  </a>
)

export default ChzzkCard 