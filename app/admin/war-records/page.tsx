// ✅ use client
'use client'

import { useEffect, useState } from 'react'
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

  return (
    <div className="p-4 space-y-6 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold">🛡️ 거점(점령)전 기록</h1>

      {/* 날짜 + 지역 + 전투 타입 선택 */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="flex gap-1 flex-wrap">
          {filteredRegions.map(region => (
            <Button
              key={region}
              variant="outline"
              className={`text-white border-white hover:bg-white/10 ${region === selectedRegion ? 'bg-primary text-white' : 'bg-transparent'}`}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {WAR_TYPES.map(type => (
            <Button
              key={type}
              variant="outline"
              className={`text-white border-white hover:bg-white/10 ${type === selectedWarType ? 'bg-primary text-white' : 'bg-transparent'}`}
              onClick={() => setSelectedWarType(type)}
            >
              {type}
            </Button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-white border-white bg-transparent hover:bg-white/10">
                {format(selectedDate, 'yyyy-MM-dd')}
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

      {/* 전투 기록 입력 테이블 */}
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

      {/* 연맹 등록 */}
      <div className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">⚔️ 연맹 등록</h2>
        <table className="w-full text-sm text-black bg-muted/30 rounded-xl shadow overflow-x-auto">
          <thead className="text-center bg-muted">
            <tr>
              <th className="border px-2 py-1">연맹명</th>
              <th className="border px-2 py-1" colSpan={4}>길드명</th>
              <th className="border px-2 py-1">+ 길드</th>
              <th className="border px-2 py-1">단계</th>
              <th className="border px-2 py-1">삭제</th>
            </tr>
          </thead>
          <tbody>
            {alliances.map((a, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1 text-white font-bold">
                  <Input value={a.name} onChange={(e) => updateAlliance(idx, 'name', e.target.value)} />
                </td>
                {a.guilds.map((g, gIdx) => (
                  <td key={gIdx} className="border px-2 py-1 text-white font-bold">
                    <Input
                      value={g}
                      onChange={(e) => {
                        const updated = [...a.guilds]
                        updated[gIdx] = e.target.value
                        updateAlliance(idx, 'guilds', updated)
                      }}
                    />
                  </td>
                ))}
                {Array.from({ length: Math.max(0, 4 - a.guilds.length) }).map((_, i) => (
                  <td key={`empty-${i}`} className="border px-2 py-1" />
                ))}
                <td className="border px-2 py-1">
                  <Button
                    variant="secondary"
                    onClick={() => updateAlliance(idx, 'guilds', [...a.guilds, ''])}
                  >+</Button>
                </td>
                <td className="border px-2 py-1 whitespace-nowrap">
                  <div className="flex gap-1 justify-center">
                    {TIERS.map((tier) => (
                      <label key={tier} className="text-white flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={a.tiers.includes(tier)}
                          onChange={() => toggleTier(idx, tier)}
                        />
                        {tier}
                      </label>
                    ))}
                  </div>
                </td>
                <td className="border px-2 py-1">
                  <Button
                    variant="destructive"
                    onClick={() => setAlliances(alliances.filter((_, i) => i !== idx))}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-2">
          <Button onClick={() => setAlliances([...alliances, { name: '', guilds: [''], tiers: [] }])}>+ 연맹 추가</Button>
          <Button onClick={saveAlliances}>💾 연맹 저장</Button>
        </div>
      </div>
    </div>
  )
}
