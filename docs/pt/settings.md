# Definições

A caixa de diálogo de configuração abre o editor de código em ecrã inteiro. O campo
**Código** que se encontra a seguir nunca é editado manualmente; se o editor estiver fechado,
o botão **Editar código** volta a abri-lo. **Aplicar** guarda o
conteúdo no campo, **Cancelar** descarta-o (com uma mensagem de confirmação, caso algo
tenha sido alterado). A gravação só ocorre com as definições do widget.

## Separadores acima da área de código

| Separador | Descrição |
| --- | --- |
| CSS | É inserido na página como uma folha de estilo e aplica-se a **toda a página**, não apenas à área do widget. Se o widget for removido, o CSS também desaparece. |
| JavaScript | Executa-se com acesso a `container` (o elemento do widget) e a `widgetApi` (a interface da Staffbase). |

Um número vermelho na separadora indica um erro nesta linguagem.

## Executar (painel «Código» à direita)

| Opção | Significado |
| --- | --- |
| Imediatamente ao renderizar | Predefinição. O script inicia assim que o widget aparece. Adequado para tudo o que não necessite de outros elementos da página. |
| Quando a página estiver totalmente carregada | O script aguarda até que o conteúdo da página deixe de sofrer alterações — para scripts que manipulam elementos que só são carregados posteriormente. Em qualquer caso, inicia-se o mais tardar após 5 segundos. |

O CSS aplica-se imediatamente em ambos os casos. Isto é intencional: assim, a página
não aparece brevemente sem estilo.

## Ajuda no editor

| Função | Descrição |
| --- | --- |
| Verificação de sintaxe | É executada à medida que se escreve. Uma linha com erro é destacada a vermelho, com a mensagem diretamente abaixo. No painel **Verificação**, aparece, consoante a linguagem, «sem erros» ou «1 erro na linha …»; clica em **Ir para o local do erro** para aceder ao local. A verificação **não impede a aplicação das alterações**. No caso do CSS, apenas é verificada a estrutura das chaves, não cada propriedade. |
| Barra de estado | Abaixo do código: linguagem, número de linhas, erros e a posição do cursor («Linha 7, coluna 32»). |
| Formatação | Indenta automaticamente o código da linguagem selecionada de forma organizada. Se não for legível, permanece inalterado e a barra de estado indica o motivo. |
| Desfazer | A seta no cabeçalho desfaz todas as etapas de edição; no próprio código, aplica-se ⌘/Ctrl Z do editor. |
| Ajuda | O ponto de interrogação na parte superior (F1) explica as linguagens, o momento de início e a verificação. |
