// src/pages/Dashboard.tsx
import { useState } from 'react';
import MetricBox from '../components/MetricBox';
import { sendTestWebhook, type SensorSnapshot } from '../api/emqx';

const def: SensorSnapshot = {
    temperature: 25.6,
    humidity: 60.2,
    pressure: 101.3,
    lux: 560,
    windSpeed: 2.4,
    windLevel: 2,
    rain: 0.0,
    soilN: 25,
    soilP: 12,
    soilK: 46,
};

export default function Dashboard() {
    const [data, setData] = useState<SensorSnapshot>(def);
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);

    const set = <K extends keyof SensorSnapshot>(k: K, v: number) =>
        setData((d) => ({ ...d, [k]: v }));

    const rand = () => {
        setData({
            temperature: +(20 + Math.random() * 10).toFixed(1),
            humidity: +(40 + Math.random() * 40).toFixed(1),
            pressure: +(98 + Math.random() * 6).toFixed(1),
            lux: Math.round(200 + Math.random() * 1200),
            windSpeed: +(Math.random() * 8).toFixed(1),
            windLevel: Math.max(0, Math.min(12, Math.round(Math.random() * 5))),
            rain: +(Math.random() * 3).toFixed(1),
            soilN: Math.round(10 + Math.random() * 40),
            soilP: Math.round(5 + Math.random() * 25),
            soilK: Math.round(15 + Math.random() * 60),
        });
    };

    const send = async () => {
        setBusy(true);
        setMsg(null);
        try {
            await sendTestWebhook(data, 'station_demo');
            setMsg('已发送 Webhook（返回 204 即成功）');
            // 为实时页兜底：把最后一次数据存本地，硬件连上 MQTT 后可无视
            localStorage.setItem('LAST_SENSOR', JSON.stringify(data));
        } catch (e) {
            setMsg('发送失败，请检查鉴权/反向代理与后端端口');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">软件测试（模拟上报 MQTT → Webhook）</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                <MetricBox label="温度" value={`${data.temperature} ℃`} />
                <MetricBox label="湿度" value={`${data.humidity} %RH`} />
                <MetricBox label="大气压强" value={`${data.pressure} kPa`} />
                <MetricBox label="光照强度" value={`${data.lux} lx`} />
                <MetricBox label="风速" value={`${data.windSpeed} m/s`} />
                <MetricBox label="风级" value={data.windLevel} />
                <MetricBox label="雨量" value={`${data.rain} mm`} />
                <MetricBox label="土壤氮 N" value={`${data.soilN} mg/kg`} />
                <MetricBox label="土壤磷 P" value={`${data.soilP} mg/kg`} />
                <MetricBox label="土壤钾 K" value={`${data.soilK} mg/kg`} />
            </div>

            {/* 输入区 */}
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {(
                        [
                            ['温度(℃)', 'temperature'],
                            ['湿度(%RH)', 'humidity'],
                            ['压强(kPa)', 'pressure'],
                            ['光照(lx)', 'lux'],
                            ['风速(m/s)', 'windSpeed'],
                            ['风级', 'windLevel'],
                            ['雨量(mm)', 'rain'],
                            ['土壤N(mg/kg)', 'soilN'],
                            ['土壤P(mg/kg)', 'soilP'],
                            ['土壤K(mg/kg)', 'soilK'],
                        ] as const
                    ).map(([label, key]) => (
                        <label key={key} className="block">
                            <div className="mb-1 text-sm text-slate-600">{label}</div>
                            <input
                                type="number"
                                step="any"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring"
                                value={data[key]}
                                onChange={(e) => set(key, Number(e.target.value))}
                            />
                        </label>
                    ))}
                </div>

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={rand}
                        type="button"
                        className="h-10 px-4 rounded-lg bg-slate-100 hover:bg-slate-200"
                    >
                        随机填充
                    </button>
                    <button
                        onClick={send}
                        type="button"
                        disabled={busy}
                        className="h-10 px-4 rounded-lg bg-emerald-600 text-white disabled:opacity-60"
                    >
                        {busy ? '发送中…' : '发送测试 Webhook'}
                    </button>
                </div>

                {msg && <p className="mt-3 text-sm text-slate-600">{msg}</p>}
            </div>
        </div>
    );
}
