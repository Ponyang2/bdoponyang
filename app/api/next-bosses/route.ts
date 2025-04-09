import { getNextWorldBosses } from '@/lib/queries/world-boss'

export async function GET() {
  const bosses = await getNextWorldBosses()
  return Response.json(bosses)
}
