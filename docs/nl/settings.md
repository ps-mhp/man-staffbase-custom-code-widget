# Instellingen

Het configuratievenster bevat een veld **Code** dat nooit handmatig wordt bewerkt.
Het bewerken gebeurt in de code-editor erboven; de knop **Code bewerken**
opent deze opnieuw, **Klaar** neemt de status over in het veld.

## Tabbladen in de code-editor

| Tabblad | Beschrijving |
| --- | --- |
| CSS | Wordt als stylesheet in de pagina ingevoegd en geldt voor de **hele pagina**, niet alleen voor het widgetgebied. Als de widget wordt verwijderd, verdwijnt ook de CSS weer. |
| JavaScript | Wordt uitgevoerd met toegang tot `container` (het widget-element) en `widgetApi` (de Staffbase-interface). |

## Starttijdstip („Uitvoeren:”, alleen in het tabblad JavaScript)

| Waarde | Betekenis |
| --- | --- |
| onmiddellijk bij het renderen | Standaardinstelling. Het script start zodra de widget verschijnt. Geschikt voor alles wat geen andere pagina-elementen nodig heeft. |
| wanneer de pagina volledig is geladen | Het script wacht tot de inhoud van de pagina niet meer verandert — voor scripts die elementen bewerken die pas later worden geladen. Het start in ieder geval uiterlijk na 5 seconden. |

De CSS is in beide gevallen onmiddellijk van kracht. Dit is zo bedoeld: zo verschijnt de pagina
niet even zonder opmaak.

## Hulp in de editor

| Functie | Beschrijving |
| --- | --- |
| Syntaxiscontrole | Wordt uitgevoerd tijdens het typen. Onder de editor staat „Geen syntaxfouten gevonden“ of de foutlocatie met regelnummer. Dit **belemmert het opslaan niet**. Bij CSS wordt alleen de haakstructuur gecontroleerd, niet elke eigenschap. |
| Opmaak | Zorgt automatisch voor een nette inspringing van de code. |
