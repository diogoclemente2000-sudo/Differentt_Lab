// Netlify Function — recebe as submissões dos formulários e envia por email via Resend.
// A API key vem SEMPRE de uma variável de ambiente no Netlify (RESEND_API_KEY),
// nunca do código. Config opcional: MAIL_FROM, MAIL_TO.
//
// Endpoint em produção:  /.netlify/functions/send-email
// Espera JSON no body, ex.: { "formType":"contacto", "firstName":"...", "email":"...", ... }
// formType: contacto (omissão) | ideia | newsletter | pack (pedido de plano na gestão de redes sociais)

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// nomes dos serviços como aparecem no formulário dos contactos
const SERVICOS = {
  REDES: 'Gestão de redes sociais', BRANDING: 'Branding & comunicação', WEBSITE: 'Websites',
  '3D': '3D & interiores', MOTION: 'Motion & vídeo', FOTO: 'Fotografia & conteúdo', SOFTWARE: 'Software para empresas',
};

// Projetos do "Enquanto esperas" do email de confirmação. Imagens em JPG (f_jpg e não f_auto):
// vários clientes de email não abrem WebP/AVIF.
const IMG = (p) => `https://res.cloudinary.com/dgun4lhkm/image/upload/c_fill,g_auto,w_560,h_350,q_auto,f_jpg/${p}`;
const PROJETOS = {
  // a imagem do hero tem o portatil a direita sobre preto: recorta-se a volta dele
  esthetic: { nome: 'Esthetic Solution', linha: 'Transformação digital',
    img: 'https://res.cloudinary.com/dgun4lhkm/image/upload/c_crop,x_880,y_190,w_1600,h_1000/c_scale,w_560/q_auto,f_jpg/Website_photos/work%20individual%20pages/Esthetic%20solution/website-hero-mac.jpg',
    url: 'https://differenttlab.com/projeto?p=esthetic-solution-website' },
  evo: { nome: 'Evo Clinic', linha: '+70% ligações · +30% marcações',
    img: IMG('Website_photos/photos_work_page/HV885HO4Fkcy0k237JIZVqfPd2w.jpg'),
    url: 'https://differenttlab.com/projeto?p=evo-clinic' },
  moment: { nome: 'Moment Laser', linha: '7.000 → 10.000 seguidores',
    img: IMG('Website_photos/work%20individual%20pages/moment%20laser/about-banner.jpg'),
    url: 'https://differenttlab.com/projeto?p=moment-laser' },
};

const WHATSAPP = '351910185220';
const VIDEOCHAMADA = 'https://calendar.app.google/h1VQZZ1eKChfrCvZ6';

const listaPt = (a) => a.length > 1 ? a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1] : (a[0] || '');

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

// O que o email de confirmação mostra em "O teu pedido", conforme o formulário de origem.
// linhas: [rótulo, valor, nota] · projetos: chaves de PROJETOS · zap: texto do WhatsApp
function pedidoReply(type, d) {
  const msg = (d.message || '').toString().trim();
  if (type === 'pack') {
    const extras = Array.isArray(d.extras) ? d.extras.filter(Boolean) : [];
    const linhas = [['Plano', d.plano || 'Ainda por escolher', d.valor || '']];
    if (extras.length) linhas.push([extras.length > 1 ? 'Extras' : 'Extra', extras.join(', '), 'sob orçamento']);
    if (d.semestre) linhas.push(['Semestre à cabeça', d.semestre, 'menos 10%']);
    return { linhas, mensagem: msg, projetos: ['evo', 'moment'],
      zap: `Olá! Enviei pelo site o pedido do plano ${d.plano || 'de gestão de redes sociais'}.` };
  }
  const lista = d.servicos_selecionados || d.services;
  const codigos = Array.isArray(lista) ? lista : (lista ? [lista] : []);
  const servicos = codigos.map(c => SERVICOS[c] || c);
  const linhas = servicos.length ? [[servicos.length > 1 ? 'Serviços' : 'Serviço', listaPt(servicos), '']] : [];
  return { linhas, mensagem: msg, projetos: codigos.includes('REDES') && !codigos.includes('WEBSITE') ? ['evo', 'moment'] : ['esthetic', 'evo'],
    zap: 'Olá! Enviei um pedido pelo site da Differentt.' };
}

