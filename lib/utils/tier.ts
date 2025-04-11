// /lib/utils/tier.ts
export function getTier(score: number): string {
    if (score >= 2401) return 'solare'
    if (score >= 2101) return 'final'
    if (score >= 1801) return 'dawn'
    if (score >= 1501) return 'blood'
    if (score >= 1201) return 'sunset'
    if (score >= 801) return 'expert'
    if (score >= 401) return 'apprentice'
    return 'none'
  }
  