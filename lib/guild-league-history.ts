// ✅ 경로: lib/guild-league-history.ts
import { db } from "@/lib/db"

export interface Guild {
  name: string
  wins: number
  losses: number
  winRate: number
  score: number
  rank: number
  updated_at: Date
  rankChange?: string
}

// ✅ 최신 두 개 snapshot의 rank map 모두 가져오기
async function getLatestTwoSnapshotRankMaps(): Promise<{ latest: Record<string, number>, prev: Record<string, number> }> {
  const result = await db.query(`
    WITH ordered_dates AS (
      SELECT DISTINCT snapshot_date
      FROM guild_league_history
      ORDER BY snapshot_date DESC
      LIMIT 2
    )
    SELECT guild_name, rank, snapshot_date
    FROM guild_league_history
    WHERE snapshot_date IN (SELECT snapshot_date FROM ordered_dates)
  `)

  // 날짜별로 분리
  const dateMap: Record<string, Record<string, number>> = {}
  result.rows.forEach((row) => {
    if (!dateMap[row.snapshot_date]) dateMap[row.snapshot_date] = {}
    dateMap[row.snapshot_date][row.guild_name] = row.rank
  })
  const dates = Object.keys(dateMap).sort() // 오름차순: [이전, 최신]
  return {
    prev: dateMap[dates[0]] || {},
    latest: dateMap[dates[1]] || {},
  }
}

// ✅ 오늘의 길드 리스트에 순위 변동 정보 추가 (▲, ▼, NEW)
export async function getRankChanges(todayGuilds: Guild[]) {
  const { prev } = await getLatestTwoSnapshotRankMaps()

  return todayGuilds.map((guild) => {
    const prevRank = prev[guild.name]
    let rankChange = "-"

    if (prevRank === undefined) {
      rankChange = "NEW"
    } else {
      const diff = prevRank - guild.rank
      if (diff > 0) rankChange = `▲${diff}`
      else if (diff < 0) rankChange = `▼${Math.abs(diff)}`
    }

    return {
      ...guild,
      rankChange,
    }
  })
}
