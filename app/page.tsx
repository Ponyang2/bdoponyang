// ✅ 경로: app/page.tsx

import UpdateCard from '@/components/home/UpdateCard'
import CouponCard from '@/components/home/CouponCard'
import WorldBossCard from '@/components/home/WorldBossCard'
import WarScheduleCard from '@/components/home/WarScheduleCard'
import GuildLeagueTop10Server from '@/components/home/GuildLeagueTop10Server'
import SolareTop10 from '@/components/home/SolareTop10'
import ChzzkCard from '@/components/home/ChzzkCard'

export default function Home() {
  return (
    <main className="bg-zinc-900 text-white">
      {/* 기존 컨텐츠 */}
      <div className="py-10">
        <div className="max-w-[1400px] mx-auto px-4 grid gap-6
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-[300px_1fr_400px]">
          {/* 좌측: 업데이트, 쿠폰 */}
          <aside className="space-y-6 sm:col-span-1 lg:col-span-1">
            {/* 후원 배너 (단색, 심플) */}
            <a href="/support" className="block bg-zinc-800 text-white font-bold text-xl rounded-lg border border-zinc-600 shadow-sm py-4 px-2 text-center hover:bg-zinc-600 transition-all font-gong">
              포냥이 후원하기
            </a>
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <UpdateCard />
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <CouponCard />
            </div>
            <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700">
              <ChzzkCard />
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
      </div>
    </main>
  )
}
