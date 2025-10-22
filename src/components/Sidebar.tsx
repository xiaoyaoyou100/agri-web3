// src/components/Sidebar.tsx
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    const link =
        'block px-4 py-2 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition';
    const active = 'bg-emerald-600 text-white hover:bg-emerald-600';

    return (
        <aside className="w-56 shrink-0 p-4">
            <div className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">A</span>
                Agri Web3
            </div>

            <nav className="space-y-2">
                <NavLink
                    to="/test"
                    className={({ isActive }) => `${link} ${isActive ? active : 'text-slate-700'}`}
                >
                    软件测试
                </NavLink>
                <NavLink
                    to="/realtime"
                    className={({ isActive }) => `${link} ${isActive ? active : 'text-slate-700'}`}
                >
                    气象站实时数据
                </NavLink>
            </nav>
        </aside>
    );
}
