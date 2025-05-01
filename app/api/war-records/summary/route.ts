// ✅ 수정 완료: 중복 row 방지 위해 DISTINCT로 집계

import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const revalidate = 300 // 5분 캐시

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tierFilter = searchParams.get('tier')

  const client = await db.connect()
  try {
    // 필요한 필드만 선택하고 JOIN 최적화
    const allRecords = await client.query(`
      WITH recent_wars AS (
        SELECT id, alliance_id, region, result
        FROM war_records
        WHERE war_date >= CURRENT_DATE - INTERVAL '7 days'
        ${tierFilter ? `AND region = $1` : ''}
        ORDER BY war_date DESC, id ASC
      ),
      alliance_stats AS (
        SELECT 
          a.name AS alliance_name,
          COUNT(DISTINCT w.id) AS participated,
          COUNT(DISTINCT CASE WHEN w.result = '점령성공' THEN w.id END) AS count
        FROM recent_wars w
        JOIN alliances a ON w.alliance_id = a.id
        GROUP BY a.name
      )
      SELECT 
        alliance_name,
        participated,
        count
      FROM alliance_stats
      ORDER BY count DESC, participated DESC
    `, tierFilter ? [tierFilter] : [])

    const response = NextResponse.json(allRecords.rows)
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60')
    return response
  } catch (err) {
    console.error('DB Error:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    client.release()
  }
}