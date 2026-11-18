# Impostazioni

La finestra di dialogo di configurazione apre l'editor di codice a schermo intero. Il campo
**Codice** che si trova dietro non va mai modificato manualmente; se l'editor è chiuso,
il pulsante **Modifica codice** lo riapre. **Applica** salva lo
stato attuale nel campo, **Annulla** lo scarta (con una richiesta di conferma se è stato
modificato qualcosa). Il salvataggio avviene solo con le impostazioni del widget.

## Schede sopra l’area del codice

| Scheda | Descrizione |
| --- | --- |
| CSS | Viene inserito nella pagina come foglio di stile e si applica all’**intera pagina**, non solo all’area del widget. Se il widget viene rimosso, anche il CSS scompare. |
| JavaScript | Viene eseguito con accesso a `container` (l’elemento del widget) e a `widgetApi` (l’interfaccia di Staffbase). |

Un numero rosso sulla scheda indica un errore in quel linguaggio.

## Esecuzione (pannello «Codice» a destra)

| Opzione | Significato |
| --- | --- |
| Immediatamente al momento del rendering | Impostazione predefinita. Lo script si avvia non appena appare il widget. Adatto a tutto ciò che non necessita di altri elementi della pagina. |
| Quando la pagina è stata caricata completamente | Lo script attende che il contenuto della pagina non subisca più modifiche — per script che modificano elementi caricati in un secondo momento. In ogni caso, si avvia al più tardi dopo 5 secondi. |

Il CSS viene applicato immediatamente in entrambi i casi. Questo è intenzionale: in questo modo la pagina
non appare per un attimo senza stile.

## Aiuti nell’editor

| Funzione | Descrizione |
| --- | --- |
| Controllo della sintassi | Viene eseguito durante la digitazione. Una riga con errore è evidenziata in rosso, con il messaggio direttamente sotto. Nel pannello **Controllo** compare, a seconda del linguaggio, «nessun errore» o «1 errore nella riga …»; **Vai al punto dell’errore**. La verifica **non blocca il salvataggio**. Per il CSS viene controllata solo la struttura delle parentesi, non ogni singola proprietà. |
| Barra di stato | Sotto il codice: linguaggio, numero di righe, errori e posizione del cursore (“Riga 7, colonna 32”). |
| Formattazione | Indenta automaticamente il codice del linguaggio selezionato in modo ordinato. Se il codice risulta illeggibile, rimane invariato e la riga di stato ne indica il motivo. |
| Annulla | La freccia nell’intestazione annulla intere operazioni di modifica; nel codice stesso si utilizza ⌘/Ctrl Z dell’editor. |
| Aiuto | Il punto interrogativo nell’intestazione (F1) fornisce spiegazioni su linguaggi, ora di avvio e verifica. |
