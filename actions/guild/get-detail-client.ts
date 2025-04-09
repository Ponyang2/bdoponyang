export async function getGuildDetailClient(guildName: string) {
  const res = await fetch(`/api/guild-detail?name=${encodeURIComponent(guildName)}`)
  if (!res.ok) return null
  return await res.json()
}
