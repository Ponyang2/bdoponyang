import { getCurrentGuild } from "@/lib/queries/getCurrentGuild"
import FamilyCurrentGuild from "@/components/family/FamilyCurrentGuild"

interface Props {
  params: Promise<{ name: string }>  // ✅ 중요: Promise 타입 명시
}

export default async function FamilyPage({ params }: Props) {
  const { name } = await params  // ✅ await로 params 처리
  const familyName = decodeURIComponent(name)
  const currentGuild = await getCurrentGuild(familyName)

  return <FamilyCurrentGuild familyName={familyName} currentGuild={currentGuild} />
}
