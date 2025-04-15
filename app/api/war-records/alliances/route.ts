import { getAlliancesWithGuilds } from '@/lib/queries/war-records'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = await getAlliancesWithGuilds()
  return NextResponse.json(data)
}
