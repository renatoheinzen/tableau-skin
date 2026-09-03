# tableau-skin

Extensões de dashboard do Tableau com a identidade visual da Projedata (Iniflex Smart/Pro). Hospedado via GitHub Pages em `https://renatoheinzen.github.io/tableau-skin/`.

## Extensões

| Extensão | Tipo | Manifesto | O que faz |
|---|---|---|---|
| Projedata KPI Card | worksheet | [`trex/kpi.trex`](trex/kpi.trex) | Card de KPI estilizado (cor de destaque, rótulo, prefixo/sufixo, tamanho, alinhamento configuráveis via clique direito → Formatar extensão) |
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
