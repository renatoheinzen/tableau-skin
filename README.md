# tableau-skin

Extensões de dashboard do Tableau com a identidade visual da Projedata (Iniflex Smart/Pro). Hospedado via GitHub Pages em `https://renatoheinzen.github.io/tableau-skin/`.

## Extensões

| Extensão | Tipo | Manifesto | O que faz |
|---|---|---|---|
| Projedata KPI Card | worksheet | [`trex/kpi.trex`](trex/kpi.trex) | Card de KPI estilizado (cor de destaque, rótulo, prefixo/sufixo, tamanho, alinhamento configuráveis via clique direito → Formatar extensão) |
| Projedata Gráfico de Barras | worksheet | [`trex/bar-chart.trex`](trex/bar-chart.trex) | Gráfico de barras estilizado (cor de destaque, campos de categoria/valor, orientação vertical/horizontal, ordenação, limite de barras configuráveis via clique direito → Formatar extensão) |
| Projedata Skin | dashboard | [`trex/skin.trex`](trex/skin.trex) | Fundo de dashboard + logo, com tema claro (Iniflex Smart) / escuro (Iniflex Pro) trocável — ver [Tema claro/escuro dinâmico](#tema-claroescuro-dinâmico) abaixo. **Recomendado para novos dashboards.** |
| Projedata Skin Claro *(legado)* | dashboard | [`trex/skin-light.trex`](trex/skin-light.trex) | Fundo de dashboard tema claro fixo. Mantido só para não quebrar dashboards já publicados — use `skin.trex` em projetos novos. |
| Projedata Skin Escuro *(legado)* | dashboard | [`trex/skin-dark.trex`](trex/skin-dark.trex) | Fundo de dashboard tema escuro fixo. Mantido só para não quebrar dashboards já publicados — use `skin.trex` em projetos novos. |

### Tema claro/escuro dinâmico

`skin.trex`, `kpi.trex` e `bar-chart.trex` compartilham um mecanismo de tema (via [`assets/theme.js`](assets/theme.js)) que evita duplicar o workbook pra ter versão clara e escura:

1. Crie no workbook um **parâmetro** chamado exatamente `Projedata Tema`, do tipo string, com os valores `Claro` e `Escuro`.
2. Coloque um controle desse parâmetro no dashboard (ou troque o valor via ação de parâmetro num botão/imagem) — ao mudar o valor, a skin troca de fundo/logo e o KPI Card / Gráfico de Barras trocam a cor do texto para variantes com contraste adequado sobre fundo escuro, tudo em tempo real, sem duplicar planilhas nem dashboards.
3. Se o workbook não tiver esse parâmetro, cada extensão usa um tema padrão fixo: a skin usa o que for salvo em **Formatar extensão** (`Claro` por padrão); KPI Card e Gráfico de Barras continuam com as cores pensadas para fundo claro.

Não é preciso empilhar duas extensões de skin nem usar Visibilidade Dinâmica de Zona — a `skin.trex` já resolve isso sozinha lendo o parâmetro.

### Como instalar num workbook

1. Baixe o `.trex` da extensão desejada (arquivos em [`trex/`](trex/)).
2. No Tableau Desktop, arraste um objeto **Extensão** para o dashboard e selecione o `.trex` baixado.
3. Para as Skins, converta o container de layout raiz do dashboard para **Flutuante** e envie a extensão para trás (**Organizar → Enviar para trás**) — objetos flutuantes nunca ficam atrás de conteúdo lado a lado, então o container precisa ser flutuante também.
4. Publique o workbook. Se o Tableau Server/Cloud bloquear a extensão, adicione `https://renatoheinzen.github.io` (com e sem `https://`) na lista de extensões permitidas do site.

## Estrutura do projeto

```
html/     páginas das extensões (a lógica em si)
trex/     manifestos .trex que o Tableau carrega
assets/   imagens e CSS compartilhados entre as extensões
```

- `assets/tokens.css` centraliza a paleta de cores da marca (`--azul`, `--azul-escuro`, `--laranja`, `--amarelo`, `--cinza`, `--cinza-claro`, `--preto`, `--branco`). Qualquer nova extensão HTML deve referenciar esse arquivo em vez de redeclarar as cores.
  - `--amarelo` não é usado como cor de *texto* em nenhuma extensão (contraste ~1.8:1 sobre fundo claro, abaixo do mínimo WCAG AA de 3:1 mesmo pra texto grande) — só serve como cor de preenchimento/destaque (ex: barra do gráfico).
- `assets/theme.js` expõe `ProjedataTheme.watchTheme(onChange)`, usado pelas extensões pra reagir ao parâmetro `Projedata Tema` do workbook (ver [Tema claro/escuro dinâmico](#tema-claroescuro-dinâmico)).
- Imagens (`assets/*.png`, `assets/*.jpg`) são sempre carregadas com `fetch(url, { cache: 'no-store' })` + `URL.createObjectURL()` nas páginas HTML, para evitar cache de navegador sem precisar de query strings de versão (`?v=`).

## Desenvolvimento local

Sem build step — é HTML/CSS/JS puro. Para testar uma página fora do Tableau, sirva a pasta com qualquer servidor estático (ex: `python3 -m http.server`) e abra a página em `html/`; sem `window.tableau`, as extensões mostram um erro de inicialização esperado mas o restante do layout/estilo pode ser conferido normalmente.
