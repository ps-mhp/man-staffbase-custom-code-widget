# FAQ

**Frage:** Läuft mein Code auch im CMS-Editor, während ich ihn bearbeite?

Antwort: Nein. Ausgeführt wird nur auf der veröffentlichten Seite und in der
Vorschau. In der Bearbeitungsansicht steht stattdessen eine Karte mit den
ersten Zeilen des hinterlegten Codes — ein fehlerhaftes Skript würde sonst
die Oberfläche zerlegen, in der man es gerade korrigieren möchte.

**Frage:** Wer darf dieses Widget auf eine Seite setzen?

Antwort: Wer die Staffbase-Berechtigung hat, die Seite zu bearbeiten, kann
über dieses Widget die Seite beliebig verändern — das ist Absicht, denn der
übliche Anlass ist gerade ein Element, das nicht dem Widget selbst gehört.
Die Berechtigung dafür regelt ausschließlich Staffbase, nicht das Widget.

**Frage:** Mein Skript soll ein Element anfassen, das aber noch gar nicht da
ist — was tun?

Antwort: Im JavaScript-Reiter den Startzeitpunkt auf „Wenn die Seite fertig
geladen ist“ umstellen. Damit wartet das Skript, bis der Seiteninhalt zur
Ruhe gekommen ist, statt sofort beim Rendern des Widgets zu laufen.

**Frage:** Mein CSS oder JavaScript verschwindet plötzlich?

Antwort: Ein Syntaxfehler blockiert das Speichern nicht, wird aber unter dem
Editor im Klartext angezeigt — den Hinweis vor dem Schließen des Dialogs
prüfen. Bei JavaScript-Fehlern zur Laufzeit lohnt zusätzlich ein Blick in die
Browser-Konsole der veröffentlichten Seite.
