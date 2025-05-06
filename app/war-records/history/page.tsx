'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

const NODE_REGION_GROUPS = [
  { label: '발레노스/세렌디아', regions: ['발레노스', '세렌디아'] },
  { label: '칼페온/카마실비아', regions: ['칼페온', '카마실비아'] },
  { label: '메디아/발렌시아', regions: ['메디아', '발렌시아'] },
]
const SIEGE_REGIONS = ['칼페온', '발렌시아', '메디아']
const WAR_TYPES = ['거점전', '점령전']

interface WarRecord {
  id: number
  war_type: string
  war_date: string
  alliance_name: string
  occupied_area: string
  result: string
  fort_stage: number | null
  region: string
}

export default function WarHistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedWarType, setSelectedWarType] = useState('거점전')
  const [selectedRegion, setSelectedRegion] = useState('발레노스/세렌디아')
  const [records, setRecords] = useState<WarRecord[]>([])

  useEffect(() => {
    if (!selectedDate) return

    const regionParam = selectedWarType === '점령전'
      ? selectedRegion
      : NODE_REGION_GROUPS.find(g => g.label === selectedRegion)?.regions.join(',') || selectedRegion

    const query = new URLSearchParams({
      date: format(selectedDate, 'yyyy-MM-dd'),
      region: regionParam,
      war_type: selectedWarType,
    })

    fetch(`/api/war-records/history?${query}`)
      .then((res) => res.json())
      .then((json) => {
        console.log('API 응답:', json)
        setRecords(Array.isArray(json) ? json : [])
      })
  }, [selectedDate, selectedRegion, selectedWarType])

  const renderRegionButtons = () => {
    if (selectedWarType === '점령전') {
      return SIEGE_REGIONS.map(region => (
        <Button
          key={region}
          variant="outline"
          className={`text-white border-white hover:bg-white/10 ${
            region === selectedRegion ? 'bg-primary text-white' : 'bg-transparent'
          }`}
          onClick={() => setSelectedRegion(region)}
        >
          {region}
        </Button>
      ))
    }
    return NODE_REGION_GROUPS.map(group => (
      <Button
        key={group.label}
        variant="outline"
        className={`text-white border-white hover:bg-white/10 ${
          group.label === selectedRegion ? 'bg-primary text-white' : 'bg-transparent'
        }`}
        onClick={() => setSelectedRegion(group.label)}
      >
        {group.label}
      </Button>
    ))
  }

  const groupedRecords = selectedWarType === '거점전'
    ? NODE_REGION_GROUPS.find(g => g.label === selectedRegion)?.regions.reduce((acc, region) => {
        acc[region] = Array.isArray(records) ? records.filter(r => r.region === region) : []
        return acc
      }, {} as Record<string, WarRecord[]>) ?? {}
    : { [selectedRegion]: records }

  return (
    <div className="p-6 max-w-screen-xl mx-auto mt-4">
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-6 rounded-2xl shadow-lg mb-4">
        <div className="flex flex-col w-full md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-white mb-0 text-left">
              <span>📜</span>
              <span className="ml-2">전투 기록</span>
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:mt-0 md:ml-4 md:items-start items-end w-full md:w-auto">
            {WAR_TYPES.map(type => (
              <Button
                key={type}
                variant="outline"
                className={`text-white border-blue-400 hover:bg-blue-400/10 hover:text-blue-300 border-2 font-bold px-4 py-2 rounded-lg transition-all duration-150 ${
                  type === selectedWarType ? 'bg-blue-400 text-black' : 'bg-transparent'
                }`}
                onClick={() => setSelectedWarType(type)}
              >
                {type}
              </Button>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-white border-blue-400 border-2 bg-transparent hover:bg-blue-400/10 hover:text-blue-300 px-4 py-2 rounded-lg font-bold transition-all duration-150">
                  {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '날짜 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  locale={ko}
                  initialFocus
                  disabled={
                    selectedWarType === '점령전'
                      ? (date) => date.getDay() !== 6
                      : selectedWarType === '거점전'
                      ? (date) => date.getDay() === 6
                      : undefined
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {renderRegionButtons()}
      </div>

      <div className="space-y-8">
        {Object.entries(groupedRecords).map(([regionLabel, regionRecords]) => {
          const sortedRecords = [...regionRecords].sort((a, b) => {
            if (a.result === '점령성공' && b.result !== '점령성공') return -1
            if (a.result !== '점령성공' && b.result === '점령성공') return 1
            return 0
          })

          return (
            <section key={regionLabel} className="transform transition-all hover:scale-[1.01]">
              <h3 className="text-3xl font-bold mb-4 text-white flex items-center gap-2">
                <span>🗓️</span>
                {format(selectedDate || new Date(), 'yyyy년 MM월 dd일', { locale: ko })} {regionLabel} {selectedWarType}
              </h3>
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <table className="w-full text-sm table-fixed">
                  <colgroup>
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '28%' }} />
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '22%' }} />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-4 py-3 text-lg font-extrabold text-white text-center">연맹</th>
                      <th className="px-4 py-3 text-lg font-extrabold text-white text-center">지역</th>
                      <th className="px-4 py-3 text-lg font-extrabold text-white text-center">성채단계</th>
                      <th className="px-4 py-3 text-lg font-extrabold text-white text-center">결과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedRecords.map((rec) => (
                      <tr key={rec.id} className="border-t border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 text-white font-semibold whitespace-nowrap text-base text-center">{rec.alliance_name}</td>
                        <td className="px-4 py-3 text-gray-300 text-base whitespace-nowrap font-semibold text-center">{rec.occupied_area}</td>
                        <td className="px-4 py-3 text-center text-blue-300 text-base">{rec.fort_stage ?? '-'}</td>
                        <td className={`px-4 py-3 text-center text-base font-bold ${rec.result === '점령성공' ? 'text-emerald-300' : 'text-red-400'}`}>{rec.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
