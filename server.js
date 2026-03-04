const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const port = 3000;
const distPath = path.join(__dirname, 'dist');

const BACKEND_HOST = '127.0.0.1';
const BACKEND_PORT = 8089;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.map': 'application/json',
};

// Extensions that benefit from gzip compression
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.map']);

// Simple in-memory cache for static files (avoids repeated disk reads)
const fileCache = new Map();
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB limit
let currentCacheSize = 0;

function getCachedFile(filePath) {
    if (fileCache.has(filePath)) {
        return fileCache.get(filePath);
    }
    try {
        const content = fs.readFileSync(filePath);
        if (content.length < 2 * 1024 * 1024 && currentCacheSize + content.length < MAX_CACHE_SIZE) {
            fileCache.set(filePath, content);
            currentCacheSize += content.length;
        }
        return content;
    } catch {
        return null;
    }
}

// Pre-compress gzip responses
const gzipCache = new Map();

function getGzipped(filePath, content) {
    if (gzipCache.has(filePath)) {
        return gzipCache.get(filePath);
    }
    const compressed = zlib.gzipSync(content, { level: 6 });
    if (compressed.length < 1024 * 1024) {
        gzipCache.set(filePath, compressed);
    }
    return compressed;
}

const server = http.createServer((req, res) => {
    // Proxy /api requests to backend
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

    // Strip query string for file lookup
    const urlPath = req.url.split('?')[0];
    let filePath = path.join(distPath, urlPath === '/' ? 'index.html' : urlPath);

    // SPA fallback: if file doesn't exist, serve index.html
    let isSPA = false;
    try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            filePath = path.join(distPath, 'index.html');
            isSPA = true;
        }
    } catch {
        filePath = path.join(distPath, 'index.html');
        isSPA = true;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const content = getCachedFile(filePath);

    if (!content) {
        res.writeHead(404);
        res.end('Not Found');
        return;
    }

    // Build response headers
    const headers = {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
    };

    // Cache policy: hashed assets get long cache, HTML/SPA gets no-cache
    if (!isSPA && ext !== '.html' && (urlPath.match(/\.[a-f0-9]{8}\./))) {
        headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else if (ext === '.html' || isSPA) {
        headers['Cache-Control'] = 'no-cache, must-revalidate';
    } else {
        headers['Cache-Control'] = 'public, max-age=86400';
    }

    // Gzip compression for text-based files
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (COMPRESSIBLE.has(ext) && acceptEncoding.includes('gzip') && content.length > 1024) {
        const gzipped = getGzipped(filePath, content);
        headers['Content-Encoding'] = 'gzip';
        headers['Content-Length'] = gzipped.length;
        headers['Vary'] = 'Accept-Encoding';
        res.writeHead(200, headers);
        res.end(gzipped);
    } else {
        headers['Content-Length'] = content.length;
        res.writeHead(200, headers);
        res.end(content);
    }
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
});
