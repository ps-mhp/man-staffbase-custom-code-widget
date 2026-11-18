/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Die Hilfe des Code-Editors in der Leiste des Rahmens. Tasten und den Satz
 * zu „Übernehmen“ ergänzt der Rahmen selbst.
 *
 * Was früher als Hinweis über dem Editor stand – wo CSS gilt, was das
 * Skript bekommt, wie es aufräumt –, steht jetzt hier: die Codefläche
 * bekommt den Platz, und der Text ist da, wenn man ihn sucht.
 */

import * as React from "react";

interface HelpTopic {
  title: string;
  body: React.ReactNode;
}

const CODE = "rounded bg-muted px-1 font-mono text-[12px] text-foreground";

const TOPICS: readonly HelpTopic[] = [
  {
    title: "Wo der Code läuft",
    body: (
      <>
        Auf der veröffentlichten Seite und in der Vorschau – nicht in der Bearbeitung und nicht in diesem Fenster. Dort
        zeigt das Widget eine Karte mit den ersten Zeilen; ein fehlerhaftes Skript könnte sonst die Oberfläche zerlegen,
        in der man es korrigiert.
      </>
    ),
  },
  {
    title: "CSS",
    body: (
      <>
        Gilt für die ganze Seite, nicht nur für den Bereich des Widgets. Wird das Widget entfernt oder die Seite
        verlassen, verschwindet es wieder.
      </>
    ),
  },
  {
    title: "JavaScript",
    body: (
      <>
        Läuft als Funktionskörper mit <code className={CODE}>ctx</code>, darin <code className={CODE}>container</code>{" "}
        (das Element des Widgets) und <code className={CODE}>widgetApi</code>. Gibt das Skript eine Funktion zurück,
        wird sie beim Entfernen des Widgets zum Aufräumen aufgerufen – etwa{" "}
        <code className={CODE}>{"return () => clearInterval(timer);"}</code>. Laufzeitfehler stehen in der
        Browser-Konsole der Seite.
      </>
    ),
  },
  {
    title: "Ausführen",
    body: (
      <>
        „Sofort beim Rendern“ startet das Skript, sobald das Widget erscheint. „Wenn die Seite fertig geladen ist“
        wartet, bis sich am Seiteninhalt nichts mehr ändert – nötig, sobald das Skript Elemente anfasst, die Staffbase
        erst nachlädt; nach spätestens 5 Sekunden startet es in jedem Fall. Das CSS wirkt immer sofort.
      </>
    ),
  },
  {
    title: "Prüfung und Formatieren",
    body: (
      <>
        Fehler stehen unter ihrer Zeile, als Marke am Reiter und im Panel „Prüfung“; „Zur Fehlerstelle“ springt hin.
        Sie halten „Übernehmen“ nicht auf, fehlerhaftes JavaScript läuft auf der Seite aber nicht. Beim CSS prüft der
        Editor nur die Klammern. „Formatieren“ rückt den Code mit Prettier ein; lässt er sich nicht lesen, bleibt er
        unverändert, und die Statuszeile nennt den Grund.
      </>
    ),
  },
];

export function CodeHelp(): React.ReactElement {
  return (
    <div className="flex flex-col gap-2" data-testid="code-help">
      {TOPICS.map((topic, index) => (
        <details key={topic.title} className="rounded-md border px-3" open={index === 0}>
          <summary className="flex min-h-10 cursor-pointer items-center text-[13px] font-semibold text-foreground">
            {topic.title}
          </summary>
          <p className="pb-3 text-muted-foreground">{topic.body}</p>
        </details>
      ))}
    </div>
  );
}
