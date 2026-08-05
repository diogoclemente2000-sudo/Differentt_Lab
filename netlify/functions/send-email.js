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
  // Logótipo servido como PNG (rasterizado do SVG via Cloudinary — os clientes de email bloqueiam SVG).
  const LOGO = 'https://res.cloudinary.com/dgun4lhkm/image/upload/f_png,w_480/Website_photos/photos_home_page/full%20logo.svg';
  return `<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>Recebemos o teu pedido — Differentt Lab</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f4f4f5;">Recebemos o teu pedido e respondemos em 24 a 48 horas úteis. Enquanto isso, conhece o nosso trabalho.</div>
  <div style="max-width:600px;margin:0 auto;padding:28px 16px 36px;">

    <!-- CABEÇALHO -->
    <div style="background:#0d0d0d;border-radius:18px;padding:40px 30px 34px;text-align:center;">
      <img src="${LOGO}" alt="Differentt Lab" width="172" style="width:172px;max-width:62%;height:auto;display:inline-block;border:0;outline:none;text-decoration:none;">
      <div style="color:#9e7bb6;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-top:24px;">Pedido recebido</div>
      <h1 style="color:#ffffff;font-size:25px;font-weight:700;line-height:1.25;margin:10px 0 0;">Já estamos a tratar do teu pedido.</h1>
    </div>

    <!-- CORPO -->
    <div style="background:#ffffff;border-radius:18px;padding:32px 32px 28px;margin-top:14px;box-shadow:0 8px 30px rgba(0,0,0,0.07);">
      <p style="color:#1a1a1a;font-size:15px;line-height:1.75;margin:0 0 16px;">${ola}</p>
      <p style="color:#3a3a3a;font-size:15px;line-height:1.75;margin:0 0 16px;">Obrigado por chegares até nós. A tua mensagem foi entregue à nossa equipa e vamos analisá-la com atenção. Respondemos normalmente em <strong style="color:#1a1a1a;">24 a 48 horas úteis</strong>, com os próximos passos para o teu projeto — as nossas questões, ideias e uma proposta de caminho.</p>
      <p style="color:#3a3a3a;font-size:15px;line-height:1.75;margin:0 0 24px;">Somos um estúdio de design, branding, websites e conteúdo sediado em Odivelas, Lisboa. Ajudamos marcas a destacarem-se com trabalho feito à medida — e a tua pode ser a próxima.</p>

      <!-- BOTÃO WHATSAPP -->
      <div style="margin:0 0 26px;">
        <a href="https://wa.me/351926283061" style="display:inline-block;background:#0d0d0d;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:100px;">É urgente? Fala connosco no WhatsApp</a>
      </div>

      <!-- ENQUANTO ESPERAS -->
      <div style="border-top:1px solid #ededed;padding-top:22px;">
        <p style="color:#8a8a8a;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin:0 0 10px;">Enquanto esperas</p>
        <p style="color:#3a3a3a;font-size:15px;line-height:1.75;margin:0;">Vê os nossos projetos no <a href="https://differenttlab.com/portfolio" style="color:#9e7bb6;font-weight:700;text-decoration:none;">portefólio</a> ou acompanha o dia a dia do estúdio no <a href="https://www.instagram.com/differentt_lab/" style="color:#9e7bb6;font-weight:700;text-decoration:none;">Instagram</a>.</p>
      </div>

      <p style="color:#1a1a1a;font-size:15px;line-height:1.75;margin:26px 0 0;">Até já,<br><strong>Equipa Differentt Lab</strong></p>
    </div>

    <!-- RODAPÉ -->
    <div style="padding:26px 24px 4px;text-align:center;">
      <div style="color:#111111;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;">Differentt Lab</div>
      <p style="color:#9a9a9a;font-size:12px;line-height:1.7;margin:0 0 8px;">Av. Miguel Torga 20 A &middot; 2675-664 Odivelas &middot; Lisboa &middot; Portugal</p>
      <p style="color:#9a9a9a;font-size:12px;line-height:1.7;margin:0 0 10px;">
        <a href="https://differenttlab.com" style="color:#9e7bb6;text-decoration:none;">differenttlab.com</a> &nbsp;&middot;&nbsp;
        <a href="mailto:differenttdesignlab@gmail.com" style="color:#9e7bb6;text-decoration:none;">Email</a> &nbsp;&middot;&nbsp;
        <a href="tel:+351926283061" style="color:#9e7bb6;text-decoration:none;">+351&nbsp;926&nbsp;283&nbsp;061</a>
      </p>
      <p style="color:#9a9a9a;font-size:12px;line-height:1.7;margin:0 0 16px;">
        <a href="https://www.instagram.com/differentt_lab/" style="color:#9e7bb6;text-decoration:none;">Instagram</a> &nbsp;&middot;&nbsp;
        <a href="https://www.tiktok.com/@differentt_lab" style="color:#9e7bb6;text-decoration:none;">TikTok</a> &nbsp;&middot;&nbsp;
        <a href="https://www.facebook.com/profile.php?id=61566459876656&amp;locale=pt_PT" style="color:#9e7bb6;text-decoration:none;">Facebook</a>
      </p>
      <p style="color:#c4c4c4;font-size:11px;line-height:1.6;margin:0;">Recebeste este email porque submeteste um pedido em differenttlab.com.</p>
    </div>

  </div>
</body>
</html>`;
}

