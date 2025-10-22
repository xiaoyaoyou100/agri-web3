// src/api/emqx.ts
import http from './http';

export type EventsQuery = {
    page?: number;
    size?: number;
    sort?: string;
};

export type Page<T> = {
    content: T[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
};

export type EmqxWebhookEvent = {
    id: number;
    event: string;
    name: string;
    ruleId: string;
    timestampMs: number;
    message: string;
    createdAt: string;
    // 服务器若透传 details，这里接一下
    details?: unknown;
};

export type SensorSnapshot = {
    temperature: number; // °C
    humidity: number; // %RH
    pressure: number; // kPa
    lux: number; // lx
    windSpeed: number; // m/s
    windLevel: number; // 级
    rain: number; // mm
    soilN: number; // mg/kg
    soilP: number; // mg/kg
    soilK: number; // mg/kg
};

/** 拉取事件分页 */
export async function getEvents(q: EventsQuery = {}): Promise<Page<EmqxWebhookEvent>> {
    const { page = 0, size = 10, sort = 'id,desc' } = q;
    const res = await http.get('/emqx/events', { params: { page, size, sort } });
    return res.data as Page<EmqxWebhookEvent>;
}

/** 发送一条“测试 webhook”——把各项气象/土壤数据塞到 details 里，后端 204 即成功 */
export async function sendTestWebhook(data: SensorSnapshot, name = 'station_01'): Promise<void> {
    const payload = {
        event: 'alarm.activated',
        name,
        message: 'demo',
        timestamp: Date.now(),
        node: 'emqx@127.0.0.1',
        metadata: { rule_id: 'agri_webhook_WH_D' },
        details: {
            temperature: data.temperature,
            humidity: data.humidity,
            pressure: data.pressure,
            lux: data.lux,
            windSpeed: data.windSpeed,
            windLevel: data.windLevel,
            rain: data.rain,
            soilN: data.soilN,
            soilP: data.soilP,
            soilK: data.soilK,
        },
    };
    await http.post('/emqx/webhook', payload);
}
