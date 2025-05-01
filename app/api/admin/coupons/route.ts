import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const client = await db.connect()
    
    try {
      const result = await client.query(`
        SELECT 
          id,
          code,
          title,
          description,
          start_date,
          end_date
        FROM coupons
        ORDER BY end_date DESC
      `)

      return NextResponse.json(result.rows)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to fetch coupons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, title, description, start_date, end_date } = body

    const client = await db.connect()
    
    try {
      const result = await client.query(
        `
        INSERT INTO coupons (code, title, description, start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [code, title, description, start_date, end_date]
      )

      return NextResponse.json(result.rows[0])
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to create coupon:', error)
    return NextResponse.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    )
  }
} 