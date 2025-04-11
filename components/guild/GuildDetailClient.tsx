"use client"

import { useEffect } from "react"
import { Card } from "@/components/card"
import Image from "next/image"
import { FaTrophy } from "react-icons/fa"
import MemberTrendChart from "@/components/charts/MemberTrendChart"
import RankTrendChart from "@/components/charts/RankTrendChart"

interface GuildDetail {
  name: string
  leader: string
  member_count: number
  creation_date: string
  rank: number | null
  wins: number
  losses: number
  winRate: number
  updated_at: string
  icon_url?: string
  members: string[]
  joinCount: number
  leaveCount: number
  history: { date: string, join: number, leave: number }[]
}

export default function GuildDetailClient({ guild }: { guild: GuildDetail }) {
  // ✅ 페이지 진입 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const renderTrophy = () => {
    if (guild.rank === 1) return <FaTrophy className="w-4 h-4 inline text-yellow-400" title="1위" />
    if (guild.rank === 2) return <FaTrophy className="w-4 h-4 inline text-gray-300" title="2위" />
    if (guild.rank === 3) return <FaTrophy className="w-4 h-4 inline text-orange-500" title="3위" />
    return null
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">
      {/* 길드 기본 정보 */}
      <Card className="p-6 space-y-6">
        <h1 className="text-3xl font-extrabold text-left">{guild.name}</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-[130px] h-[130px] border-4 border-white flex items-center justify-center">
            <Image
              src={guild.icon_url || "/guild-icons/default.png"}
              alt="길드 마크"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2 text-sm md:text-base">
            <p><strong>인원 수 :</strong> {guild.member_count}명</p>
            <p><strong>길드리그 순위 :</strong> {guild.rank ?? "-"}위 {renderTrophy()}</p>
            <p><strong>대장 :</strong> {guild.leader}</p>
            <p><strong>길드리그 전적 :</strong> {guild.wins}승 / {guild.losses}패 ({guild.winRate.toFixed(1)}%)
              {guild.winRate >= 70 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-rose-600 text-white rounded-full">고승률🔥</span>
              )}
            </p>
            <p><strong>길드 생성일 :</strong> {new Date(guild.creation_date).toLocaleDateString("ko-KR")}</p>
          </div>
        </div>
      </Card>

      {/* 차트 */}
      <Card className="p-6">
        <h2 className="text-lg font-bold mb-4">최근 1개월 활동 요약</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <MemberTrendChart data={guild.history} currentMemberCount={guild.member_count} />
          </div>
          <div className="w-full md:w-1/2">
            <RankTrendChart guildName={guild.name} />
          </div>
        </div>
      </Card>

      {/* 길드원 목록 */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-5">길드원 목록</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-lg text-gray-300">
          {guild.members.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
