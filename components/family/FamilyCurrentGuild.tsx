// ✅ components/family/FamilyCurrentGuild.tsx
"use client"

import { Card } from "@/components/card"

export default function FamilyCurrentGuild({
  familyName,
  currentGuild,
}: {
  familyName: string
  currentGuild: string | null
}) {
  return (
    <div className="max-w-screen-md mx-auto px-4 py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">{familyName} 가문</h1>
        <p className="text-lg">
          현재 소속 길드: {" "}
          <span className="font-semibold">
            {currentGuild ? currentGuild : "정보 없음"}
          </span>
        </p>
      </Card>
    </div>
  )
}
