import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  if (!id) {
    return new NextResponse('Invalid ID', { status: 400 })
  }

  try {
    const client = await db.connect()
    
    try {
      await client.query(
        `
        DELETE FROM coupons
        WHERE id = $1
        `,
        [id]
      )

      return NextResponse.json({ success: true })
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Failed to delete coupon:', error)
    return NextResponse.json(
      { error: 'Failed to delete coupon' },
      { status: 500 }
    )
  }
} 