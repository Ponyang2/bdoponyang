'use client'

import { saveAllGuildLeague } from '@/actions/guild-league/save-all'
import { Button } from '@/components/ui/button'
import { useTransition, useState } from 'react'
import { format } from 'date-fns'

interface Props {
  data: any[]
  date: Date
  disabled?: boolean
}

export default function SaveAllButton({ data, date, disabled }: Props) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  const handleSave = () => {
    setMessage('')
    startTransition(async () => {
      try {
        await saveAllGuildLeague(data, format(date, 'yyyy-MM-dd'))
        setMessage('✅ 저장이 완료되었습니다.')
      } catch (err) {
        console.error(err)
        setMessage('❌ 저장 중 오류가 발생했습니다.')
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleSave} disabled={isPending || disabled}>
        {isPending ? '저장 중...' : '💾 전체 저장'}
      </Button>
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  )
}
