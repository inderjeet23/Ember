'use client'
import * as htmlToImage from 'html-to-image'
import { useRef } from 'react'
import { load } from '@/lib/storage'

export default function ProgressCard({ projectId }: { projectId: string }){
  const ref = useRef<HTMLDivElement>(null)
  const db = load()
  const project = db.projects.find(p=>p.id===projectId)!

  async function exportPng(){
    if (!ref.current) return
    const dataUrl = await htmlToImage.toPng(ref.current)
    const link = document.createElement('a')
    link.download = `${project.name}-progress.png`
    link.href = dataUrl
    link.click()
  }
  return (
    <div className="space-y-2">
      <div ref={ref} className="card w-[420px]">
        <div className="text-lg font-semibold">{project.name}</div>
        <div className="text-sm opacity-80">Momentum: {project.momentumScore}</div>
        <div className="h-2 w-full bg-neutral-800 rounded-md mt-2">
          <div className="h-2 rounded-md bg-green-500" style={{ width: `${project.momentumScore}%` }} />
        </div>
        <div className="mt-2 text-xs opacity-70">Progress card preview</div>
      </div>
      <button onClick={exportPng} className="btn">Export PNG</button>
    </div>
  )
}
