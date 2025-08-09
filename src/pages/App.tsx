
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import QuickAddFab from '@/components/QuickAddFab'
import { dailyRecompute } from '@/lib/momentum'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { Project } from '@/lib/types'
import Login from './Login'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'

export default function App(){
  const loc = useLocation()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
  }, [])

  // Recompute on load for all projects
  useEffect(()=>{
    if (!auth?.currentUser?.uid || !db) return
    const ref = doc(db, 'users', auth.currentUser.uid)
    getDoc(ref).then(async doc => {
      const projects = doc.data()?.projects as Project[] || []
      projects.forEach(p => dailyRecompute(p))
      await setDoc(ref, { projects })
    })
  }, [user])

  // Keyboard shortcuts
  useEffect(()=>{
    const handler = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return
      if (e.key.toLowerCase() === 'i') location.href = '/inbox'
      if (e.key.toLowerCase() === 'w') location.href = '/wins'
      if (e.key.toLowerCase() === 'd') location.href = '/debug'
      if (e.key.toLowerCase() === 'h') location.href = '/'
      if (e.key.toLowerCase() === 't' && loc.pathname.startsWith('/project/')) {
        const input = document.querySelector('input[name="name"]') as HTMLInputElement | null
        input?.focus()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [loc.pathname])

  // High-contrast toggle persisted
  useEffect(()=>{
    const hc = localStorage.getItem('hc') === '1'
    if (hc) document.documentElement.classList.add('hc')
  }, [])
  function toggleHC(){
    const el = document.documentElement
    const on = el.classList.toggle('hc')
    localStorage.setItem('hc', on ? '1' : '0')
  }

  
  if (!user) return <Login />

  return (
    <div className="min-h-screen">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <div className="text-lg font-semibold">Ember</div>
        {user && auth && (
          <button className="btn" onClick={() => signOut(auth)}>Sign Out</button>
        )}
      </header>
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex gap-6">
          <aside className="hidden md:block sidebar">
            <div className="card sticky top-4 space-y-2">
              <Link className="header-link block" to="/">Dashboard</Link>
              <Link className="header-link block" to="/inbox">Idea Inbox</Link>
              <Link className="header-link block" to="/wins">Dopamine Board</Link>
              <Link className="header-link block" to="/debug">Debug</Link>
              <button className="header-link w-full text-left" onClick={toggleHC}>Toggle High Contrast</button>
              <div className="text-xs text-neutral-400">Shortcuts: H, I, W, D, T</div>
            </div>
          </aside>
          <main className="flex-1">
            <Outlet />
            <QuickAddFab />
          </main>
        </div>
      </div>
    </div>
  )
}

