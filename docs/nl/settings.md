# Instellingen

Het configuratievenster opent de code-editor in volledig scherm. Het veld
**Code** daarachter wordt nooit handmatig bewerkt; als de editor gesloten is,
opent de knop **Code bewerken** deze opnieuw. **Toepassen** slaat de
huidige status op in het veld, **Annuleren** verwijdert deze (met een bevestigingsvraag als er iets
is gewijzigd). Er wordt pas opgeslagen bij het opslaan van de widgetinstellingen.

## Tabbladen boven het codevenster

| Tabblad | Beschrijving |
| --- | --- |
| CSS | Wordt als stylesheet in de pagina ingevoegd en geldt voor de **hele pagina**, niet alleen voor het widgetgebied. Als de widget wordt verwijderd, verdwijnt ook de CSS weer. |
| JavaScript | Wordt uitgevoerd met toegang tot `container` (het widget-element) en `widgetApi` (de Staffbase-interface). |

Een rood getal bij het tabblad duidt op een fout in deze taal.

## Uitvoeren (paneel „Code“ rechts)

| Keuze | Betekenis |
| --- | --- |
| Direct bij het renderen | Standaardinstelling. Het script start zodra de widget verschijnt. Geschikt voor alles wat geen andere pagina-elementen nodig heeft. |
| Wanneer de pagina volledig is geladen | Het script wacht tot de inhoud van de pagina niet meer verandert — voor scripts die elementen bewerken die pas later worden geladen. Het start in ieder geval uiterlijk na 5 seconden. |

De CSS is in beide gevallen onmiddellijk van kracht. Dit is zo bedoeld: zo verschijnt de pagina
niet even zonder opmaak.

## Hulp in de editor

| Functie | Beschrijving |
| --- | --- |
| Syntaxiscontrole | Wordt uitgevoerd tijdens het typen. Een foutregel is rood gemarkeerd, de melding staat er direct onder. In het paneel **Controle** staat per taal „geen fouten“ of „1 fout in regel …“; **Naar de foutlocatie** springt erheen. De controle **belemmert het opslaan niet**. Bij CSS wordt alleen de haakstructuur gecontroleerd, niet elke eigenschap. |
| Statusbalk | Onder de code: taal, aantal regels, fouten en de positie van de cursor („regel 7, kolom 32“). |
| Opmaak | Zorgt ervoor dat de code van de geselecteerde taal automatisch netjes wordt ingesprongen. Als de code niet leesbaar is, blijft deze ongewijzigd en geeft de statusbalk de reden aan. |
| Ongedaan maken | De pijl bovenaan maakt volledige bewerkingsstappen ongedaan; in de code zelf geldt ⌘/Ctrl Z van de editor. |
| Help | Het vraagteken bovenaan (F1) geeft uitleg over talen, het starttijdstip en de controle. |
