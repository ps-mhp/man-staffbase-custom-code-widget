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
 * Das Panel „Code“ rechts im Rahmen, wie im Screen: oben „Ausführen“ als
 * Wahlkarten, darunter „Prüfung“ mit einer Zeile je Sprache, dem Sprung zur
 * Fehlerstelle und einem Hinweis, was „Übernehmen“ bewirkt.
 *
 * Der Startzeitpunkt stand früher als Auswahlliste nur im Reiter
 * JavaScript. Hier steht er immer – er gilt für das ganze Widget –, und die
 * Beschreibung sagt, dass das CSS davon unberührt sofort wirkt.
 */

import * as React from "react";
import { Check, TriangleAlert } from "lucide-react";
import { FormSection } from "@man/config-ui/form/form-section";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { Button } from "@man/config-ui/primitives/button";
import { cn } from "@man/config-ui/primitives/utils";

import { CodeProblems, LANGUAGES, LANGUAGE_LABELS, checkNote, checkSummary } from "./code-check";
import type { Language } from "./code-mirror";
import type { CustomCode, RunTiming } from "./custom-code";
import { OptionCard, OptionCards } from "./option-cards";
import type { SyntaxProblem } from "./syntax-check";

export interface CodeInspectorProps {
  value: CustomCode;
  onChange: (value: CustomCode) => void;
  problems: CodeProblems;
  /** Springt zur ersten Fehlerstelle; fehlt, wenn es keine gibt. */
  onReveal?: () => void;
}

const TIMING_OPTIONS: readonly OptionCard<RunTiming>[] = [
  { id: "immediate", label: "Sofort beim Rendern", hint: "Für Code, der nichts von der Seite braucht." },
  {
    id: "ready",
    label: "Wenn die Seite fertig geladen ist",
    hint: "Für JavaScript, das Elemente der Seite sucht. Wartet, bis sich am Inhalt nichts mehr ändert – höchstens 5 Sekunden.",
  },
];

/** Eine Zeile der Prüfung: Haken oder Warnzeichen, Sprache, Ergebnis. */
function CheckRow({ language, problem }: { language: Language; problem: SyntaxProblem | null }): React.ReactElement {
  const Icon = problem === null ? Check : TriangleAlert;
  return (
    <li
      data-testid={`code-check-${language}`}
      className={cn("flex items-start gap-2", problem === null ? "text-foreground" : "text-destructive")}
    >
      <Icon aria-hidden className={cn("mt-0.5 size-4 shrink-0", problem === null && "text-muted-foreground")} />
      <span className="min-w-0">
        <strong className="font-semibold">{LANGUAGE_LABELS[language]}</strong>
        {` – ${checkSummary(problem)}`}
        {/* Ohne Zeile gibt es keine Stelle im Editor, unter der die Meldung
            stehen könnte; dann steht sie hier. */}
        {problem !== null && problem.line === undefined && (
          <span className="block text-[13px] [overflow-wrap:anywhere]">{problem.message}</span>
        )}
      </span>
    </li>
  );
}

export function CodeInspector({ value, onChange, problems, onReveal }: CodeInspectorProps): React.ReactElement {
  return (
    <InspectorPanel title="Code">
      <div className="flex flex-col gap-6">
        <FormSection title="Ausführen" description="Wann das JavaScript startet. Das CSS wirkt immer sofort.">
          <OptionCards<RunTiming>
            aria-label="Ausführen"
            data-testid="code-timing"
            options={TIMING_OPTIONS}
            value={value.timing}
            onChange={(timing) => onChange({ ...value, timing })}
          />
        </FormSection>
        <FormSection title="Prüfung">
          <ul aria-label="Prüfung je Sprache" className="m-0 flex list-none flex-col gap-2.5 p-0 text-sm">
            {LANGUAGES.map((language) => (
              <CheckRow key={language} language={language} problem={problems[language]} />
            ))}
          </ul>
          {onReveal !== undefined && (
            <Button type="button" variant="ghost" size="sm" className="self-start" onClick={onReveal} data-testid="code-reveal">
              Zur Fehlerstelle
            </Button>
          )}
          <p
            data-testid="code-check-note"
            className="rounded-md bg-secondary px-3.5 py-3 text-[13px] leading-normal text-muted-foreground"
          >
            {checkNote(problems)}
          </p>
        </FormSection>
      </div>
    </InspectorPanel>
  );
}
