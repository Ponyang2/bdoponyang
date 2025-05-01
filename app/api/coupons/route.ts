import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface Coupon {
  code: string
  title: string
  description: string
  start_date: string
  end_date: string
  status: 'active' | 'expired'
}

export const revalidate = 3600 // 1시간 캐시

export async function GET() {
  try {
    const client = await db.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          code,
          title,
          description,
          start_date,
          end_date,
          CASE 
            WHEN end_date < CURRENT_DATE THEN 'expired'
            ELSE 'active'
          END as status
        FROM coupons
        ORDER BY 
          CASE 
            WHEN end_date < CURRENT_DATE THEN 1
            ELSE 0
          END,
          end_date DESC
      `)

      const coupons: Coupon[] = result.rows.map(row => ({
        code: row.code,
        title: row.title,
        description: row.description,
        start_date: row.start_date,
        end_date: row.end_date,
        status: row.status
      }))

      return NextResponse.json(coupons)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Coupon error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
} 