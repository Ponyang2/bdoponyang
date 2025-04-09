// lib/queries/family.ts 등에서
import { db } from '@/lib/db'

export async function getCurrentGuild(familyName: string): Promise<string | null> {
  const client = await db.connect()
  try {
    const normalized = familyName.trim().normalize('NFC')
    const res = await client.query(
      `SELECT current_guild FROM family_tracking WHERE family_name = $1`,
      [normalized]
    )
    return res.rows[0]?.current_guild ?? null
  } finally {
    client.release()
  }
}
