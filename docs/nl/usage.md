# Stap voor stap

## Eigen CSS invoeren

1. Plaats de widget **Aangepaste code** op de pagina — de positie maakt
   niet uit, omdat deze onzichtbaar is. Aanbeveling: helemaal onderaan, zodat deze bij het
   bewerken niet in de weg zit.
2. Open de widgetinstellingen. De code-editor verschijnt in volledig scherm;
   als deze gesloten is, kun je hem weer openen met de knop **Code bewerken**.
3. Selecteer het tabblad **CSS** en voer de regels in.
4. Controleer de statusbalk onder de code: als daar „Geen fouten“ staat, is de
   structuur in orde.
5. Klik rechtsboven op **Toepassen** en sla de widgetinstellingen
   op.
6. Controleer het resultaat in het **Voorbeeld** — in de editor werkt de CSS niet.

## Eigen JavaScript toevoegen

1. Open de widgetinstellingen en selecteer in de code-editor het tabblad **JavaScript**
  .
2. Voer de code in. Je hebt de beschikking over `container` (het element van de
   widget op de pagina) en `widgetApi` (de interface van Staffbase).
3. Kies in het paneel **Code** rechts onder **Uitvoeren** het startmoment —
   standaardinstelling „Direct bij het renderen“; voor scripts die bestaande
   pagina-elementen beïnvloeden, „Wanneer de pagina volledig is geladen“.
4. Klik optioneel op **Opmaak**; de code wordt automatisch netjes
   ingesprongen.
5. Controleer in het paneel onder **Controle** of beide talen „geen fouten“
   melden, klik op **Toepassen** en sla de widgetinstellingen op.
6. Controleer het resultaat in het **Voorbeeld**. Als er niets gebeurt, open dan de browserconsole
   — runtime-fouten worden daar gelogd.

## Vergeet niet op te ruimen

Alles wat blijft draaien — timers, event-listeners, observers — moet worden beëindigd
zodra de widget verdwijnt. Anders blijft het draaien wanneer je verder klikt in
de app, omdat de pagina daarbij niet opnieuw wordt geladen.

1. Sla in het script het actieve element op in een variabele.
2. Retourneer aan het einde een functie die het weer opruimt:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Deze functie wordt automatisch aangeroepen wanneer de widget wordt verwijderd.

## Als er iets misgaat

1. Klik in het paneel **Code** op **Naar foutlocatie** — de editor schakelt over naar
   het tabblad met de fout en springt naar de regel; de melding staat direct
   daaronder. Een rood getal op het tabblad geeft aan welke taal het betreft.
2. Als dat niet helpt, kopieer de code dan naar het klembord en wis deze,
   klik vervolgens op **Toepassen** en sla op.
3. Controleer of de pagina weer normaal werkt en voeg de code vervolgens
   stukje bij beetje weer in.
