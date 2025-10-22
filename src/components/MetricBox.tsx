// src/components/MetricBox.tsx
import type { ReactNode } from 'react';

type Props = {
    label: string;
    value: ReactNode;
    hint?: ReactNode;
};

export default function MetricBox({ label, value, hint }: Props) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
            {hint ? <div className="mt-1 text-xs text-slate-400">{hint}</div> : null}
        </div>
    );
}
