import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { id } from '@/lib/id';
import { load, save } from '@/lib/storage';
import { isFirebaseEnabled } from '@/lib/firebase';
import { subscribeProjects as fxSubProjects, createProject as fxCreateProject } from '@/lib/fx';
import StateBadge from '@/components/StateBadge';
import { computeStreak } from '@/lib/streak';
export default function Dashboard() {
    const [db, setDb] = useState(load());
    const [projects, setProjects] = useState(null);
    const useFx = isFirebaseEnabled();
    useEffect(() => {
        if (!useFx)
            return;
        let unsub;
        (async () => { unsub = await fxSubProjects(setProjects); })();
        return () => { if (typeof unsub === 'function')
            unsub(); };
    }, [useFx]);
    async function createProjectHandler(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const name = form.elements.namedItem('name').value || 'Untitled';
        const type = form.elements.namedItem('type').value;
        if (useFx) {
            await fxCreateProject(name, type);
        }
        else {
            const now = Date.now();
            const p = { id: id(), name, type, momentumScore: 60, state: 'warm', createdAt: now, updatedAt: now, tasks: [], wins: [] };
            const next = { ...db, projects: [p, ...db.projects] };
            save(next);
            setDb(next);
        }
        form.reset();
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Dashboard" }), _jsxs("form", { onSubmit: createProjectHandler, className: "card flex items-end gap-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-xs opacity-70 mb-1", children: "New project" }), _jsx("input", { name: "name", className: "input", placeholder: "Project name" })] }), _jsxs("select", { name: "type", className: "input max-w-[160px]", children: [_jsx("option", { value: "other", children: "Other" }), _jsx("option", { value: "writing", children: "Writing" }), _jsx("option", { value: "video", children: "Video" }), _jsx("option", { value: "dev", children: "Dev" })] }), _jsx("button", { className: "btn", children: "Create" })] }), _jsx("div", { className: "grid gap-4 grid-cols-1 md:grid-cols-2", children: db.projects.map(p => {
                    const streak = computeStreak(p);
                    return (_jsxs("details", { className: "card group", children: [_jsx("summary", { className: "list-none cursor-pointer", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-lg font-semibold underline", children: p.name }), _jsxs("div", { className: "flex items-center gap-2", children: [streak >= 2 && _jsxs("span", { className: "text-xs rounded-md px-2 py-0.5 bg-[color:var(--accent-quiet)] text-[color:var(--text)]", children: ["\uD83D\uDD25 ", streak] }), _jsx(StateBadge, { state: p.state })] })] }) }), _jsxs("div", { className: "mt-3 grid gap-3", children: [_jsx("div", { className: "text-sm opacity-80", children: "Momentum" }), _jsx("div", { className: "progress", children: _jsx("div", { style: { width: `${p.momentumScore}%` } }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { className: "btn", to: `/project/${p.id}`, children: "Open" }), _jsx(Link, { className: "btn", to: `/sprint/${p.id}`, children: "Start Sprint" })] })] })] }, p.id));
                }) }), db.projects.length === 0 && (_jsxs("div", { className: "text-neutral-400", children: ["No projects yet. Create one above or promote an idea from the ", _jsx(Link, { to: "/inbox", children: "Idea Inbox" }), "."] }))] }));
}
