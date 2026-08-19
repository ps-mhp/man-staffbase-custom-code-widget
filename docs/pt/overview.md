# Código personalizado

O widget de código personalizado é a ferramenta ideal para tudo aquilo que as funcionalidades padrão do CMS
não permitem: uma formatação especial, a ocultação específica de um
elemento, uma pequena interação.

**Por si só, não exibe nada.** Na página publicada, é
invisível e não ocupa espaço. Apenas contém o código que definir na
caixa de diálogo de configuração:

- **CSS** altera o aspeto da página. Aplica-se a **toda a página**,
  não apenas à área do widget.
- **JavaScript** altera o comportamento da página e pode
  remodelá-la à vontade.

## Antes de começar

Este widget requer conhecimentos de programação. Não existe qualquer verificação que
impeda que um erro torne a página inutilizável — embora o widget
detete erros, um código «errado, mas válido» continua a funcionar. Quem pretenda apenas
incorporar uma imagem, uma tabela ou um artigo, ficará melhor servido com os outros
widgets.

Regra geral: verifique primeiro se o resultado pretendido também é possível com um
widget normal. O código personalizado é o último recurso, não o primeiro.

## Onde o código é executado

| Local | JavaScript | CSS |
| --- | --- | --- |
| Página publicada | é executado | tem efeito |
| Pré-visualização | é executado | tem efeito |
| Editor do CMS (vista de edição) | **não** é executado | **não** tem efeito |

No editor, no local do widget, aparece apenas um mapa com as primeiras linhas
do código armazenado. Isto é intencional: caso contrário, um script com erros
destruiria precisamente a interface que está a tentar reparar. Por isso,
para testar, utilize sempre a **pré-visualização**.

Nesta página de documentação, pela mesma razão, **não é apresentado nenhum exemplo ao vivo**
— caso contrário, o código seria executado na documentação em vez de na sua página.
