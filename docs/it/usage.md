# Passo dopo passo

## Inserire il proprio CSS

1. Posizionare il widget **Codice personalizzato** sulla pagina — la posizione non ha
   importanza, poiché è invisibile. Consiglio: in fondo alla pagina, in modo che non
   dia fastidio durante la modifica.
2. Aprire le impostazioni del widget. Apparirà l’editor di codice; se è
   chiuso, il pulsante **Modifica codice** lo riaprirà.
3. Selezionare la scheda **CSS** e inserire le regole.
4. Controllare il messaggio sotto l’editor: se c’è scritto «Nessun errore di sintassi
   trovato», la struttura è corretta.
5. Fare clic su **Fine** e salvare le impostazioni del widget.
6. Verificare il risultato nell’**anteprima** — nell’editor il CSS non ha effetto.

## Inserire il proprio codice JavaScript

1. Aprire le impostazioni del widget e selezionare la scheda **JavaScript**
   nell’editor di codice.
2. Inserire il codice. Sono disponibili `container` (l’elemento del
   widget sulla pagina) e `widgetApi` (l’interfaccia di Staffbase).
3. In **Esegui:** selezionare il momento di avvio — impostazione predefinita «subito al
   rendering»; per gli script che modificano elementi esistenti della pagina, «quando la
   pagina è stata caricata completamente».
4. Facoltativamente, clicca su **Formatta**; il codice verrà automaticamente
   indentato in modo ordinato.
5. Controlla il messaggio sotto l’editor, clicca su **Fine** e salva le
   impostazioni del widget.
6. Verifica il risultato nell’**Anteprima**. Se non succede nulla, aprire la console del browser
   — gli errori di runtime vengono registrati lì.

## Non dimenticare di ripulire

Tutto ciò che continua a funzionare — timer, listener di eventi, osservatori — deve essere terminato
non appena il widget scompare. Altrimenti continuerà a funzionare quando si continua a cliccare
nell’app, poiché la pagina non viene ricaricata.

1. Nello script, memorizzare l’elemento in esecuzione in una variabile.
2. Alla fine, restituire una funzione che lo elimini:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Questa funzione viene chiamata automaticamente quando il widget viene rimosso.

## Se qualcosa va storto

1. Aprire la scheda con il codice errato e leggere il messaggio sotto l’
   editor: indica il numero di riga.
2. Se ciò non basta, copia il contenuto del campo
   e svuota il codice, quindi seleziona **Fine** e salva.
3. Verifica se la pagina funziona di nuovo normalmente, quindi reinserisci il codice
   un pezzo alla volta.
