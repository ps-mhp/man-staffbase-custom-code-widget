# Impostazioni

La finestra di dialogo di configurazione mostra un campo **Codice** che non va mai modificato manualmente.
Le modifiche vanno apportate nell’editor di codice situato sopra; il pulsante **Modifica codice**
lo riapre, mentre **Fine** applica le modifiche al campo.

## Schede nell’editor di codice

| Scheda | Descrizione |
| --- | --- |
| CSS | Viene inserito nella pagina come foglio di stile e si applica all’**intera pagina**, non solo all’area del widget. Se il widget viene rimosso, anche il CSS scompare. |
| JavaScript | Viene eseguito con accesso a `container` (l’elemento del widget) e a `widgetApi` (l’interfaccia Staffbase). |

## Momento di avvio (“Esegui:”, solo nella scheda JavaScript)

| Valore | Significato |
| --- | --- |
| immediatamente al momento del rendering | Impostazione predefinita. Lo script si avvia non appena appare il widget. Adatto a tutto ciò che non necessita di altri elementi della pagina. |
| quando la pagina è stata caricata completamente | Lo script attende che il contenuto della pagina non subisca più modifiche — per script che modificano elementi caricati successivamente. In ogni caso, l’esecuzione inizia al più tardi dopo 5 secondi. |

Il CSS viene applicato immediatamente in entrambi i casi. È un comportamento intenzionale: in questo modo la pagina
non appare per un istante senza stile.

## Aiuti nell’editor

| Funzione | Descrizione |
| --- | --- |
| Controllo della sintassi | Viene eseguito durante la digitazione. Sotto l’editor compare la dicitura «Nessun errore di sintassi rilevato» oppure la posizione dell’errore con il numero di riga. **Non impedisce il salvataggio**. Per il CSS viene verificata solo la struttura delle parentesi, non ogni singola proprietà. |
| Formattazione | Indenta automaticamente il codice in modo ordinato. |
