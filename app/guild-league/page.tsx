// app/guild-league/page.tsx
'use server'

import { redirect } from 'next/navigation'

export default async function GuildLeagueRootPage() {
  redirect('/guild-league/1')
}
