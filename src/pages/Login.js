import { jsx as _jsx } from "react/jsx-runtime";
import { signInWithGoogle } from '../lib/firebase';
export default function Login() {
    return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("button", { onClick: signInWithGoogle, className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded", children: "Sign in with Google" }) }));
}
