# Sessão landing pages — novembro 2026 (notas para continuar noutro PC)

> Escrito a 2026-11-06 pelo Claude Code, a pedido do Diogo, para retomar o trabalho noutro computador.
> Estado: **último deploy `d6741c2`** (28/10). Feito localmente e **ainda não publicado**: preços dos planos de
> redes sociais ocultados (`gestao-redes-sociais.html` + `faq.html`). O `index.html` tem uma alteração local que
> não é do Claude (`top: 42%` no brilho da secção de serviços em mobile): perguntar antes de a incluir num commit.

## Já em produção (deploy `d6741c2`)

- **Esthetic Solution · Transformação Digital**: projeto `esthetic-solution-website` no `projeto.html` (hero MacBook
  `Esthetic solution/website-hero-mac.jpg`, vídeo `Website_videos/esthetic-site-web.mp4`, slides), card na
  `criacao-websites` (→ `portfolio?filter=web`) e no portfólio. A descrição liga a `/gestao-redes-sociais#marcas`.
- **Esthetic · redes sociais**: reel `Website_videos/esthetic-porque-web.mp4` (Cloudinary) no topo da galeria de
  `esthetic-solution` e no card da gestão (capa `Website_videos/esthetic-porque-capa.jpg`, ela lá fora).
- **Time Gym**: "Web & Produto", filtros web + 3d, vídeo `gym-time-web.mp4` na galeria.
- **Packs (gestão de redes sociais)**: o botão do resumo abre um formulário (`#pfFundo`) → `send-email` com
  `formType: 'pack'` → `/obrigado` (dispara o Lead do Pixel). WhatsApp fica como alternativa dentro do pop-up.
- **`netlify/functions/send-email.js`**: tipo `pack` + email de confirmação redesenhado para todos os formulários
  (escuro, "O teu pedido", 3 passos, videochamada/WhatsApp, 2 projetos com números).
- **Aroma Boreal**: capa do card na gestão = `photos_home_page/aroma-capa.jpg` (a mesma da homepage).

## Feito só no PC onde esta nota foi escrita (utilizador `Usuario`), fora do git

O Diogo escolheu enviar só esta nota. Num PC acabado de sincronizar, **estas alterações não existem**: ou se trazem
desse PC (commit lá) ou se refazem com a descrição abaixo.

