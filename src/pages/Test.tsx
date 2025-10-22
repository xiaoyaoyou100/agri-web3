import { useState } from 'react'
import MetricBox from '../components/MetricBox'
import { sendTelemetry } from '../api/emqx'
import type { Telemetry } from '../types'

function rand(min: number, max: number) {
    return +(Math.random() * (max - min) + min).toFixed(1)
}

function genOne(): Telemetry {
    return {
        temperature: rand(10, 35),
        humidity: rand(20, 90),
        pressure: +(rand(95, 106).toFixed(1)), // kPa
        light: Math.round(rand(200, 80000)),
        windSpeed: rand(0, 15),
        windLevel: Math.round(rand(0, 12)),
        rain: +(rand(0, 50).toFixed(1)), // mm
        soilN: Math.round(rand(0, 500)),
        soilP: Math.round(rand(0, 500)),
        soilK: Math.round(rand(0, 500)),
        source: 'software_test',
    }
}

export default function Test() {
    const [t, setT] = useState<Telemetry | null>(null)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState<string | null>(null)

    const handleOnce = async () => {
        const data = genOne()
        setLoading(true)
        setMsg(null)
        try {
            await sendTelemetry(data)
            setT(data)
            setMsg('已发送到 /api/emqx/webhook 并写入事件表')
        } catch (e) {
            setMsg('发送失败，请检查代理与后端连通')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">软件测试</h1>
                <button
                    onClick={handleOnce}
                    disabled={loading}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                    {loading ? '发送中…' : '随机生成并上报一次'}
                </button>
            </div>

            {msg ? <div className="mb-4 text-sm text-emerald-700">{msg}</div> : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <MetricBox label="温度" value={t ? `${t.temperature} °C` : undefined} />
                <MetricBox label="湿度" value={t ? `${t.humidity} %RH` : undefined} />
                <MetricBox label="大气压强" value={t ? `${t.pressure} kPa` : undefined} />
                <MetricBox label="光照强度" value={t ? `${t.light} lx` : undefined} />
                <MetricBox label="风速" value={t ? `${t.windSpeed} m/s` : undefined} />
                <MetricBox label="风级" value={t ? `${t.windLevel} 级` : undefined} />
                <MetricBox label="雨量(当日)" value={t ? `${t.rain} mm` : undefined} />
                <MetricBox label="土壤氮(N)" value={t ? `${t.soilN} mg/kg` : undefined} />
                <MetricBox label="土壤磷(P)" value={t ? `${t.soilP} mg/kg` : undefined} />
                <MetricBox label="土壤钾(K)" value={t ? `${t.soilK} mg/kg` : undefined} />
            </div>
        </div>
    )
}