// Email de confirmação para quem preenche um formulário: escuro como o site, com o resumo do
// pedido, os próximos passos e dois projetos. Layout em tabelas e estilos inline (clientes de email).
function replyHtml(nome, pedido) {
  const F = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
  // Logótipo servido como PNG (rasterizado do SVG via Cloudinary — os clientes de email bloqueiam SVG).
  const LOGO = 'https://res.cloudinary.com/dgun4lhkm/image/upload/f_png,w_480/Website_photos/photos_home_page/full%20logo.svg';
  const titulo = nome ? `Obrigado, ${esc(nome)}.<br>O teu pedido já está connosco.` : 'Obrigado.<br>O teu pedido já está connosco.';
  const zapUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(pedido.zap)}`;
  const rotulo = (t) => `<div style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#8d8496;margin:0 0 14px;">${t}</div>`;

  const linhas = pedido.linhas.map((l, i) => {
    const borda = i ? 'border-top:1px solid #241f2a;' : '';
    return `<tr>
          <td style="${borda}padding:13px 0;font-family:${F};font-size:14px;color:#a19aa8;">${esc(l[0])}</td>
          <td align="right" style="${borda}padding:13px 0;font-family:${F};font-size:14px;font-weight:700;color:#ffffff;">${esc(l[1])}${l[2] ? `<span style="font-weight:400;color:#a19aa8;"> · ${esc(l[2])}</span>` : ''}</td>
        </tr>`;
  }).join('');
  const citacao = pedido.mensagem
    ? `<div style="margin-top:${linhas ? 18 : 0}px;padding:14px 18px;border-left:2px solid #9e7bb6;background-color:#17121c;border-radius:0 10px 10px 0;font-family:${F};font-size:14px;line-height:1.6;color:#cfc8d6;">${esc(pedido.mensagem.length > 420 ? pedido.mensagem.slice(0, 420).trim() + '…' : pedido.mensagem).replace(/\n/g, '<br>')}</div>`
    : '';
  const blocoPedido = (linhas || citacao) ? `
    <tr><td class="pad" style="padding:30px 36px;background-color:#0d0b12;border:1px solid #241f2a;border-radius:20px;">
      ${rotulo('O teu pedido')}
      ${linhas ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${linhas}</table>` : ''}
      ${citacao}
    </td></tr>
    <tr><td style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>` : '';

  const passos = [
    ['01', 'Lemos o teu pedido', 'Olhamos para o que nos enviaste e para o teu negócio antes de responder.'],
    ['02', 'Respondemos em 24 a 48 horas úteis', 'Com as nossas perguntas, ideias e o caminho que propomos.'],
    ['03', 'Conversa e proposta', 'Uma videochamada curta para fechar os detalhes. Depois enviamos a proposta.'],
  ].map((p, i) => `<tr>
          <td width="46" valign="top" style="padding:${i ? 18 : 0}px 0 0;">
            <div style="width:34px;height:34px;line-height:34px;border-radius:50%;background-color:#21182a;border:1px solid #4a3657;text-align:center;font-family:${F};font-size:12px;font-weight:700;color:#e2b4d8;">${p[0]}</div>
          </td>
          <td valign="top" style="padding:${i ? 18 : 0}px 0 0;">
            <div style="font-family:${F};font-size:15px;font-weight:700;color:#ffffff;line-height:1.3;padding-top:2px;">${p[1]}</div>
            <div style="font-family:${F};font-size:14px;color:#a19aa8;line-height:1.55;margin-top:4px;">${p[2]}</div>
          </td>
        </tr>`).join('');

  const cartao = (k) => {
    const p = PROJETOS[k];
    return `<a href="${p.url}" style="text-decoration:none;display:block;">
            <img src="${p.img}" width="270" alt="${esc(p.nome)}" style="display:block;width:100%;max-width:270px;height:auto;border:1px solid #241f2a;border-radius:14px;">
            <div style="font-family:${F};font-size:15px;font-weight:700;color:#ffffff;margin-top:12px;">${esc(p.nome)}</div>
            <div style="font-family:${F};font-size:13px;color:#a19aa8;margin-top:3px;">${esc(p.linha)}</div>
          </a>`;
  };
  const [p1, p2] = pedido.projetos;

  return `<!doctype html>
