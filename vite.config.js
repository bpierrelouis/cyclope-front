import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        svgr(),
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000/',
                changeOrigin: true,
                secure: false,
                configure: (proxy) => {
                    proxy.on('proxyRes', (proxyRes) => {
                        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                    });
                },
            },
        },
    },
});
