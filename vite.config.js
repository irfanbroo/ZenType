import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
    clearScreen: false,
    server: {
        port: 5173,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                protocol: 'ws',
                host,
                port: 1421,
            }
            : undefined,
        watch: {
            ignored: ['**/src-tauri/**'],
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        target: 'es2021', // Tauri supports modern JS
    },
});
