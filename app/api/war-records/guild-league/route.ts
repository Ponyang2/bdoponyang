import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const revalidate = 300 // 5분 캐시

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const allianceName = searchParams.get('alliance_name')
  
  if (!allianceName) {
    return NextResponse.json({ error: 'alliance_name 파라미터가 필요합니다.' }, { status: 400 })
  }

  try {
    const client = await db.connect()
    try {
      // 먼저 연맹 ID를 찾습니다
      const allianceQuery = `
        SELECT id FROM alliances WHERE name = $1
      `
      const allianceResult = await client.query(allianceQuery, [allianceName])
      
      if (allianceResult.rows.length === 0) {
        return NextResponse.json({ error: '연맹을 찾을 수 없습니다.' }, { status: 404 })
      }

      const allianceId = allianceResult.rows[0].id

      // 최신 날짜 구하기
      const latestDateRes = await client.query(`
        SELECT DISTINCT snapshot_date
        FROM guild_league_history
        ORDER BY snapshot_date DESC
        LIMIT 1
      `)

      const latestDate = latestDateRes.rows[0]?.snapshot_date
      if (!latestDate) {
        return NextResponse.json({ error: '길드리그 데이터가 없습니다.' }, { status: 404 })
      }

      // 연맹에 속한 길드들의 길드리그 정보를 조회합니다
      const query = `
        WITH alliance_guilds_info AS (
          SELECT 
            ag.guild_name,
            g.name AS original_name
          FROM alliance_guilds ag
          JOIN guilds g ON LOWER(ag.guild_name) = LOWER(g.name)
          WHERE ag.alliance_id = $1
        )
        SELECT 
          agi.original_name AS guild_name,
          COALESCE(gl.score, 0) AS league_points,
          COALESCE(gl.rank, 0) AS league_rank,
          COALESCE(gl.wins, 0) AS wins,
          COALESCE(gl.losses, 0) AS losses,
          CASE 
            WHEN gl.rank <= 10 THEN 'S'
            WHEN gl.rank <= 30 THEN 'A'
            WHEN gl.rank <= 60 THEN 'B'
            ELSE 'C'
          END AS league_tier
        FROM alliance_guilds_info agi
        LEFT JOIN guild_league_history gl ON LOWER(agi.original_name) = LOWER(gl.guild_name) 
          AND gl.snapshot_date = $2
        ORDER BY gl.rank ASC NULLS LAST
      `

      const result = await client.query(query, [allianceId, latestDate])
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching guild league info:', error)
    return NextResponse.json(
      { error: '길드리그 정보를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 