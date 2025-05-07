'use server'

import { db } from '@/lib/db'

export async function getAllGuildLeague() {
  // 최신 날짜 구하기
  const latestDateRes = await db.query(`
    SELECT DISTINCT snapshot_date
    FROM guild_league_history
    ORDER BY snapshot_date DESC
  `)
  console.log('모든 날짜:', latestDateRes.rows.map(r => r.snapshot_date))

  const latestDate = latestDateRes.rows[0]?.snapshot_date
  if (!latestDate) {
    console.log('최신 날짜 없음')
    return []
  }
  console.log('최신 날짜:', latestDate)

  // 최신 날짜의 데이터 가져오기
  const latestRows = await db.query(
    `SELECT *, snapshot_date FROM guild_league_history 
     WHERE snapshot_date = $1 
     ORDER BY rank ASC`,
    [latestDate]
  )
  console.log('최신 데이터 개수:', latestRows.rows.length)

  // 전날 데이터 가져오기
  const prevDate = new Date(latestDate)
  prevDate.setDate(prevDate.getDate() - 1)
  const prevRows = await db.query(
    `SELECT guild_name, rank, score FROM guild_league_history 
     WHERE snapshot_date = $1`,
    [prevDate]
  )
  console.log('전날 데이터 개수:', prevRows.rows.length)

  const prevMap = new Map<string, { rank: number, score: number }>()
  for (const row of prevRows.rows) {
    const name = row.guild_name.trim().normalize('NFC')
    prevMap.set(name, { rank: row.rank, score: row.score })
    console.log('전날 데이터:', name, row.rank, row.score)
  }

  return latestRows.rows.map((row) => {
    const name = row.guild_name.trim().normalize('NFC')
    const prev = prevMap.get(name)
    let rank_diff = '-'
    let score_diff = '-'
    if (prev) {
      const rankChange = prev.rank - row.rank
      rank_diff = rankChange > 0 ? `▲${rankChange}` : rankChange < 0 ? `▼${Math.abs(rankChange)}` : '-'
      const scoreChange = row.score - prev.score
      score_diff = scoreChange > 0 ? `▲${scoreChange}` : scoreChange < 0 ? `▼${Math.abs(scoreChange)}` : '-'
    } else {
      rank_diff = 'NEW'
      score_diff = 'NEW'
    }
    console.log('길드:', name, '현재 순위:', row.rank, '이전 순위:', prev?.rank, '순위 변동:', rank_diff, '점수 변동:', score_diff)
    
    return {
      ...row,
      rank_diff,
      score_diff,
    }
  })
}
