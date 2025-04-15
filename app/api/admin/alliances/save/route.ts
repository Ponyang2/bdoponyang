import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { REGION_TIERS } from '@/lib/constants/war-tiers'
import crypto from 'crypto'

export async function POST(req: Request) {
  const body = await req.json()
  const {
    war_type,
    war_date,
    alliance_name,
    guild_name,
    region,
    occupied_area,
    fort_stage,
    result,
  } = body

  const client = await db.connect()
  try {
    let allianceId = null

    if (alliance_name) {
      const found = await client.query(`SELECT id FROM alliances WHERE name = $1`, [alliance_name])

      if (found.rowCount && found.rows.length > 0) {
        allianceId = found.rows[0].id
      } else {
        const tier = REGION_TIERS[region as keyof typeof REGION_TIERS] ?? null
        const inserted = await client.query(
          `INSERT INTO alliances (name, tier) VALUES ($1, $2) RETURNING id`,
          [alliance_name, tier]
        )
        allianceId = inserted.rows[0].id
      }
    }

    await client.query(
      `INSERT INTO war_records (war_type, war_date, alliance_id, guild_name, region, occupied_area, fort_stage, result)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [war_type, war_date, allianceId, guild_name || null, region, occupied_area, fort_stage || null, result]
    )

    // ✅ 연맹 히스토리 자동 반영
    if (allianceId) {
      const guildsRes = await client.query(
        `SELECT guild_name FROM alliance_guilds WHERE alliance_id = $1 ORDER BY guild_name`,
        [allianceId]
      )
      const guilds: string[] = guildsRes.rows.map(row => row.guild_name)
      const hash = crypto.createHash('sha256').update(guilds.join(',')).digest('hex')

      const existing = await client.query(
        `SELECT 1 FROM alliance_history WHERE composition_hash = $1 AND alliance_name = $2`,
        [hash, alliance_name]
      )
      if (existing.rowCount === 0) {
        await client.query(
          `INSERT INTO alliance_history (alliance_name, guilds, composition_hash)
           VALUES ($1, $2, $3)`,
          [alliance_name, guilds, hash]
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SAVE WAR RECORD ERROR]', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  } finally {
    client.release()
  }
}
