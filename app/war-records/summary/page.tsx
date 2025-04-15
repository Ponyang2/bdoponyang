'use client'

import { useEffect, useState, Fragment } from 'react'
import PeriodSelector from '@/components/war-records/PeriodSelector'

interface RankingEntry {
  alliance_name: string
  count: number
  participated?: number
}

interface AllianceEntry {
  alliance_name: string
  guilds: string[]
  tiers: string[]
}

interface RelatedAlliance {
  alliance_name: string
  guilds: string[]
  count: number
  participated: number
}

export default function WarSummaryPage() {
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly' | 'yearly'>('weekly')
  const [rankingByTier, setRankingByTier] = useState<Record<'무제한' | '2단' | '1단', RankingEntry[]>>({
    무제한: [], '2단': [], '1단': []
  })
  const [alliances, setAlliances] = useState<AllianceEntry[]>([])
  const [expandedAlliances, setExpandedAlliances] = useState<Record<string, RelatedAlliance[] | undefined>>({})

  useEffect(() => {
    const load = async () => {
      const endpointBase = `/api/war-records/summary?period=${selectedTab}`
      const tiers: ('무제한' | '2단' | '1단')[] = ['무제한', '2단', '1단']
      const results = await Promise.all(
        tiers.map(tier =>
          fetch(`${endpointBase}&tier=${tier}`).then(res => res.json())
        )
      )
      setRankingByTier({ '무제한': results[0], '2단': results[1], '1단': results[2] })
    }
    load()
  }, [selectedTab])

  useEffect(() => {
    fetch('/api/war-records/alliances')
      .then(res => res.json())
      .then(data => setAlliances(data ?? []))
  }, [])

  const toggleExpanded = async (name: string) => {
    if (expandedAlliances[name]) {
      setExpandedAlliances(prev => ({ ...prev, [name]: undefined }))
    } else {
      const res = await fetch(`/api/war-records/related-alliances?alliance_name=${encodeURIComponent(name)}`)
      const data = await res.json()
      setExpandedAlliances(prev => ({ ...prev, [name]: data }))
    }
  }

  const renderTableByTier = (tier: '무제한' | '2단' | '1단') => {
    const filtered = alliances
      .filter((a) => a.tiers.includes(tier))
      .sort((a, b) => {
        const aCount = rankingByTier[tier].find(r => r.alliance_name === a.alliance_name)?.count ?? 0
        const bCount = rankingByTier[tier].find(r => r.alliance_name === b.alliance_name)?.count ?? 0
        return bCount - aCount
      })

    return (
      <section key={tier}>
        <h3 className="mt-5 text-2xl font-bold mb-2">{tier} 연맹</h3>
        <div className="bg-muted/30 rounded-xl p-4 shadow overflow-x-auto mb-6">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="border-b px-3 py-2 text-lg">연맹/길드명</th>
                <th className="border-b px-3 py-2 text-lg">소속 길드</th>
                <th className="border-b px-3 py-2 text-right text-lg">참여</th>
                <th className="border-b px-3 py-2 text-right text-lg">점령</th>
                <th className="border-b px-3 py-2 text-right text-lg">승률</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => {
                const main = rankingByTier[tier].find(r => r.alliance_name === a.alliance_name)
                const occupied = main?.count ?? 0
                const participated = main?.participated ?? occupied
                const winRate = participated > 0 ? `${Math.round((occupied / participated) * 100)}%` : '-'
                const isExpanded = Array.isArray(expandedAlliances[a.alliance_name])

                return (
                  <Fragment key={a.alliance_name}>
                    <tr className="border-t">
                      <td
                        className="px-3 py-2 text-white font-semibold whitespace-nowrap text-base cursor-pointer"
                        onClick={() => toggleExpanded(a.alliance_name)}
                      >
                        {isExpanded ? '▽' : '▶'} {a.alliance_name}
                      </td>
                      <td className="px-3 py-2 text-white text-base font-semibold">{a.guilds.join(', ')}</td>
                      <td className="px-3 py-2 text-right text-white text-base font-bold">{participated}</td>
                      <td className="px-3 py-2 text-right text-white text-base font-bold">{occupied}</td>
                      <td className="px-3 py-2 text-right text-white text-base font-bold">{winRate}</td>
                    </tr>
                    {isExpanded &&
                      expandedAlliances[a.alliance_name]?.map((rel, i) => {
                        const subWinRate = rel.participated > 0
                          ? `${Math.round((rel.count / rel.participated) * 100)}%`
                          : '-'
                        return (
                          <tr key={`sub-${a.alliance_name}-${i}`} className="bg-muted/20">
                            <td className="px-3 py-1 pl-6 text-white text-base font-bold">↳ {rel.alliance_name}</td>
                            <td className="px-3 py-1 text-white text-base font-bold">{rel.guilds.join(', ')}</td>
                            <td className="px-3 py-1 text-right text-white text-base font-bold">{rel.participated}</td>
                            <td className="px-3 py-1 text-right text-white text-base font-bold">{rel.count}</td>
                            <td className="px-3 py-1 text-right text-white text-base font-bold">{subWinRate}</td>
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
  }

  return (
    <div className="p-1s max-w-screen-xl mx-auto mt-4">
      <div className="flex justify-between text-sm text-white mb-4">
        <h2 className="text-3xl text-center font-bold mb-3">🏰 연맹 점령 현황</h2>
        <PeriodSelector
          selected={selectedTab}
          onChange={(val) => setSelectedTab(val as 'weekly' | 'monthly' | 'yearly')}
        />
      </div>
      {renderTableByTier('무제한')}
      {renderTableByTier('2단')}
      {renderTableByTier('1단')}
    </div>
  )
}
