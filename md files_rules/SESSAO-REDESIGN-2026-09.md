# Sessão de redesign — setembro 2026 (notas para continuar noutro PC)

> Escrito a 2026-09-03 pelo Claude Code, a pedido do Diogo, para retomar o trabalho noutro computador.
> Estado no momento: **tudo publicado no deploy `ebe7690`** (main → Netlify → differenttlab.com).

## O que esta sessão fez (tudo já em produção)

Redesign inspirado no site **GetDigital** (referência laranja), adaptado à identidade roxo/rosa da Differentt (`#9e7bb6` / `#c585b8`).

- **Fonte Satoshi** (Fontshare CDN) nas 14 páginas: títulos de secção (peso 500), hero e título do card 4 passos (700), subtítulos de secção (Regular 400, 17px, line-height 1.18), texto do footer (Regular).
- **Gradiente nos títulos** (regra da casa): fundo `linear-gradient(180deg, #fbfbfb 14%, #6e6e6e 92%)` + `background-clip:text` + `-webkit-text-stroke: 0.3px rgba(255,255,255,0.45)`. Hero: `#fff→#d4d4d4`, stroke 0.5px. Card passos: `#fff→#cfcfcf`, stroke 0.15px.
- **Hero**: 2 linhas fixas (`br-d`), letter-spacing **-0.03em** (regra partilhada com o título do card), lead em Satoshi Medium.
- **Carrossel** (index + criacao-websites): banda 26-27px, interior glass cinza-escuro, reflexo rosa 3.5px (anima com `mlineGrow`), outlines cinza 1.75px em cima/baixo que abrem com o reflexo, **sombras laterais** preto→transparente (`.mq-shade`, 10% de cada lado), 34s/46s.
- **Secção 4 Passos**: os 4 círculos foram substituídos por **um card único ciclante** (mecânica do palco mobile): 560px, raio 12px, borda gradiente com reflexos em vértices opostos + halo roxo subtil (`inset -1.5px, blur 2.5px`), PNG do anel (`Website_photos/photos_home_page/diff_imagebackground.png` no Cloudinary) numa camada `::before` rodada **15º** (`top 34%`, `145%×82%`), véu `rgba(5,4,8, 0.2/0.4/0.6)`, blobs **desativados** (`.steps-grupo { display:none }`). **5.º slide CTA** "Vamos trabalhar juntos?" com pill roxo "Saber mais" → /metodos (o link antigo por baixo do card foi removido). CICLO=20000, 5 dots.
- **CTA final**: título até 82px, line-height 0.98, `text-wrap: balance`, `margin:0` no h2; botões `gx-btn` menores (15/30, font 12.5) alinhados à esquerda, gap 16px.
- **Footer novo (14 páginas)**: grelha 1.35fr/0.9fr/0.9fr desktop; em ≤1024: ícones 32px (svg 15), texto desc `rgba(255,255,255,0.92)` lh 1.35 max-width 250px, contactos 14px/11.5px max-width 230px gap 9px, socials 32px, mais respiro entre blocos.
- **Cookies**: card de canto (7 páginas), Satoshi, 3 botões, rosa.
- Fundos das páginas mais escuros (12 páginas); removidos "Como trabalhamos", "Os nossos clientes.", subtítulo dos serviços.

## Regras de trabalho combinadas

1. **NUNCA fazer commit/push sem OK explícito do Diogo** — trabalhar local, verificar com screenshot, apresentar e esperar ("da deploy" / "ok").
2. Prints vão para `temporary screenshots/` com prefixo numérico (1-, 2-, …) — o Diogo abre os ficheiros; imagens lidas pelo Claude não lhe aparecem.
3. Seguir referências GetDigital: replicar layout/espaçamentos exatamente, cores da Differentt.

## Gotchas técnicos (poupam horas)

- **index.html está em CRLF** — regex multi-linha com `\n` falha silenciosamente; usar `\r?\n` ou âncoras de linha única.
- **Nunca** apagar blocos com regex não-gananciosa terminada em `</div>\s*</div>` — uma dessas comeu a secção Portfólio inteira (recuperada com `git show HEAD:index.html`). Preferir âncoras exatas e verificar contagens depois.
- Gradiente em texto: line-height ≥1.28 **ou** padding vertical, senão p/q/g partem o gradiente. Um `background:` shorthand posterior **reseta** o `background-clip` — voltar a declará-lo.
- Puppeteer: `scrollBehavior='auto'` + scroll iterativo ×3-4 (lazy-load mexe o layout) + `element.screenshot()`; cookies via `localStorage.setItem('cookie_consent','accept')` + reload.
- Servidor: `node serve.mjs` → :3001; se morrer, `(node serve.mjs > server.log 2>&1 &)`.

## Pendentes

- Ficheiros untracked por decidir (apagar ou guardar): `prototipo-circulos*.html`, `_mockup-*.html`, `_frag-*.html`, `_especime-satoshi.html`, `_teste-som*.mjs`, `brief-website.md`, `Brand_assets/differentt gif.gif`.
- Sem os blobs, o card dos 4 passos já não muda de cor entre passos — ficou oferecido fazer a imagem variar de tonalidade (hue-rotate) por passo; sem resposta.
- Satoshi nos títulos está aplicada via bloco de gradiente **só no index**; as outras páginas têm Satoshi carregada mas os títulos de secção internos mantêm o estilo antigo — possível próximo passo de coerência.
