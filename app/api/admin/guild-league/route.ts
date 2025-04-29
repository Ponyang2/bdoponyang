// app/api/admin/guild-league/route.ts
'use server'
import { NextRequest, NextResponse } from 'next/server'
import { db } from 'lib/db'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  const now = new Date()
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const todayStr = kstNow.toISOString().split('T')[0]

  if (date) {
    if (date === todayStr) {
      // 오늘 날짜면 현재 테이블에서 조회
      const { rows } = await db.query('SELECT * FROM guild_league ORDER BY rank ASC')
      return NextResponse.json(rows)
    } else {
      // 과거 날짜면 히스토리 테이블에서 조회 (wins, losses, score 포함)
      const { rows } = await db.query(
        `SELECT guild_name, rank, wins, losses, score
         FROM guild_league_history
         WHERE snapshot_date = $1::date
         ORDER BY rank ASC`,
        [date]
      )
      return NextResponse.json(rows)
    }
  } else {
    // 기본: 현재 테이블
    const { rows } = await db.query('SELECT * FROM guild_league ORDER BY rank ASC')
    return NextResponse.json(rows)
  }
}
