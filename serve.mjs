import { createServer } from 'http';
import { readFile, stat, watch } from 'fs/promises';
import { watch as fsWatch } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Anthropic from '@anthropic-ai/sdk';

// Load .env file if present
try {
  const envFile = await readFile(new URL('.env', import.meta.url), 'utf8');
  for (const line of envFile.split('\n')) {
    const [key, ...rest] = line.trim().split('=');
    if (key && rest.length && !key.startsWith('#')) {
      process.env[key] = rest.join('=').trim();
    }
  }
} catch { /* no .env file */ }

let anthropic = null;

// Load system prompt from txt file
let SYSTEM_PROMPT = '';
try {
  SYSTEM_PROMPT = await readFile(new URL('./chatbot information/txt prompt chatbot.txt', import.meta.url), 'utf8');
} catch {
  SYSTEM_PROMPT = 'És a Margarida, assistente da Differentt Lab. Responde em português de forma profissional e simpática sobre os serviços da agência.';
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const MAX_BODY_BYTES = 64 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestLog = new Map();

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

// SSE clients for live reload
let clients = [];

fsWatch(__dirname, { recursive: false }, (event, filename) => {
  if (filename && filename.endsWith('.html')) {
    clients.forEach(c => c.res.write('data: reload\n\n'));
    clients = clients.filter(c => !c.res.writableEnded);
  }
});

const LIVERELOAD_SCRIPT = `
<script>
(function(){
  const es = new EventSource('/__livereload');
  es.onmessage = () => location.reload();
})();
</script>`;

const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // Chat API endpoint
  if (req.url === '/api/chat' && req.method === 'POST') {
    const ip = req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter(time => now - time < RATE_LIMIT_WINDOW_MS);
    if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
      res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
      res.end(JSON.stringify({ reply: 'Demasiados pedidos. Tente novamente dentro de um minuto.' }));
      return;
    }
    recent.push(now);
    requestLog.set(ip, recent);
    let body = '';
    let bodyTooLarge = false;
    req.on('data', chunk => {
      body += chunk;
      if (body.length > MAX_BODY_BYTES) {
        bodyTooLarge = true;
        req.destroy();
      }
    });
    req.on('end', async () => {
      try {
        if (bodyTooLarge) throw new Error('Request body too large');
        if (!anthropic) anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const { messages } = JSON.parse(body);
        if (!Array.isArray(messages) || messages.length === 0 || messages.length > 10 ||
          messages.some(message => !message || !['user', 'assistant'].includes(message.role) || typeof message.content !== 'string' || message.content.length > 2_000)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ reply: 'Pedido inválido.' }));
          return;
        }
        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 150,
          system: SYSTEM_PROMPT + '\n\nIMPORTANTE: Mantém SEMPRE as respostas curtas — máximo 2-3 frases. Nunca uses listas longas. Vai direto ao ponto.',
          messages: messages.slice(-10), // keep last 10 turns
        });
        const reply = response.content[0]?.text || 'Desculpe, não consegui processar a sua mensagem.';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      } catch (e) {
        console.error('[chat error]', e?.message || e);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply: 'Erro interno. Por favor contacte-nos em differenttdesignlab@gmail.com' }));
      }
    });
    return;
  }

  if (req.url === '/__livereload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' });
    res.write(': connected\n\n');
    clients.push({ res });
    req.on('close', () => { clients = clients.filter(c => c.res !== res); });
    return;
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = join(__dirname, urlPath === '/' ? 'index.html' : urlPath);

  if (!filePath.startsWith(__dirname + '\\') && filePath !== __dirname) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  try {
    let stats = await stat(filePath).catch(() => null);
    // Clean URL support: try appending .html if file not found and has no extension
    if (!stats && !extname(filePath)) {
      filePath = filePath + '.html';
      stats = await stat(filePath).catch(() => null);
    }
    if (!stats) throw new Error('not found');
    if (stats.isDirectory()) filePath = join(filePath, 'index.html');
    const ext = extname(filePath).toLowerCase();
    const contentType = mime[ext] || 'application/octet-stream';
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    if (ext === '.html') {
      res.end(data.toString().replace('</body>', LIVERELOAD_SCRIPT + '</body>'));
    } else {
      res.end(data);
    }
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
