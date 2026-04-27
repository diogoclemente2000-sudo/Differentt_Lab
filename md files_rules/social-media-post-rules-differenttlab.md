# Regras para Posts de Redes Sociais — Differentt Lab

## 1. Linguagem e Tom

- **Usar sempre "tu/tua/teu"** — nunca usar "você/seu/seus"
  - ✅ "Eleva a tua presença digital"
  - ❌ "Eleve a sua presença digital"
- Tom próximo, criativo e aspiracional — jovem e direto sem perder profissionalismo
- Verbos no imperativo informal: "Transforma", "Cresce", "Descobre", "Conquista", "Eleva"
- Frases curtas e impactantes no headline — máximo 2 linhas
- Posicionamento: agência criativa que combina **criatividade, tecnologia e estratégia**

---

## 2. Formato e Dimensões

| Formato | Dimensões | Uso |
|---|---|---|
| Instagram Portrait | 1080 × 1350 px | Feed principal |
| Instagram Square | 1080 × 1080 px | Feed alternativo |
| Instagram Story | 1080 × 1920 px | Stories |

- Exportar sempre com `clip` exacto às dimensões (sem overflow)
- Resolução: 1x (deviceScaleFactor: 1)

---

## 3. Margens e Safe Zone

- **Padding mínimo de todas as bordas: 56px**
- **Padding inferior: mínimo 64px** — evitar que o botão CTA ou texto seja cortado pelo ecrã do telemóvel
- **Padding superior: mínimo 44px** — espaço para o indicador de notificações do Instagram
- Todo o conteúdo importante (logo, badge, CTA, URL) deve estar dentro da safe zone
- Nunca colocar texto ou elementos interativos nos primeiros/últimos 40px de qualquer borda

---

## 4. Tipografia

- **Fonte principal (headings):** Overpass — pesos 700, 800, 900
- **Fonte de corpo:** Nunito Sans — pesos 300, 400, 600, 700
- **Headline principal:** Overpass font-weight 900, tamanho ≥ 60px, letter-spacing `-0.02em`
- **Subheadline:** Nunito Sans font-weight 300–400, tamanho ~26px
- **Corpo/bullets:** Nunito Sans font-weight 400, tamanho ~24–26px
- **Labels/caps:** Overpass font-weight 700, tamanho ~10–11px, letter-spacing `.15em` a `.25em`, `text-transform: uppercase`
- Letter-spacing em headings: `-0.02em`
- Letter-spacing em labels/caps: `.15em` a `.25em`

---

## 5. Cores e Identidade Visual

- **Roxo principal:** `#9e7bb6`
- **Rosa-roxo secundário:** `#c585b8`
- **Roxo escuro:** `#6a4f8a`
- **Preto marca:** `#000000` / `#050505` / `#0a0a0a`
- **Gradiente principal:** `linear-gradient(135deg, #9e7bb6, #c585b8)`
- **Gradiente profundo:** `linear-gradient(135deg, #9e7bb6 0%, #6a4f8a 100%)`
- Nunca usar azul, vermelho ou cores fora da paleta da marca
- O gradiente roxo aplica-se a: CTAs, destaques de texto, dividers, ícones, badges, glows

---

## 6. Backgrounds e Transições de Cor

- **Fundo principal:** `#000000` a `#0a0a0a` (gradiente radial subtil para profundidade)
- **Fundo elevado (cards/sections):** `#0d0d0d` a `#111111`
- **Glow de fundo:** radial roxo atrás de elementos principais — `rgba(158,123,182,.15–.25)`
- Quando há split claro/escuro: garantir que o texto começa **sempre abaixo** da linha de transição diagonal
- Nunca colocar texto claro sobre fundo claro nem texto escuro sobre fundo escuro sem verificar o contraste
- Grain/texture subtil: `opacity: .03`, `mix-blend-mode: overlay` — adiciona profundidade ao fundo preto

---

## 7. Contraste e Legibilidade

- Texto principal sobre fundo escuro: usar `#ffffff` com `font-weight: 700`
- Subtítulos sobre fundo escuro: `rgba(255,255,255,.7)` a `rgba(255,255,255,.85)`
- Labels/texto secundário: `rgba(255,255,255,.45)` a `rgba(255,255,255,.6)`
- Texto com destaque de cor: usar `#9e7bb6` para labels, categorias e highlights
- **Nunca usar `opacity` baixo em texto principal** — mínimo 70% de opacidade
- Verificar sempre o contraste antes de exportar (passar o olho humano)

