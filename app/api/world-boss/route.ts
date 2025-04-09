// ✅ 경로: app/api/world-boss/route.ts
import { getWorldBossSchedule } from '@/lib/queries/world-boss'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await getWorldBossSchedule()
  return NextResponse.json(data)
}
