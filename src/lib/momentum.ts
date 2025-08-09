import { Project, ProjectState, ProjectType, Win } from './types'

export const STATE_MIN = { fresh: 70, warm: 40, cooling: 15, cold: 0 } as const

export function stateFromScore(score: number): ProjectState {
  if (score >= STATE_MIN.fresh) return 'fresh'
  if (score >= STATE_MIN.warm) return 'warm'
  if (score >= STATE_MIN.cooling) return 'cooling'
  return 'cold'
}

function clamp(n: number, min = 0, max = 100) { return Math.max(min, Math.min(max, n)) }
function decayMultiplier(type: ProjectType) {
  if (type === 'writing') return 0.9
  if (type === 'dev') return 1.1
  return 1.0
}

export function applyGain(p: Project, kind: 'taskComplete' | 'milestoneComplete' | 'sprintComplete' | 'ideaPromoted' | 'railOverflow' | 'touchOnly'): Win {
  const values = { taskComplete: 8, milestoneComplete: 20, sprintComplete: 5, ideaPromoted: 4, railOverflow: -2, touchOnly: 0 }
  const delta = values[kind]
  p.momentumScore = clamp(p.momentumScore + delta)
  p.state = stateFromScore(p.momentumScore)
  p.lastTouchedAt = Date.now()
  const win: Win = { id: Math.random().toString(36).slice(2), projectId: p.id, type: (kind === 'railOverflow' ? 'taskComplete' : kind), value: delta, createdAt: Date.now() }
  p.wins.unshift(win)
  return win
}

export function dailyRecompute(p: Project, now = Date.now()) {
  const last = p.lastDailyRecompute ?? 0
  const lastDay = new Date(last).toDateString()
  const today = new Date(now).toDateString()
  if (last && lastDay === today) return

  const touched = !!p.lastTouchedAt && (now - p.lastTouchedAt) < 24*60*60*1000
  const base = touched ? -3 : -6
  const decay = Math.round(base * decayMultiplier(p.type))
  p.momentumScore = clamp(p.momentumScore + decay)
  p.state = stateFromScore(p.momentumScore)
  p.lastDailyRecompute = now
}
