import { FormEvent, useState } from 'react'
import { load, save } from '@/lib/storage'
import { Idea } from '@/lib/types'
import { id } from '@/lib/id'
import { applyGain } from '@/lib/momentum'
import { Link, useNavigate } from 'react-router-dom'

export default function InboxPage(){
  const [db, setDb] = useState(load())
  const nav = useNavigate()

  function add(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    const form = e.currentTarget
    const text = (form.elements.namedItem('text') as HTMLInputElement).value.trim()
    if (!text) return
    const idea: Idea = { id: id(), text, createdAt: Date.now(), coolingUntil: Date.now() + 48*3600_000, status: 'cooling' }
    const next = { ...db, ideas: [idea, ...db.ideas] }
    save(next); setDb(next); form.reset()
  }

  function promote(ideaId: string){
    const idea = db.ideas.find(i => i.id === ideaId)
    if (!idea) return
    const name = prompt('Project name?') || 'New Project'
    const p = { id: id(), name, type: 'other' as const, momentumScore: 60, state: 'warm' as const, createdAt: Date.now(), updatedAt: Date.now(), tasks: [], wins: [] }
    db.projects.unshift(p as any)
    idea.status = 'promoted'
    idea.promotedProjectId = p.id
    const tname = prompt('First tiny task?') || 'First step'
    p.tasks.push({ id: id(), name: tname, isActive: true, isComplete: false, createdAt: Date.now() })
    applyGain(p as any, 'ideaPromoted'); burstGood()
    save(db); setDb({ ...db })
    nav(`/project/${p.id}`)
  }

  function archive(ideaId: string){
    const idea = db.ideas.find(i => i.id === ideaId)
    if (!idea) return
    idea.status = 'archived'
    save(db); setDb({ ...db })
  }

  return (
    <div className="space-y-6"><h1 className="text-2xl font-semibold">Idea Inbox</h1>
      <form onSubmit={add} className="card flex gap-2">
        <input name="text" className="input flex-1" placeholder="Capture idea..." />
        <button className="btn">Add</button>
      </form>

      <div className="space-y-3">
        {db.ideas.map(i => (
          <div key={i.id} className="card">
            <div className="text-sm opacity-80">{new Date(i.createdAt).toLocaleString()} — {i.status}</div>
            <div className="mt-1">{i.text}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {i.status !== 'promoted' && <button className="btn" onClick={()=>promote(i.id)}>Promote</button>}
              <button className="btn" onClick={()=>archive(i.id)}>Archive</button>
              {i.promotedProjectId && <Link className="btn" to={`/project/${i.promotedProjectId}`}>Open Project</Link>}
            </div>
          </div>
        ))}
        {db.ideas.length === 0 && <div className="text-neutral-400">No ideas yet.</div>}
      </div>
    </div>
  )
}
