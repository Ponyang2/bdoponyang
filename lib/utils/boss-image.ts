// ✅ 경로: /lib/utils/boss-image.ts

const bossImageMap: Record<string, string> = {
    가모스: '/boss-icons/garmoth.png',
    쿠툼: '/boss-icons/kutum.png',
    누베르: '/boss-icons/nouver.png',
    카란다: '/boss-icons/karanda.png',
    크자카: '/boss-icons/karzaka.png',
    벨: '/boss-icons/vell.png',
    오핀: '/boss-icons/offin.png',
    무라카: '/boss-icons/muraka.png',
    귄트: '/boss-icons/Gunt.png',
    검은그림자: '/boss-icons/nightmare.png',
    산군: '/boss-icons/sangun.png',
    우투리: '/boss-icons/Woturi.png',
    금돼지왕: '/boss-icons/goldpig.png',
    불가살: '/boss-icons/bulgasal.png',
  }
  
  export function getBossImage(name: string): string {
    return bossImageMap[name] || '/bosses/default.png'
  }
  