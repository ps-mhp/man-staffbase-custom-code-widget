# Domande frequenti

**Domanda:** Il mio codice viene eseguito anche nell’editor del CMS mentre lo modifico?

Risposta: No. L’esecuzione avviene solo sulla pagina pubblicata e nell’
anteprima. Nell’editor vedrete invece una scheda con le prime righe
del vostro codice. In questo modo, uno script difettoso non può compromettere l’interfaccia
in cui lo state correggendo.

**Domanda:** Nell’editor vedo solo «Nessun codice inserito. Modifica tramite le
impostazioni del widget».

Risposta: Il widget è posizionato, ma è vuoto. Apri le impostazioni del widget e
inserisci il codice nell’editor di codice.

**Domanda:** Il mio script deve agire su un elemento che non è ancora presente.

Risposta: Nel pannello **Codice**, a destra sotto **Esegui**, seleziona «Quando la pagina è stata completamente
caricata». In questo modo lo script attenderà che il contenuto della pagina si sia
stabilizzato.

**Domanda:** Il mio CSS o JavaScript non funziona.

Risposta: Controlla uno per uno: è stato testato nell’**Anteprima** e non
nell’editor? Il pannello **Verifica** segnala un errore? Dopo aver cliccato su
**Applica**, sono state salvate anche le impostazioni del widget? Per JavaScript, apri anche la
console del browser della pagina pubblicata: lì troverai messaggi come
«Il JavaScript presenta un errore di sintassi e non è stato eseguito» o «Il
JavaScript non è stato eseguito correttamente».

**Domanda:** Viene visualizzato un errore di sintassi — posso comunque confermare?

Risposta: Sì, la verifica non blocca nulla. È un avviso, non un blocco.
Il codice JavaScript errato, tuttavia, non verrà nemmeno eseguito sulla pagina.

**Domanda:** Il mio CSS modifica anche altre aree della pagina.

Risposta: È previsto che sia così: il CSS ha validità globale. Chi desidera interessare solo un’area
deve definire il selettore in modo più restrittivo.

**Domanda:** Posso inserire più widget di codice personalizzato in una pagina?

Risposta: Sì. Ciascuno include il proprio CSS, che scompare quando si rimuove quel
widget, senza interferire con gli altri. Tuttavia, non bisogna fare affidamento sull’
ordine di esecuzione degli script —
è meglio raggruppare le dipendenze in un unico widget.

**Domanda:** Perché il mio script non viene rieseguito dopo il salvataggio?

Risposta: Se il codice rimane invariato, non viene rieseguito. Solo una
modifica effettiva al codice riavvia lo script.

**Domanda:** Il mio timer continua a funzionare anche se ho lasciato la pagina.

Risposta: Quando si clicca altrove all’interno dell’app, la pagina non viene ricaricata.
Pertanto, nello script è necessario restituire una funzione di pulizia (vedi «Passo
per passo») che chiuda timer e listener.

**Domanda:** Chi può utilizzare questo widget?

Risposta: Chiunque abbia il permesso di modificare la pagina — e con esso può
modificare la pagina a proprio piacimento. Questo è intenzionale, poiché il motivo più comune è proprio
un elemento che non appartiene al widget stesso. Chi ha l’autorizzazione
è stabilito esclusivamente da Staffbase.
