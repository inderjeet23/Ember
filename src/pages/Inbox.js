import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { load, save } from '@/lib/storage';
import { id } from '@/lib/id';
import { applyGain } from '@/lib/momentum';
import { Link, useNavigate } from 'react-router-dom';
import { burstGood } from '@/lib/reward';
export default function InboxPage() {
    const [db, setDb] = useState(load());
    const nav = useNavigate();
    function add(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const text = form.elements.namedItem('text').value.trim();
        if (!text)
            return;
        const idea = { id: id(), text, createdAt: Date.now(), coolingUntil: Date.now() + 48 * 3600000, status: 'cooling' };
        const next = { ...db, ideas: [idea, ...db.ideas] };
        save(next);
        setDb(next);
        form.reset();
    }
    function promote(ideaId) {
        const idea = db.ideas.find(i => i.id === ideaId);
        if (!idea)
            return;
        const name = prompt('Project name?') || 'New Project';
        const p = { id: id(), name, type: 'other', momentumScore: 60, state: 'warm', createdAt: Date.now(), updatedAt: Date.now(), tasks: [], wins: [] };
        db.projects.unshift(p);
        idea.status = 'promoted';
        idea.promotedProjectId = p.id;
        const tname = prompt('First tiny task?') || 'First step';
        p.tasks.push({ id: id(), name: tname, isActive: true, isComplete: false, createdAt: Date.now() });
        applyGain(p, 'ideaPromoted');
        burstGood();
        save(db);
        setDb({ ...db });
        nav(`/project/${p.id}`);
    }
    function archive(ideaId) {
        const idea = db.ideas.find(i => i.id === ideaId);
        if (!idea)
            return;
        idea.status = 'archived';
        save(db);
        setDb({ ...db });
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Idea Inbox" }), _jsxs("form", { onSubmit: add, className: "card flex gap-2", children: [_jsx("input", { name: "text", className: "input flex-1", placeholder: "Capture idea..." }), _jsx("button", { className: "btn", children: "Add" })] }), _jsxs("div", { className: "space-y-3", children: [db.ideas.map(i => (_jsxs("div", { className: "card", children: [_jsxs("div", { className: "text-sm opacity-80", children: [new Date(i.createdAt).toLocaleString(), " \u2014 ", i.status] }), _jsx("div", { className: "mt-1", children: i.text }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [i.status !== 'promoted' && _jsx("button", { className: "btn", onClick: () => promote(i.id), children: "Promote" }), _jsx("button", { className: "btn", onClick: () => archive(i.id), children: "Archive" }), i.promotedProjectId && _jsx(Link, { className: "btn", to: `/project/${i.promotedProjectId}`, children: "Open Project" })] })] }, i.id))), db.ideas.length === 0 && _jsx("div", { className: "text-neutral-400", children: "No ideas yet." })] })] }));
}
