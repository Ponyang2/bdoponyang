// ✅ 경로: app/page.tsx
import UpdateCard from '@/components/home/UpdateCard'
import CouponCard from '@/components/home/CouponCard'
import WorldBossCard from '@/components/home/WorldBossCard'
import WarScheduleCard from '@/components/home/WarScheduleCard'
import GuildLeagueTop10Server from '@/components/home/GuildLeagueTop10Server'
import SolareTop10 from '@/components/home/SolareTop10'

export default function Home() {
  return (
    <main className="bg-zinc-900 text-white py-10">
      <div className="max-w-[1400px] mx-auto px-4 grid gap-6
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-[300px_1fr_400px]">
        {/* 좌측: 업데이트, 쿠폰 */}
        <aside className="space-y-6 sm:col-span-1 lg:col-span-1">
          <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            <UpdateCard />
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            <CouponCard />
          </div>
        </aside>

        {/* 중앙: 월드보스 + 시간표 버튼 + 거점/점령전 */}
        <section className="space-y-6 sm:col-span-1 lg:col-span-1">
          <WorldBossCard />
          <WarScheduleCard />
        </section>

        {/* 우측: 길드 리그 / 솔라레 */}
        <aside className="space-y-6 sm:col-span-2 lg:col-span-1">
          <GuildLeagueTop10Server />
          <SolareTop10 />
        </aside>
      </div>
    </main>
  )
}
