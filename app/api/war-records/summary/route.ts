// ✅ 수정 완료: 중복 row 방지 위해 DISTINCT로 집계

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { REGION_TIERS } from '@/lib/constants/war-tiers'

export const revalidate = 300 // 5분 캐시

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tierFilter = searchParams.get('tier')
  const period = searchParams.get('period') || 'weekly'
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  try {
    const client = await db.connect()
    try {
      if (!tierFilter) {
        return NextResponse.json([])
      }

      // tier에 해당하는 지역 목록 가져오기
      const regionsForTier = Object.entries(REGION_TIERS)
        .filter(([_, tier]) => tier === tierFilter)
        .map(([region]) => region)

      // 기간에 따른 쿼리 구성
      let dateFilter = ''
      if (start && end) {
        dateFilter = `w.war_date >= '${start}' AND w.war_date <= '${end}'`
      } else {
        switch (period) {
          case 'monthly':
            dateFilter = 'w.war_date >= CURRENT_DATE - INTERVAL \'1 month\''
            break
          case 'yearly':
            dateFilter = 'w.war_date >= CURRENT_DATE - INTERVAL \'1 year\''
            break
          default:
            dateFilter = 'w.war_date >= CURRENT_DATE - INTERVAL \'6 days\''
        }
      }

      const query = `
        WITH filtered_records AS (
          SELECT DISTINCT w.id, w.alliance_id, w.result
          FROM war_records w
          JOIN alliances a ON w.alliance_id = a.id
          WHERE ${dateFilter}
            AND w.region = ANY($1)
            AND a.tiers @> ARRAY[$2]::text[]
            AND w.war_type = '거점전'
        )
        SELECT
          a.name AS alliance_name,
          COUNT(DISTINCT fr.id) FILTER (WHERE fr.result = '점령성공') AS count,
          COUNT(DISTINCT fr.id) AS participated
        FROM filtered_records fr
        JOIN alliances a ON fr.alliance_id = a.id
        GROUP BY a.id, a.name
        ORDER BY count DESC
      `

      // 쿼리 실행
      const result = await client.query(query, [regionsForTier, tierFilter])

      const filteredRecords = result.rows.map(r => ({
        alliance_name: r.alliance_name,
        count: Number(r.count),
        participated: Number(r.participated),
      }))

      const response = NextResponse.json(filteredRecords)
      response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
      return response
    } finally {
      client.release()
    }
  } catch (error: any) {
    console.error('DB Error:', error)
    return NextResponse.json({ error: 'Database error', details: error.message }, { status: 500 })
  }
}