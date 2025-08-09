import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { load } from '@/lib/storage';
import ProgressCard from '@/widgets/ProgressCard';
import { isFirebaseEnabled } from '@/lib/firebase';
export default function WinsPage() {
    const db = load();
    const localWins = db.projects.flatMap(p => p.wins.map(w => ({ ...w, projectName: p.name, score: p.momentumScore }))).sort((a, b) => b.createdAt - a.createdAt).slice(0, 50);
    const exampleProject = db.projects[0];
    const useFx = isFirebaseEnabled();
    const [rows, setRows] = useState([]);
    // TODO: Implement fetching wins from Firebase
    // useEffect(()=>{
    //   if (!useFx) return
    //   // subscribeAllWins(setRows)
    // }, [useFx])
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Dopamine Board" }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "text-lg font-semibold", children: "Recent Wins" }), _jsxs("div", { className: "mt-2 space-y-2", children: [(useFx ? rows : localWins).map(w => (_jsxs("div", { className: "flex items-center justify-between rounded-xl bg-neutral-800 p-2", children: [_jsxs("div", { className: "text-sm", children: [w.type, " \u2022 ", w.projectName] }), _jsx("div", { className: "text-xs opacity-60", children: new Date(w.createdAt).toLocaleString() })] }, w.id))), (useFx ? rows : localWins).length === 0 && _jsx("div", { className: "text-neutral-400", children: "No wins yet." })] })] }), exampleProject && (_jsxs("div", { className: "card", children: [_jsx("div", { className: "mb-2 font-medium", children: "Progress Card (example)" }), _jsx(ProgressCard, { projectId: exampleProject.id })] }))] }));
}
