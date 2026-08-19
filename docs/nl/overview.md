# Aangepaste code

De widget voor aangepaste code is het hulpmiddel voor alles wat de standaardfuncties van het CMS
niet bieden: een speciale opmaak, het gericht verbergen van een
element, een kleine interactie.

**Het geeft zelf niets weer.** Op de gepubliceerde pagina is het
onzichtbaar en neemt het geen ruimte in beslag. Het bevat alleen de code die u in
het configuratievenster invoert:

- **CSS** verandert het uiterlijk van de pagina. Dit geldt voor de **hele pagina**,
  niet alleen voor het gebied van de widget.
- **JavaScript** verandert het gedrag van de pagina en kan deze naar believen
  aanpassen.

## Voordat u aan de slag gaat

Voor deze widget is programmeerkennis vereist. Er is geen controle die
voorkomt dat een fout de pagina onbruikbaar maakt — de widget vangt
weliswaar fouten op, maar een „verkeerde, maar geldige“ code werkt toch. Wie alleen een
afbeelding, een tabel of een bericht wil insluiten, is beter af met de andere
widgets.

Vuistregel: controleer eerst of het gewenste resultaat ook met een
gewone widget te bereiken is. Aangepaste code is het laatste redmiddel, niet het eerste.

## Waar de code wordt uitgevoerd

| Locatie | JavaScript | CSS |
| --- | --- | --- |
| Gepubliceerde pagina | draait | werkt |
| Voorbeeld | draait | werkt |
| CMS-editor (bewerkingsweergave) | draait **niet** | werkt **niet** |

In de editor staat op de plaats van de widget alleen een kaart met de eerste regels
van de opgeslagen code. Dat is met opzet: een foutief script zou anders
juist de interface kapotmaken waarin u het op dat moment wilt repareren. Gebruik dus
altijd de **voorbeeldweergave** om te testen.

Om dezelfde reden wordt op deze documentatiepagina **geen live-voorbeeld**
getoond — de code zou anders de documentatie verstoren in plaats van uw pagina.
