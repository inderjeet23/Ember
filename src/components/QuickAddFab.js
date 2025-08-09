'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function QuickAddFab() {
    const [open, setOpen] = useState(false);
    const nav = useNavigate();
    return (_jsxs("div", { className: "fab", children: [_jsx("button", { className: "fab-btn", onClick: () => setOpen(!open), children: "\uFF0B" }), open && (_jsxs("div", { className: "menu", children: [_jsx("button", { className: "block btn w-full mb-1", onClick: () => { nav('/'); setOpen(false); const el = document.querySelector('input[name="name"]'); el?.focus(); }, children: "New Project (P)" }), _jsx("button", { className: "block btn w-full", onClick: () => { nav('/inbox'); setOpen(false); const el = document.querySelector('input[name="text"]'); setTimeout(() => el?.focus(), 50); }, children: "New Idea (I)" })] }))] }));
}
