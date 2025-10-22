/* 基础分页结构（保留你原有的，如有重复以此为准） */
export interface Page<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

/* 事件（兼容你 /api/emqx/events 返回的字段） */
export interface EmqxWebhookEvent {
    id: number;
    event: string;
    name: string;
    ruleId: string;
    timestampMs: number;
    message: string;      // 我们会把 telemetry JSON 放在这里
    createdAt: string;
}

/* 气象站一次遥测数据（全部必填，单位写在注释） */
export interface Telemetry {
    /* 温湿压：温度 °C, 湿度 %RH, 气压 kPa */
    temperature: number;  // 25.6 => °C
    humidity: number;     // 55.1 => %RH
    pressure: number;     // 101.3 => kPa

    /* 光照、风：照度 lux，风速 m/s，风级（整数） */
    light: number;        // lux
    windSpeed: number;    // m/s
    windLevel: number;    // 级

    /* 雨量（累计，前端直接显示 mm；你的 F407 里是 0.1mm 精度，这里已换算） */
    rain: number;         // mm

    /* 土壤三要素：mg/kg */
    soilN: number;        // N
    soilP: number;        // P
    soilK: number;        // K

    /* 数据来源（software_test / device），仅方便展示 */
    source: 'software_test' | 'device';
}
