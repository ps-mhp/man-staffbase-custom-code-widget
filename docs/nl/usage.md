# Stap voor stap

## Eigen CSS instellen

1. Plaats de widget **Aangepaste code** op de pagina — de positie maakt
   niet uit, omdat deze onzichtbaar is. Aanbeveling: helemaal onderaan, zodat deze tijdens het
   bewerken niet in de weg zit.
2. Open de widgetinstellingen. De code-editor verschijnt; als deze
   gesloten is, kun je hem weer openen met de knop **Code bewerken**.
3. Selecteer het tabblad **CSS** en voer de regels in.
4. Controleer het bericht onder de editor: als daar „Geen syntaxfouten
   gevonden”, dan is de structuur in orde.
5. Klik op **Klaar** en sla de widgetinstellingen op.
6. Controleer het resultaat in het **Voorbeeld** — in de editor werkt de CSS niet.

## Eigen JavaScript toevoegen

1. Open de widgetinstellingen en selecteer in de code-editor het tabblad **JavaScript**
  .
2. Voer de code in. Je kunt gebruikmaken van `container` (het element van de
   widget op de pagina) en `widgetApi` (de interface van Staffbase).
3. Kies bij **Uitvoeren:** het startmoment — standaardinstelling „direct bij
   het renderen“; voor scripts die bestaande pagina-elementen beïnvloeden, „wanneer de
   pagina volledig is geladen“.
4. Klik eventueel op **Opmaak**; de code wordt automatisch netjes
   ingesprongen.
5. Controleer het bericht onder de editor, klik op **Gereed** en sla de
   widgetinstellingen op.
6. Controleer het resultaat in het **Voorbeeld**. Als er niets gebeurt, open dan de browserconsole
   — runtime-fouten worden daar geregistreerd.

## Vergeet niet op te ruimen

Alles wat blijft draaien — timers, event-listeners, observers — moet worden beëindigd
zodra de widget verdwijnt. Anders blijft het draaien wanneer je verder klikt in
de app, omdat de pagina daarbij niet opnieuw wordt geladen.

1. Sla in het script het actieve element op in een variabele.
2. Geef aan het einde een functie terug die het weer opruimt:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Deze functie wordt automatisch aangeroepen wanneer de widget wordt verwijderd.

## Als er iets misgaat

1. Open het tabblad met de foutieve code en lees het bericht onder de
   editor — daarin staat het regelnummer vermeld.
2. Als dat niet helpt, kopieer dan de inhoud van het veld
   en wis de code, klik vervolgens op **Klaar** en sla op.
3. Controleer of de pagina weer normaal werkt en voeg de code vervolgens
   stukje bij beetje weer in.
