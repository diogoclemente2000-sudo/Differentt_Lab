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

  // ===== 1) Captura de atribuição — PRIMEIRO TOQUE GANHA =====
  // Lê os parâmetros de campanha do URL e guarda em sessionStorage['attrib'] apenas se
  // ainda não existirem — assim a navegação interna nunca sobrescreve a origem da visita.
  var ATTRIB_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid'];
  try {
    if (!sessionStorage.getItem('attrib')) {
      var params = new URLSearchParams(window.location.search);
      var attrib = {};
      var hasAny = false;
      for (var i = 0; i < ATTRIB_KEYS.length; i++) {
        var val = params.get(ATTRIB_KEYS[i]);
        if (val) { attrib[ATTRIB_KEYS[i]] = val; hasAny = true; }
      }
      if (hasAny) sessionStorage.setItem('attrib', JSON.stringify(attrib));
    }
  } catch (e) { /* sessionStorage indisponível (modo privado/embargado) — ignora */ }

  // Helper global: devolve a atribuição guardada (ou {} se não houver).
  window.getAttrib = function () {
    try { return JSON.parse(sessionStorage.getItem('attrib') || '{}'); }
    catch (e) { return {}; }
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
