# Sistema visual — regras consolidadas (set/2026)

> Reunido a 2026-09-09 a partir do que ficou fechado na home (`index.html`) e na
> `criacao-websites.html`. É a referência para remodelar as restantes páginas.
> Página-modelo mais limpa: `nos.html` (estilo consolidado num só `<style>`).

## 1. Layout e medidas (tudo *fixed*)

| Variável | PC (≥1200px) | Mobile (≤1199px) |
|---|---|---|
| `--gutter` (margem lateral) | 80px | 28px |
| `--larg-max` (largura de conteúdo) | 1120px | — |
| `--card-mob` (largura única dos cards) | — | 334px |

- **Um só breakpoint**: `@media (max-width: 1199px)` / `(min-width: 1200px)`. Nada de 600/768/900/1024.
- **PC — coluna única**: a secção trava em `max-width: calc(var(--larg-max) + 2*var(--gutter))` (=1280) com `margin-inline:auto` e `padding: 120px var(--gutter)`. Assim títulos, parágrafos, cards, CTA e footer partilham a **mesma margem esquerda** em qualquer ecrã (80 a 1280, 160 a 1440, 400 a 1920). O que cresce é a margem, nunca o conteúdo.
- **Mobile — congelamento**: cards, títulos, subtítulos, parágrafos e footer usam `width:min(var(--card-mob),100%); margin-inline:auto`. Até aos 390px esticam até encostar aos 28px; a partir daí ficam nos **334px** e a margem cresce (48 a 430, 83 a 500, 283 a 900). Secções: `padding: 72px var(--gutter)`.
- **Faixas full-bleed** (marquee, carrosséis): `width:100vw; margin-left:calc(50% - 50vw)`; o primeiro card alinha pela margem efetiva: `padding-left: max(var(--gutter), calc((100vw - var(--card-mob))/2))`; cards `flex: 0 0 min(var(--card-mob), calc(100vw - 2*var(--gutter)))`, `scroll-snap-align:start`.
- **Footer**: em PC `footer{padding-inline:0}` e `.ft-grid,.ft-bottom` com a mesma conta da secção (max 1280 + padding gutter). Em mobile entra no congelamento.
- **Texto nunca escala com o viewport em mobile**: título de secção 29,6px, h1 do hero 36px/600, parágrafos 17px, CTA 31px.

## 2. Tipografia

- **Satoshi** em tudo (Fontshare). Nunito Sans só na nav (`.nav-links a`). Overpass e Inter estão extintas.
- **Título de secção** `.section-title`: Satoshi 500, `clamp(29px, 2.9vw, 40px)` em PC, line-height 1,06, letter-spacing -0,02em, `text-align:left`, `margin:0 0 4px`, `padding: 0.06em 0 0.18em` (obrigatório: sem padding os descendentes partem o gradiente).
- **Subtítulo** `.section-sub`: Satoshi 400 17px, lh 1,18, `rgba(255,255,255,.88)`, `max-width:560px`, `margin:0 0 56px`, à esquerda. 4px do título ao subtítulo, 56px do subtítulo ao conteúdo.
- **Parágrafo** `.section-body`: Satoshi 400 17px, lh 1,32, mesma cor, `max-width:680px`.
- **H1 do hero** `.home-hero-title`: Satoshi 500, `clamp(44px,4.9vw,72px)`, lh 0,92, ls -0,03em, à esquerda, mesmo gradiente + contorno; `padding:.24em 0 .30em; margin:-.14em 0 calc(20px - .14em)`. `.hero-lead`: Satoshi 500, clamp(16px, 1.1vw+1px, 17.5px), lh 1,34, max 54ch.
- **Nomes de card** (equipa, ciclante): Satoshi 700 com gradiente `#fff → #cfcfcf`.
- Etiquetas pequenas (categoria de projeto, sobretítulo): Satoshi 700 10,5px, tracking .12em, **branco 50%** (não rosa).

## 3. Cores e gradientes

