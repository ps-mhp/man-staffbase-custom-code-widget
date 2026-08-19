# Perguntas Frequentes

**Pergunta:** O meu código também é executado no editor do CMS enquanto o estou a editar?

Resposta: Não. A execução só ocorre na página publicada e na
pré-visualização. Na vista de edição, aparece, em vez disso, um cartão com as
primeiras linhas do código introduzido — caso contrário, um script com erros
danificaria a interface onde se pretende corrigi-lo.

**Pergunta:** Quem pode inserir este widget numa página?

Resposta: Quem tiver a autorização na Staffbase para editar a página pode
alterá-la à vontade através deste widget — isto é intencional, pois o
motivo habitual é precisamente um elemento que não pertence ao próprio widget.
A autorização para tal é regulada exclusivamente pelo Staffbase, não pelo widget.

**Pergunta:** O meu script deve alterar um elemento que ainda nem sequer
existe — o que fazer?

Resposta: No separador JavaScript, altere o momento de início para «Quando a página estiver totalmente
carregada». Desta forma, o script aguarda até que o conteúdo da página esteja
estabilizado, em vez de ser executado imediatamente durante a renderização do widget.

**Pergunta:** O meu CSS ou JavaScript desaparece de repente?

Resposta: Um erro de sintaxe não impede o guardamento, mas é apresentado em texto
simples por baixo do editor — verifique a mensagem antes de fechar a caixa de diálogo.
No caso de erros de JavaScript em tempo de execução, vale a pena dar uma vista de olhos
na consola do navegador da página publicada.
