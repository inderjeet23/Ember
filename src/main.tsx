import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './pages/App'
import Dashboard from './pages/Dashboard'
import ProjectPage from './pages/Project'
import InboxPage from './pages/Inbox'
import SprintPage from './pages/Sprint'
import WinsPage from './pages/Wins'
import DebugPage from './pages/Debug'

const router = createBrowserRouter([
  { path: '/', element: <App />, children: [
    { index: true, element: <Dashboard /> },
    { path: 'project/:id', element: <ProjectPage /> },
    { path: 'inbox', element: <InboxPage /> },
    { path: 'sprint/:projectId', element: <SprintPage /> },
    { path: 'wins', element: <WinsPage /> },
    { path: 'debug', element: <DebugPage /> },
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
