import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { id } from '@/lib/id'
import { load, save } from '@/lib/storage'
import { Project } from '@/lib/types'
import { isFirebaseEnabled } from '@/lib/firebase'
import { subscribeProjects as fxSubProjects, createProject as fxCreateProject } from '@/lib/fx'
import StateBadge from '@/components/StateBadge'
import ProgressBar from '@/components/ProgressBar'
import { computeStreak } from '@/lib/streak'

export default function Dashboard(){
  const [db, setDb] = useState(load())
  const [projects, setProjects] = useState<Project[] | null>(null)
  const useFx = isFirebaseEnabled()
  useEffect(()=>{
    if (!useFx) return
    let unsub: any
    (async()=>{ unsub = await fxSubProjects(setProjects) })()
    return ()=>{ if (typeof unsub === 'function') unsub() }
  }, [useFx])
  async function createProjectHandler(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value || 'Untitled'
    const type = (form.elements.namedItem('type') as HTMLSelectElement).value as Project['type']
    if (useFx) {
      await fxCreateProject(name, type)
    } else {
      const now = Date.now()
      const p: Project = { id: id(), name, type, momentumScore: 60, state: 'warm', createdAt: now, updatedAt: now, tasks: [], wins: [] }
      const next = { ...db, projects: [p, ...db.projects] }
      save(next); setDb(next)
    }
    form.reset()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <form onSubmit={createProjectHandler} className="card flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-xs opacity-70 mb-1">New project</label>
          <input name="name" className="input" placeholder="Project name" />
        </div>
        <select name="type" className="input max-w-[160px]">
          <option value="other">Other</option>
          <option value="writing">Writing</option>
          <option value="video">Video</option>
          <option value="dev">Dev</option>
        </select>
        <button className="btn">Create</button>
      </form>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {db.projects.map(p => {
          const streak = computeStreak(p)
          return (
          <details key={p.id} className="card group">
            <summary className="list-none cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold underline">{p.name}</div>
                <div className="flex items-center gap-2">
                  {streak >= 2 && <span className="text-xs rounded-md px-2 py-0.5 bg-[color:var(--accent-quiet)] text-[color:var(--text)]">🔥 {streak}</span>}
                  <StateBadge state={p.state} />
                </div>
              </div>
              {/* Progressive disclosure: hide extras until expanded */}
            </summary>
            <div className="mt-3 grid gap-3">
              <div className="text-sm opacity-80">Momentum</div>
              <div className="progress"><div style={{ width: `${p.momentumScore}%` }}/></div>
              <div className="flex gap-2">
                <Link className="btn" to={`/project/${p.id}`}>Open</Link>
                <Link className="btn" to={`/sprint/${p.id}`}>Start Sprint</Link>
              </div>
            </div>
          </details>
        )})}
      </div>

      {db.projects.length === 0 && (
        <div className="text-neutral-400">No projects yet. Create one above or promote an idea from the <Link to="/inbox">Idea Inbox</Link>.</div>
      )}
    </div>
  )
}
