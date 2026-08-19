# FAQ

**Frage:** Läuft mein Code auch im CMS-Editor, während ich ihn bearbeite?

Antwort: Nein. Ausgeführt wird nur auf der veröffentlichten Seite und in der
Vorschau. Im Editor sehen Sie stattdessen eine Karte mit den ersten Zeilen
Ihres Codes. So kann ein fehlerhaftes Skript nicht die Oberfläche zerlegen,
in der Sie es gerade korrigieren.

**Frage:** Ich sehe im Editor nur „Noch kein Code hinterlegt. Über die
Widget-Einstellungen bearbeiten.“

Antwort: Das Widget ist platziert, aber leer. Widget-Einstellungen öffnen und
den Code im Code-Editor eintragen.

**Frage:** Mein Skript soll ein Element anfassen, das noch gar nicht da ist.

Antwort: Im Reiter JavaScript bei **Ausführen:** auf „wenn die Seite fertig
geladen ist“ umstellen. Dann wartet das Skript, bis der Seiteninhalt zur Ruhe
gekommen ist.

**Frage:** Mein CSS oder JavaScript wirkt nicht.

Antwort: Der Reihe nach prüfen: Wurde in der **Vorschau** getestet und nicht
im Editor? Steht unter dem Editor eine Fehlermeldung? Wurde nach **Fertig**
auch die Widget-Einstellung gespeichert? Bei JavaScript zusätzlich die
Browser-Konsole der veröffentlichten Seite öffnen — dort stehen Meldungen wie
„Das JavaScript hat einen Syntaxfehler und wurde nicht ausgeführt“ oder „Das
JavaScript ist beim Ausführen gescheitert“.

**Frage:** Ein Syntaxfehler wird angezeigt — kann ich trotzdem speichern?

Antwort: Ja, die Prüfung blockiert nichts. Sie ist ein Hinweis, keine Sperre.
Fehlerhaftes JavaScript wird auf der Seite aber gar nicht erst ausgeführt.

**Frage:** Mein CSS verändert auch andere Bereiche der Seite.

Antwort: Das ist so vorgesehen — das CSS gilt global. Wer nur einen Bereich
treffen will, muss den Selektor entsprechend eng fassen.

**Frage:** Kann ich mehrere Custom-Code-Widgets auf eine Seite legen?

Antwort: Ja. Jedes bringt sein eigenes CSS mit, das beim Entfernen dieses
Widgets auch wieder verschwindet, ohne die anderen zu stören. Auf die
Ausführungsreihenfolge der Skripte sollte man sich aber nicht verlassen —
Abhängigkeiten besser in ein einziges Widget legen.

**Frage:** Warum läuft mein Skript nach dem Speichern nicht erneut?

Antwort: Bei unverändertem Code wird nicht neu ausgeführt. Erst eine
tatsächliche Änderung am Code startet das Skript neu.

**Frage:** Mein Timer läuft weiter, obwohl ich die Seite verlassen habe.

Antwort: Beim Weiterklicken innerhalb der App wird die Seite nicht neu
geladen. Deshalb im Skript eine Aufräumfunktion zurückgeben (siehe „Schritt
für Schritt“), die Timer und Listener beendet.

**Frage:** Wer darf dieses Widget verwenden?

Antwort: Jede Person, die die Seite bearbeiten darf — und sie kann damit die
Seite beliebig verändern. Das ist Absicht, denn der übliche Anlass ist genau
ein Element, das nicht dem Widget selbst gehört. Wer die Berechtigung hat,
regelt ausschließlich Staffbase.
