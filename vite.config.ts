// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // 后端 Nginx/网关暴露的 API 前缀
            '/api': {
                target: 'https://8.153.173.131', // 例如 https://8.153.173.131
                changeOrigin: true,
                secure: false, // 自签/无 CA 证书时需要；正式证书可去掉
            },
            // 如果登录时用 /actuator/health 做连通性校验，也一并代理
            '/actuator': {
                target: 'https://8.153.173.131',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
