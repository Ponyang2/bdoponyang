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

// ✅ 전체 랭킹 순위 변동 계산 (가장 최근 snapshot 기준)
export async function getSolareOverallRankChanges(today: OverallEntry[]) {
  const latest = await db.query(`
    SELECT snapshot_date
    FROM solare_overall_league_history
    ORDER BY snapshot_date DESC
    LIMIT 1
  `)

  const latestDate = latest.rows[0]?.snapshot_date
  if (!latestDate) return today.map(entry => ({ ...entry, rankChange: 'NEW' }))

  const result = await db.query(
    `SELECT name, class_rank FROM solare_overall_league_history WHERE snapshot_date = $1`,
    [latestDate]
  )

  const prevMap = new Map<string, number>()
  result.rows.forEach((row: any) => {
    prevMap.set(row.name, row.class_rank)
  })

  return today.map((entry) => {
    const prevRank = prevMap.get(entry.name)
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

// ✅ 클래스별 랭킹 순위 변동 계산 (가장 최근 snapshot 기준)
export async function getSolareClassRankChanges(today: ClassEntry[], className: string) {
  const latest = await db.query(`
    SELECT snapshot_date
    FROM solare_class_league_history
    WHERE class = $1
    ORDER BY snapshot_date DESC
    LIMIT 1
  `, [className])

  const latestDate = latest.rows[0]?.snapshot_date
  if (!latestDate) return today.map(entry => ({ ...entry, rankChange: 'NEW' }))

  const result = await db.query(
    `SELECT name, class_rank FROM solare_class_league_history WHERE snapshot_date = $1 AND class = $2`,
    [latestDate, className]
  )

  const prevMap = new Map<string, number>()
  result.rows.forEach((row: any) => {
    prevMap.set(row.name, row.class_rank)
  })

  return today.map((entry) => {
    const prevRank = prevMap.get(entry.name)
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
