'use server'

import { db } from '@/lib/db'

export async function getAllGuildLeague() {
  // 최신 2일의 날짜 구하기
  const datesRes = await db.query(`
    SELECT DISTINCT snapshot_date
    FROM guild_league_history
    ORDER BY snapshot_date DESC
    LIMIT 2
  `)
  const dates = datesRes.rows.map(r => r.snapshot_date).sort()
  if (dates.length < 2) return []

  // 두 날짜의 데이터 모두 가져오기
  const [prevDate, latestDate] = dates
  const prevRows = await db.query(
    `SELECT guild_name, rank FROM guild_league_history WHERE snapshot_date = $1`,
    [prevDate]
  )
  const latestRows = await db.query(
    `SELECT *, snapshot_date FROM guild_league_history WHERE snapshot_date = $1 ORDER BY rank ASC`,
    [latestDate]
  )

  const prevMap = new Map<string, number>()
  for (const row of prevRows.rows) {
    prevMap.set(row.guild_name.trim().normalize('NFC'), row.rank)
  }

  return latestRows.rows.map((row) => {
    const name = row.guild_name.trim().normalize('NFC')
    const prevRank = prevMap.get(name)
    let diff: string | null = null

    if (prevRank === undefined) {
      diff = 'NEW'
    } else {
      const change = prevRank - row.rank
      if (change > 0) diff = `▲${change}`
      else if (change < 0) diff = `▼${Math.abs(change)}`
      else diff = '-'
    }

    return {
      ...row,
      rank_diff: diff,
    }
  })
}
