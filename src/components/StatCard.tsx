import type { ReactNode } from 'react';

type StatCardProps = {
    title: string;
    value: ReactNode;
    extra?: ReactNode;
};

export default function StatCard({ title, value, extra }: StatCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow">
            <div className="text-sm text-slate-500">{title}</div>
            <div className="mt-2 text-2xl font-semibold">{value}</div>
            {extra ? (
                <div className="mt-2 text-xs text-slate-500">{extra}</div>
            ) : null}
        </div>
    );
}
