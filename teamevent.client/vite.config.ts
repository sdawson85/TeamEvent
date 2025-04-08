import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder =
    env.APPDATA !== undefined && env.APPDATA !== ''
        ? `${env.APPDATA}/ASP.NET/https`
        : `${env.HOME}/.aspnet/https`;

const certificateName = "teamevent.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}

const target = env.NODE_ENV === 'production' || !env.ASPNETCORE_HTTPS_PORT
    ? 'https://te-webapp-cca.azurewebsites.net'
    : env.ASPNETCORE_HTTPS_PORT 
        ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
        : env.ASPNETCORE_URLS 
            ? env.ASPNETCORE_URLS.split(';')[0] 
            : 'https://localhost:7019';
const tenantId = "tenant1";
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '^/TeamEvent/Index': {
                target: target,
                secure: false,
                changeOrigin: true,
                headers: {
                    'X-Tenant-ID': tenantId, // Directly add custom header here
                },
            },
            '^/TeamEvent/AddEvent': {
                target: target,
                secure: false,
                changeOrigin: true,
                headers: {
                    'X-Tenant-ID': tenantId, // Directly add custom header here
                },
            },
        },
        port: parseInt(env.DEV_SERVER_PORT || '63698'),
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
