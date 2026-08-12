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

## Wo es läuft — und wo nicht

Ausgeführt wird auf der veröffentlichten Seite und in der Vorschau. In der
Bearbeitungsansicht läuft nichts; dort steht eine Karte mit den ersten Zeilen
des hinterlegten Codes. Ein fehlerhaftes Skript würde sonst die Oberfläche
zerlegen, in der man es korrigieren müsste.

## Der Editor

Der Konfigurationsdialog öffnet ein Modal mit zwei Reitern, CSS und
JavaScript, darin ein CodeMirror-Editor mit Syntaxprüfung. Fehler werden im
Text markiert und unter dem Editor im Klartext genannt; sie blockieren das
Speichern nicht.

CodeMirror liegt in einem eigenen Chunk und wird erst beim Öffnen des Modals
geladen. Auch React kommt nur in der Bearbeitungsansicht dazu: das Bundle, das
ein Leser der Seite lädt, enthält weder das eine noch das andere.

## Reichweite

Wer das Widget auf eine Seite setzen darf, kann die Seite beliebig verändern.
Die Grenze ist die Staffbase-Berechtigung, nicht das Widget. Das ist Absicht:
der übliche Anlass ist gerade ein Element, das nicht dem Widget gehört.
