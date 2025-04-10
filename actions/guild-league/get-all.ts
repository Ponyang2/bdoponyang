'use server'

import { db } from 'lib/db'

// 오늘 기준 + 어제 히스토리 동시 불러오기
export async function getAllGuildLeague() {
  // KST 기준 오늘/어제 날짜 구하기
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const today = kst.toISOString().split('T')[0]

  const yesterdayObj = new Date(kst)
  yesterdayObj.setDate(yesterdayObj.getDate() - 1)
  const yesterday = yesterdayObj.toISOString().split('T')[0]
  

  // 오늘 데이터
  const current = await db.query(`
    SELECT * FROM guild_league ORDER BY rank ASC
  `)

  // 어제 히스토리 데이터 (최근 snapshot)
  const history = await db.query(`
    SELECT guild_name, rank
    FROM guild_league_history
    WHERE snapshot_date = $1
  `, [yesterday])

  const prevMap = new Map<string, number>()
  for (const row of history.rows) {
    const name = row.guild_name.trim().normalize('NFC')
    prevMap.set(name, row.rank)
  }

  // 현재 순위 + 변동 계산
  const withDiff = current.rows.map(row => {
    const name = row.guild_name.trim().normalize('NFC')
    const prevRank = prevMap.get(name)
    let diff: string | null = null

    if (prevRank === undefined) {
      diff = 'NEW'
    } else {
      const change = prevRank - row.rank
      if (change > 0) diff = `▲${change}`
      else if (change < 0) diff = `▼${Math.abs(change)}`
      else diff = '-' // 변동 없음
    }

    return {
      ...row,
      rank_diff: diff,
    }
  })
  return withDiff
}