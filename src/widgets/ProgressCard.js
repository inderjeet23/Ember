'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as htmlToImage from 'html-to-image';
import { useRef } from 'react';
import { load } from '@/lib/storage';
export default function ProgressCard({ projectId }) {
    const ref = useRef(null);
    const db = load();
    const project = db.projects.find(p => p.id === projectId);
    async function exportPng() {
        if (!ref.current)
            return;
        const dataUrl = await htmlToImage.toPng(ref.current);
        const link = document.createElement('a');
        link.download = `${project.name}-progress.png`;
        link.href = dataUrl;
        link.click();
    }
    return (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { ref: ref, className: "card w-[420px]", children: [_jsx("div", { className: "text-lg font-semibold", children: project.name }), _jsxs("div", { className: "text-sm opacity-80", children: ["Momentum: ", project.momentumScore] }), _jsx("div", { className: "h-2 w-full bg-neutral-800 rounded-md mt-2", children: _jsx("div", { className: "h-2 rounded-md bg-green-500", style: { width: `${project.momentumScore}%` } }) }), _jsx("div", { className: "mt-2 text-xs opacity-70", children: "Progress card preview" })] }), _jsx("button", { onClick: exportPng, className: "btn", children: "Export PNG" })] }));
}
