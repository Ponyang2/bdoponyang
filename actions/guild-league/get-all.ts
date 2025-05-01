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
    `SELECT guild_name, rank FROM guild_league_history 
     WHERE snapshot_date = $1`,
    [prevDate]
  )
  console.log('전날 데이터 개수:', prevRows.rows.length)

  const prevMap = new Map<string, number>()
  for (const row of prevRows.rows) {
    const name = row.guild_name.trim().normalize('NFC')
    prevMap.set(name, row.rank)
    console.log('전날 데이터:', name, row.rank)
  }

  return latestRows.rows.map((row) => {
    const name = row.guild_name.trim().normalize('NFC')
    const prevRank = prevMap.get(name)
    console.log('길드:', name, '현재 순위:', row.rank, '이전 순위:', prevRank)
    
    let diff: string | null = null
    if (prevRank === undefined) {
      diff = 'NEW'
    } else {
      const change = prevRank - row.rank
      if (change > 0) diff = `▲${change}`
      else if (change < 0) diff = `▼${Math.abs(change)}`
      else diff = '-'
    }
    console.log('순위 변동:', diff)

    return {
      ...row,
      rank_diff: diff,
    }
  })
}
