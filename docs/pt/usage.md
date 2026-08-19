# Passo a passo

## Definir o próprio CSS

1. Colocar o widget **Código personalizado** na página — a posição
   não importa, porque é invisível. Recomendação: colocar bem no fundo, para que não
   atrapalhe durante a edição.
2. Abra as definições do widget. O editor de código aparece; se estiver
   fechado, o botão **Editar código** volta a abri-lo.
3. Selecione o separador **CSS** e introduza as regras.
4. Verifique a mensagem abaixo do editor: se estiver escrito «Não foram encontrados erros de sintaxe
», a estrutura está correta.
5. Clique em **Concluído** e guarde as definições do widget.
6. Verifique o resultado na **Pré-visualização** — o CSS não tem efeito no editor.

## Inserir JavaScript próprio

1. Abra as definições do widget e, no editor de código, selecione o separador **JavaScript**
  .
2. Introduza o código. Estão disponíveis `container` (o elemento do
  widget na página) e `widgetApi` (a interface da Staffbase).
3. Em **Executar:** selecione o momento de início — predefinição «imediatamente ao
   renderizar»; para scripts que alteram elementos existentes na página, «quando a
   página estiver totalmente carregada».
4. Opcionalmente, clique em **Formatar**; o código será automaticamente
   indentado de forma organizada.
5. Verifique a mensagem abaixo do editor, clique em **Concluído** e guarde as
   definições do widget.
6. Verifique o resultado na **Pré-visualização**. Se nada acontecer, abra a consola do navegador
   — os erros de execução são registados aí.

## Não se esqueça de limpar

Tudo o que continuar em execução — temporizadores, ouvintes de eventos, observadores — tem de ser encerrado
assim que o widget desaparecer. Caso contrário, continuará a funcionar ao clicar noutro local
da aplicação, porque a página não é recarregada nesse momento.

1. No script, guarde o elemento em execução numa variável.
2. No final, devolva uma função que o elimine:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Esta função é chamada automaticamente quando o widget é removido.

## Se algo correr mal

1. Abra o separador com o código com erros e leia a mensagem abaixo do
   editor — ela indica o número da linha.
2. Se isso não ajudar, copie o conteúdo do campo
   e esvazie o código, depois clique em **Concluído** e guarde.
3. Verifique se a página volta a funcionar normalmente e, em seguida,
   volte a inserir o código, parte por parte.
