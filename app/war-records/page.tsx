// app/war-records/page.tsx
import { redirect } from 'next/navigation'

export default function WarRecordsIndex() {
  redirect('/war-records/summary')
}
