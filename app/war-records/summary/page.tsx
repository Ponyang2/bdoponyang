'use client'

export const dynamic = 'force-dynamic'

import { useState, Fragment, useCallback, useMemo } from 'react'
import PeriodSelector from '@/components/war-records/PeriodSelector'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import Link from 'next/link'
import { format, subDays, subMonths, subYears } from 'date-fns'

interface AllianceData {
  alliance_name: string
  guilds: string[]
  tiers: string[]
}

interface WarSummaryData {
  alliance_name: string
  count: number
  participated: number
}

interface RecentVictory {
  alliance_name: string
  war_date: string
  occupied_area: string
  region: string
}

interface GuildLeagueInfo {
  guild_name: string
  league_points: number
  league_rank: number
  league_tier: string
  wins: number
  losses: number
}

async function fetchWarSummary(period: string, tier: string): Promise<WarSummaryData[]> {
  const res = await fetch(`/api/war-records/summary?period=${period}&tier=${tier}`)
  if (!res.ok) throw new Error('Failed to fetch war summary')
  return res.json()
}

async function fetchAlliances(): Promise<AllianceData[]> {
  const res = await fetch('/api/war-records/alliances')
  if (!res.ok) throw new Error('Failed to fetch alliances')
  return res.json()
}

async function fetchRecentVictories(): Promise<RecentVictory[]> {
  const res = await fetch('/api/war-records/recent-victories')
  if (!res.ok) throw new Error('Failed to fetch recent victories')
  return res.json()
}

async function fetchGuildLeagueInfo(allianceName: string): Promise<GuildLeagueInfo[]> {
  try {
    const res = await fetch(`/api/war-records/guild-league?alliance_name=${encodeURIComponent(allianceName)}`)
    if (!res.ok) {
      throw new Error(`Failed to fetch guild league info: ${res.statusText}`)
    }
    return res.json()
  } catch (error) {
    console.error('Error fetching guild league info:', error)
    return []
  }
}

