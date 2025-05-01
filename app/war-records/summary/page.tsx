'use client'

import { useState, Fragment, useCallback, useMemo } from 'react'
import PeriodSelector from '@/components/war-records/PeriodSelector'
import { useQuery } from '@tanstack/react-query'

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

interface RelatedAlliance {
  alliance_name: string
  guilds: string[]
  count: number
  participated: number
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

export default function WarSummaryPage() {
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')
  const [expandedAlliances, setExpandedAlliances] = useState<Record<string, RelatedAlliance[] | undefined>>({})

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

  const toggleExpanded = useCallback(async (name: string) => {
    if (expandedAlliances[name]) {
      setExpandedAlliances(prev => ({ ...prev, [name]: undefined }))
    } else {
      const res = await fetch(`/api/war-records/related-alliances?alliance_name=${encodeURIComponent(name)}`)
      const data = await res.json()
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
                    {isExpanded &&
                      expandedAlliances[a.alliance_name]?.map((rel, i) => {
                        const subWinRate = rel.participated > 0 ? Math.round((rel.count / rel.participated) * 100) : 0
                        const subWinRateText = rel.participated > 0 ? `${subWinRate}%` : '-'
                        let subWinRateClass = ''
                        if (subWinRate >= 80) subWinRateClass = 'text-rose-400 font-bold'
                        else if (subWinRate >= 70) subWinRateClass = 'text-yellow-300 font-semibold'
                        else subWinRateClass = 'text-white/80'
                        return (
                          <tr key={`sub-${a.alliance_name}-${i}`} className="bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-2 pl-8 text-gray-300 text-base">↳ {rel.alliance_name}</td>
                            <td className="px-4 py-2 text-gray-400 text-base">{rel.guilds.join(', ')}</td>
                            <td className="px-4 py-2 text-right text-blue-400/80 text-base">{rel.participated}</td>
                            <td className="px-4 py-2 text-right text-cyan-400/80 text-base">{rel.count}</td>
                            <td className={`px-4 py-2 text-right text-base ${subWinRateClass}`}>{subWinRateText}</td>
                          </tr>
                        )
                      })}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    )
  }, [alliances, rankingByTier, expandedAlliances, toggleExpanded])

  return (
    <div className="p-6 max-w-screen-xl mx-auto mt-4">
      <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8 bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-6 rounded-2xl shadow-lg">
        <h2 className="text-4xl text-center font-bold text-white">
          <span>🏰</span>
          <span className="ml-2">연맹 점령 현황</span>
        </h2>
        <PeriodSelector
          selected={selectedTab}
          onChange={(val) => setSelectedTab(val as 'weekly' | 'monthly' | 'yearly')}
        />
      </div>

      <div className="space-y-8">
        {renderTableByTier('무제한')}
        {renderTableByTier('2단')}
        {renderTableByTier('1단')}
      </div>
    </div>
  )
}
