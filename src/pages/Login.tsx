// src/pages/Login.tsx
import type { FormEvent, ChangeEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 浏览器安全的 base64：
 * 先尝试 btoa；若因 UTF-8 报错，使用 TextEncoder 把字符串转字节，再 btoa 二进制串。
 */
function toBase64(s: string): string {
    try {
        return btoa(s);
    } catch {
        const utf8 = new TextEncoder().encode(s);
        let bin = '';
        utf8.forEach((b) => (bin += String.fromCharCode(b)));
        return btoa(bin);
    }
}

export default function Login() {
    const nav = useNavigate();
    const [user, setUser] = useState('admin');
    const [pass, setPass] = useState('abc123456');
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 本地校验固定账号密码
        if (user === 'admin' && pass === 'abc123456') {
            const token = toBase64(`${user}:${pass}`);
            sessionStorage.setItem('AUTH', token); // http.ts 会自动带上
            setErr(null);
            nav('/dashboard', { replace: true });
        } else {
            setErr('用户名或密码错误');
        }
    };

    return (
        <div className="mx-auto mt-24 max-w-md rounded-2xl border border-slate-200 bg-white/80 p-6 shadow">
            <h1 className="mb-6 text-center text-3xl font-semibold">登录</h1>
            <form onSubmit={onSubmit} className="space-y-3">
                <div>
                    <label className="mb-1 block text-sm text-slate-600">用户名</label>
                    <input
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring"
                        value={user}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-slate-600">密码</label>
                    <input
                        type="password"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring"
                        value={pass}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPass(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                {err && <p className="text-sm text-red-600">{err}</p>}

                <button
                    type="submit"
                    className="mt-4 w-full rounded-lg bg-emerald-600 py-2 text-white hover:bg-emerald-700"
                >
                    登录
                </button>
            </form>
        </div>
    );
}
