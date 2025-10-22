// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Realtime from './pages/Realtime';

function Protected({ children }: { children: React.ReactNode }) {
    const auth = sessionStorage.getItem('AUTH');
    if (!auth) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

export default function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        <Protected>
                            <div className="mx-auto max-w-7xl flex gap-6 p-4">
                                <Sidebar />
                                <div className="flex-1">
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/test" replace />} />
                                        <Route path="/test" element={<Dashboard />} />
                                        <Route path="/realtime" element={<Realtime />} />
                                        <Route path="*" element={<Navigate to="/test" replace />} />
                                    </Routes>
                                </div>
                            </div>
                        </Protected>
                    }
                />
            </Routes>
        </div>
    );
}
