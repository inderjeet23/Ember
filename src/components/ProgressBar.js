import { jsx as _jsx } from "react/jsx-runtime";
export default function ProgressBar({ value }) {
    return (_jsx("div", { className: "h-2 w-full bg-neutral-800 rounded-md", children: _jsx("div", { className: "h-2 rounded-md bg-green-500", style: { width: `${value}%` } }) }));
}
