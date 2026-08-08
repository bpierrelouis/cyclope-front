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
            // Proxy dev : sert la vidéo de test w3schools en same-origin pour éviter le non secure pour la capture d'écran.
            '/dev-media': {
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/dev-media/, ''),
                target: 'https://www.w3schools.com',
            },
        },
    },
});
