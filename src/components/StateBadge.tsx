import { ProjectState } from '@/lib/types'
export default function StateBadge({ state }: { state: ProjectState }){
  const cls = state === 'fresh' ? 'state-fresh' :
              state === 'warm' ? 'state-warm' :
              state === 'cooling' ? 'state-cooling' : 'state-cold'
  const label = state[0].toUpperCase() + state.slice(1)
  return <span className={`badge ${cls}`}>{label}</span>
}
