# Passo dopo passo

## Inserire il proprio CSS

1. Posizionare il widget **Codice personalizzato** sulla pagina — la posizione non ha
   importanza, poiché è invisibile. Consiglio: in fondo alla pagina, in modo che non
   dia fastidio durante la modifica.
2. Aprire le impostazioni del widget. L’editor di codice appare a schermo intero;
   se è chiuso, il pulsante **Modifica codice** lo riporta in primo piano.
3. Selezionare la scheda **CSS** e inserire le regole.
4. Controllare la barra di stato sotto il codice: se c’è scritto «Nessun errore», la
   struttura è corretta.
5. Cliccare in alto a destra su **Applica** e salvare le impostazioni del widget
  .
6. Verificare il risultato nell’**Anteprima** — nell’editor il CSS non ha effetto.

## Inserire il proprio codice JavaScript

1. Aprire le impostazioni del widget e selezionare la scheda **JavaScript**
   nell’editor di codice.
2. Inserire il codice. Sono disponibili `container` (l’elemento del
   widget sulla pagina) e `widgetApi` (l’interfaccia di Staffbase).
3. Nel pannello **Codice**, a destra sotto **Esegui**, selezionare il momento di avvio —
   impostazione predefinita “Subito al momento del rendering”; per gli script che modificano
   elementi esistenti della pagina, “Quando la pagina è stata caricata completamente”.
4. Facoltativamente, fare clic su **Formatta**; il codice verrà automaticamente
   indentato in modo ordinato.
5. Nel pannello sotto **Verifica** controllare che entrambi i linguaggi non segnalino «errori»,
   cliccare su **Applica** e salvare le impostazioni del widget.
6. Verificare il risultato nell’**Anteprima**. Se non succede nulla, aprire la console del browser
   — gli errori di runtime vengono registrati lì.

## Non dimenticare di ripulire

Tutto ciò che continua a funzionare — timer, listener di eventi, osservatori — deve essere terminato
non appena il widget scompare. Altrimenti continuerà a funzionare quando si clicca altrove
nell’app, poiché la pagina non viene ricaricata.

1. Nello script, memorizzare l’elemento in esecuzione in una variabile.
2. Alla fine, restituire una funzione che lo elimini:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Questa funzione viene chiamata automaticamente quando il widget viene rimosso.

## Se qualcosa va storto

1. Nel pannello **Codice**, clicca su **Vai al punto dell’errore**: l’editor passerà alla
   scheda con l’errore e salterà alla riga; il messaggio si trova proprio
   sotto. Un numero rosso sulla scheda indica quale linguaggio è interessato.
2. Se ciò non basta, copiare il codice (salvarlo temporaneamente) e svuotare il campo,
   quindi fare clic su **Applica** e salvare.
3. Verificare se la pagina funziona nuovamente correttamente, quindi reinserire il codice
   un pezzo alla volta.
