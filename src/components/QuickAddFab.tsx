'use client'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickAddFab(){
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  return (
    <div className="fab">
      <button className="fab-btn" onClick={()=>setOpen(!open)}>＋</button>
      {open && (
        <div className="menu">
          <button className="block btn w-full mb-1" onClick={()=>{ nav('/'); setOpen(false); const el=document.querySelector('input[name="name"]') as HTMLInputElement|null; el?.focus() }}>New Project (P)</button>
          <button className="block btn w-full" onClick={()=>{ nav('/inbox'); setOpen(false); const el=document.querySelector('input[name="text"]') as HTMLInputElement|null; setTimeout(()=>el?.focus(), 50) }}>New Idea (I)</button>
        </div>
      )}
    </div>
  )
}
