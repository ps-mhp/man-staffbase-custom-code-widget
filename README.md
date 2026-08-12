# custom-code-widget

Eigenes CSS und JavaScript für eine Seite. Der Code wird im
Konfigurationsdialog eingegeben und auf der veröffentlichten Seite ausgeführt.

Staffbase-Custom-Widget. Entwickelt, gebaut und released wird es aus dem
Meta-Repo [`ps-mhp/man-staffbase-cms-extensions`](https://github.com/ps-mhp/man-staffbase-cms-extensions);
dieses Repo enthält nur Quellcode und das ausgelieferte Bundle unter `dist/`.

```bash
scripts/sync.sh custom-code-widget
npm run build -- --env widget=custom-code-widget
npm test -- src/widgets/custom-code-widget
scripts/release.sh custom-code-widget
```

## Was es tut

Das Widget stellt selbst nichts dar. Auf der Seite ist es unsichtbar und
belegt keinen Platz; es trägt nur den Code.

- **CSS** landet als `<style>` im `document.head` und gilt damit für die ganze
  Seite, nicht nur für den Widget-Container.
- **JavaScript** läuft als Funktionskörper mit einem Objekt `ctx`, das
  `container` und `widgetApi` enthält. Wer eine Funktion zurückgibt, bekommt
  sie beim Entfernen des Widgets zum Aufräumen aufgerufen — der einzige Weg,
  Timer und Listener in einer Single-Page-App wieder loszuwerden.

```js
const timer = setInterval(() => console.log("tick"), 1000);
return () => clearInterval(timer);
```

Fehler im Code landen in der Konsole und werden verschluckt: ein Tippfehler
darf die Seite nicht abräumen.

## Wann das Skript startet

Im JavaScript-Reiter steht eine Auswahl:

- **sofort beim Rendern** (Voreinstellung) — das Skript läuft, sobald das
  Widget gerendert wird.
- **wenn die Seite fertig geladen ist** — das Skript wartet auf `load` und
  danach auf eine Ruhephase, in der sich am Seiteninhalt nichts mehr ändert.

Die zweite Einstellung ist für Skripte gedacht, die Elemente anfassen, die
Staffbase erst nachlädt. In einer Single-Page-App feuert `load`, während der
Artikel noch leer ist, und `DOMContentLoaded` noch früher — beobachtbar ist
nur, dass das Dokument zur Ruhe kommt. Nach spätestens fünf Sekunden läuft das
Skript in jedem Fall, damit eine Seite mit Dauer-Animation es nicht auf immer
blockiert.

Das CSS gilt immer sofort: früh angewandt kann es nur verhindern, dass die
Seite kurz ungestylt aufblitzt.

## Wo es läuft — und wo nicht

Ausgeführt wird auf der veröffentlichten Seite und in der Vorschau. In der
Bearbeitungsansicht läuft nichts; dort steht eine Karte mit den ersten Zeilen
des hinterlegten Codes. Ein fehlerhaftes Skript würde sonst die Oberfläche
zerlegen, in der man es korrigieren müsste.

## Der Editor

Der Konfigurationsdialog öffnet ein Modal mit zwei Reitern, CSS und
JavaScript, darin ein CodeMirror-Editor mit Syntaxprüfung. Fehler werden im
Text markiert und unter dem Editor im Klartext genannt; sie blockieren das
Speichern nicht. Lange Zeilen scrollen waagerecht, statt das Modal zu
verbreitern.

Der Knopf **Formatieren** rückt den Code per Prettier ein. Lässt er sich nicht
parsen, bleibt der Text unverändert und die Meldung des Parsers steht unter
dem Editor.

CodeMirror liegt in einem eigenen Chunk und wird erst beim Öffnen des Modals
geladen, Prettier in einem weiteren erst beim ersten Druck auf den Knopf. Auch
React kommt nur in der Bearbeitungsansicht dazu: das Bundle, das ein Leser der
Seite lädt, enthält nichts davon.

## Reichweite

Wer das Widget auf eine Seite setzen darf, kann die Seite beliebig verändern.
Die Grenze ist die Staffbase-Berechtigung, nicht das Widget. Das ist Absicht:
der übliche Anlass ist gerade ein Element, das nicht dem Widget gehört.