<html lang="pt">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>Recebemos o teu pedido — Differentt Lab</title>
<style>
  @media (max-width: 620px) {
    .pad { padding-left: 24px !important; padding-right: 24px !important; }
    .titulo { font-size: 25px !important; }
    .col { display: block !important; width: 100% !important; max-width: 100% !important; padding: 0 0 22px !important; }
    .col img { max-width: 100% !important; }
    .btn { display: block !important; width: 100% !important; padding: 0 0 10px !important; }
    .btn a { display: block !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#000000;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#000000;">Respondemos em 24 a 48 horas úteis. Aqui fica o resumo do que nos enviaste e o que acontece a seguir.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#000000" style="background-color:#000000;">
  <tr><td align="center" style="padding:36px 12px 44px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

    <!-- LOGO -->
    <tr><td class="pad" style="padding:0 36px 26px;">
      <img src="${LOGO}" alt="Differentt Lab" width="150" style="display:block;width:150px;height:auto;border:0;">
    </td></tr>

    <!-- ABERTURA -->
    <tr><td class="pad" style="padding:40px 36px 38px;background-color:#120e17;background-image:linear-gradient(160deg,#2b1f36 0%,#120e17 62%);border:1px solid #2c2433;border-radius:20px;">
      <div style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:#c585b8;margin:0 0 16px;">Pedido recebido</div>
      <h1 class="titulo" style="font-family:${F};font-size:30px;line-height:1.15;font-weight:600;letter-spacing:-0.5px;color:#ffffff;margin:0;">${titulo}</h1>
      <p style="font-family:${F};font-size:15px;line-height:1.65;color:#b9b2c0;margin:16px 0 0;">A tua mensagem chegou à equipa. Respondemos em <strong style="color:#ffffff;">24 a 48 horas úteis</strong>, com as nossas perguntas, ideias e o caminho que propomos para o teu projeto.</p>
    </td></tr>
    <tr><td style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>

    ${blocoPedido}

    <!-- PROXIMOS PASSOS -->
    <tr><td class="pad" style="padding:30px 36px;background-color:#0d0b12;border:1px solid #241f2a;border-radius:20px;">
      ${rotulo('O que acontece a seguir')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${passos}</table>
    </td></tr>
    <tr><td style="height:12px;line-height:12px;font-size:0;">&nbsp;</td></tr>

    <!-- ADIANTAR -->
    <tr><td class="pad" align="center" style="padding:30px 36px;background-color:#0d0b12;border:1px solid #241f2a;border-radius:20px;">
      <div style="font-family:${F};font-size:17px;font-weight:700;color:#ffffff;">Queres adiantar a conversa?</div>
      <div style="font-family:${F};font-size:14px;line-height:1.55;color:#a19aa8;margin:6px 0 20px;">Marca já a videochamada ou fala connosco no WhatsApp.</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
        <td class="btn" style="padding:0 5px;">
          <a href="${VIDEOCHAMADA}" style="display:inline-block;padding:15px 28px;border-radius:100px;background-color:#a480bd;background-image:linear-gradient(180deg,#c49bd8 0%,#a480bd 48%,#86609f 100%);font-family:${F};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;">Marcar videochamada</a>
        </td>
        <td class="btn" style="padding:0 5px;">
          <a href="${zapUrl}" style="display:inline-block;padding:14px 27px;border-radius:100px;border:1px solid #4a4250;font-family:${F};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;">Falar no WhatsApp</a>
        </td>
      </tr></table>
    </td></tr>

    <!-- ENQUANTO ESPERAS -->
    <tr><td class="pad" style="padding:40px 36px 0;">
      ${rotulo('Enquanto esperas')}
      <div style="font-family:${F};font-size:20px;font-weight:600;letter-spacing:-0.3px;color:#ffffff;margin:-4px 0 20px;">Trabalho que fizemos para marcas como a tua</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="col" width="50%" valign="top" style="padding:0 9px 0 0;">${cartao(p1)}</td>
        <td class="col" width="50%" valign="top" style="padding:0 0 0 9px;">${cartao(p2)}</td>
      </tr></table>
      <div style="font-family:${F};font-size:14px;margin-top:22px;"><a href="https://differenttlab.com/portfolio" style="color:#e2b4d8;font-weight:700;text-decoration:none;">Ver o portefólio completo →</a></div>
    </td></tr>

    <!-- ASSINATURA -->
    <tr><td class="pad" style="padding:36px 36px 0;">
      <div style="font-family:${F};font-size:15px;line-height:1.6;color:#b9b2c0;">Até já,<br><strong style="color:#ffffff;">Equipa Differentt Lab</strong></div>
    </td></tr>

    <!-- RODAPE -->
    <tr><td class="pad" style="padding:32px 36px 0;">
      <div style="border-top:1px solid #1f1b24;padding-top:24px;font-family:${F};font-size:12px;line-height:1.8;color:#6f6876;">
        Differentt Lab · Av. Miguel Torga 20 A · 2675-664 Odivelas · Lisboa<br>
        <a href="https://differenttlab.com" style="color:#a19aa8;text-decoration:none;">differenttlab.com</a> &nbsp;·&nbsp;
        <a href="tel:+351910185220" style="color:#a19aa8;text-decoration:none;">+351&nbsp;910&nbsp;185&nbsp;220</a> &nbsp;·&nbsp;
        <a href="https://www.instagram.com/differentt_lab/" style="color:#a19aa8;text-decoration:none;">Instagram</a> &nbsp;·&nbsp;
        <a href="https://www.tiktok.com/@differentt_lab" style="color:#a19aa8;text-decoration:none;">TikTok</a> &nbsp;·&nbsp;
        <a href="https://www.facebook.com/profile.php?id=61566459876656&amp;locale=pt_PT" style="color:#a19aa8;text-decoration:none;">Facebook</a><br>
        <span style="color:#4f4956;">Recebeste este email porque enviaste um pedido em differenttlab.com.</span>
      </div>
    </td></tr>

    </table>
  </td></tr>
  </table>
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
  let mensagemLead = d.message || null;   // o que fica na coluna message do Supabase

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
  } else if (type === 'pack') {
    // pedido feito no resumo dos packs da /gestao-redes-sociais
    const extras = Array.isArray(d.extras) ? d.extras.filter(Boolean) : [];
    formLabel = 'Pedido de plano · Redes sociais';
    subject = `Novo pedido do plano ${d.plano || 'por escolher'} — ${nomeCompleto || email || 'sem nome'}`;
    rows = [
      { k: 'Nome', v: nomeCompleto },
      { k: 'Email', v: email },
      { k: 'Telefone', v: d.phone },
      { k: 'Plano', v: d.plano || 'Ainda por escolher' },
      { k: 'Valor', v: d.valor },
      { k: 'Semestre à cabeça', v: d.semestre },
      { k: extras.length > 1 ? 'Extras' : 'Extra', v: extras.join(', ') },
      { k: 'Mensagem', v: d.message },
    ];
    const resumo = [`Plano: ${d.plano || 'por escolher'}${d.valor ? ' (' + d.valor + ')' : ''}`,
      extras.length ? 'Extras: ' + extras.join(', ') : '', d.phone ? 'Telefone: ' + d.phone : ''].filter(Boolean).join(' | ');
    mensagemLead = d.message ? resumo + '\n\n' + d.message : resumo;
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
    const assunto = type === 'pack' && d.plano
      ? `Recebemos o teu pedido do plano ${d.plano} — Differentt Lab`
      : 'Recebemos o teu pedido — Differentt Lab';
    try {
      await send({ from: FROM, to: [email], subject: assunto, html: replyHtml(nome, pedidoReply(type, d)) });
    } catch (_) { /* auto-resposta é best-effort; não falha a submissão */ }
  }

  // 3) Persistência no Supabase (best-effort). Leads (contacto/ideia/pack) -> `leads`; newsletter -> `subscribers`.
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
      : { form_type: type, name: nomeCompleto || null, email: email || null, website: d.website || null, services: svc, message: mensagemLead, page_origin: d.pagina_origem || null, raw: d };
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
