'use client'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { load, save } from '@/lib/storage'
import { applyGain } from '@/lib/momentum'
import { burstGood } from '@/lib/reward'

export default function SprintPage(){
  const { projectId } = useParams()
  const nav = useNavigate()
  const [seconds, setSeconds] = useState(25*60)
  const [running, setRunning] = useState(false)

  useEffect(()=>{ setRunning(true) }, [])

  useEffect(()=>{
    if (!running) return
    const t = setInterval(()=> setSeconds(s => {
      if (s <= 1) { clearInterval(t); setRunning(false); onComplete(); return 0 }
      return s - 1
    }), 1000)
    return ()=> clearInterval(t)
  }, [running])

  function onComplete(){
    const db = load()
    const p = db.projects.find(p=>p.id === projectId)
    if (p){ applyGain(p as any, 'sprintComplete'); save(db); burstGood() }
    nav(`/project/${projectId}`)
  }

  const m = Math.floor(seconds/60).toString().padStart(2,'0')
  const s = (seconds%60).toString().padStart(2,'0')

  return (
    <div className="max-w-lg mx-auto card text-center">
      <div className="text-xl font-semibold mb-2">Focus Sprint</div>
      <div className="text-6xl font-mono tracking-widest">{m}:{s}</div>
      <div className="mt-4 text-neutral-400">Stay with the current project. Other views are blocked during a sprint.</div>
      <button onClick={()=>setRunning(!running)} className="btn mt-4">{running ? 'Pause' : 'Resume'}</button>
    </div>
  )
}
