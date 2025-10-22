// src/api/http.ts
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

const http = axios.create({
    baseURL: '/api',
    timeout: 15000,
});

/**
 * 统一在请求上附加 Basic 授权头：
 * 从 sessionStorage 读取 AUTH（值为 btoa('admin:abc123456')）
 * 关键点：用 AxiosHeaders.from(...) 规范化，避免 TS2322 类型不兼容
 */
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('AUTH');
    if (token) {
        const headers = AxiosHeaders.from(config.headers); // 规范化为 AxiosHeaders
        headers.set('Authorization', `Basic ${token}`);
        config.headers = headers; // 类型安全
    }
    return config;
});

export default http;
