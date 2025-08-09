import { load, save, reset } from '@/lib/storage'
import { id } from '@/lib/id'

export default function DebugPage(){
  function seed(){
    const db = load()
    const p = { id: id(), name: 'YouTube Short', type: 'video' as const, momentumScore: 60, state: 'warm' as const, createdAt: Date.now(), updatedAt: Date.now(), tasks: [], wins: [] }
    p.tasks.push({ id: id(), name: 'Write hook', isActive: true, isComplete: false, createdAt: Date.now() })
    p.tasks.push({ id: id(), name: 'Cut intro', isActive: true, isComplete: false, createdAt: Date.now() })
    p.tasks.push({ id: id(), name: 'Add SFX', isActive: false, isComplete: false, createdAt: Date.now() })
    db.projects.unshift(p as any); save(db); location.reload()
  }
  return (
    <div className="space-y-4">
      <button className="btn" onClick={seed}>Seed Demo Data</button>
      <button className="btn" onClick={()=>{ reset(); location.reload() }}>Reset Local Data</button>
    </div>
  )
}
