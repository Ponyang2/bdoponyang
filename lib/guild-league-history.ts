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

// ✅ 최신 두 개 snapshot 중 직전 snapshot rank map 가져오기
async function getLastSnapshotRankMap(): Promise<Record<string, number>> {
  const result = await db.query(`
    SELECT guild_name, rank
    FROM guild_league_history
    WHERE snapshot_date = (
      SELECT snapshot_date
      FROM guild_league_history
      GROUP BY snapshot_date
      ORDER BY snapshot_date DESC
      OFFSET 1 LIMIT 1
    )
  `)

  const map: Record<string, number> = {}
  result.rows.forEach((row) => {
    map[row.guild_name] = row.rank
  })

  return map
}

// ✅ 오늘의 길드 리스트에 순위 변동 정보 추가 (▲, ▼, NEW)
export async function getRankChanges(todayGuilds: Guild[]) {
  const previousRanks = await getLastSnapshotRankMap()

  return todayGuilds.map((guild) => {
    const prevRank = previousRanks[guild.name]
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
