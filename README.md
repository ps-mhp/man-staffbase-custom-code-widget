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

Im Panel **Code** rechts im Editor steht unter **Ausführen** eine Wahl:

- **Sofort beim Rendern** (Voreinstellung) — das Skript läuft, sobald das
  Widget gerendert wird.
- **Wenn die Seite fertig geladen ist** — das Skript wartet auf `load` und
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

Der Konfigurationsdialog öffnet den Editor im Vollbild-Rahmen aller
MAN-Widgets (`@man/config-ui`): oben der Kopf mit Status, **Rückgängig**,
**Hilfe**, **Abbrechen** und **Übernehmen**, darunter links die Codefläche,
rechts das Panel **Code**. Eine Vorschau gibt es nicht — der Code läuft nur
auf der Seite.

- **Reiter CSS · JavaScript** über der Codefläche, je ein CodeMirror-Editor.
  Beide bleiben beim Wechsel erhalten, mit Schreibmarke und eigenem Verlauf.
  Rechts daneben **Formatieren**.
- **Codefläche** mit Zeilennummern, hervorgehobener aktueller Zeile und
  Syntaxprüfung. Eine Fehlerzeile ist rot hinterlegt, die Meldung steht direkt
  darunter; am Reiter zählt eine rote Marke die Fehler. Lange Zeilen scrollen
  waagerecht, statt das Modal zu verbreitern.
- **Statuszeile** unter dem Code: Sprache, Zeilenzahl, Fehler und die
  Position der Schreibmarke.
- **Panel Code**: der Startzeitpunkt als Wahlkarten, darunter **Prüfung** mit
  einer Zeile je Sprache, **Zur Fehlerstelle** und einem Hinweis, was
  „Übernehmen“ bewirkt.

Fehler blockieren das Übernehmen nicht: fehlerhaftes JavaScript läuft auf der
Seite einfach nicht, CSS wendet der Browser an, so weit er es lesen kann.
Öffnen und Übernehmen ohne Änderung schreibt nichts in den Block.

**Formatieren** rückt den Code der gewählten Sprache per Prettier ein. Lässt
er sich nicht parsen, bleibt der Text unverändert und die Statuszeile nennt
den Grund. ⌘/Strg ↵ im Code übernimmt und schließt wie überall im Rahmen.

CodeMirror liegt in einem eigenen Chunk und wird erst beim Öffnen des Modals
geladen, Prettier in einem weiteren erst beim ersten Druck auf den Knopf, der
Arbeitsbereich mit `@man/config-ui` per `React.lazy`. Auch React kommt nur in
der Bearbeitungsansicht dazu: das Bundle, das ein Leser der Seite lädt,
enthält nichts davon.

## Reichweite

Wer das Widget auf eine Seite setzen darf, kann die Seite beliebig verändern.
Die Grenze ist die Staffbase-Berechtigung, nicht das Widget. Das ist Absicht:
der übliche Anlass ist gerade ein Element, das nicht dem Widget gehört.
