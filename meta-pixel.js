/*
 * Differentt Lab — Píxel da Meta + captura de atribuição (UTM / fbclid)
 * =====================================================================
 * Ficheiro ÚNICO carregado no <head> de todas as páginas. JS nativo, zero dependências.
 *
 * ID DO PÍXEL — fonte única (META_PIXEL_ID abaixo):
 *   • '' (vazio)  → píxel DESATIVADO (nenhum pedido é feito à Meta; fbq fica indefinido).
 *   • preenchido  → píxel ATIVO em todas as páginas (PageView automático).
 *   • Podes também injetá-lo por ambiente definindo window.META_PIXEL_ID ANTES deste script
 *     (ex.: snippet injection no Netlify) — esse valor tem prioridade.
 *
 * Único evento standard disparado a partir daqui é o PageView (base do píxel).
 * O evento "Lead" é disparado apenas na página /obrigado, após submissão do formulário.
 */
(function () {
  'use strict';

  // ===== ID do Píxel da Meta (deixa '' para desativar) =====
  var ENV_ID = (typeof window.META_PIXEL_ID === 'string') ? window.META_PIXEL_ID.trim() : '';
  var META_PIXEL_ID = ENV_ID || '3066909863517847';

  // ===== 1) Captura de atribuição — FIRST-TOUCH + LAST-TOUCH (localStorage, ~90 dias) =====
  // Guarda em localStorage (sobrevive ao fecho da aba). Regista o PRIMEIRO toque (nunca
  // sobrescrito) e o ÚLTIMO toque (atualiza sempre). Expira 90 dias após o último toque.
  var ATTRIB_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid'];
  var STORE_KEY = 'dl_attrib';
  var MAX_AGE = 90 * 24 * 60 * 60 * 1000; // 90 dias

  function readStore() {
    try {
      var s = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
      var ref = (s.last && s.last.ts) || (s.first && s.first.ts);
      if (ref && (Date.now() - new Date(ref).getTime()) > MAX_AGE) return {}; // expirou
      return s && typeof s === 'object' ? s : {};
    } catch (e) { return {}; }
  }

  try {
    var params = new URLSearchParams(window.location.search);
    var now = {}, hasAny = false;
    for (var i = 0; i < ATTRIB_KEYS.length; i++) {
      var val = params.get(ATTRIB_KEYS[i]);
      if (val) { now[ATTRIB_KEYS[i]] = val; hasAny = true; }
    }
    if (hasAny) {
      now.ts = new Date().toISOString();
      var store = readStore();
      if (!store.first) store.first = now; // primeiro toque nunca é sobrescrito
      store.last = now;                    // último toque atualiza sempre
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
    }
  } catch (e) { /* localStorage indisponível (modo privado/embargado) — ignora */ }

  // Devolve { first:{...}, last:{...} } (ou {} se não houver atribuição guardada).
  window.getAttrib = function () { return readStore(); };

  // ===== 1b) WhatsApp com atribuição — reescreve os links no runtime =====
  // Todos os botões de WhatsApp passam a apontar para o número dedicado e levam a
  // origem da lead na mensagem: "(ref: <utm_content|utm_campaign|utm_source|direto>)".
  // A ref usa o ÚLTIMO toque (campanha mais recente), caindo para o primeiro toque.
  var WHATSAPP_NUMBER = '351910185220';

  function attribRef() {
    var s = readStore();
    var t = s.last || s.first || {};
    return t.utm_content || t.utm_campaign || t.utm_source || 'direto';
  }

  // href do WhatsApp com a mensagem + ref (usado pelos botões e pelo chatbot).
  window.whatsappHref = function () {
    var texto = 'Olá! Vim do site da Differentt. (ref: ' + attribRef() + ')';
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(texto);
  };

  function applyWhatsappLinks() {
    try {
      var links = document.querySelectorAll('a[href*="wa.me/"], a[href*="api.whatsapp.com"], a[href*="web.whatsapp.com"]');
      var href = window.whatsappHref();
      for (var i = 0; i < links.length; i++) links[i].setAttribute('href', href);
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyWhatsappLinks);
  else applyWhatsappLinks();

  // Helpers de evento (só disparam se o píxel estiver ativo; seguros se fbq não existir).
  window.fireLead = function (tipo) {
    try { if (typeof fbq === 'function') fbq('track', 'Lead', { content_name: tipo || 'lead' }); } catch (e) {}
  };
  window.fireSubscribe = function () {
    try { if (typeof fbq === 'function') fbq('track', 'Subscribe', { content_name: 'newsletter' }); } catch (e) {}
  };

  // ===== 2) Snippet base do Píxel da Meta (só corre quando há ID) =====
  if (META_PIXEL_ID) {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }
})();
