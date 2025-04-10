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

// ✅ KST 기준 어제 날짜 문자열 (YYYY-MM-DD)
function getKSTYesterdayDate(): string {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const kst = new Date(utc + 9 * 60 * 60000)
  kst.setDate(kst.getDate() - 1)
  return kst.toISOString().split("T")[0]
}

// ✅ KST 기준 오늘 날짜 문자열 (YYYY-MM-DD)
export function getKSTTodayDate(): string {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const kst = new Date(utc + 9 * 60 * 60000)
  return kst.toISOString().split("T")[0]
}

// ✅ 어제 스냅샷을 기반으로 길드 순위 맵 생성
async function getYesterdayRankMap(): Promise<Record<string, number>> {
  const snapshotDate = getKSTYesterdayDate()

  const result = await db.query(
    `SELECT guild_name, rank FROM guild_league_history WHERE snapshot_date = $1`,
    [snapshotDate]
  )

  const map: Record<string, number> = {}
  result.rows.forEach((row) => {
    map[row.guild_name] = row.rank
  })

  return map
}

// ✅ 오늘의 길드 리스트에 순위 변동(▲, ▼, NEW) 정보 추가
export async function getRankChanges(todayGuilds: Guild[]) {
  const yesterdayRanks = await getYesterdayRankMap()

  return todayGuilds.map((guild) => {
    const yesterdayRank = yesterdayRanks[guild.name]
    let rankChange = "-"

    if (yesterdayRank === undefined) {
      rankChange = "NEW"
    } else {
      const diff = yesterdayRank - guild.rank
      if (diff > 0) rankChange = `▲${diff}`
      else if (diff < 0) rankChange = `▼${Math.abs(diff)}`
    }

    return {
      ...guild,
      rankChange,
    }
  })
}