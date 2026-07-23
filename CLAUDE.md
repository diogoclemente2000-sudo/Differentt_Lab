# CLAUDE.md — Website Differentt Lab

Site institucional da **Differentt Lab**, agência digital sediada em Odivelas, Lisboa
(branding, websites, design gráfico, 3D e gestão de redes sociais para PMEs portuguesas).

Domínio de produção: **https://differenttlab.com**

---

## Stack — o que isto é (e o que não é)

- **HTML estático puro.** Não há build step, bundler, framework nem npm run build.
- **CSS escrito à mão**, dentro de um `<style>` no `<head>` de cada página. Não existe nenhum ficheiro `.css` externo. Cada página é autocontida.
- **JavaScript vanilla inline**, no fim de cada página.
- ⚠️ O **Tailwind CDN** está carregado em apenas 3 páginas (`index`, `metodos`, `contactos`) e é essencialmente resíduo — o sistema de design real é o CSS próprio. **Não escrever novo código com classes Tailwind**; seguir o CSS existente da página.

Dependências npm (`package.json`) servem só ferramentas locais: `puppeteer` (screenshots),
`cloudinary` (upload de media), `@anthropic-ai/sdk` (chatbot do servidor de dev).

---

## Servidor local

```bash
node serve.mjs     # a partir de "Different lab v2/"
```

→ **http://localhost:3001** — o porto por omissão é **3001**, não 3000. (`PORT` env override.)

O `serve.mjs` dá:
- **Live reload** por SSE — grava um `.html` na raiz e o browser recarrega sozinho.
- **URLs limpos** — `/contactos` serve `contactos.html`.
- **`POST /api/chat`** — chatbot "Margarida", proxy para a API Anthropic (modelo `claude-haiku-4-5-20251001`, respostas de 2-3 frases). Lê `ANTHROPIC_API_KEY` do `.env` e o system prompt de `chatbot information/txt prompt chatbot.txt`.

Se o servidor já estiver a correr, **não arrancar uma segunda instância**.

---

## Screenshots

```bash
node screenshot.mjs http://localhost:3001 <etiqueta>
```
Guarda em `temporary screenshots/screenshot-N-<etiqueta>.png` (numeração automática, nunca sobrescreve).
Chrome do Puppeteer em `C:\Users\diogo\.cache\puppeteer` (instalar com `npx puppeteer browsers install chrome`).

**Limitação importante:** o `screenshot.mjs` **não faz scroll**. A `gestao-redes-sociais.html` usa animações
de scroll-reveal (`.reveal { opacity: 0 }` → `.reveal.in`) e imagens `loading="lazy"`, por isso a captura
sai **praticamente preta**. Para essa página é preciso um script que percorra a página antes de capturar.

Nunca fotografar um URL `file:///` — servir sempre por localhost.

---

## Páginas

| Ficheiro | Rota | O que é |
|---|---|---|
| `index.html` | `/` | Homepage |
| `servicos.html` | `/servicos` | Lista de serviços |
| `criacao-websites.html` | `/criacao-websites` | Landing de serviço — websites e software |
| `gestao-redes-sociais.html` | `/gestao-redes-sociais` | Landing de serviço — social media |
| `portfolio.html` | `/portfolio` | Portefólio (suporta `?filter=social`) |
| `projeto.html` | `/projeto` | Página de projeto individual |
| `metodos.html` | `/metodos` | Metodologia |
| `nos.html` | `/nos` | Sobre a agência / equipa |
| `contactos.html` | `/contactos` | Contactos |
| `blog.html` | `/blog` | Índice do blog (artigos em `blog/`) |
| `faq.html` | `/faq` | Perguntas frequentes |
| `termos.html` · `privacidade.html` · `rgpd.html` | — | Legal |

SEO: `sitemap.xml`, `robots.txt`, `llms.txt` e JSON-LD no `<head>` do `index`.

---

## Pastas

| Pasta | Conteúdo | No git? |
|---|---|---|
| `Brand_assets/` | Logo da agência + `client_logos/` (SVG dos clientes) | ✅ sim — servido do repositório |
| `blog/` | Artigos do blog | ✅ sim |
| `Website_photos/` | Fotos por página e por cliente | ❌ **gitignored** |
| `Website_videos/` | Vídeos | ❌ gitignored |
| `Website_texts/` · `website_links/` · `chatbot information/` | Conteúdo de apoio e prompt do chatbot | — |
| `temporary screenshots/` | Saída do `screenshot.mjs` | ❌ gitignored |
| `social-media/` · `md files_rules/` | **Ignorar. Não fazem parte do website** (também no `.netlifyignore`) | ❌ |

