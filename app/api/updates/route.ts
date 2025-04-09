// app/api/updates/route.ts
'use server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'  // ✅ 네가 이미 쓰고 있는 DB 연결 방식!

export async function GET() {
  try {
    const result = await db.query(
      `SELECT title, link, date
       FROM updates
       ORDER BY date DESC
       LIMIT 5`
    )
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('❌ updates 가져오기 실패:', err)
    return NextResponse.json([], { status: 500 })
  }
}
