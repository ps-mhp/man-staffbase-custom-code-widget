# Definições

A caixa de diálogo de configuração apresenta um campo **Código**, que nunca é editado manualmente.
A edição é feita no editor de código situado acima; o botão **Editar código**
abre-o novamente, e **Concluído** aplica o estado atual ao campo.

## Separadores no editor de código

| Separador | Descrição |
| --- | --- |
| CSS | É inserido na página como uma folha de estilo e aplica-se a **toda a página**, não apenas à área do widget. Se o widget for removido, o CSS também desaparece. |
| JavaScript | Executa-se com acesso a `container` (o elemento do widget) e a `widgetApi` (a interface da Staffbase). |

## Momento de início («Executar:», apenas no separador JavaScript)

| Valor | Significado |
| --- | --- |
| imediatamente após a renderização | Predefinição. O script inicia assim que o widget aparece. Adequado para tudo o que não necessite de outros elementos da página. |
| quando a página estiver totalmente carregada | O script aguarda até que o conteúdo da página deixe de sofrer alterações — para scripts que manipulam elementos que só são carregados posteriormente. Em qualquer caso, inicia-se o mais tardar após 5 segundos. |

O CSS aplica-se imediatamente em ambos os casos. Isto é intencional: assim, a página
não aparece brevemente sem estilo.

## Ajuda no editor

| Função | Descrição |
| --- | --- |
| Verificação de sintaxe | Executa-se à medida que se escreve. Por baixo do editor aparece «Não foram encontrados erros de sintaxe» ou a localização do erro com o número da linha. Isso **não impede o salvamento**. No caso do CSS, apenas é verificada a estrutura das chaves, não cada propriedade. |
| Formatação | Indenta automaticamente o código de forma organizada. |
