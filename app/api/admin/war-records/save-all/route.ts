// /app/api/admin/war-records/save-all/route.ts

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { REGION_TIERS } from '@/lib/constants/war-tiers'

export async function POST(req: Request) {
  const { date, region, war_type, records } = await req.json()
  if (!date || !region || !war_type || !Array.isArray(records)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const client = await db.connect()
  try {
    await client.query('BEGIN')

    // 기존 기록 삭제
    await client.query(
      'DELETE FROM war_records WHERE war_date = $1 AND region = $2 AND war_type = $3',
      [date, region, war_type]
    )

    for (const r of records) {
      let allianceId = null

      if (r.alliance_name?.trim()) {
        const cleanedName = r.alliance_name.trim()

        // 1. 정확히 같은 이름이 존재하는지 검사 (대소문자 무시)
        const found = await client.query(
          `SELECT id FROM alliances WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))`,
          [cleanedName]
        )

        if (found.rows.length > 0) {
          allianceId = found.rows[0].id
        } else {
          // 2. 이 이름이 기존 guild_name에 있는지 확인
          const alt = await client.query(
            `SELECT alliance_id FROM alliance_guilds WHERE LOWER(TRIM(guild_name)) = LOWER(TRIM($1)) LIMIT 1`,
            [cleanedName]
          )

          if (alt.rows.length > 0) {
            allianceId = alt.rows[0].alliance_id
          } else {
            // 3. 없으면 새로 연맹 생성
            const tier = REGION_TIERS[region as keyof typeof REGION_TIERS] ?? null
            const tiers = tier ? [tier] : []
            const inserted = await client.query(
              `INSERT INTO alliances (name, tiers) VALUES ($1, $2) RETURNING id`,
              [cleanedName, tiers]
            )
            allianceId = inserted.rows[0].id
          }
        }
      }

      await client.query(
        `INSERT INTO war_records (war_date, region, war_type, alliance_id, occupied_area, fort_stage, result)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          date,
          region,
          war_type,
          allianceId,
          r.occupied_area,
          r.fort_stage || null,
          r.result,
        ]
      )
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('[SAVE WAR RECORDS ERROR]', JSON.stringify(err, null, 2))
    return NextResponse.json({ error: 'DB error', detail: String(err) }, { status: 500 })
  } finally {
    client.release()
  }
}