- **Preços ocultados** na `gestao-redes-sociais.html`: cards, resumo ("Proposta à medida · enviada em 24 a 48 horas
  úteis" + botão "Pedir proposta"), selo e pop-up do semestre, FAQ visível e JSON-LD, meta description/og e
  `offers` do JSON-LD. Na `faq.html`: pergunta 11 e valores do semestre. O formulário dos packs envia só plano + extras.
- **Ainda com preços** (decidir com o Diogo): `blog/quanto-custa-gestao-redes-sociais-portugal.html` (artigo sobre
  preços, tirar os números enfraquece-o) e `blog/gestao-redes-sociais-vale-a-pena.html`.

## Próximo passo: transformar as páginas em landing pages

Pedido do Diogo: `criacao-websites` e `gestao-redes-sociais` a funcionar como LPs dos anúncios Meta (formulário
próprio, a funcionar sozinhas). A de redes sociais passa a focar **presença digital / atualização digital**:
marcas pessoais, profissionalizar a marca ou o negócio, produção profissional (há videógrafo).

**Decisão pendente do Diogo:** transformar as páginas atuais (mexe no SEO, sobretudo se a de redes passar a
"presença digital") **ou** criar LPs só para anúncios (ex.: `/presenca-digital` e `/websites-software`, noindex,
sem menu) e manter as atuais com preços ocultos + formulário. **Recomendação do Claude: LPs separadas.**
Começar pela de redes sociais.

### Diagnóstico (nov 2026, telemóvel 390px)

1. Sem formulário próprio: na de websites os dois "Pedir Proposta" vão para `/contactos`; na de redes o único
   formulário é o pop-up dos packs, a ~5 ecrãs do topo.
2. Muitas saídas: menu e rodapé completos, "Ver Portfólio"/"Ver Casos Reais" no hero, cards de projetos, link do blog.
3. Compridas: 12 ecrãs (websites) e 10 (redes). FAQ de websites com 13 perguntas.
4. **Zero testemunhos** nas duas (a homepage tem 5 em vídeo).
5. Hero vago: websites = "Transformação digital · Alinhamos equipas, dados e ferramentas" (abstrato, mistura site,
   loja, CRM e software); redes = "Gestão de redes sociais… para PMEs" (não fala de marca pessoal nem da produção).
6. Contagem "-15% · expira em 00:59:55" na `criacao-websites` é falsa (recomeça a cada hora, `offer_deadline` no
   localStorage): tira credibilidade e pode ser vista como publicidade enganosa. Recomendado tirar.

### Estrutura proposta — presença digital (redes sociais)

1. Hero: imagem profissional todos os meses ("A tua marca com imagem profissional, todos os meses"); filmamos no
   teu espaço, editamos e publicamos; marcas pessoais e negócios. Vídeo de produção ao fundo. Botão desce ao
   formulário. Linha de prova: "+6.000 seguidores na Esthetic · 87% dos clientes renovam".
2. Testemunhos em vídeo (Telma Fonseca, marca pessoal, primeiro).
3. Como funciona a produção: sessão de filmagem → edição → publicação e relatório (bastidores do videógrafo).
4. Resultados: números + reels das marcas (já existem).
5. Planos sem preço (como ficaram).
6. Formulário curto na página: nome, contacto, marca pessoal ou negócio, @ do Instagram, objetivo.
7. FAQ com 5–6 perguntas.
Tirar: menu/rodapé completos (só logo + "Pedir proposta"), saídas para portfólio e blog, carrossel "Mais do que publicar".

### Estrutura proposta — websites e software

1. Hero concreto ("Websites e software que trazem pedidos e poupam horas à tua equipa"); formulário pergunta o
   tipo de projeto (website, loja, software à medida, ainda não sei).
2. Projetos com o resultado de cada um, a abrir na própria página (o leitor de vídeo já existe).
3. Testemunho de um cliente de website (ex.: pedir à Esthetic).
4. O que entregam, prazos e garantia, condensado (o carrossel de 8 "implementações" e o "93% otimização média" dizem pouco).
5. Formulário + FAQ com 6 perguntas. Tirar a contagem falsa e as saídas.

### Material disponível

- Testemunhos em vídeo (homepage, `Website_videos/*-testemunho-web.mp4`): Telma Fonseca (marca pessoal),
  Aroma Boreal, Evo Clinic, Moment Laser, Villas Gourmet, Inês.
- Números: Esthetic +6.000 seguidores · 400 clientes/mês · +127 mil views/mês; Evo +70% ligações · +30% marcações;
  Moment 7.000 → 10.000 seguidores · +813 mil views; 87% renovam o plano.
- Reels: `Website_videos/*-reels-web.mp4` (repo) e `esthetic-porque-web.mp4` (Cloudinary).
- Canalização pronta: `send-email.js` (acrescentar um ramo por `formType` novo), `meta-pixel.js` (UTM → localStorage,
  ref no WhatsApp), `/obrigado` dispara o Lead quando há `sessionStorage.meta_lead_pending`.

## Outras pendências

- Evento "Contact" do Pixel no clique do WhatsApp (`meta-pixel.js`): proposto, não feito.
- Hero de `projeto?p=evo-clinic` dá 404 (`evo clinic/banner.png` não existe no Cloudinary).
- Testar em produção o formulário dos packs e os dois emails (pedido + confirmação).
- Anúncios Meta: links com `utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}`;
  no `#packs` confirmar que os UTMs não ficam depois do `#`.

## Regras e gotchas (somam às do `SESSAO-REDESIGN-2026-09.md`)

- Push para `main` = deploy. **Só com OK explícito do Diogo** ("da deploy").
- No Git Bash o push falha a pedir credenciais. Usar PowerShell:
  `$env:GCM_INTERACTIVE='always'; $env:GIT_TERMINAL_PROMPT='1'; git push origin main` (abre o login do GitHub).
- Cloudinary: limite de 10 MB; PNG grandes falham sem aviso e a página fica com imagem partida. Reduzir para JPG antes.
- Vídeos exportados no Raylight trazem "Made in Raylight" no canto inferior direito: cortar ou tapar sempre.
- Galeria do `projeto.html`: `{src, full:true}` força largura toda; vídeo detetado pela extensão; `mediaTag`
  reescreve `image/upload` → `video/upload` e `work individual pages` → `work individual pages light`.
- `Website_videos/` está no `.gitignore` com exceções (`!`): vídeos novos vão para o Cloudinary.
- O servidor local não corre funções Netlify: os formulários só enviam de verdade em produção.
