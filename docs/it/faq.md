# Domande frequenti

**Domanda:** Il mio codice viene eseguito anche nell'editor del CMS mentre lo sto modificando?

Risposta: No. L’esecuzione avviene solo sulla pagina pubblicata e nell’
anteprima. Nella vista di modifica viene invece visualizzata una scheda con le
prime righe del codice inserito — altrimenti uno script errato
comprometterebbe l’interfaccia in cui si sta cercando di correggerlo.

**Domanda:** Chi può inserire questo widget in una pagina?

Risposta: Chiunque disponga dell’autorizzazione Staffbase per modificare la pagina può
modificarla a proprio piacimento tramite questo widget — questo è voluto, poiché il
motivo più comune è proprio un elemento che non appartiene al widget stesso.
L’autorizzazione a farlo è regolata esclusivamente da Staffbase, non dal widget.

**Domanda:** Il mio script deve intervenire su un elemento che però non è ancora presente
— cosa fare?

Risposta: Nella scheda JavaScript, imposta il momento di avvio su «Quando la pagina è stata caricata
completamente». In questo modo lo script attende che il contenuto della pagina si sia
stabilizzato, invece di essere eseguito immediatamente durante il rendering del widget.

**Domanda:** Il mio CSS o JavaScript scompare improvvisamente?

Risposta: Un errore di sintassi non impedisce il salvataggio, ma viene visualizzato in
testo chiaro sotto l’editor — controlla il messaggio prima di chiudere la finestra di dialogo.
In caso di errori JavaScript in fase di esecuzione, vale la pena dare un’occhiata anche alla
console del browser della pagina pubblicata.
