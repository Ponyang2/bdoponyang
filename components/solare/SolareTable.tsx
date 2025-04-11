import Image from 'next/image'

interface Entry {
  family_name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
  tier: string
}

interface Props {
  data: Entry[]
}

export default function SolareTable({ data }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="min-w-full text-lg text-center border-separate border-spacing-y-2">
        <thead className="bg-gray-800 text-white font-semibold">
          <tr>
            <th className="px-2 py-1">순위</th>
            <th className="px-2 py-1">티어</th>
            <th className="px-2 py-1">가문명</th>
            <th className="px-2 py-1">전승/각성</th>
            <th className="px-2 py-1">클래스</th>
            <th className="px-2 py-1">승 / 무 / 패</th>
            <th className="px-2 py-1">승률</th>
            <th className="px-2 py-1">점수</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={entry.family_name} className="bg-white text-black">
              <td className="px-2 py-1 font-medium">{idx + 1}</td>
              <td className="px-2 py-1">
                <Image
                  src={`/solare-icons/${entry.tier}.png`}
                  alt={entry.tier}
                  width={32}
                  height={32}
                  className="mx-auto"
                />
              </td>
              <td className="px-2 py-1">{entry.family_name}</td>
              <td className="px-2 py-1">{entry.subclass}</td>
              <td className="px-2 py-1">{entry.class}</td>
              <td className="px-2 py-1">
                {entry.wins}/{entry.draws}/{entry.losses}
              </td>
              <td className="px-2 py-1">
                {entry.wins + entry.draws + entry.losses > 0
                  ? `${Math.round(
                      (entry.wins / (entry.wins + entry.draws + entry.losses)) * 100,
                    )}%`
                  : '-'}
              </td>
              <td className="px-2 py-1 font-semibold">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