exports.handler = async (event) => {
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
    const listaServicos = d.servicos_selecionados || d.services;
    const servicos = Array.isArray(listaServicos) ? listaServicos.join(', ') : listaServicos;
    rows = [
      { k: 'Nome', v: nomeCompleto },
      { k: 'Email', v: email },
      { k: 'Website', v: d.website },
      { k: 'Serviços', v: servicos },
      { k: 'Mensagem', v: d.message },
    ];
  }

  // --- Rastreio / atribuição: aceita { first, last } (novo) ou objeto plano (legado) ---
  const ATTR_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid'];
  const A = (d.attrib && typeof d.attrib === 'object') ? d.attrib : {};
  let first = (A.first && typeof A.first === 'object') ? A.first : null;
  let last = (A.last && typeof A.last === 'object') ? A.last : null;
  if (!first && !last && ATTR_KEYS.some((k) => A[k])) last = A; // formato legado (plano) -> último toque

  const fmtTs = (t) => { try { return new Date(t).toLocaleString('pt-PT', { timeZone: 'Europe/Lisbon' }); } catch (e) { return t; } };
  const attribRows = (obj, prefix) => !obj ? [] : [
    { k: prefix + 'Source', v: obj.utm_source }, { k: prefix + 'Medium', v: obj.utm_medium },
    { k: prefix + 'Campaign', v: obj.utm_campaign }, { k: prefix + 'Content', v: obj.utm_content },
    { k: prefix + 'Term', v: obj.utm_term }, { k: prefix + 'ID', v: obj.utm_id },
    { k: prefix + 'fbclid', v: obj.fbclid }, { k: prefix + 'Data', v: obj.ts ? fmtTs(obj.ts) : '' },
  ];
  rows = rows.concat(attribRows(last, 'Último toque · '), attribRows(first, '1º toque · '));
  if (d.pagina_origem) rows.push({ k: 'Página origem', v: d.pagina_origem });
  if (d.timestamp) rows.push({ k: 'Data/hora', v: fmtTs(d.timestamp) });

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

  // 3) Persistência no Supabase (best-effort). Leads (contacto/ideia) -> `leads`; newsletter -> `subscribers`.
  //    Se as env vars não existirem ou o Supabase falhar, a submissão NÃO falha.
  const SB_URL = process.env.SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (SB_URL && SB_KEY) {
    const col = (obj, p) => {
      obj = obj || {};
      return {
        [p + 'source']: obj.utm_source || null, [p + 'medium']: obj.utm_medium || null,
        [p + 'campaign']: obj.utm_campaign || null, [p + 'content']: obj.utm_content || null,
        [p + 'term']: obj.utm_term || null, [p + 'id']: obj.utm_id || null,
        [p + 'fbclid']: obj.fbclid || null, [p + 'ts']: obj.ts || null,
      };
    };
    const isNewsletter = type === 'newsletter';
    const svcList = d.servicos_selecionados || d.services;
    const svc = Array.isArray(svcList) ? svcList : (svcList ? [svcList] : null);
    const base = isNewsletter
      ? { email: email || null, page_origin: d.pagina_origem || null, raw: d }
      : { form_type: type, name: nomeCompleto || null, email: email || null, website: d.website || null, services: svc, message: d.message || null, page_origin: d.pagina_origem || null, raw: d };
    const record = Object.assign(base, col(first, 'first_'), col(last, 'last_'));
    const sbTable = isNewsletter ? 'subscribers' : 'leads';
    const sbEndpoint = SB_URL.replace(/\/+$/, '').replace(/\/rest\/v1$/, '') + '/rest/v1/' + sbTable;
    try {
      const sbRes = await fetch(sbEndpoint, {
        method: 'POST',
        headers: {
          apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json',
          Prefer: isNewsletter ? 'resolution=merge-duplicates,return=minimal' : 'return=minimal',
        },
        body: JSON.stringify(record),
      });
      if (!sbRes.ok) {
        const body = await sbRes.text().catch(() => '');
        console.error('[supabase] INSERT falhou:', sbRes.status, 'tabela=' + sbTable, '| resposta:', body);
      } else {
        console.log('[supabase] gravado OK em', sbTable);
      }
    } catch (e) {
      console.error('[supabase] EXCECAO:', (e && e.message) || e, '| endpoint=' + sbEndpoint);
    }
  } else {
    console.error('[supabase] ENV VARS EM FALTA -> SUPABASE_URL presente:', !!SB_URL, '| SUPABASE_SERVICE_ROLE_KEY presente:', !!SB_KEY);
  }

  return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ok: true }) };
};