- Marca: `#9e7bb6` (roxo) e `#c585b8` (rosa). Fundos: `#000`/`#08060b`/`#0b0a0f`.
- **Gradiente de título**: `linear-gradient(180deg, #e6e6e9 12%, #79797c 100%)` + `-webkit-background-clip:text` + `-webkit-text-fill-color:transparent` + **contorno** `-webkit-text-stroke: 0.77px rgba(255,255,255,0.25)`.
- **Números de destaque** (chips "+3", "93%"): Satoshi 700, gradiente `#fff 17% → #93929a 62% → #1c1b22 92%` (o fim escuro tem de cair *dentro* dos glifos: medir a caixa), contorno 0,4px a 55%.
- **Anel da casa** (moldura de card): pseudo-elemento `inset:0; padding:1px; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude;` com `linear-gradient(135deg, rgba(197,133,184,.55) 0%, rgba(158,123,182,.07) 32%, rgba(158,123,182,.06) 68%, rgba(197,133,184,.52) 100%)`. O elemento fica com `border:0` (senão o raio não casa nos cantos). Vermelho na barra de oferta: mesma forma com `rgba(224,51,47,.6)`.
- Cards neutros (serviços, projetos): fundo transparente ou `#0a0a0a`, raio 12–14px, sem borda plana — só o anel.
- Barra de progresso: preenchimento a 42–50% de opacidade, anel branco neutro 22%.

## 4. Componentes

- **Botões** `.gx-btn`: pill (`border-radius:100px`), Satoshi 700 15px, `padding:15px 32px`. Branco: `linear-gradient(180deg,#f0f0f2,#d3d3d8 48%,#ababb2)` texto `#0d0d10`. `--purple`: `#c49bd8 → #a480bd 48% → #86609f`, texto branco. `--azul`: `#a8cbe8 → #6f9dc4 48% → #416a91`. Em mobile `display:flex; width:100%; padding:13px 0`. **Anel animado** `<i class="st-anel">` só em 2 botões por página (principal do hero e do CTA) — exige os 4 `@property --stp*` e `@keyframes stAnelGira`.
- **Card ciclante** `.ciclo-*`: substitui grelhas de cards. Todos os slides ficam no DOM (só muda a opacidade); JS converte uma grelha `h3+p` (IIFE de `criacao-websites`/`nos`). PC: 1120px, `padding:44px 48px 92px`; mobile 334px.
- **Equipa** `.tm-*`: componente da home (fotos `nova-secao/*.png` no Cloudinary, card 3/4, gradiente roxo a subir no hover, card de vagas). Em PC a folga de 120px acima do card só abre no hover (senão a 2ª fila invade a 1ª).
- **CTA** `.cta-section`: card com bloom a rodar em PC (3 camadas `<span class="cta-bloom"><i><b>`), aparência dos 4 Passos em mobile. 1120px em PC. O bloom tem de ser um quadrado com lado ≥ diagonal do card (130% da largura).
- **FAQ** `.faq-item`: anel da casa, pergunta Satoshi 600 15,5px (20px em PC) com gradiente, chevron de 9px em `#c585b8`, aberto com halo `rgba(176,138,204,.26)` no canto superior esquerdo.
- **Pop-up** `.lp-modal`: anel da casa, raio 16, título Satoshi 500 25px com gradiente, ícones a `currentColor`.
- **Marquee de logos**: `loading="eager"` (no Safari os clones fora do ecrã ficavam por carregar) + `will-change:transform; translateZ(0)`.
- **Cookies**: 3 botões numa linha em mobile (`flex-wrap:nowrap`).

## 5. Gotchas

- Ficheiros em CRLF; fazer `replace(/\r\n/g,'\n')` nas pesquisas.
- Vários `<style>` por página: os últimos vencem; anexar antes do último `</style>`.
- `filter` aplica-se antes de `mask`: desfocar um anel mascarado corta o brilho — usar 3 níveis (pai desfoca, meio mascara, filho roda).
- Um pseudo-elemento com `z-index:-1` pinta **por cima** do fundo do próprio elemento (dentro do seu contexto): brilhos exteriores fazem-se com `box-shadow`, não com `::before`.
- Substituições por string: verificar que o alvo é único (o mesmo contorno existe em `.section-title` e noutros — já aconteceu aplicar-se ao seletor errado).
- Puppeteer: `clip` em coordenadas de página (+ `scrollY`); remover `#chat-widget` antes de scroll; esperar `document.fonts.ready`.
