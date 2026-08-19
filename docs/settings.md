# Einstellungen

Der Konfigurationsdialog zeigt ein Feld **Code**, das nie von Hand bearbeitet
wird. Gearbeitet wird im Code-Editor darüber; der Button **Code bearbeiten**
öffnet ihn erneut, **Fertig** übernimmt den Stand in das Feld.

## Reiter im Code-Editor

| Reiter | Beschreibung |
| --- | --- |
| CSS | Wird als Stylesheet in die Seite eingefügt und gilt für die **ganze Seite**, nicht nur für den Widget-Bereich. Wird das Widget entfernt, verschwindet auch das CSS wieder. |
| JavaScript | Läuft mit Zugriff auf `container` (das Widget-Element) und `widgetApi` (die Staffbase-Schnittstelle). |

## Startzeitpunkt („Ausführen:“, nur im Reiter JavaScript)

| Wert | Bedeutung |
| --- | --- |
| sofort beim Rendern | Voreinstellung. Das Skript startet, sobald das Widget erscheint. Richtig für alles, was keine anderen Seitenelemente braucht. |
| wenn die Seite fertig geladen ist | Das Skript wartet, bis sich am Seiteninhalt nichts mehr ändert — für Skripte, die Elemente anfassen, die erst nachgeladen werden. Spätestens nach 5 Sekunden startet es in jedem Fall. |

Das CSS gilt in beiden Fällen sofort. Das ist gewollt: So blitzt die Seite
nicht kurz ungestylt auf.

## Hilfen im Editor

| Funktion | Beschreibung |
| --- | --- |
| Syntaxprüfung | Läuft beim Tippen. Unter dem Editor steht „Keine Syntaxfehler gefunden“ oder die Fehlerstelle mit Zeilennummer. Sie **blockiert das Speichern nicht**. Bei CSS wird nur die Klammerstruktur geprüft, nicht jede Eigenschaft. |
| Formatieren | Rückt den Code automatisch sauber ein. |
