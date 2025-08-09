import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, Link } from 'react-router-dom';
import { load, save } from '@/lib/storage';
import StateBadge from '@/components/StateBadge';
import { useMemo, useState, useEffect } from 'react';
import { applyGain } from '@/lib/momentum';
import { id } from '@/lib/id';
import { isFirebaseEnabled } from '@/lib/firebase';
import { subscribeProject, subscribeTasks, addTask, activateTask, completeTask as fxCompleteTask, applyGainAndPersist } from '@/lib/fx';
import { tinyPop } from '@/lib/reward';
export default function ProjectPage() {
    const { id: pid } = useParams();
    const [db, setDb] = useState(load());
    const useFx = isFirebaseEnabled();
    const [projectFx, setProjectFx] = useState(null);
    const [tasksFx, setTasksFx] = useState(null);
    // Subscribe when Firebase is on
    useEffect(() => {
        if (!useFx || !pid)
            return;
        let un1, un2;
        (async () => {
            un1 = await subscribeProject(pid, setProjectFx);
            un2 = await subscribeTasks(pid, setTasksFx);
        })();
        return () => { if (typeof un1 === 'function')
            un1(); if (typeof un2 === 'function')
            un2(); };
    }, [useFx, pid]);
    const project = useFx ? projectFx : db.projects.find(p => p.id === pid);
    const tasks = tasksFx ?? project?.tasks ?? [];
    const active = tasks.filter(t => t.isActive && !t.isComplete).slice(0, 3);
    const backlog = tasks.filter(t => !t.isActive && !t.isComplete);
    const completed = tasks.filter(t => t.isComplete);
    async function addTaskHandler(e) {
        e.preventDefault();
        if (!project)
            return;
        const form = e.currentTarget;
        const name = form.elements.namedItem('name').value || 'New task';
        const activate = form.elements.namedItem('activate').checked;
        const activeCount = active.length;
        if (useFx) {
            await addTask(project.id, name, activate);
            if (activate && activeCount >= 3)
                await applyGainAndPersist(project.id, 'railOverflow');
        }
        else {
            const t = { id: id(), name, isActive: activate && activeCount < 3, isComplete: false, createdAt: Date.now() };
            project.tasks.push(t);
            if (activate && activeCount >= 3)
                applyGain(project, 'railOverflow');
            project.updatedAt = Date.now();
            const next = { ...db };
            save(next);
            setDb(next);
        }
        form.reset();
    }
    async function activateTaskHandler(taskId) {
        if (!project)
            return;
        const activeCount = active.length;
        if (activeCount >= 3)
            return; // swap flow omitted for MVP
        if (useFx) {
            await activateTask(project.id, taskId, true);
        }
        else {
            const t = project.tasks.find(t => t.id === taskId);
            if (!t)
                return;
            t.isActive = true;
            project.updatedAt = Date.now();
            const next = { ...db };
            save(next);
            setDb(next);
        }
    }
    async function completeTaskHandler(taskId) {
        if (!project)
            return;
        if (useFx) {
            await fxCompleteTask(project.id, taskId);
        }
        else {
            const t = project.tasks.find(t => t.id === taskId);
            if (!t || t.isComplete)
                return;
            t.isComplete = true;
            tinyPop();
            t.isActive = false;
            t.completedAt = Date.now();
            applyGain(project, 'taskComplete');
            project.updatedAt = Date.now();
            const doneCount = project.tasks.filter(x => x.isComplete).length;
            if (doneCount > 0 && doneCount % 3 === 0)
                applyGain(project, 'milestoneComplete');
            const next = { ...db };
            save(next);
            setDb(next);
        }
    }
    const reentry = useMemo(() => {
        if (!project)
            return { lastTouch: '—', nextStep: 'Add a tiny next step', blocker: '—' };
        const lastTouch = project.lastTouchedAt ? new Date(project.lastTouchedAt).toLocaleString() : '—';
        const nextStep = active[0]?.name || backlog[0]?.name || 'Add a tiny next step';
        const blocker = backlog.find(b => b.name.toLowerCase().includes('block'))?.name || '—';
        return { lastTouch, nextStep, blocker };
    }, [project, active, backlog]);
    if (!project)
        return _jsx("div", { className: "text-neutral-400", children: "Not found." });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "card", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-xl font-semibold", children: project.name }), _jsx(StateBadge, { state: project.state })] }), _jsxs("div", { className: "mt-2 text-sm opacity-80", children: ["Momentum: ", project.momentumScore] }), _jsx("div", { className: "mt-3", children: _jsx(Link, { to: `/sprint/${project.id}`, className: "btn", children: "Start 25-minute sprint" }) }), _jsxs("div", { className: "mt-3 text-sm opacity-80", children: [_jsxs("div", { children: ["Last touch: ", reentry.lastTouch] }), _jsxs("div", { children: ["Next micro-step: ", reentry.nextStep] }), _jsxs("div", { children: ["Blocker: ", reentry.blocker] })] })] }), _jsxs("form", { onSubmit: addTaskHandler, className: "card flex items-end gap-2", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-xs opacity-70 mb-1", children: "Add task" }), _jsx("input", { name: "name", className: "input", placeholder: "Tiny next step" })] }), _jsxs("label", { className: "text-sm flex items-center gap-2", children: [_jsx("input", { type: "checkbox", name: "activate" }), " Activate on rail"] }), _jsx("button", { className: "btn", children: "Add" })] }), _jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "card", children: [_jsx("div", { className: "font-medium mb-2", children: "Active (Rail)" }), _jsxs("div", { className: "space-y-2", children: [active.map(t => (_jsxs("div", { className: "flex items-center justify-between rounded-xl bg-neutral-800 p-2", children: [_jsx("div", { children: t.name }), _jsx("button", { className: "btn", onClick: () => completeTaskHandler(t.id), children: "Complete" })] }, t.id))), active.length < 3 && _jsx("div", { className: "rounded-xl border border-dashed border-neutral-700 p-2 text-neutral-400", children: "Empty slot" })] })] }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "font-medium mb-2", children: "Backlog" }), _jsxs("div", { className: "space-y-2", children: [backlog.map(t => (_jsxs("div", { className: "rounded-xl bg-neutral-800 p-2 flex items-center justify-between", children: [_jsx("div", { children: t.name }), _jsx("button", { className: "btn", onClick: () => activateTaskHandler(t.id), children: "Activate" })] }, t.id))), backlog.length === 0 && _jsx("div", { className: "text-neutral-400 text-sm", children: "Nothing here." })] })] }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "font-medium mb-2", children: "Completed" }), _jsxs("div", { className: "space-y-2", children: [completed.slice(0, 10).map(t => (_jsx("div", { className: "rounded-xl bg-neutral-900 p-2 opacity-70 line-through", children: t.name }, t.id))), completed.length === 0 && _jsx("div", { className: "text-neutral-400 text-sm", children: "No wins yet." })] })] })] })] }));
}
