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
                changeOrigin: true,
                configure: (proxy) => {
                    proxy.on('proxyRes', (proxyRes) => {
                        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
                    });
                },
                secure: false,
                target: 'http://localhost:8001/',
            },
            '/dev-media/image': {
                changeOrigin: true,
                followRedirects: true,
                rewrite: () => '/300/200',
                target: 'https://picsum.photos',
            },
            '/dev-media/video': {
                changeOrigin: true,
                followRedirects: true,
                rewrite: () => '/video-files/4507858/4507858-hd_1920_1080_30fps.mp4',
                target: 'https://videos.pexels.com',
            },
        },
    },
});
