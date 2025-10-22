import { Link, useLocation, useNavigate } from 'react-router-dom'
import clsx from 'clsx'

export default function Header() {
    const nav = useNavigate()
    const loc = useLocation()
    const authed = !!sessionStorage.getItem('AUTH')

    function logout() {
        sessionStorage.removeItem('AUTH')
        nav('/login', { replace: true })
    }

    const items = [
        { to: '/dashboard', text: '仪表盘' },
        { to: '/events', text: '事件' },
    ]

    return (
        <header className="bg-white/80 backdrop-blur border-b sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 rounded-xl bg-agri-600 text-white items-center justify-center font-bold">A</span>
                    <span className="font-semibold">Agri Web3</span>
                </Link>

                {authed && (
                    <nav className="flex items-center gap-2">
                        {items.map(it => (
                            <Link
                                key={it.to}
                                to={it.to}
                                className={clsx(
                                    "px-3 py-1.5 rounded-lg text-sm",
                                    loc.pathname.startsWith(it.to) ? "bg-agri-100 text-agri-800" : "hover:bg-gray-100"
                                )}
                            >
                                {it.text}
                            </Link>
                        ))}

                        <button className="btn btn-ghost ml-2" onClick={logout}>退出登录</button>
                    </nav>
                )}
            </div>
        </header>
    )
}
