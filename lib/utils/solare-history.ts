// lib/utils/solare-history.ts
import { db } from '@/lib/db'

interface OverallEntry {
  name: string
  rank: number
  [key: string]: any
}

interface ClassEntry {
  name: string
  rank: number
  class: string
  [key: string]: any
}

// ✅ 전체 랭킹 순위 변동 계산
export async function getSolareOverallRankChanges(today: OverallEntry[]) {
  const result = await db.query(`
    SELECT name, class_rank
    FROM solare_overall_league_history
    WHERE snapshot_date = CURRENT_DATE - INTERVAL '1 day'
  `)

  const yesterdayMap = new Map<string, number>()
  result.rows.forEach((row: any) => {
    yesterdayMap.set(row.name, row.class_rank)
  })

  return today.map((entry) => {
    const prevRank = yesterdayMap.get(entry.name)
    let rankChange = '-'
    if (prevRank === undefined) {
      rankChange = 'NEW'
    } else {
      const diff = prevRank - entry.rank
      if (diff > 0) rankChange = `▲${diff}`
      else if (diff < 0) rankChange = `▼${Math.abs(diff)}`
    }
    return { ...entry, rankChange }
  })
}

// ✅ 클래스별 랭킹 순위 변동 계산
export async function getSolareClassRankChanges(today: ClassEntry[], className: string) {
  const result = await db.query(`
    SELECT name, class_rank
    FROM solare_class_league_history
    WHERE snapshot_date = CURRENT_DATE - INTERVAL '1 day' AND class = $1
  `, [className])

  const yesterdayMap = new Map<string, number>()
  result.rows.forEach((row: any) => {
    yesterdayMap.set(row.name, row.class_rank)
  })

  return today.map((entry) => {
    const prevRank = yesterdayMap.get(entry.name)
    let rankChange = '-'
    if (prevRank === undefined) {
      rankChange = 'NEW'
    } else {
      const diff = prevRank - entry.rank
      if (diff > 0) rankChange = `▲${diff}`
      else if (diff < 0) rankChange = `▼${Math.abs(diff)}`
    }
    return { ...entry, rankChange }
  })
}