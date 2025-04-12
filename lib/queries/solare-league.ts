// ✅ /lib/queries/solare-league.ts
import { db } from "@/lib/db"
import { getSolareOverallRankChanges } from "@/lib/utils/solare-history"
import { getTier } from "@/lib/utils/tier"

interface Entry {
  name: string
  class: string
  subclass: string
  wins: number
  draws: number
  losses: number
  score: number
  rank: number
  rankChange?: string
  tier: string
}

export async function getSolareTop10(): Promise<Entry[]> {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT
        name,
        subclass,
        class,
        wins,
        draws,
        losses,
        score
      FROM solare_overall_league
      ORDER BY score DESC
      LIMIT 100
    `)

    const ranked = result.rows.map((row, index) => ({
      ...row,
      rank: index + 1,
    }))

    const rawChanges = await getSolareOverallRankChanges(ranked) as Entry[]

    // 명시적으로 모든 필드 매핑해서 Entry 타입으로 보장
    const withChange: Entry[] = rawChanges.slice(0, 10).map((row) => ({
      name: row.name,
      class: row.class,
      subclass: row.subclass,
      wins: row.wins,
      draws: row.draws,
      losses: row.losses,
      score: row.score,
      rank: row.rank,
      rankChange: row.rankChange,
      tier: getTier(row.score),
    }))

    return withChange
  } finally {
    client.release()
  }
}