# Custom-Code

Das Custom-Code-Widget ist das Werkzeug für alles, was die Bordmittel des CMS
nicht hergeben: eine Sonderformatierung, das gezielte Ausblenden eines
Elements, eine kleine Interaktion.

**Es zeigt selbst nichts an.** Auf der veröffentlichten Seite ist es
unsichtbar und belegt keinen Platz. Es trägt nur den Code, den Sie im
Konfigurationsdialog hinterlegen:

- **CSS** verändert das Aussehen der Seite. Es gilt für die **ganze Seite**,
  nicht nur für den Bereich des Widgets.
- **JavaScript** verändert das Verhalten der Seite und kann sie beliebig
  umbauen.

## Bevor Sie loslegen

Dieses Widget setzt Programmierkenntnisse voraus. Es gibt keine Prüfung, die
verhindert, dass ein Fehler die Seite unbrauchbar macht — das Widget fängt
zwar Fehler ab, ein „falsch, aber gültiger“ Code wirkt trotzdem. Wer nur ein
Bild, eine Tabelle oder einen Beitrag einbetten will, ist mit den anderen
Widgets besser bedient.

Faustregel: Erst prüfen, ob es das gewünschte Ergebnis auch mit einem
normalen Widget gibt. Custom-Code ist der letzte Ausweg, nicht der erste.

## Wo der Code läuft

| Ort | JavaScript | CSS |
| --- | --- | --- |
| Veröffentlichte Seite | läuft | wirkt |
| Vorschau | läuft | wirkt |
| CMS-Editor (Bearbeitungsansicht) | läuft **nicht** | wirkt **nicht** |

Im Editor steht an der Stelle des Widgets nur eine Karte mit den ersten Zeilen
des hinterlegten Codes. Das ist Absicht: Ein fehlerhaftes Skript würde sonst
genau die Oberfläche zerlegen, in der Sie es gerade reparieren wollen. Zum
Testen also immer die **Vorschau** verwenden.

Auf dieser Dokumentationsseite wird aus demselben Grund **kein Live-Beispiel**
gezeigt — der Code liefe sonst gegen die Doku statt gegen Ihre Seite.
