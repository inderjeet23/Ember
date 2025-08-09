import { Project } from './types'

// Computes consecutive-day streak ending today from wins timestamps
export function computeStreak(p: Project): number {
  if (!p.wins.length) return 0
  const days = new Set(p.wins.map(w => new Date(w.createdAt).toDateString()))
  let streak = 0
  let d = new Date()
  for (;;) {
    const key = d.toDateString()
    if (days.has(key)) { streak++; d.setDate(d.getDate()-1); continue }
    // allow "yesterday" start if today had no activity but last touch is today
    break
  }
  return streak
}
