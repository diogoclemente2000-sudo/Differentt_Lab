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

## Atualização 2026-11-09: `criacao-websites` passa a landing page no próprio endereço

O Diogo decidiu: os anúncios de desenvolvimento caem direto na `/criacao-websites`, que fica **simples como está**
(mesmo menu, topo, ordem das secções e FAQ), mais informativa e a prender o lead. Feito localmente, **não publicado**:

- **Formulário em 4 passos** (atualizado: passo 2 "Conta-nos mais sobre o projeto" com perguntas de intenção só dos
  serviços escolhidos, opcionais, em cartões: Landing page = para que é + anúncios; Website institucional = nº de
  páginas + o que precisa; Loja online = nº de produtos + pagamentos + entregas; Software ou CRM = o que organizar +
  nº de utilizadores; Automações = o que automatizar + ferramentas atuais. Só "Ainda não sei" salta este passo.
  Passo 3 "Últimas perguntas": ponto de partida + para quando; o objetivo principal só aparece a quem não teve
  perguntas de detalhe (só "Ainda não sei"/"Outro"), porque aí a intenção ainda não ficou clara.
  Passo 1 tem também "Outro" (abre campo "Qual?", obrigatório; segue como "Outro: <texto>") e "Ainda não sei" em linha inteira.
  "Outro" também nas perguntas de detalhe de escolha (para que é, precisa de ter, pagamentos, entregas, organizar,
  automatizar, ferramentas), com "Qual?" opcional (segue como "Outro: <texto>"); as de quantidade não têm.
  Tipografia do cartão: Satoshi nos títulos/perguntas/botões (500), Nunito Sans 400 nas respostas e campos.
  ATUALIZADO: o "Outro" escreve-se no próprio cartão (é um <div> com o campo lá dentro, não <label>: num label cada
  clique no texto ligava/desligava a opção); escrever marca, apagar desmarca. Passo 1: 6 meios cartões (… Automações,
  Ainda não sei) + "Outro, escreve aqui" na linha inteira. Telemóvel: título, formulário, e só depois a lista
  (consultoria/resposta/videochamada), estrelas e WhatsApp (display: contents + order); fita do fundo atrás do formulário.
  Seguem em `detalhes` no payload e aparecem nos dois emails e no Supabase. Cantos dos cartões a 5px).
- Estrutura original de 3 passos (`#pedir-proposta`, antes da FAQ): 1) "De que precisas?" em cartões de escolha múltipla
  (Landing page, Website institucional, Loja online, Software ou CRM, Automações e integrações, Ainda não sei);
  2) objetivo principal (Mais pedidos e clientes, Vender online, Leads mais qualificadas, Renovar a imagem),
  ponto de partida e para quando (os três obrigatórios, um toque cada); 3) nome, email, telefone (opcional), nota.
  Versão simples a pedido do Diogo: cartões só com o nome (sem ícones nem descrições), sem "Passo X de 3", só a
  barra de progresso. Cartão em vidro baço como os cards de serviços da homepage (transparente,
  `backdrop-filter: blur(28px) saturate(150%)`, borda branca fina, reflexo no topo), sem imagem dentro. Envia `formType: 'website'` →
  `/obrigado` (Lead com `formulario: 'lp-websites'`). Evento `trackCustom('PedidoPropostaPasso')` em cada passo.
- **Avaliações do Google** (secção copiada da homepage) depois da FAQ, antes do CTA final, com cards mais compactos (270px no PC, 230px no telemóvel; na home são 350px);
  **estrelas** no hero e ao lado do formulário (este com a entrada do hero da home, disparada ao entrar no ecrã).
- Botões levam ao formulário: hero ("Ver Portfólio" passou a "Ver projetos" → `#projetos`), modais dos exemplos
  (pré-escolhem o serviço via `data-servico`), leitor de projetos ("Quero um projeto assim") e CTA final.
- **Tirada a contagem "-15% expira em"** (HTML + script; ficou CSS sem uso).
- Exemplos "Websites, lojas e sistemas de gestão": 3 em cima no tamanho original e o "Software à medida" a toda a
  largura em baixo com imagem 3:1 (antes ficava um cartão sozinho; 4 colunas ficavam pequenos demais).
- Lista ao lado do formulário: "Consultoria gratuita" (em vez de "Proposta sem compromisso").
- Fundo da secção do formulário: fita roxa `criacao-websites_page/fundo-fita-roxa.jpg` (Cloudinary, 2400px) a toda
  a largura, com máscara a desvanecer em cima e em baixo e escurecimento à esquerda (texto); no telemóvel a fita
  fica só por trás do formulário (versão `w_1400`).
- `send-email.js`: ramo `website` (email ao estúdio com projetos, site, prazo, telefone; confirmação com Esthetic + ZeeTelecom).

Ainda por decidir na `criacao-websites`: texto do hero ("Transformação digital" continua), tirar o menu/rodapé
completos, e a secção "O que entregamos" com o "93%".

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
