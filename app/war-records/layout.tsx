// app/war-records/layout.tsx
import { ReactNode } from 'react'
import Sidebar from './Sidebar'

export default function WarRecordsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-screen-xl mx-auto p-4 gap-6">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
