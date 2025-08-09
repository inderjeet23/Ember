import { useMemo } from 'react'
import { load } from '@/lib/storage'
import ProgressCard from '@/widgets/ProgressCard'

export default function WinsPage(){
  const db = load()
  const wins = db.projects.flatMap(p => p.wins.map(w => ({...w, projectName: p.name, score: p.momentumScore}))).sort((a,b)=> b.createdAt - a.createdAt).slice(0,50)
  const exampleProject = db.projects[0]

  return (
    <div className="space-y-6"><h1 className="text-2xl font-semibold">Dopamine Board</h1>
      <div className="card">
        <div className="text-lg font-semibold">Recent Wins</div>
        <div className="mt-2 space-y-2">
          {(useFx ? rows : localWins).map(w => (
            <div key={w.id} className="flex items-center justify-between rounded-xl bg-neutral-800 p-2">
              <div className="text-sm">{w.type} • {w.projectName}</div>
              <div className="text-xs opacity-60">{new Date(w.createdAt).toLocaleString()}</div>
            </div>
          ))}
          {(useFx ? rows : localWins).length === 0 && <div className="text-neutral-400">No wins yet.</div>}
        </div>
      </div>
      {exampleProject && (
        <div className="card">
          <div className="mb-2 font-medium">Progress Card (example)</div>
          <ProgressCard projectId={exampleProject.id} />
        </div>
      )}
    </div>
  )
}
