# Einstellungen

Der Konfigurationsdialog öffnet ein Modal mit zwei Reitern:

| Reiter | Beschreibung |
| --- | --- |
| CSS | Wird als `<style>` global in die Seite eingefügt und gilt für die ganze Seite, nicht nur für den Widget-Container. |
| JavaScript | Läuft als Funktionskörper mit Zugriff auf `container` (das Widget-Element) und `widgetApi`. |

Zusätzlich lässt sich im JavaScript-Reiter der **Startzeitpunkt** wählen:

| Wert | Bedeutung |
| --- | --- |
| Sofort beim Rendern (Voreinstellung) | Das Skript läuft, sobald das Widget gerendert wird. |
| Wenn die Seite fertig geladen ist | Das Skript wartet, bis sich am Seiteninhalt nichts mehr ändert — gedacht für Skripte, die Elemente anfassen, die erst nachgeladen werden. Nach spätestens 5 Sekunden läuft es in jedem Fall. |

Das CSS gilt in beiden Fällen sofort — früh angewandt kann es nur verhindern,
dass die Seite kurz ungestylt aufblitzt.

Der Editor prüft die Syntax beim Tippen: Fehler werden im Text markiert und
unter dem Editor im Klartext genannt, blockieren das Speichern aber nicht. Der
Knopf **Formatieren** rückt den Code automatisch per Prettier ein.

Wer eine JavaScript-Funktion zurückgibt, bekommt sie beim Entfernen des
Widgets zum Aufräumen aufgerufen — der Weg, um Timer oder Event-Listener
wieder loszuwerden:

```js
const timer = setInterval(() => console.log("tick"), 1000);
return () => clearInterval(timer);
```

Fehler im Code landen in der Browser-Konsole und werden abgefangen: ein
Tippfehler darf die Seite nicht lahmlegen.