---

## 8. Logo

| Versão | Ficheiro | Usar em |
|---|---|---|
| Marca + wordmark (branca) | `Logo_variation.svg` | Fundos escuros (uso padrão) |
| Ícone isolado (branco) | `logo.svg` | Composições compactas, watermark |

- Altura mínima do logo: 48px
- Nunca distorcer ou esticar o logo
- Sempre com padding suficiente à volta (não encostar às bordas)
- A marca é **dark-first** — fundo preto é o contexto nativo da identidade

---

## 9. Elementos de Destaque (Serviços/Portfolio)

- Usar sempre imagens de alta qualidade para mostrar trabalhos
- Aplicar overlay escuro + glow roxo para destacar visuals de portfolio:
  ```css
  filter: drop-shadow(0 32px 80px rgba(158,123,182,.3)) drop-shadow(0 8px 24px rgba(0,0,0,.5));
  ```
- Elementos visuais de serviço devem ocupar pelo menos 40% da área visual do post
- Posicionar visuals na zona superior/central para criar hierarquia visual

---

## 10. CTA (Call to Action)

- **Botão pill** com gradiente roxo: `background: linear-gradient(135deg, #9e7bb6, #c585b8)`
- Border-radius: `100px` (pill completo)
- Padding: `24–28px` vertical, `48–56px` horizontal
- Box-shadow com glow roxo: `0 8px 36px rgba(158,123,182,.45)`
- Font: Nunito Sans, font-weight 700, cor branca, tamanho ~24–26px
- Sempre incluir seta → no final do texto do botão
- **O botão deve estar sempre completamente visível** — verificar que não é cortado pelo fundo ou pela borda
- CTAs sugeridos: "Falar Connosco →", "Ver Portfolio →", "Começar Projeto →"

---

## 11. Elementos Decorativos (Brand Identity)

- **Bordas/cards com roxo subtil:** `border: 1px solid rgba(158,123,182,.5)`
- **Glow radial roxo** atrás de elementos principais: `rgba(158,123,182,.15)`
- **Pills de categoria:** roxo outline — `border: 1px solid rgba(158,123,182,.5)`, texto `#9e7bb6`
- **Pontos de marca:** `background: #9e7bb6`, `border-radius: 50%`, 4px de diâmetro
- Grain texture subtil: `opacity: .03`, `mix-blend-mode: overlay`
- Gradiente de fundo no marquee/dividers: `rgba(255,255,255,.06)` border top/bottom

---

## 12. Rodapé do Post

- **Apenas o URL** no canto inferior direito: `www.differenttlab.com`
- **Não repetir "differentt lab"** em texto no rodapé (o logo já está presente)
- Cor do rodapé: `rgba(255,255,255,.3)` sobre fundo escuro
- Fonte: Nunito Sans, font-weight 300, letter-spacing: `.08em`

---

## 13. Badge de Serviço / Categoria

- Estilo pill com fundo semi-transparente escuro + blur
- Dot roxo no início: `background: #9e7bb6`
- Borda subtil: `border: 1px solid rgba(158,123,182,.5)`
- Texto: `color: #9e7bb6`, Overpass font-weight 700, letter-spacing `.15em`, uppercase
- Posição: canto superior direito ou acima do headline, dentro da safe zone

---

## 14. Checklist antes de Exportar

- [ ] Texto usa "tu/tua/teu" (não "você/seu/seus")
- [ ] Padding inferior ≥ 64px — botão CTA não cortado
- [ ] Logo visível e na versão correcta para o fundo
- [ ] Headline completamente legível, contraste verificado
- [ ] Contraste de texto verificado visualmente
- [ ] URL no rodapé presente e legível: `www.differenttlab.com`
- [ ] Dimensões exactas: 1080 × 1350 px (ou formato correspondente)
- [ ] Nenhum elemento importante nas bordas (< 56px das margens)
- [ ] Cores dentro da paleta — sem azuis, vermelhos ou tons fora de paleta
