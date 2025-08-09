import { jsx as _jsx } from "react/jsx-runtime";
export default function StateBadge({ state }) {
    const cls = state === 'fresh' ? 'state-fresh' :
        state === 'warm' ? 'state-warm' :
            state === 'cooling' ? 'state-cooling' : 'state-cold';
    const label = state[0].toUpperCase() + state.slice(1);
    return _jsx("span", { className: `badge ${cls}`, children: label });
}
