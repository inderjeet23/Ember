import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QuickAddFab from '@/components/QuickAddFab';
import { dailyRecompute } from '@/lib/momentum';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Login from './Login';
import { onAuthStateChanged, signOut, } from 'firebase/auth';
export default function App() {
    const loc = useLocation();
    const [user, setUser] = useState(null);
    useEffect(() => {
        let unsubscribe;
        if (auth) {
            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
            });
        }
        else {
            // If auth is not available, we don't need to set loading to false
            // as the loading state is no longer used for rendering.
        }
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [auth]);
    // Recompute on load for all projects
    useEffect(() => {
        if (!auth?.currentUser?.uid || !db)
            return;
        const ref = doc(db, 'users', auth.currentUser.uid);
        getDoc(ref).then(async (doc) => {
            const projects = doc.data()?.projects || [];
            projects.forEach(p => dailyRecompute(p));
            await setDoc(ref, { projects });
        });
    }, [user]);
    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e) => {
            if (e.target && e.target.tagName === 'INPUT')
                return;
            if (e.key.toLowerCase() === 'i')
                location.href = '/inbox';
            if (e.key.toLowerCase() === 'w')
                location.href = '/wins';
            if (e.key.toLowerCase() === 'd')
                location.href = '/debug';
            if (e.key.toLowerCase() === 'h')
                location.href = '/';
            if (e.key.toLowerCase() === 't' && loc.pathname.startsWith('/project/')) {
                const input = document.querySelector('input[name="name"]');
                input?.focus();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [loc.pathname]);
    // High-contrast toggle persisted
    useEffect(() => {
        const hc = localStorage.getItem('hc') === '1';
        if (hc)
            document.documentElement.classList.add('hc');
    }, []);
    function toggleHC() {
        const el = document.documentElement;
        const on = el.classList.toggle('hc');
        localStorage.setItem('hc', on ? '1' : '0');
    }
    if (!user)
        return _jsx(Login, {});
    return (_jsxs("div", { className: "min-h-screen", children: [_jsxs("header", { className: "flex justify-between items-center p-4 bg-white shadow-md", children: [_jsx("div", { className: "text-lg font-semibold", children: "Ember" }), user && auth && (_jsx("button", { className: "btn", onClick: () => signOut(auth), children: "Sign Out" }))] }), _jsx("div", { className: "mx-auto max-w-6xl p-4", children: _jsxs("div", { className: "flex gap-6", children: [_jsx("aside", { className: "hidden md:block sidebar", children: _jsxs("div", { className: "card sticky top-4 space-y-2", children: [_jsx(Link, { className: "header-link block", to: "/", children: "Dashboard" }), _jsx(Link, { className: "header-link block", to: "/inbox", children: "Idea Inbox" }), _jsx(Link, { className: "header-link block", to: "/wins", children: "Dopamine Board" }), _jsx(Link, { className: "header-link block", to: "/debug", children: "Debug" }), _jsx("button", { className: "header-link w-full text-left", onClick: toggleHC, children: "Toggle High Contrast" }), _jsx("div", { className: "text-xs text-neutral-400", children: "Shortcuts: H, I, W, D, T" })] }) }), _jsxs("main", { className: "flex-1", children: [_jsx(Outlet, {}), _jsx(QuickAddFab, {})] })] }) })] }));
}