export default function WarSummaryPage() {
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')
  const [expandedAlliances, setExpandedAlliances] = useState<Record<string, GuildLeagueInfo[] | undefined>>({})

  const { data: rankingByTier = { '무제한': [], '2단': [], '1단': [] } } = useQuery({
    queryKey: ['war-summary', selectedTab],
    queryFn: async () => {
      const tiers: ('무제한' | '2단' | '1단')[] = ['무제한', '2단', '1단']
      const results = await Promise.all(
        tiers.map(tier => fetchWarSummary(selectedTab, tier))
      )
      return { '무제한': results[0], '2단': results[1], '1단': results[2] }
    },
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  const { data: alliances = [] } = useQuery({
    queryKey: ['alliances'],
    queryFn: fetchAlliances,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  const { data: recentVictories = [] } = useQuery({
    queryKey: ['recent-victories'],
    queryFn: fetchRecentVictories,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  const toggleExpanded = useCallback(async (name: string) => {
    if (expandedAlliances[name]) {
      setExpandedAlliances(prev => ({ ...prev, [name]: undefined }))
    } else {
      const data = await fetchGuildLeagueInfo(name)
      setExpandedAlliances(prev => ({ ...prev, [name]: data }))
    }
  }, [expandedAlliances])

  const renderTableByTier = useCallback((tier: '무제한' | '2단' | '1단') => {
    const filtered = useMemo(() => 
      alliances
        .filter((a: AllianceData) => a.tiers.includes(tier))
        .sort((a: AllianceData, b: AllianceData) => {
          const aCount = rankingByTier[tier].find((r: WarSummaryData) => r.alliance_name === a.alliance_name)?.count ?? 0
          const bCount = rankingByTier[tier].find((r: WarSummaryData) => r.alliance_name === b.alliance_name)?.count ?? 0
          return bCount - aCount
        }),
      [alliances, rankingByTier, tier]
    )

    return (
      <section key={tier} className="transform transition-all hover:scale-[1.01]">
        <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
          {tier} 연맹
        </h3>
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3 text-lg font-extrabold text-blue-300">연맹/길드명</th>
                <th className="px-4 py-3 text-lg font-extrabold text-blue-300">소속 길드</th>
                <th className="px-4 py-3 text-lg font-extrabold text-blue-300 text-right">참여</th>
                <th className="px-4 py-3 text-lg font-extrabold text-blue-300 text-right">점령</th>
                <th className="px-4 py-3 text-lg font-extrabold text-blue-300 text-right">승률</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a: AllianceData) => {
                const main = rankingByTier[tier].find((r: WarSummaryData) => r.alliance_name === a.alliance_name)
                const occupied = main?.count ?? 0
                const participated = main?.participated ?? occupied
                const winRate = participated > 0 ? Math.round((occupied / participated) * 100) : 0
                const winRateText = participated > 0 ? `${winRate}%` : '-'
                let winRateClass = ''
                if (winRate >= 80) winRateClass = 'text-rose-400 font-bold'
                else if (winRate >= 70) winRateClass = 'text-yellow-300 font-semibold'
                else winRateClass = 'text-white/80'
                const isExpanded = Array.isArray(expandedAlliances[a.alliance_name])

                return (
                  <Fragment key={a.alliance_name}>
                    <tr className="border-t border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                      <td
                        className="px-4 py-3 text-white font-semibold whitespace-nowrap text-base cursor-pointer flex items-center gap-2"
                        onClick={() => toggleExpanded(a.alliance_name)}
                      >
                        <span className="text-blue-400 transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}>
                          ▶
                        </span>
                        {a.alliance_name}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-base">{a.guilds.join(', ')}</td>
                      <td className="px-4 py-3 text-right text-blue-300 text-base font-bold">{participated}</td>
                      <td className="px-4 py-3 text-right text-cyan-300 text-base font-bold">{occupied}</td>
                      <td className={`px-4 py-3 text-right text-base font-bold ${winRateClass}`}>{winRateText}</td>
                    </tr>
                    {isExpanded && (
                      <>
                        <tr className="bg-white/10">
                          <th className="px-4 py-2 text-left text-white text-base font-bold border-b border-white/20">길드리그 순위</th>
                          <th className="px-4 py-2 pl-8 text-left text-white text-base font-bold border-b border-white/20">길드명</th>
                          <th className="px-4 py-2 text-right text-white text-base font-bold border-b border-white/20">승/패</th>
                          <th className="px-4 py-2 text-right text-white text-base font-bold border-b border-white/20">승률</th>
                          <th className="px-4 py-2 text-right text-white text-base font-bold border-b border-white/20">점수</th>
                        </tr>
                        {expandedAlliances[a.alliance_name]?.map((guild, i) => (
                          <tr key={`guild-${a.alliance_name}-${i}`} className="bg-slate-800/30 hover:bg-white/5 transition-colors">
                            <td className="px-4 py-2 text-gray-200 text-base border-l border-white/10">
                              {guild.league_rank > 0 ? (
                                <span className="text-white font-medium">{guild.league_rank}위</span>
                              ) : (
                                <span className="text-gray-500">데이터 없음</span>
                              )}
                            </td>
                            <td className="px-4 py-2 pl-8 text-white text-base">
                              <Link 
                                href={`/guild/${encodeURIComponent(guild.guild_name)}`}
                                className="hover:text-blue-400 transition-colors"
                              >
                                {guild.guild_name}
                              </Link>
                            </td>
                            <td className="px-4 py-2 text-right text-base">
                              {guild.wins > 0 || guild.losses > 0 ? (
                                <span className="inline-flex items-center gap-1">
                                  <span className="text-emerald-400">{guild.wins}승</span>
                                  <span className="text-gray-400">/</span>
                                  <span className="text-rose-400">{guild.losses}패</span>
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right text-base">
                              {guild.wins + guild.losses > 0 ? (
                                <span className={`font-bold ${
                                  (guild.wins / (guild.wins + guild.losses)) * 100 >= 70 
                                    ? 'text-amber-400' 
                                    : 'text-emerald-400'
                                }`}>
                                  {Math.round((guild.wins / (guild.wins + guild.losses)) * 100)}%
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right text-base border-r border-white/10">
                              {guild.league_points > 0 ? (
                                <span className="font-bold text-amber-400">{guild.league_points}점</span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    )
  }, [alliances, rankingByTier, expandedAlliances, toggleExpanded])

  // 날짜 범위 계산
  const today = new Date()
  const weeklyStart = subDays(today, 6) // 오늘 포함 7일
  const monthlyStart = subMonths(today, 1)
  const yearlyStart = subYears(today, 1)
  const formatDate = (date: Date) => format(date, 'yyyy-MM-dd')
  let periodText = ''
  if (selectedTab === 'weekly') {
    periodText = ` ${formatDate(weeklyStart)} ~ ${formatDate(today)}`
  } else if (selectedTab === 'monthly') {
    periodText = ` ${formatDate(monthlyStart)} ~ ${formatDate(today)}`
  } else if (selectedTab === 'yearly') {
    periodText = ` ${formatDate(yearlyStart)} ~ ${formatDate(today)}`
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto mt-4">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8 bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-6 rounded-2xl shadow-lg">
        <h2 className="text-4xl text-center font-bold text-white">
          <span>🏰</span>
          <span className="ml-2">연맹 점령 현황</span>
        </h2>
        <div className="flex flex-col w-full md:w-auto">
          <PeriodSelector
            selected={selectedTab}
            onChange={(val) => setSelectedTab(val as 'weekly' | 'monthly' | 'yearly')}
          />
          <span className="text-base text-blue-200 font-semibold mt-2 ml-1 whitespace-nowrap">{periodText}</span>
        </div>
      </div>

      {recentVictories.length > 0 && (
        <div className="mb-8 bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <span>🏆</span>
            <span>영지별 성주</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['칼페온', '메디아', '발렌시아'].map((region) => {
              const regionVictory = recentVictories
                .filter(v => v.region === region)
                .sort((a, b) => new Date(b.war_date).getTime() - new Date(a.war_date).getTime())[0]
              const imageMap = {
                '칼페온': '/war-records/calfeon.png',
                '메디아': '/war-records/media.png',
                '발렌시아': '/war-records/balencia.png'
              }

              return (
                <div key={region} className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800/70 transition-colors">
                  <div className="relative w-full h-65 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={imageMap[region as keyof typeof imageMap]}
                      alt={region}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-bold text-white mb-2">{region}</h4>
                    {regionVictory ? (
                      <div className="space-y-1">
                        <p className="text-blue-300 font-semibold">{regionVictory.alliance_name}</p>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">최근 승리 기록 없음</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-8">
        {renderTableByTier('무제한')}
        {renderTableByTier('2단')}
        {renderTableByTier('1단')}
      </div>
    </div>
  )
}
