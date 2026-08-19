# Perguntas Frequentes

**Pergunta:** O meu código também é executado no editor do CMS enquanto o estou a editar?

Resposta: Não. A execução só ocorre na página publicada e na
pré-visualização. No editor, verá, em vez disso, um cartão com as primeiras linhas
do seu código. Desta forma, um script com erros não pode danificar a interface
na qual o está a corrigir.

**Pergunta:** No editor, só vejo «Ainda não foi introduzido nenhum código. Edite através das
configurações do widget.»

Resposta: O widget está colocado, mas vazio. Abra as definições do widget e
introduza o código no editor de código.

**Pergunta:** O meu script deve interagir com um elemento que ainda nem sequer existe.

Resposta: No separador JavaScript, em **Executar:**, altera para «quando a página estiver totalmente
carregada». Assim, o script aguarda até que o conteúdo da página esteja
estável.

**Pergunta:** O meu CSS ou JavaScript não funciona.

Resposta: Verifique o seguinte, por ordem: Foi testado na **Pré-visualização** e não
no editor? Aparece alguma mensagem de erro por baixo do editor? Após clicar em **Concluído**,
as definições do widget foram também guardadas? No caso do JavaScript, abra também a
consola do navegador da página publicada — aí encontrará mensagens como
«O JavaScript tem um erro de sintaxe e não foi executado» ou «O
JavaScript falhou na execução».

**Pergunta:** É exibido um erro de sintaxe — posso guardar na mesma?

Resposta: Sim, a verificação não bloqueia nada. É apenas um aviso, não um bloqueio.
No entanto, o JavaScript com erros nem sequer será executado na página.

**Pergunta:** O meu CSS também altera outras áreas da página.

Resposta: É assim que deve ser — o CSS aplica-se globalmente. Quem pretender afetar apenas uma área
deve definir o seletor de forma mais restrita.

**Pergunta:** Posso colocar vários widgets de código personalizado numa página?

Resposta: Sim. Cada um traz o seu próprio CSS, que desaparece quando esse
widget é removido, sem afetar os outros. No entanto, não se deve confiar na
ordem de execução dos scripts —
é melhor colocar as dependências num único widget.

**Pergunta:** Por que razão o meu script não é executado novamente após guardar?

Resposta: Se o código não for alterado, não é executado novamente. Só uma
alteração efetiva no código reinicia o script.

**Pergunta:** O meu temporizador continua a funcionar, apesar de eu ter saído da página.

Resposta: Ao clicar noutras páginas dentro da aplicação, a página não é recarregada.
Por isso, no script, deve-se devolver uma função de limpeza (ver «Passo
a passo») que encerre o temporizador e o ouvinte.

**Pergunta:** Quem pode utilizar este widget?

Resposta: Qualquer pessoa com permissão para editar a página — e essa pessoa pode, com isso,
alterar a página como quiser. Isto é intencional, pois o motivo habitual é precisamente
um elemento que não pertence ao próprio widget. Quem tem a autorização
é determinado exclusivamente pela Staffbase.
