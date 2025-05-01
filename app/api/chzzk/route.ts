import { NextResponse } from 'next/server'

interface Streamer {
  nickname: string
  title: string
  isLive: boolean
  viewerCount: number
  thumbnailUrl: string
  broadcastThumbnail: string
  url: string
}

export const revalidate = 60 // 1분 캐시

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'ko-KR,ko;q=0.9',
  'Referer': 'https://chzzk.naver.com/',
  'Origin': 'https://chzzk.naver.com'
}

const DEFAULT_THUMBNAIL = 'https://ssl.pstatic.net/static/nng/glive/icon/favicon.png'

export async function GET() {
  try {
    // 검은사막 카테고리의 라이브 목록 가져오기
    const livesRes = await fetch('https://api.chzzk.naver.com/service/v2/categories/GAME/Black_Desert/lives', {
      headers,
      next: { revalidate: 60 } // 1분마다 갱신
    })
    
    if (!livesRes.ok) {
      throw new Error(`Failed to fetch lives: ${livesRes.status} ${livesRes.statusText}`)
    }

    const livesData = await livesRes.json()

    if (livesData.code !== 200) {
      throw new Error(`Lives API Error: ${livesData.message || 'Unknown error'}`)
    }

    // 라이브 방송 매핑
    const streamers = (livesData.content?.data || [])
      .map((stream: any) => {
        try {
          return {
            nickname: stream.channel?.channelName || '알 수 없음',
            title: stream.liveTitle || '',
            isLive: true,
            viewerCount: stream.concurrentUserCount || 0,
            thumbnailUrl: stream.channel?.channelImageUrl || DEFAULT_THUMBNAIL,
            broadcastThumbnail: stream.liveThumbAddr || DEFAULT_THUMBNAIL,
            url: `https://chzzk.naver.com/live/${stream.channel?.channelId || ''}`
          }
        } catch (error) {
          console.error('Failed to process stream data:', error)
          return null
        }
      })

    // null 값 제거 및 시청자 수 기준으로 정렬
    const filteredStreamers = streamers
      .filter((streamer: Streamer | null): streamer is Streamer => streamer !== null)
      .sort((a: Streamer, b: Streamer) => b.viewerCount - a.viewerCount)

    return NextResponse.json(filteredStreamers)
  } catch (error) {
    console.error('Failed to fetch streamers:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 