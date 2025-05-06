import { db } from '@/lib/db'

export async function getWeeklyWarRanking() {
  const client = await db.connect()
  try {
    const result = await client.query(
      `SELECT
         a.name AS alliance_name,
         COUNT(DISTINCT w.id) FILTER (WHERE w.result = '점령성공') AS count,
         COUNT(DISTINCT w.id) AS participated
       FROM war_records w
       JOIN alliances a ON w.alliance_id = a.id
       WHERE war_date >= CURRENT_DATE - INTERVAL '6 days'
       GROUP BY a.id, a.name
       ORDER BY count DESC`
    )
    return result.rows.map(r => ({
      alliance_name: r.alliance_name,
      count: Number(r.count),
      participated: Number(r.participated),
    }))
  } finally {
    client.release()
  }
}

export async function getMonthlyWarRanking() {
  const client = await db.connect()
  try {
    const result = await client.query(
      `SELECT
         a.name AS alliance_name,
         COUNT(DISTINCT w.id) FILTER (WHERE w.result = '점령성공') AS count,
         COUNT(DISTINCT w.id) AS participated
       FROM war_records w
       JOIN alliances a ON w.alliance_id = a.id
       WHERE war_date >= CURRENT_DATE - INTERVAL '1 month'
       GROUP BY a.id, a.name
       ORDER BY count DESC`
    )
    return result.rows.map(r => ({
      alliance_name: r.alliance_name,
      count: Number(r.count),
      participated: Number(r.participated),
    }))
  } finally {
    client.release()
  }
}

export async function getYearlyWarRanking() {
  const client = await db.connect()
  try {
    const result = await client.query(
      `SELECT
         a.name AS alliance_name,
         COUNT(DISTINCT w.id) FILTER (WHERE w.result = '점령성공') AS count,
         COUNT(DISTINCT w.id) AS participated
       FROM war_records w
       JOIN alliances a ON w.alliance_id = a.id
       WHERE war_date >= CURRENT_DATE - INTERVAL '1 year'
       GROUP BY a.id, a.name
       ORDER BY count DESC`
    )
    return result.rows.map(r => ({
      alliance_name: r.alliance_name,
      count: Number(r.count),
      participated: Number(r.participated),
    }))
  } finally {
    client.release()
  }
}

// ✅ 실제 점령 지역 기반 tier 계산
export async function getAlliancesWithGuilds() {
  const client = await db.connect()
  try {
    const result = await client.query(
      `SELECT
         a.name AS alliance_name,
         a.tiers AS tiers,
         ARRAY_AGG(ag.guild_name) AS guilds
       FROM alliances a
       LEFT JOIN alliance_guilds ag ON ag.alliance_id = a.id
       GROUP BY a.name, a.tiers
       ORDER BY a.name`
    )

    return result.rows.map(row => ({
      alliance_name: row.alliance_name,
      guilds: row.guilds.filter(Boolean),
      tiers: row.tiers ?? [],
    }))
  } finally {
    client.release()
  }
}

