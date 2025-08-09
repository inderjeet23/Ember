import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './pages/App';
import Dashboard from './pages/Dashboard';
import ProjectPage from './pages/Project';
import InboxPage from './pages/Inbox';
import SprintPage from './pages/Sprint';
import WinsPage from './pages/Wins';
import DebugPage from './pages/Debug';
const router = createBrowserRouter([
    { path: '/', element: _jsx(App, {}), children: [
            { index: true, element: _jsx(Dashboard, {}) },
            { path: 'project/:id', element: _jsx(ProjectPage, {}) },
            { path: 'inbox', element: _jsx(InboxPage, {}) },
            { path: 'sprint/:projectId', element: _jsx(SprintPage, {}) },
            { path: 'wins', element: _jsx(WinsPage, {}) },
            { path: 'debug', element: _jsx(DebugPage, {}) },
        ] }
]);
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
