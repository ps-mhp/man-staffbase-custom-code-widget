# Einstellungen

Der Konfigurationsdialog öffnet den Code-Editor im Vollbild. Das Feld
**Code** dahinter wird nie von Hand bearbeitet; ist der Editor geschlossen,
öffnet ihn der Button **Code bearbeiten** erneut. **Übernehmen** schreibt den
Stand in das Feld, **Abbrechen** verwirft ihn (mit Rückfrage, wenn etwas
geändert ist). Gespeichert wird erst mit den Widget-Einstellungen.

## Reiter über der Codefläche

| Reiter | Beschreibung |
| --- | --- |
| CSS | Wird als Stylesheet in die Seite eingefügt und gilt für die **ganze Seite**, nicht nur für den Widget-Bereich. Wird das Widget entfernt, verschwindet auch das CSS wieder. |
| JavaScript | Läuft mit Zugriff auf `container` (das Widget-Element) und `widgetApi` (die Staffbase-Schnittstelle). |

Eine rote Zahl am Reiter zeigt einen Fehler in dieser Sprache.

## Ausführen (Panel „Code“ rechts)

| Wahl | Bedeutung |
| --- | --- |
| Sofort beim Rendern | Voreinstellung. Das Skript startet, sobald das Widget erscheint. Richtig für alles, was keine anderen Seitenelemente braucht. |
| Wenn die Seite fertig geladen ist | Das Skript wartet, bis sich am Seiteninhalt nichts mehr ändert — für Skripte, die Elemente anfassen, die erst nachgeladen werden. Spätestens nach 5 Sekunden startet es in jedem Fall. |

Das CSS gilt in beiden Fällen sofort. Das ist gewollt: So blitzt die Seite
nicht kurz ungestylt auf.

## Hilfen im Editor

| Funktion | Beschreibung |
| --- | --- |
| Syntaxprüfung | Läuft beim Tippen. Eine Fehlerzeile ist rot hinterlegt, die Meldung steht direkt darunter. Im Panel **Prüfung** steht je Sprache „keine Fehler“ oder „1 Fehler in Zeile …“; **Zur Fehlerstelle** springt hin. Die Prüfung **blockiert das Übernehmen nicht**. Bei CSS wird nur die Klammerstruktur geprüft, nicht jede Eigenschaft. |
| Statuszeile | Unter dem Code: Sprache, Zahl der Zeilen, Fehler und die Position der Schreibmarke („Zeile 7, Spalte 32“). |
| Formatieren | Rückt den Code der gewählten Sprache automatisch sauber ein. Lässt er sich nicht lesen, bleibt er unverändert, und die Statuszeile nennt den Grund. |
| Rückgängig | Der Pfeil im Kopf nimmt ganze Bearbeitungsschritte zurück; im Code selbst gilt ⌘/Strg Z des Editors. |
| Hilfe | Das Fragezeichen im Kopf (F1) erklärt Sprachen, Startzeitpunkt und Prüfung. |
