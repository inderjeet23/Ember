import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { load, save, reset } from '@/lib/storage';
import { id } from '@/lib/id';
export default function DebugPage() {
    function seed() {
        const db = load();
        const p = { id: id(), name: 'YouTube Short', type: 'video', momentumScore: 60, state: 'warm', createdAt: Date.now(), updatedAt: Date.now(), tasks: [], wins: [] };
        p.tasks.push({ id: id(), name: 'Write hook', isActive: true, isComplete: false, createdAt: Date.now() });
        p.tasks.push({ id: id(), name: 'Cut intro', isActive: true, isComplete: false, createdAt: Date.now() });
        p.tasks.push({ id: id(), name: 'Add SFX', isActive: false, isComplete: false, createdAt: Date.now() });
        db.projects.unshift(p);
        save(db);
        location.reload();
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("button", { className: "btn", onClick: seed, children: "Seed Demo Data" }), _jsx("button", { className: "btn", onClick: () => { reset(); location.reload(); }, children: "Reset Local Data" })] }));
}
