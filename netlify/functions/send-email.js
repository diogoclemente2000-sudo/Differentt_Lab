// Netlify Function — recebe as submissões dos formulários e envia por email via Resend.
// A API key vem SEMPRE de uma variável de ambiente no Netlify (RESEND_API_KEY),
// nunca do código. Config opcional: MAIL_FROM, MAIL_TO.
//
// Endpoint em produção:  /.netlify/functions/send-email
// Espera JSON no body, ex.: { "formType":"contacto", "firstName":"...", "email":"...", ... }

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function studioHtml(rows, formLabel) {
  const trs = rows.filter(r => r.v).map(r => `
    <tr>
      <td style="padding:10px 0;vertical-align:top;width:150px;color:#6b6b6b;font-size:13px;">${esc(r.k)}</td>
      <td style="padding:10px 0;vertical-align:top;color:#111;font-size:14px;">${esc(r.v)}</td>
    </tr>`).join('');
  return `<!doctype html><html><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <div style="background:#0d0d0d;border-radius:16px 16px 0 0;padding:22px 28px;">
        <span style="color:#9e7bb6;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${esc(formLabel)}</span>
        <div style="color:#fff;font-size:20px;font-weight:700;margin-top:6px;">Nova submissão no site</div>
      </div>
      <div style="background:#fff;border-radius:0 0 16px 16px;padding:8px 28px 24px;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
        <table style="width:100%;border-collapse:collapse;">${trs}</table>
      </div>
      <p style="color:#9a9a9a;font-size:12px;text-align:center;margin-top:18px;">Differentt Lab · differenttlab.com</p>
    </div>
  </body></html>`;
}

function replyHtml(nome) {
  const ola = nome ? `Olá ${esc(nome)},` : 'Olá,';
  return `<!doctype html><html><body style="margin:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <div style="background:#0d0d0d;border-radius:16px;padding:34px 30px;text-align:center;">
        <div style="color:#9e7bb6;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Differentt Lab</div>
        <h1 style="color:#fff;font-size:24px;font-weight:700;margin:14px 0 0;">Recebemos o teu pedido.</h1>
      </div>
      <div style="background:#fff;border-radius:16px;padding:28px 30px;margin-top:14px;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
        <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 14px;">${ola}</p>
        <p style="color:#333;font-size:15px;line-height:1.7;margin:0 0 14px;">Obrigado pelo contacto. A tua mensagem chegou à nossa equipa e respondemos normalmente em <strong>24–48&nbsp;horas úteis</strong>.</p>
        <p style="color:#333;font-size:15px;line-height:1.7;margin:0;">Entretanto, se for urgente, fala connosco no WhatsApp: <a href="https://wa.me/351926283061" style="color:#9e7bb6;text-decoration:none;">+351 926 283 061</a>.</p>
      </div>
      <p style="color:#9a9a9a;font-size:12px;text-align:center;margin-top:18px;">Differentt Lab · Odivelas, Lisboa · differenttlab.com</p>
    </div>
  </body></html>`;
}

exports.handler = async (event) => {
  // Sonda de diagnóstico (GET) — só reporta se a chave existe e o seu tamanho, NUNCA o valor. Temporária.
  if (event.httpMethod === 'GET') {
    const k = process.env.RESEND_API_KEY || '';
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ keyPresent: !!k, keyLen: k.length, mailFrom: process.env.MAIL_FROM || '(default)', mailTo: process.env.MAIL_TO || '(default)' }) };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Método não permitido' }) };
  }
  const KEY = process.env.RESEND_API_KEY;
  if (!KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'RESEND_API_KEY em falta no Netlify' }) };
  }

  let d;
  try { d = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, body: JSON.stringify({ error: 'JSON inválido' }) }; }

  const FROM = process.env.MAIL_FROM || 'Differentt Lab <contacto@differenttlab.com>';
  const TO = process.env.MAIL_TO || 'differenttdesignlab@gmail.com';

  const type = (d.formType || 'contacto').toLowerCase();
  const nome = (d.firstName || d.name || '').toString().trim();
  const nomeCompleto = [d.firstName, d.lastName].filter(Boolean).join(' ').trim() || nome;
  const email = (d.email || '').toString().trim();

  let formLabel, subject, rows;
  if (type === 'newsletter') {
    formLabel = 'Newsletter';
    subject = `Nova subscrição — ${email || 'newsletter'}`;
    rows = [{ k: 'Email', v: email }];
  } else if (type === 'ideia') {
    formLabel = 'Pedido de ideia';
    subject = `Novo pedido — ${nomeCompleto || email || 'sem nome'}`;
    rows = [
      { k: 'Nome', v: nomeCompleto },
      { k: 'Email', v: email },
      { k: 'Mensagem', v: d.message },
    ];
  } else {
    formLabel = 'Pedido de contacto';
    subject = `Novo contacto — ${nomeCompleto || email || 'sem nome'}`;
    const servicos = Array.isArray(d.services) ? d.services.join(', ') : d.services;
    rows = [
      { k: 'Nome', v: nomeCompleto },
      { k: 'Email', v: email },
      { k: 'Website', v: d.website },
      { k: 'Serviços', v: servicos },
      { k: 'Mensagem', v: d.message },
    ];
  }

  const send = (payload) => fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // 1) Notificação para o estúdio (com reply-to para responder direto ao cliente)
  const notify = await send({
    from: FROM,
    to: [TO],
    reply_to: email || undefined,
    subject,
    html: studioHtml(rows, formLabel),
  });
  if (!notify.ok) {
    const detail = await notify.text().catch(() => '');
    return { statusCode: 502, body: JSON.stringify({ error: 'Falha ao enviar', detail }) };
  }

  // 2) Auto-resposta ao cliente (só quando há email e não é newsletter)
  if (email && type !== 'newsletter') {
    try {
      await send({ from: FROM, to: [email], subject: 'Recebemos o teu pedido — Differentt Lab', html: replyHtml(nome) });
    } catch (_) { /* auto-resposta é best-effort; não falha a submissão */ }
  }

  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
};
