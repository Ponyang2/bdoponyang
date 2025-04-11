'use server'

import { db } from '@/lib/db'

export async function getAllGuildLeague() {
  const now = new Date()
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const today = kst.toISOString().split('T')[0]

  const yesterdayObj = new Date(kst)
  yesterdayObj.setDate(yesterdayObj.getDate() - 1)
  const yesterday = yesterdayObj.toISOString().split('T')[0]

  const current = await db.query(`SELECT * FROM guild_league ORDER BY rank ASC`)

  const history = await db.query(
    `
    SELECT guild_name, rank
    FROM guild_league_history
    WHERE snapshot_date >= $1::date AND snapshot_date < ($1::date + interval '1 day')
    `,
    [yesterday]
  )

  const prevMap = new Map<string, number>()
  for (const row of history.rows) {
    const name = row.guild_name.trim().normalize('NFC')
    prevMap.set(name, row.rank)
  }

  const withDiff = current.rows.map((row) => {
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

  return withDiff
}
