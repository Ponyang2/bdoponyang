// ✅ use client
'use client'

import { useEffect, useState, useMemo } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from '@/components/ui/select'

const WAR_TYPES = ['거점전', '점령전'] as const
const NODE_REGIONS = ['발레노스', '세렌디아', '칼페온', '카마실비아', '메디아', '발렌시아']
const SIEGE_REGIONS = ['칼페온', '발렌시아', '메디아']
const RESULTS = ['점령성공', '점령실패']
const TIERS = ['무제한', '2단', '1단']

type WarType = (typeof WAR_TYPES)[number]

interface RecordRow {
  alliance_name: string
  fort_stage: number | null
  occupied_area: string
  result: string
}

interface AllianceRow {
  name: string
  guilds: string[]
  tiers: string[]
}

const TIER_ORDER = { '무제한': 0, '2단': 1, '1단': 2 }

export default function AdminWarRecordsPage() {
  const [selectedWarType, setSelectedWarType] = useState<WarType>('거점전')
  const [selectedRegion, setSelectedRegion] = useState(NODE_REGIONS[0])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [records, setRecords] = useState<Record<string, RecordRow[]>>({})
  const [alliances, setAlliances] = useState<AllianceRow[]>([])

  const filteredRegions = selectedWarType === '점령전' ? SIEGE_REGIONS : NODE_REGIONS

  useEffect(() => {
    setSelectedRegion(filteredRegions[0])
  }, [selectedWarType])

  const getKey = () => `${format(selectedDate, 'yyyy-MM-dd')}_${selectedRegion}_${selectedWarType}`

  const rows: RecordRow[] = records[getKey()] ?? Array.from({ length: 10 }, (): RecordRow => ({
    alliance_name: '',
    fort_stage: null,
    occupied_area: '',
    result: '점령실패',
  }))

  const updateRecord = <K extends keyof RecordRow>(idx: number, key: K, value: RecordRow[K]) => {
    const updated: RecordRow[] = [...rows]
    updated[idx][key] = value
    setRecords((prev) => ({ ...prev, [getKey()]: updated }))
  }

  const updateAlliance = (idx: number, key: keyof AllianceRow, value: any) => {
    const updated = [...alliances]
    updated[idx][key] = value
    setAlliances(updated)
  }

  const toggleTier = (idx: number, tier: string) => {
    const prev = alliances[idx].tiers ?? []
    const next = prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    updateAlliance(idx, 'tiers', next)
  }

  const saveRecords = async () => {
    const payload = (records[getKey()] || []).filter(r => r.alliance_name && r.result)
    const res = await fetch('/api/admin/war-records/save-all', {
      method: 'POST',
      body: JSON.stringify({
        date: format(selectedDate, 'yyyy-MM-dd'),
        region: selectedRegion,
        war_type: selectedWarType,
        records: payload,
      }),
    })
    if (res.ok) alert('✅ 저장 완료!')
    else {
      const error = await res.json()
      console.error('❌ 저장 실패:', error)
      alert(`❌ 저장 실패: ${error.detail || 'Unknown error'}`)
    }
  }

  const saveAlliances = async () => {
    const valid = alliances.filter(a => a.name && a.guilds.length > 0)
    const res = await fetch('/api/admin/alliances/save-all', {
      method: 'POST',
      body: JSON.stringify({ alliances: valid }),
    })
    if (res.ok) alert('✅ 연맹 저장 완료!')
    else alert('❌ 저장 실패')
  }

  useEffect(() => {
    const fetchAlliances = async () => {
      const res = await fetch('/api/admin/alliances/load')
      const data = await res.json()
      const parsed = Array.isArray(data)
        ? data.map((a) => ({
            name: a.name,
            guilds: Array.isArray(a.guilds)
              ? a.guilds
              : (a.guilds ?? '').split('/').map((g: string) => g.trim()).filter(Boolean),
            tiers: Array.isArray(a.tiers) ? a.tiers : [],
          }))
        : []
      setAlliances(parsed)
    }
    fetchAlliances()
  }, [])

  useEffect(() => {
    const fetchRecords = async () => {
      const query = new URLSearchParams({
        date: format(selectedDate, 'yyyy-MM-dd'),
        region: selectedRegion,
        war_type: selectedWarType,
      })

      const res = await fetch(`/api/admin/war-records/load?${query}`)
      const data = await res.json()

      if (Array.isArray(data)) {
        const parsed: RecordRow[] = data.map((item) => ({
          alliance_name: item.alliance_name || '',
          occupied_area: item.occupied_area,
          fort_stage: item.fort_stage ?? null,
          result: item.result,
        }))
        setRecords(prev => ({ ...prev, [getKey()]: parsed }))
      }
    }

    fetchRecords()
  }, [selectedDate, selectedRegion, selectedWarType])

  // 정렬된 연맹 목록 생성
  const sortedAlliances = useMemo(() => 
    [...alliances].sort((a, b) => {
      const aTier = Math.min(...(a.tiers.map(t => TIER_ORDER[t as keyof typeof TIER_ORDER] ?? 99)), 99)
      const bTier = Math.min(...(b.tiers.map(t => TIER_ORDER[t as keyof typeof TIER_ORDER] ?? 99)), 99)
      return aTier - bTier
    }),
    [alliances]
  )

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-8">
      {/* 전투 기록 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">⚔️ 전투 기록</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  {selectedDate ? format(selectedDate, 'PPP', { locale: ko }) : '날짜 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Select value={selectedWarType} onValueChange={(val) => setSelectedWarType(val as WarType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {WAR_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {filteredRegions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-muted/30 rounded-2xl p-4 shadow">
          <table className="w-full text-center text-black text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="border px-2 py-1 text-left">연맹명</th>
                <th className="border px-2 py-1 text-left">성채단계</th>
                <th className="border px-2 py-1 text-left">점령지역</th>
                <th className="border px-2 py-1 text-left">결과</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1 text-white font-semibold">
                    <Input value={row.alliance_name} onChange={(e) => updateRecord(idx, 'alliance_name', e.target.value)} />
                  </td>
                  <td className="border px-2 py-1">
                    <Input
                      type="number"
                      min={1}
                      max={5}
                      value={row.fort_stage ?? ''}
                      onChange={(e) => updateRecord(idx, 'fort_stage', Number(e.target.value))}
                    />
                  </td>
                  <td className="border px-2 py-1 text-white font-semibold">
                    <Input value={row.occupied_area} onChange={(e) => updateRecord(idx, 'occupied_area', e.target.value)} />
                  </td>
                  <td className="border px-2 py-1 text-white font-semibold">
                    <Select value={row.result} onValueChange={(val) => updateRecord(idx, 'result', val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {RESULTS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-2 mt-4">
            <Button onClick={() => setRecords(prev => ({
              ...prev,
              [getKey()]: [...(records[getKey()] ?? []), {
                alliance_name: '', fort_stage: null, occupied_area: '', result: '점령실패'
              }]
            }))}>
              + 기록 추가
            </Button>
            <Button onClick={saveRecords}>💾 전체 저장</Button>
          </div>
        </div>
      </div>

      {/* 연맹 등록 */}
      <div className="mt-10 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">⚔️ 연맹 등록</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setAlliances([...alliances, { name: '', guilds: [''], tiers: [] }])}
              className="flex items-center gap-2"
            >
              <span>+ 연맹 추가</span>
            </Button>
            <Button 
              onClick={saveAlliances}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <span>💾 연맹 저장</span>
            </Button>
          </div>
        </div>

        {/* 활성 연맹 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-green-400">활성 연맹</h3>
          <div className="bg-muted/30 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">연맹명</th>
                    <th className="px-4 py-3 text-left font-medium" colSpan={4}>길드명</th>
                    <th className="px-4 py-3 text-center font-medium w-20">+ 길드</th>
                    <th className="px-4 py-3 text-center font-medium">단계</th>
                    <th className="px-4 py-3 text-center font-medium w-20">해체</th>
                    <th className="px-4 py-3 text-center font-medium w-20">삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sortedAlliances
                    .filter(a => a.tiers.length > 0)
                    .map((a, idx) => {
                      const originalIndex = alliances.findIndex(orig => orig.name === a.name)
                      return (
                        <tr key={a.name || idx} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-3">
                            <Input 
                              value={a.name} 
                              onChange={(e) => updateAlliance(originalIndex, 'name', e.target.value)}
                              className="bg-transparent border-gray-600"
                              placeholder="연맹명 입력"
                            />
                          </td>
                          {a.guilds.map((g, gIdx) => (
                            <td key={gIdx} className="px-4 py-3">
                              <Input
                                value={g}
                                onChange={(e) => {
                                  const updated = [...a.guilds]
                                  updated[gIdx] = e.target.value
                                  updateAlliance(originalIndex, 'guilds', updated)
                                }}
                                className="bg-transparent border-gray-600"
                                placeholder={`길드 ${gIdx + 1}`}
                              />
                            </td>
                          ))}
                          {Array.from({ length: Math.max(0, 4 - a.guilds.length) }).map((_, i) => (
                            <td key={`empty-${i}`} className="px-4 py-3" />
                          ))}
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              onClick={() => updateAlliance(originalIndex, 'guilds', [...a.guilds, ''])}
                              className="hover:bg-muted/60"
                            >
                              +
                            </Button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3 justify-center">
                              {TIERS.map((tier) => (
                                <label key={tier} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={a.tiers.includes(tier)}
                                    onChange={() => toggleTier(originalIndex, tier)}
                                    className="w-4 h-4 rounded border-gray-600"
                                  />
                                  <span className="text-sm">{tier}</span>
                                </label>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              onClick={() => {
                                const updated = [...alliances]
                                updated[originalIndex].tiers = []
                                setAlliances(updated)
                              }}
                              className="hover:bg-yellow-500/20 text-yellow-400 hover:text-yellow-300"
                            >
                              해체
                            </Button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              onClick={() => setAlliances(alliances.filter(alliance => alliance.name !== a.name))}
                              className="hover:bg-red-500/20 text-red-400 hover:text-red-300"
                            >
                              삭제
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 해체 연맹 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-red-400">해체 연맹</h3>
          <div className="bg-muted/30 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">연맹명</th>
                    <th className="px-4 py-3 text-left font-medium" colSpan={4}>길드명</th>
                    <th className="px-4 py-3 text-center font-medium w-20">+ 길드</th>
                    <th className="px-4 py-3 text-center font-medium">단계</th>
                    <th className="px-4 py-3 text-center font-medium w-20">삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {sortedAlliances
                    .filter(a => a.tiers.length === 0)
                    .map((a, idx) => {
                      const originalIndex = alliances.findIndex(orig => orig.name === a.name)
                      return (
                        <tr key={a.name || idx} className="hover:bg-muted/40 transition-colors">
                          <td className="px-4 py-3">
                            <Input 
                              value={a.name} 
                              onChange={(e) => updateAlliance(originalIndex, 'name', e.target.value)}
                              className="bg-transparent border-gray-600"
                              placeholder="연맹명 입력"
                            />
                          </td>
                          {a.guilds.map((g, gIdx) => (
                            <td key={gIdx} className="px-4 py-3">
                              <Input
                                value={g}
                                onChange={(e) => {
                                  const updated = [...a.guilds]
                                  updated[gIdx] = e.target.value
                                  updateAlliance(originalIndex, 'guilds', updated)
                                }}
                                className="bg-transparent border-gray-600"
                                placeholder={`길드 ${gIdx + 1}`}
                              />
                            </td>
                          ))}
                          {Array.from({ length: Math.max(0, 4 - a.guilds.length) }).map((_, i) => (
                            <td key={`empty-${i}`} className="px-4 py-3" />
                          ))}
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              onClick={() => updateAlliance(originalIndex, 'guilds', [...a.guilds, ''])}
                              className="hover:bg-muted/60"
                            >
                              +
                            </Button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3 justify-center">
                              {TIERS.map((tier) => (
                                <label key={tier} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={a.tiers.includes(tier)}
                                    onChange={() => toggleTier(originalIndex, tier)}
                                    className="w-4 h-4 rounded border-gray-600"
                                  />
                                  <span className="text-sm">{tier}</span>
                                </label>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              variant="ghost"
                              onClick={() => setAlliances(alliances.filter(alliance => alliance.name !== a.name))}
                              className="hover:bg-red-500/20 text-red-400 hover:text-red-300"
                            >
                              삭제
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
