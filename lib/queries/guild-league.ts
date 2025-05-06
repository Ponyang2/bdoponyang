import { db } from "@/lib/db"
import { getRankChanges } from "@/lib/guild-league-history"

export async function getGuildLeagueTop10() {
  // 최신 날짜 구하기
  const latestDateRes = await db.query(`
    SELECT DISTINCT snapshot_date
    FROM guild_league_history
    ORDER BY snapshot_date DESC
  `)

  const latestDate = latestDateRes.rows[0]?.snapshot_date
  if (!latestDate) return []

  // 최신 날짜의 데이터 가져오기
  const latestRows = await db.query(
    `SELECT *, snapshot_date FROM guild_league_history 
     WHERE snapshot_date = $1 
     ORDER BY rank ASC
     LIMIT 10`,
    [latestDate]
  )

  // 전날 데이터 가져오기
  const prevDate = new Date(latestDate)
  prevDate.setDate(prevDate.getDate() - 1)
  const prevRows = await db.query(
    `SELECT guild_name, rank FROM guild_league_history 
     WHERE snapshot_date = $1`,
    [prevDate]
  )

  const prevMap = new Map<string, number>()
  for (const row of prevRows.rows) {
    const name = row.guild_name.trim().normalize('NFC')
    prevMap.set(name, row.rank)
  }

  return latestRows.rows.map((row) => {
    const name = row.guild_name.trim().normalize('NFC')
    const prevRank = prevMap.get(name)
    
    let rankChange: string
    if (prevRank === undefined) {
      rankChange = 'NEW'
    } else {
      const change = prevRank - row.rank
      if (change > 0) rankChange = `▲${change}`
      else if (change < 0) rankChange = `▼${Math.abs(change)}`
      else rankChange = '-'
    }

    return {
      ...row,
      rankChange,
    }
  })
}
