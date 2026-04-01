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
  // Chat API endpoint
  if (req.url === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        if (!anthropic) anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const { messages } = JSON.parse(body);
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

  try {
    const stats = await stat(filePath);
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
