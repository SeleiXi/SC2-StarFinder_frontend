const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
const distPath = path.join(__dirname, 'dist');

const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = 8089;

const server = http.createServer((req, res) => {
    // 转发以 /api 开头的请求到后端服务
    if (req.url.startsWith('/api')) {
        const proxyOptions = {
            hostname: BACKEND_HOST,
            port: BACKEND_PORT,
            path: req.url,
            method: req.method,
            headers: {
                ...req.headers,
                host: `${BACKEND_HOST}:${BACKEND_PORT}`
            }
        };

        const proxyReq = http.request(proxyOptions, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        proxyReq.on('error', (err) => {
            console.error(`Proxy error: ${err.message}`);
            res.writeHead(502);
            res.end(`Bad Gateway: ${err.message}`);
        });

        req.pipe(proxyReq, { end: true });
        return;
    }

    let filePath = path.join(distPath, req.url === '/' ? 'index.html' : req.url);

    // SPA support: if file doesn't exist, serve index.html
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distPath, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    }[ext] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(500);
            res.end('Error: ' + error.code);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
});
