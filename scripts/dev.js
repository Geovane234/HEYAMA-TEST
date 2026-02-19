const { spawn, execSync } = require('child_process');
const path = require('path');
const os = require('os');

const root = path.resolve(__dirname, '..');
const mobilePath = path.resolve(root, 'apps', 'mobile');

// Detect LAN IP
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }

    // Prioritize 192.168 or 10.x which are typical LAN ranges
    const lanIp = ips.find(ip => ip.startsWith('192.168.') || ip.startsWith('10.'));
    return lanIp || ips[0] || '127.0.0.1';
}

const localIp = getLocalIp();

// Kill any process using these ports (prevents EADDRINUSE on restart)
function cleanPorts() {
    [3000, 3001, 8081].forEach((port) => {
        try {
            execSync(
                `powershell -Command "Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"`,
                { stdio: 'ignore' }
            );
        } catch (_) { }
    });
}


cleanPorts();

console.log(`Starting Heyama dev servers...`);
console.log(`Detected LAN IP for Mobile: ${localIp}\n`);

// turbo dev (api + web)
const turbo = spawn('npx', ['turbo', 'dev', '--filter=!mobile'], {
    stdio: 'inherit',
    shell: true,
    cwd: root,
});

console.log(`Forcing Expo to use LAN IP: ${localIp}\n`);
const expo = spawn('npx', ['expo', 'start', '--lan'], {
    stdio: 'inherit',
    shell: true,
    cwd: mobilePath,
    env: {
        ...process.env,
        EXPO_OFFLINE: '1',
        REACT_NATIVE_PACKAGER_HOSTNAME: localIp
    }
});

function cleanup() {
    turbo.kill();
    expo.kill();
    process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

turbo.on('close', (code) => {
    if (code) console.error(`[turbo] exited with code ${code}`);
});

expo.on('close', (code) => {
    if (code) console.error(`[expo] exited with code ${code}`);
    turbo.kill();
    process.exit(code ?? 0);
});
