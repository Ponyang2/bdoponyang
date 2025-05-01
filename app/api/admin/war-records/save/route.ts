import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { REGION_TIERS } from '@/lib/constants/war-tiers'

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
    const cleanedAlliance = alliance_name?.trim()
    const cleanedGuild = guild_name?.trim()
    const tier = REGION_TIERS[region as keyof typeof REGION_TIERS] ?? null

    // 1. 연맹 이름으로 정확히 찾기 (대소문자 구분)
    if (cleanedAlliance) {
      const res = await client.query(
        `SELECT id, tiers FROM alliances WHERE name = $1`,
        [cleanedAlliance]
      )
      if (res.rows.length > 0) {
        allianceId = res.rows[0].id
        // 기존 연맹의 티어 정보 업데이트
        if (tier) {
          const existingTiers = res.rows[0].tiers || []
          if (!existingTiers.includes(tier)) {
            await client.query(
              `UPDATE alliances SET tiers = array_append(COALESCE(tiers, ARRAY[]::text[]), $1) WHERE id = $2`,
              [tier, allianceId]
            )
          }
        }
      } else {
        // 2. 없으면 새로 등록 (입력된 이름 그대로 저장)
        const insertedAlliance = await client.query(
          `INSERT INTO alliances (name, tiers) VALUES ($1, $2) RETURNING id`,
          [alliance_name, tier ? [tier] : []]
        )
        allianceId = insertedAlliance.rows[0].id

        // 3. 새로운 연맹에 길드 정보 추가
        if (cleanedGuild) {
          await client.query(
            `INSERT INTO alliance_guilds (alliance_id, guild_name) VALUES ($1, $2)`,
            [allianceId, cleanedGuild]
          )
        }
      }
    }

    // 4. 전투 기록 저장
    await client.query(
      `INSERT INTO war_records (war_type, war_date, alliance_id, guild_name, region, occupied_area, fort_stage, result)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        war_type,
        war_date,
        allianceId,
        cleanedGuild,
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
