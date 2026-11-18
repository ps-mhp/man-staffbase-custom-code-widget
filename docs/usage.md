# Schritt für Schritt

## Eigenes CSS hinterlegen

1. Das Widget **Custom-Code** auf der Seite platzieren — die Position ist
   egal, weil es unsichtbar ist. Empfehlung: ganz nach unten, damit es beim
   Bearbeiten nicht stört.
2. Die Widget-Einstellungen öffnen. Der Code-Editor erscheint im Vollbild;
   ist er geschlossen, bringt ihn der Button **Code bearbeiten** zurück.
3. Den Reiter **CSS** wählen und die Regeln eintragen.
4. Die Statuszeile unter dem Code prüfen: Steht dort „Keine Fehler“, ist die
   Struktur in Ordnung.
5. Oben rechts auf **Übernehmen** klicken und die Widget-Einstellungen
   speichern.
6. Das Ergebnis in der **Vorschau** prüfen — im Editor wirkt das CSS nicht.

## Eigenes JavaScript hinterlegen

1. Widget-Einstellungen öffnen und im Code-Editor den Reiter **JavaScript**
   wählen.
2. Den Code eintragen. Zur Verfügung stehen `container` (das Element des
   Widgets auf der Seite) und `widgetApi` (die Schnittstelle von Staffbase).
3. Im Panel **Code** rechts unter **Ausführen** den Startzeitpunkt wählen —
   Voreinstellung „Sofort beim Rendern“; für Skripte, die vorhandene
   Seitenelemente anfassen, „Wenn die Seite fertig geladen ist“.
4. Optional auf **Formatieren** klicken; der Code wird automatisch sauber
   eingerückt.
5. Im Panel unter **Prüfung** nachsehen, ob beide Sprachen „keine Fehler“
   melden, auf **Übernehmen** klicken und die Widget-Einstellungen speichern.
6. Ergebnis in der **Vorschau** prüfen. Passiert nichts, die Browser-Konsole
   öffnen — Laufzeitfehler werden dort protokolliert.

## Aufräumen nicht vergessen

Alles, was weiterläuft — Timer, Event-Listener, Beobachter —, muss beendet
werden, sobald das Widget verschwindet. Sonst läuft es beim Weiterklicken in
der App weiter, weil die Seite dabei nicht neu geladen wird.

1. Im Skript das laufende Element in einer Variablen merken.
2. Am Ende eine Funktion zurückgeben, die es wieder abräumt:

   ```js
   const timer = setInterval(() => console.log("tick"), 1000);
   return () => clearInterval(timer);
   ```

Diese Funktion wird automatisch aufgerufen, wenn das Widget entfernt wird.

## Wenn etwas schiefgeht

1. Im Panel **Code** auf **Zur Fehlerstelle** klicken — der Editor wechselt in
   den Reiter mit dem Fehler und springt zur Zeile; die Meldung steht direkt
   darunter. Eine rote Zahl am Reiter zeigt, welche Sprache betroffen ist.
2. Hilft das nicht, den Code zwischenspeichern (herauskopieren) und leeren,
   dann **Übernehmen** und speichern.
3. Prüfen, ob die Seite wieder normal funktioniert, und den Code dann
   Stück für Stück wieder einsetzen.
