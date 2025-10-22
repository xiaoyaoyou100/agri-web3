// src/pages/Realtime.tsx
import { useEffect, useState } from 'react';
import MetricBox from '../components/MetricBox';
import { getEvents, type SensorSnapshot, type EmqxWebhookEvent } from '../api/emqx';

const empty: SensorSnapshot = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    lux: 0,
    windSpeed: 0,
    windLevel: 0,
    rain: 0,
    soilN: 0,
    soilP: 0,
    soilK: 0,
};

export default function Realtime() {
    const [data, setData] = useState<SensorSnapshot>(empty);

    useEffect(() => {
        const tryLoadLocal = () => {
            const raw = localStorage.getItem('LAST_SENSOR');
            if (raw) {
                try {
                    setData(JSON.parse(raw) as SensorSnapshot);
                } catch {}
            }
        };

        const pull = async () => {
            try {
                const page = await getEvents({ size: 1, sort: 'id,desc' });
                const ev: EmqxWebhookEvent | undefined = page.content[0];
                if (ev && ev.details && typeof ev.details === 'object') {
                    const d = ev.details as Partial<SensorSnapshot>;
                    // 仅在存在某一项时更新（避免覆盖为 0）
                    setData((prev) => ({ ...prev, ...d }));
                } else if (!ev) {
                    tryLoadLocal();
                }
            } catch {
                tryLoadLocal();
            }
        };

        pull();
        const t = setInterval(pull, 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold">气象站实时数据</h2>

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
        </div>
    );
}
