# tableau-skin

Extensões de dashboard do Tableau com a identidade visual da Projedata (Iniflex Smart/Pro). Hospedado via GitHub Pages em `https://renatoheinzen.github.io/tableau-skin/`.

## Extensões

| Extensão | Tipo | Manifesto | O que faz |
|---|---|---|---|
| Projedata KPI Card | worksheet | [`trex/kpi.trex`](trex/kpi.trex) | Card de KPI estilizado (cor de destaque, rótulo, prefixo/sufixo, tamanho, alinhamento configuráveis via clique direito → Formatar extensão) |
| Projedata Gráfico de Barras | worksheet | [`trex/bar-chart.trex`](trex/bar-chart.trex) | Gráfico de barras estilizado (cor de destaque, campos de categoria/valor, orientação vertical/horizontal, ordenação, limite de barras configuráveis via clique direito → Formatar extensão) |
| Projedata Gráfico de Pizza | worksheet | [`trex/pie-chart.trex`](trex/pie-chart.trex) | Gráfico de pizza/donut com a paleta de série da marca |
| Projedata Gráfico de Linha | worksheet | [`trex/line-chart.trex`](trex/line-chart.trex) | Gráfico de linha estilizado |
| Projedata Anel de Proporção | worksheet | [`trex/ring-chart.trex`](trex/ring-chart.trex) | Anéis de proporção por categoria |
| Projedata Lista Ranqueada | worksheet | [`trex/rank-list.trex`](trex/rank-list.trex) | Lista Top N ranqueada, com sparkline (linha/área/barras) por período e barra proporcional opcionais |
| Projedata Matriz de Calor | worksheet | [`trex/heatmap-matrix.trex`](trex/heatmap-matrix.trex) | Matriz de calor (linha × coluna) |
| Projedata Lista de Cards | worksheet | [`trex/card-list.trex`](trex/card-list.trex) | Lista de cards |
| Projedata Treemap | worksheet | [`trex/treemap.trex`](trex/treemap.trex) | Treemap (área proporcional ao valor, cor por intensidade de outra medida ou por série, agrupamento opcional) |
| Projedata Cascata | worksheet | [`trex/waterfall.trex`](trex/waterfall.trex) | Gráfico em cascata (bridge): valor inicial, variações positivas/negativas e total final, com eixo ajustável |
| Projedata Perfil com Estrelas | worksheet | [`trex/rating-list.trex`](trex/rating-list.trex) | Lista de atributos com nota em estrelas (inteiras, meias ou parciais) e classificação em texto |
| Projedata Mini-gráficos por Coorte | worksheet | [`trex/small-multiples.trex`](trex/small-multiples.trex) | Um mini-gráfico (linha, área ou barras) por coorte, com eixos compartilhados — CLV e churn por coorte |
| Projedata Tabela de Mini-gráficos | worksheet | [`trex/metric-table.trex`](trex/metric-table.trex) | Tabela com uma linha por categoria e até 4 medidas lado a lado (barra, ponto ou valor) com sparkline opcional |
| Projedata Faixa Lateral | dashboard | [`trex/sidebar-nav.trex`](trex/sidebar-nav.trex) | Navegação em faixa lateral |
| Projedata Cabeçalho com Abas | dashboard | [`trex/header-tabs.trex`](trex/header-tabs.trex) | Cabeçalho com abas de navegação |
| Projedata Painel de Seção | dashboard | [`trex/panel.trex`](trex/panel.trex) | Painel de fundo para agrupar uma seção |
| Projedata Skin Iniflex Pro (escuro) | dashboard | [`trex/skin-pro.trex`](trex/skin-pro.trex) | Fundo de dashboard no tema "Iniflex Pro (escuro)" gerado pelo Skin Builder |
| Projedata Skin Claro | dashboard | [`trex/skin-light.trex`](trex/skin-light.trex) | Fundo de dashboard tema claro (Iniflex Smart) + logo |
| Projedata Skin Escuro | dashboard | [`trex/skin-dark.trex`](trex/skin-dark.trex) | Fundo de dashboard tema escuro (Iniflex Pro) + logo |

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
- Imagens (`assets/*.png`, `assets/*.jpg`) são sempre carregadas com `fetch(url, { cache: 'no-store' })` + `URL.createObjectURL()` nas páginas HTML, para evitar cache de navegador sem precisar de query strings de versão (`?v=`).

## Desenvolvimento local

Sem build step — é HTML/CSS/JS puro. Para testar uma página fora do Tableau, sirva a pasta com qualquer servidor estático (ex: `python3 -m http.server`) e abra a página em `html/`; sem `window.tableau`, as extensões mostram um erro de inicialização esperado mas o restante do layout/estilo pode ser conferido normalmente.
