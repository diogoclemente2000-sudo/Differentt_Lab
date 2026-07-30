// Netlify Function — chatbot "Margarida" via OpenRouter.
// A API key vem SEMPRE de uma variável de ambiente no Netlify (OPENROUTER_API_KEY),
// nunca do código. Config opcional: OPENROUTER_MODEL.
//
// Endpoint em produção:  /.netlify/functions/chat  (o netlify.toml faz redirect de /api/chat)
// Espera JSON no body: { "messages": [ { "role": "user"|"assistant", "content": "..." } ] }

const fs = require('fs');
const path = require('path');

const FALLBACK_PROMPT = 'És a Margarida, assistente da Differentt Lab, agência digital em Odivelas, Lisboa. Responde em português de Portugal, de forma profissional e simpática, sobre os serviços da agência (branding, websites, design gráfico, gestão de redes sociais). Mantém as respostas curtas (2-3 frases).';

// Carrega o prompt do ficheiro (incluído via netlify.toml). Fallback: prompt curto acima.
let SYSTEM_PROMPT = FALLBACK_PROMPT;
for (const p of [
  path.join(process.cwd(), 'chatbot information', 'txt prompt chatbot.txt'),
  path.join(__dirname, 'txt prompt chatbot.txt'),
]) {
  try { SYSTEM_PROMPT = fs.readFileSync(p, 'utf8'); break; } catch (_) { /* tenta o próximo */ }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ reply: 'Método não permitido' }) };
  }
  const KEY = process.env.OPENROUTER_API_KEY;
  if (!KEY) {
    return { statusCode: 500, body: JSON.stringify({ reply: 'OPENROUTER_API_KEY em falta no Netlify.' }) };
  }
  const MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash-lite';

  let messages;
  try { messages = (JSON.parse(event.body || '{}').messages) || []; }
  catch { return { statusCode: 400, body: JSON.stringify({ reply: 'JSON inválido' }) }; }

  // Validação básica
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12 ||
    messages.some(m => !m || !['user', 'assistant'].includes(m.role) || typeof m.content !== 'string' || m.content.length > 2000)) {
    return { statusCode: 400, body: JSON.stringify({ reply: 'Pedido inválido.' }) };
  }

  try {
    const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://differenttlab.com',
        'X-Title': 'Differentt Lab',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + '\n\nIMPORTANTE: Mantém SEMPRE as respostas curtas — máximo 2-3 frases. Nunca uses listas longas. Vai direto ao ponto.' },
          ...messages.slice(-10),
        ],
      }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('[chat] OpenRouter', r.status, detail);
      return { statusCode: 502, body: JSON.stringify({ reply: 'Desculpe, o serviço de chat está indisponível. Contacte-nos em differenttdesignlab@gmail.com' }) };
    }
    const data = await r.json();
    const reply = data.choices?.[0]?.message?.content || 'Desculpe, não consegui processar a sua mensagem.';
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reply }) };
  } catch (e) {
    console.error('[chat] erro', e?.message || e);
    return { statusCode: 500, body: JSON.stringify({ reply: 'Erro interno. Contacte-nos em differenttdesignlab@gmail.com' }) };
  }
};
