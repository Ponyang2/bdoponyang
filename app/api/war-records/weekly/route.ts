import { getWeeklyWarRanking } from '@/lib/queries/war-records'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const data = await getWeeklyWarRanking()
    return NextResponse.json(data)
  } catch (err) {
    console.error('[WEEKLY WAR RANK ERROR]', err)
    return NextResponse.json({ error: 'DB Error' }, { status: 500 })
  }
}
