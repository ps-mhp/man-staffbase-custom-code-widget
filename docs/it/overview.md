# Codice personalizzato

Il widget "Codice personalizzato" è lo strumento ideale per tutto ciò che le funzionalità standard del CMS
non consentono: una formattazione speciale, l'occultamento mirato di un
elemento, una piccola interazione.

**Di per sé non visualizza nulla.** Nella pagina pubblicata è
invisibile e non occupa spazio. Contiene solo il codice che inserite nella
finestra di dialogo di configurazione:

- **CSS** modifica l’aspetto della pagina. Si applica all’**intera pagina**,
  non solo all’area del widget.
- **JavaScript** modifica il comportamento della pagina e può modificarla a piacimento
  .

## Prima di iniziare

Questo widget richiede conoscenze di programmazione. Non esiste alcun controllo che
impedisca a un errore di rendere la pagina inutilizzabile — il widget intercetta
sì gli errori, ma un codice “errato, ma valido” viene comunque eseguito. Chi desidera semplicemente
incorporare un’immagine, una tabella o un articolo, troverà più utile ricorrere agli altri
widget.

Regola generale: verificare prima se il risultato desiderato è ottenibile anche con un
widget standard. Il codice personalizzato è l’ultima risorsa, non la prima.

## Dove viene eseguito il codice

| Posizione | JavaScript | CSS |
| --- | --- | --- |
| Pagina pubblicata | viene eseguito | ha effetto |
| Anteprima | viene eseguito | ha effetto |
| Editor CMS (vista di modifica) | **non** viene eseguito | **non** ha effetto |

Nell’editor, al posto del widget compare solo una scheda con le prime righe
del codice inserito. È intenzionale: altrimenti uno script difettoso
comprometterebbe proprio l’interfaccia che state cercando di correggere. Per
effettuare i test, utilizzate quindi sempre l’**anteprima**.

Per lo stesso motivo, in questa pagina della documentazione **non viene mostrato alcun esempio live**
: altrimenti il codice verrebbe eseguito sulla documentazione anziché sulla vostra pagina.
