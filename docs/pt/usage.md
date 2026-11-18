# Passo a passo

## Definir o seu próprio CSS

1. Coloque o widget **Código personalizado** na página — a posição
   não importa, porque é invisível. Recomendação: coloque-o bem no fundo, para que não
   atrapalhe durante a edição.
2. Abra as definições do widget. O editor de código aparece em ecrã inteiro;
   se estiver fechado, o botão **Editar código** volta a abri-lo.
3. Selecione o separador **CSS** e introduza as regras.
4. Verifique a barra de estado por baixo do código: se aparecer «Sem erros», a
   estrutura está correta.
5. Clique em **Aplicar** no canto superior direito e guarde as definições do widget
  .
6. Verifique o resultado na **Pré-visualização** — o CSS não funciona no editor.

## Inserir o seu próprio JavaScript

1. Abra as definições do widget e, no editor de código, selecione o separador **JavaScript**
  .
2. Introduza o código. Estão disponíveis `container` (o elemento do
   widget na página) e `widgetApi` (a interface da Staffbase).
3. No painel **Código**, à direita, em **Executar**, selecione o momento de início —
   predefinição «Imediatamente ao renderizar»; para scripts que alteram
   elementos existentes da página, «Quando a página estiver totalmente carregada».
4. Opcionalmente, clique em **Formatar**; o código será automaticamente
   indentado de forma organizada.
5. No painel, em **Verificação**, verifique se ambas as linguagens indicam «sem erros»
  , clique em **Aplicar** e guarde as definições do widget.
6. Verifique o resultado na **Pré-visualização**. Se nada acontecer, abra a consola do navegador
   — os erros de execução são registados aí.

## Não se esqueça de limpar

Tudo o que continuar em execução — temporizadores, ouvintes de eventos, observadores — deve ser encerrado
assim que o widget desaparecer. Caso contrário, continuará a funcionar ao clicar noutras partes
da aplicação, porque a página não é recarregada nesse momento.

1. No script, registe o elemento em execução numa variável.
2. No final, devolva uma função que o elimine:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Esta função é chamada automaticamente quando o widget é removido.

## Se algo correr mal

1. No painel **Código**, clicar em **Ir para o local do erro** — o editor muda para
   o separador com o erro e salta para a linha; a mensagem aparece diretamente
   abaixo. Um número vermelho no separador indica qual a linguagem afetada.
2. Se isso não ajudar, copie o código para a área de transferência e esvazie-a,
   depois clique em **Aplicar** e guarde.
3. Verifique se a página volta a funcionar normalmente e, em seguida,
   insira o código novamente, parte por parte.
