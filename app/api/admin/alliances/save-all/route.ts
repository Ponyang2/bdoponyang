// /app/api/admin/alliances/save-all/route.ts

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { alliances } = await req.json()

  if (!Array.isArray(alliances)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // ✅ alliance_guilds는 전체 삭제
    await client.query('DELETE FROM alliance_guilds')

    // ✅ 사용되지 않는 연맹만 삭제
    await client.query(`
      DELETE FROM alliances
      WHERE id NOT IN (
        SELECT DISTINCT alliance_id FROM war_records WHERE alliance_id IS NOT NULL
      )
    `)

    for (const a of alliances) {
      const name = a.name?.trim()
      const tiers: string[] = Array.isArray(a.tiers) ? a.tiers : []
      const guilds: string[] = Array.isArray(a.guilds) ? a.guilds : []

      if (!name || guilds.length === 0) continue

      // 이미 존재하는 경우 ID 가져오기 (삭제되지 않은 경우)
      const existing = await client.query(`SELECT id FROM alliances WHERE name = $1`, [name])
      let allianceId: number

      if (existing.rows.length > 0) {
        allianceId = existing.rows[0].id
        // 기존 tiers 업데이트
        await client.query(`UPDATE alliances SET tiers = $1 WHERE id = $2`, [tiers, allianceId])
      } else {
        const result = await client.query(
          `INSERT INTO alliances (name, tiers) VALUES ($1, $2) RETURNING id`,
          [name, tiers]
        )
        allianceId = result.rows[0].id
      }

      for (const guild of guilds) {
        const clean = guild.trim()
        if (clean) {
          await client.query(
            `INSERT INTO alliance_guilds (alliance_id, guild_name) VALUES ($1, $2)`,
            [allianceId, clean]
          )
        }
      }
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[SAVE ALLIANCES ERROR]', err)
    return NextResponse.json({ error: 'DB error', detail: String(err) }, { status: 500 })
  } finally {
    client.release()
  }
}
