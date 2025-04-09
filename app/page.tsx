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
      <div className="max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 좌측: 업데이트, 쿠폰 */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            <UpdateCard />
          </div>
          <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
            <CouponCard />
          </div>
        </aside>

        {/* 중앙: 월드보스 + 시간표 버튼 + 거점/점령전 */}
        <section className="lg:col-span-6 space-y-6">
          <WorldBossCard />
          <WarScheduleCard />
        </section>

        {/* 우측: 길드 리그 / 솔라레 */}
        <aside className="lg:col-span-3 space-y-6">
          <GuildLeagueTop10Server />
          <SolareTop10 />
        </aside>
      </div>
    </main>
  )
}
