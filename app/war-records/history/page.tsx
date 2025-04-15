'use client'

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
    <div className="space-y-6 max-w-screen-lg mx-auto p-4">
      <h1 className="text-2xl font-bold">📜 전투 기록</h1>

      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap">
          {renderRegionButtons()}
        </div>

        <div className="flex items-center gap-2">
          {WAR_TYPES.map(type => (
            <Button
              key={type}
              variant="outline"
              className={`text-white border-white hover:bg-white/10 ${
                type === selectedWarType ? 'bg-primary text-white' : 'bg-transparent'
              }`}
              onClick={() => setSelectedWarType(type)}
            >
              {type}
            </Button>
          ))}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white/10">
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
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {Object.entries(groupedRecords).map(([regionLabel, regionRecords]) => {
        const sortedRecords = [...regionRecords].sort((a, b) => {
          // '점령성공' 먼저, 그 외는 뒤로
          if (a.result === '점령성공' && b.result !== '점령성공') return -1
          if (a.result !== '점령성공' && b.result === '점령성공') return 1
          return 0
        })

        return (
          <div key={regionLabel} className="mb-10">
            <h3 className="font-semibold text-lg mb-2">
              {format(selectedDate || new Date(), 'yyyy년 MM월 dd일', { locale: ko })}{' '}
              {regionLabel} {selectedWarType}
            </h3>

            <div className="bg-muted/30 rounded-xl p-4 shadow">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2">연맹</th>
                    <th className="text-left p-2">지역</th>
                    <th className="text-center p-2">성채단계</th>
                    <th className="text-center p-2">결과</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRecords.map((rec) => (
                    <tr key={rec.id}>
                      <td className="p-2 font-semibold">{rec.alliance_name}</td>
                      <td className="p-2">{rec.occupied_area}</td>
                      <td className="p-2 text-center">{rec.fort_stage ?? '-'}</td>
                      <td className="p-2 text-center">{rec.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

    </div>
  )
}
