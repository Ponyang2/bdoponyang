import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Boss {
  name: string
  spawnTime: string
  nextSpawnTime: string
  remainingTime: string
  isSpawned: boolean
}

export default function WorldBoss() {
  const [bosses, setBosses] = useState<Boss[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBosses = async () => {
      try {
        const res = await fetch('/api/world-boss')
        const data = await res.json()
        setBosses(data)
      } catch (error) {
        console.error('Error fetching world bosses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBosses()
    const interval = setInterval(fetchBosses, 1000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
          <span>👹</span>
          <span>월드 보스</span>
        </h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-700/30 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        <span>👹</span>
        <span>월드 보스</span>
      </h2>
      <div className="space-y-3">
        {bosses.map((boss) => (
          <div
            key={boss.name}
            className={`p-4 rounded-lg transition-all ${
              boss.isSpawned
                ? 'bg-gradient-to-r from-rose-900/50 to-rose-800/50 border border-rose-500/30'
                : 'bg-slate-700/30 hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`text-lg font-semibold ${
                  boss.isSpawned ? 'text-rose-300' : 'text-white'
                }`}>
                  {boss.name}
                </span>
                {boss.isSpawned && (
                  <span className="px-2 py-1 text-xs font-medium bg-rose-500/20 text-rose-300 rounded-full">
                    출현 중
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className={`text-sm ${
                  boss.isSpawned ? 'text-rose-200' : 'text-gray-400'
                }`}>
                  {boss.isSpawned ? '다음 출현' : '출현 예정'}
                </div>
                <div className={`font-medium ${
                  boss.isSpawned ? 'text-rose-300' : 'text-white'
                }`}>
                  {format(new Date(boss.nextSpawnTime), 'HH:mm', { locale: ko })}
                </div>
              </div>
            </div>
            {!boss.isSpawned && (
              <div className="mt-2 text-sm text-gray-400">
                {boss.remainingTime} 후 출현
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 