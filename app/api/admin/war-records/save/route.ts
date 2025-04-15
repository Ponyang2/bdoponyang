import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { REGION_TIERS } from '@/lib/constants/war-tiers'

export async function POST(req: Request) {
  const body = await req.json()
  const {
    war_type,
    war_date,
    alliance_name,
    region,
    occupied_area,
    fort_stage,
    result,
  } = body

  const client = await db.connect()
  try {
    let allianceId = null
    const cleanedAlliance = alliance_name?.trim()

    // 1. 연맹 이름으로 먼저 찾기
    if (cleanedAlliance) {
      const res = await client.query(
        `SELECT id FROM alliances WHERE LOWER(TRIM(name)) = LOWER(TRIM($1))`,
        [cleanedAlliance]
      )
      if (res.rows.length > 0) {
        allianceId = res.rows[0].id
      } else {
        // 2. 없으면 새로 등록
        const tier = REGION_TIERS[region as keyof typeof REGION_TIERS] ?? null
        const insertedAlliance = await client.query(
          `INSERT INTO alliances (name, tiers) VALUES ($1, $2) RETURNING id`,
          [cleanedAlliance, tier ? [tier] : []]
        )
        allianceId = insertedAlliance.rows[0].id
      }
    }

    // 3. 전투 기록 저장 (guild_name 제거됨)
    await client.query(
      `INSERT INTO war_records (war_type, war_date, alliance_id, region, occupied_area, fort_stage, result)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        war_type,
        war_date,
        allianceId,
        region,
        occupied_area,
        fort_stage || null,
        result,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SAVE WAR RECORD ERROR]', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  } finally {
    client.release()
  }
}
