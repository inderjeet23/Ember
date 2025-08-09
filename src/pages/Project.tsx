import { useParams, Link } from 'react-router-dom'
import { load, save } from '@/lib/storage'
import StateBadge from '@/components/StateBadge'
import { FormEvent, useMemo, useState, useEffect } from 'react'
import { applyGain } from '@/lib/momentum'
import type { Project, Task } from '@/lib/types'
import { id } from '@/lib/id'
import { isFirebaseEnabled } from '@/lib/firebase'
import { subscribeProject, subscribeTasks, addTask, activateTask, completeTask as fxCompleteTask, applyGainAndPersist } from '@/lib/fx'
import { tinyPop } from '@/lib/reward'

export default function ProjectPage(){
  const { id: pid } = useParams()
  const [db, setDb] = useState(load())
  const useFx = isFirebaseEnabled()
  const [projectFx, setProjectFx] = useState<Project | null>(null)
  const [tasksFx, setTasksFx] = useState<Task[] | null>(null)

  // Subscribe when Firebase is on
  useEffect(()=>{
    if (!useFx || !pid) return
    let un1:any, un2:any
    (async()=>{
      un1 = await subscribeProject(pid, setProjectFx)
      un2 = await subscribeTasks(pid, setTasksFx)
    })()
    return ()=>{ if (typeof un1==='function') un1(); if (typeof un2==='function') un2() }
  }, [useFx, pid])

  const project = useFx ? projectFx : db.projects.find(p => p.id === pid)

  const tasks = tasksFx ?? project?.tasks ?? []
  const active = tasks.filter(t=>t.isActive && !t.isComplete).slice(0,3)
  const backlog = tasks.filter(t=>!t.isActive && !t.isComplete)
  const completed = tasks.filter(t=>t.isComplete)

  async function addTaskHandler(e: FormEvent<HTMLFormElement>){
    e.preventDefault()
    if (!project) return
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement).value || 'New task'
    const activate = (form.elements.namedItem('activate') as HTMLInputElement).checked
    const activeCount = active.length
    if (useFx) {
      await addTask(project.id, name, activate)
      if (activate && activeCount >= 3) await applyGainAndPersist(project.id, 'railOverflow')
    } else {
      const t: Task = { id: id(), name, isActive: activate && activeCount < 3, isComplete: false, createdAt: Date.now() }
      project.tasks.push(t)
      if (activate && activeCount >= 3) applyGain(project, 'railOverflow')
      project.updatedAt = Date.now()
      const next = { ...db }
      save(next); setDb(next)
    }
    form.reset()
  }

  async function activateTaskHandler(taskId: string){
    if (!project) return
    const activeCount = active.length
    if (activeCount >= 3) return // swap flow omitted for MVP
    if (useFx) { await activateTask(project.id, taskId, true) }
    else {
      const t = project.tasks.find(t=>t.id===taskId)
      if (!t) return
      t.isActive = true
      project.updatedAt = Date.now()
      const next = { ...db }; save(next); setDb(next)
    }
  }

  async function completeTaskHandler(taskId: string){
    if (!project) return
    if (useFx) {
      await fxCompleteTask(project.id, taskId)
    } else {
      const t = project.tasks.find(t=>t.id===taskId)
      if (!t || t.isComplete) return
      t.isComplete = true
      tinyPop()
      t.isActive = false
      t.completedAt = Date.now()
      applyGain(project, 'taskComplete')
      project.updatedAt = Date.now()
      const doneCount = project.tasks.filter(x=>x.isComplete).length
      if (doneCount > 0 && doneCount % 3 === 0) applyGain(project, 'milestoneComplete')
      const next = { ...db }; save(next); setDb(next)
    }
  }

  const reentry = useMemo(()=>{
    if (!project) return { lastTouch: '—', nextStep: 'Add a tiny next step', blocker: '—' }
    const lastTouch = project.lastTouchedAt ? new Date(project.lastTouchedAt).toLocaleString() : '—'
    const nextStep = active[0]?.name || backlog[0]?.name || 'Add a tiny next step'
    const blocker = backlog.find(b=>b.name.toLowerCase().includes('block') )?.name || '—'
    return { lastTouch, nextStep, blocker }
  }, [project, active, backlog])

  if (!project) return <div className="text-neutral-400">Not found.</div>

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">{project.name}</div>
          <StateBadge state={project.state} />
        </div>
        <div className="mt-2 text-sm opacity-80">Momentum: {project.momentumScore}</div>
        <div className="mt-3">
          <Link to={`/sprint/${project.id}`} className="btn">Start 25-minute sprint</Link>
        </div>
        <div className="mt-3 text-sm opacity-80">
          <div>Last touch: {reentry.lastTouch}</div>
          <div>Next micro-step: {reentry.nextStep}</div>
          <div>Blocker: {reentry.blocker}</div>
        </div>
      </div>

      <form onSubmit={addTaskHandler} className="card flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-xs opacity-70 mb-1">Add task</label>
          <input name="name" className="input" placeholder="Tiny next step" />
        </div>
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" name="activate" /> Activate on rail
        </label>
        <button className="btn">Add</button>
      </form>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <div className="font-medium mb-2">Active (Rail)</div>
          <div className="space-y-2">
            {active.map(t => (
              <div key={t.id} className="flex items-center justify-between rounded-xl bg-neutral-800 p-2">
                <div>{t.name}</div>
                <button className="btn" onClick={()=>completeTaskHandler(t.id)}>Complete</button>
              </div>
            ))}
            {active.length < 3 && <div className="rounded-xl border border-dashed border-neutral-700 p-2 text-neutral-400">Empty slot</div>}
          </div>
        </div>

        <div className="card">
          <div className="font-medium mb-2">Backlog</div>
          <div className="space-y-2">
            {backlog.map(t => (
              <div key={t.id} className="rounded-xl bg-neutral-800 p-2 flex items-center justify-between">
                <div>{t.name}</div>
                <button className="btn" onClick={()=>activateTaskHandler(t.id)}>Activate</button>
              </div>
            ))}
            {backlog.length === 0 && <div className="text-neutral-400 text-sm">Nothing here.</div>}
          </div>
        </div>

        <div className="card">
          <div className="font-medium mb-2">Completed</div>
          <div className="space-y-2">
            {completed.slice(0,10).map(t => (
              <div key={t.id} className="rounded-xl bg-neutral-900 p-2 opacity-70 line-through">{t.name}</div>
            ))}
            {completed.length === 0 && <div className="text-neutral-400 text-sm">No wins yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}