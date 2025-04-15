// ✅ 수정 완료: 중복 row 방지 위해 DISTINCT로 집계

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { REGION_TIERS } from '@/lib/constants/war-tiers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tierFilter = searchParams.get('tier') // '1단' | '2단' | '무제한' | null

  const client = await db.connect()
  try {
    const allRecords = await client.query(`
      SELECT
        a.name AS alliance_name,
        a.tiers AS tiers,
        w.id AS war_id,
        w.region,
        w.result,
        ag.guild_name AS guild_name
      FROM war_records w
      JOIN alliances a ON w.alliance_id = a.id
      LEFT JOIN alliance_guilds ag ON ag.alliance_id = a.id
    `)

    const grouped = new Map<string, {
      alliance_name: string
      guilds: Set<string>
      tiers: Set<string>
      count: Set<number>
      participated: Set<number>
    }>()

    for (const row of allRecords.rows) {
      const regionTier = REGION_TIERS[row.region as keyof typeof REGION_TIERS]
      if (tierFilter && regionTier !== tierFilter) continue

      const key = row.alliance_name
      if (!grouped.has(key)) {
        grouped.set(key, {
          alliance_name: row.alliance_name,
          guilds: new Set<string>(),
          tiers: new Set<string>(),
          count: new Set<number>(),
          participated: new Set<number>(),
        })
      }

      const data = grouped.get(key)!
      if (row.guild_name) data.guilds.add(row.guild_name)
      if (regionTier) data.tiers.add(regionTier)

      data.participated.add(row.war_id)
      if (row.result === '점령성공') data.count.add(row.war_id)
    }

    const result = Array.from(grouped.values()).map((r) => ({
      alliance_name: r.alliance_name,
      guilds: Array.from(r.guilds),
      tiers: Array.from(r.tiers),
      count: r.count.size,
      participated: r.participated.size,
    }))

    return NextResponse.json(result)
  } catch (err) {
    console.error('[WAR SUMMARY ERROR]', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  } finally {
    client.release()
  }
}