import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

type Props = {
  params: {
    id: string
  }
}

export async function DELETE(
  _: Request,
  context: Props
) {
  try {
    const client = await db.connect()
    
    try {
      await client.query(
        `
        DELETE FROM coupons
        WHERE id = $1
        `,
        [context.params.id]
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