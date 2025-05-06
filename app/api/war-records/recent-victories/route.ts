import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const revalidate = 300 // 5분 캐시

export async function GET() {
  try {
    const client = await db.connect()
    try {
      const query = `
        WITH recent_victories AS (
          SELECT DISTINCT ON (w.alliance_id, w.region)
            a.name AS alliance_name,
            w.war_date,
            w.occupied_area,
            w.region
          FROM war_records w
          JOIN alliances a ON w.alliance_id = a.id
          WHERE w.war_type = '점령전'
            AND w.result = '점령성공'
            AND w.war_date >= CURRENT_DATE - INTERVAL '7 days'
          ORDER BY w.alliance_id, w.region, w.war_date DESC
        )
        SELECT 
          alliance_name,
          war_date,
          occupied_area,
          region
        FROM recent_victories
        ORDER BY war_date DESC
      `

      const result = await client.query(query)
      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Error fetching recent victories:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
} 