---

## Imagens — Cloudinary (regra crítica)

`Website_photos/` está no `.gitignore`, logo **as imagens não são servidas do repositório**.
Todas vêm do Cloudinary (cloud `dgun4lhkm`).

Ao adicionar uma imagem nova:
1. Colocar o ficheiro em `Website_photos/...`
2. **Fazer upload para o Cloudinary** com o `public_id` a espelhar o caminho (ver `upload-to-cloudinary.mjs`)
3. Referenciar no HTML com transformações: `https://res.cloudinary.com/dgun4lhkm/image/upload/q_auto,f_auto/<public_id>.<ext>`

Limite de upload: **10 MB** — redimensionar antes se for preciso.
Exceção: os logos em `Brand_assets/` são servidos do repositório por caminho relativo (`./Brand_assets/...`).

---

## Sistema de design

**Cor de marca:** `#9e7bb6` (roxo) — de longe a mais usada. Acento secundário `#c585b8`.
**Fundos:** pretos em camadas — `#000`, `#020202`, `#050505`, `#080808`, `#0a0a0a`, `#0d0d0d`.
Nunca usar azul/índigo por omissão como cor primária.

**Tipografia** (Google Fonts):
- `Overpass` (700/800/900) — números, eyebrows, nomes destacados
- `Nunito Sans` (300/400/600/700) — títulos e corpo de texto
- `Inter` (400/700) — navegação

Títulos grandes: `font-weight: 300`, `text-transform: uppercase`, `letter-spacing: -0.02em`.
Corpo: `font-weight: 300`, `line-height: 1.7`.

**Componentes partilhados** (mesmas classes em várias páginas):
- `nav-links` + `footer-top` — nav e rodapé, presentes nas **14** páginas
- `page-hero` — hero de página interior (5 páginas)
- `section-eyebrow` / `section-title` / `section-body` — cabeçalho de secção; o `<span>` dentro do título pinta-se de roxo
- `btn-primary` (pílula branca), `btn-glow`, `divider`, `cta-bar`, `faq-list`

---

## Linguagem e tom

- **Português de Portugal.** `<html lang="pt">`.
- **Tratamento por "tu"** — "o teu negócio", "os teus clientes". É o padrão dominante do site; manter.
- Direto e concreto. Números reais e nomes de clientes reais (Evo Clinic, Moment Laser, Aroma Boreal, Esthetic Solution) em vez de promessas vagas.
- **Evitar copy genérica de IA.** Nada de "Aqui estão alguns exemplos", "Soluções à medida para o seu negócio", "Impulsione o seu negócio". Títulos devem dizer o que a secção mostra.

---

## Regras de design

- **Sombras:** nunca planas. Usar camadas com tinta de cor e opacidade baixa.
- **Tipografia:** nunca a mesma fonte para título e corpo.
- **Gradientes:** sobrepor vários radiais; adicionar grão/textura para dar profundidade.
- **Animações:** animar **só `transform` e `opacity`**. Nunca `transition-all`.
- **Estados:** todo o elemento clicável precisa de `hover`, `focus-visible` e `active`.
- **Imagens:** aplicar gradiente escuro por cima e uma camada de cor de marca com `mix-blend-multiply` para as unificar.
- **Profundidade:** manter hierarquia de superfícies (base → elevada → flutuante).
- **Excesso de cards:** o site já usa grelhas de cards em muitas secções. Antes de criar mais uma, considerar faixas full-bleed, marquees ou linhas editoriais. O que faz "ler como card" é a moldura (borda + raio + sombra), não a grelha.

### Ao seguir uma imagem de referência
Reproduzir layout, espaçamento, tipografia e cor **exatamente**. Não acrescentar secções nem "melhorar".
Fotografar o resultado, comparar com a referência, corrigir e repetir — no mínimo 2 rondas.
Ser específico na comparação ("o título está a 32px, a referência tem ~24px").

---

## Deploy

Repositório: `https://github.com/diogoclemente2000-sudo/Differentt_Lab.git` (branch `main`).
**Push para `main` dispara deploy de produção automático no Netlify.** Confirmar antes de publicar.

Notas de git neste PC:
- O drive não regista ownership → foi preciso `git config --global --add safe.directory '<caminho>'`
- Credenciais guardadas no Git Credential Manager
- `server.log` e `liquid glass/` estão por commitar de propósito — não são conteúdo do site
