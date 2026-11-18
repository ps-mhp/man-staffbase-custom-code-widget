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
 * Der Rumpf des Config-Modals, wie im Screen „Custom-Code“: links die
 * Codefläche mit Reitern je Sprache, „Formatieren“ und Statuszeile, rechts
 * das Panel „Code“ mit Startzeitpunkt und Prüfung. Keine Seitenleiste, keine
 * Vorschau – der Code läuft nur auf der Seite.
 *
 * Kopf, Übernehmen, Rückgängig und Hilfe zeichnet der Rahmen. Beide Editoren
 * bleiben eingehängt; ein Wechsel des Reiters nimmt keinem Schreibmarke
 * oder Verlauf.
 *
 * Nur über `React.lazy` aus `code-editor-injector.ts` erreichbar: was hier
 * steht, braucht `@man/config-ui`, und das gehört in keinen Chunk, den die
 * Bearbeitungsansicht schon für ihre Platzhalter-Karte lädt.
 */

import * as React from "react";
import { Check } from "lucide-react";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { Button } from "@man/config-ui/primitives/button";
import { StatusBar } from "@man/config-ui/toolbar/status-bar";

import { CodeEditor, CodeEditorHandle } from "./code-editor";
import {
  CodeProblems,
  LANGUAGES,
  LANGUAGE_LABELS,
  ParsedLines,
  findProblems,
  problemCount,
  problemLanguage,
  problemMark,
} from "./code-check";
import { CodeInspector } from "./code-inspector";
import type { Language } from "./code-mirror";
import { CursorPosition, cursorText, firstLine, lineCountText, problemCountText } from "./code-status";
import type { CustomCode } from "./custom-code";
import { LanguageTabs } from "./language-tabs";
import { Formatter, useFormatter } from "./use-formatter";

export { CodeHelp } from "./code-help";

export interface CodeWorkspaceProps {
  value: CustomCode;
  onChange: (value: CustomCode) => void;
}

const START: CursorPosition = { line: 1, column: 1 };

/** Wohin „Zur Fehlerstelle“ springt, sobald der Reiter sichtbar ist. */
interface Reveal {
  language: Language;
  line: number | undefined;
}

/** Links in der Statuszeile: Sprache, Zeilen und Fehler – oder warum Formatieren scheiterte. */
function StatusStart(props: { language: Language; text: string; problems: number; formatFailure?: string }): React.ReactElement {
  const { language, text, problems, formatFailure } = props;
  let state: React.ReactNode;
  if (formatFailure !== undefined) {
    state = <span className="font-semibold text-destructive">{`Formatieren nicht möglich: ${firstLine(formatFailure)}`}</span>;
  } else if (problems > 0) {
    state = <span className="font-semibold text-destructive">{problemCountText(problems)}</span>;
  } else {
    state = (
      <span className="inline-flex items-center gap-1 align-bottom">
        <Check aria-hidden className="size-3.5 shrink-0" />
        {problemCountText(0)}
      </span>
    );
  }
  return (
    <>
      {`${LANGUAGE_LABELS[language]} · ${lineCountText(text)} · `}
      {state}
    </>
  );
}

function FormatButton({ formatter, language }: { formatter: Formatter; language: Language }): React.ReactElement {
  const busy = formatter.busy !== null;
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      data-testid="code-format"
      title="Code einrücken und umbrechen (Prettier)"
      aria-busy={busy}
      disabled={busy}
      onClick={() => formatter.format(language)}
    >
      {busy ? "Formatiere …" : "Formatieren"}
    </Button>
  );
}

/** Springt zur Fehlerstelle, sobald ihr Reiter sichtbar ist – im verborgenen kann CodeMirror nicht scrollen. */
function useReveal(active: Language, editors: Record<Language, React.RefObject<CodeEditorHandle | null>>) {
  const [reveal, setReveal] = React.useState<Reveal | null>(null);
  React.useEffect(() => {
    if (reveal === null || reveal.language !== active) return;
    editors[reveal.language].current?.revealLine(reveal.line);
    setReveal(null);
  }, [reveal, active, editors]);
  return setReveal;
}

export function CodeWorkspace({ value, onChange }: CodeWorkspaceProps): React.ReactElement {
  const [active, setActive] = React.useState<Language>("css");
  const [parsed, setParsed] = React.useState<ParsedLines>({});
  const [cursors, setCursors] = React.useState<Record<Language, CursorPosition>>({ css: START, js: START });
  const cssEditor = React.useRef<CodeEditorHandle | null>(null);
  const jsEditor = React.useRef<CodeEditorHandle | null>(null);
  const editors = React.useMemo(() => ({ css: cssEditor, js: jsEditor }), []);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const formatter = useFormatter(value, onChange);
  const setReveal = useReveal(active, editors);

  const problems: CodeProblems = React.useMemo(
    () => findProblems({ css: value.css, js: value.js }, parsed),
    [value.css, value.js, parsed],
  );
  const target = problemLanguage(problems, active);

  const reportParsedLine = React.useCallback((language: Language, line: number | undefined) => {
    setParsed((current) => (current[language] === line ? current : { ...current, [language]: line }));
  }, []);

  // ⌘/Strg ↵ nimmt CodeMirror sonst als „Leerzeile einfügen“ und hält die
  // Taste an. Der Editor fängt sie deshalb selbst ab und gibt sie hier außerhalb
  // seiner Fläche noch einmal auf den Weg – zum Rahmen, der übernimmt und
  // schließt oder, mit Fehlern im Entwurf, sie zeigt.
  const submitViaShell = (): void => {
    rootRef.current?.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true, bubbles: true, cancelable: true }),
    );
  };

  const panel = (language: Language): React.ReactNode => (
    <CodeEditor
      ref={editors[language]}
      language={language}
      testId={`code-editor-${language}`}
      value={value[language]}
      onChange={(next) => onChange({ ...value, [language]: next })}
      problem={problemMark(problems[language])}
      onCursor={(position) => setCursors((current) => ({ ...current, [language]: position }))}
      onParsedErrorLine={(line) => reportParsedLine(language, line)}
      onSubmitShortcut={submitViaShell}
    />
  );

  return (
    <div ref={rootRef} className="flex h-full min-h-0 w-full flex-col" data-testid="code-workspace">
      <ConfigWorkspace
        className="min-h-0 flex-1"
        inspector={
          <CodeInspector
            value={value}
            onChange={onChange}
            problems={problems}
            onReveal={
              target === null
                ? undefined
                : () => {
                    setActive(target);
                    setReveal({ language: target, line: problems[target]?.line });
                  }
            }
          />
        }
      >
        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <LanguageTabs<Language>
            aria-label="Sprache"
            tabs={LANGUAGES.map((id) => ({ id, label: LANGUAGE_LABELS[id], problems: problemCount(problems[id]) }))}
            value={active}
            onChange={setActive}
            actions={<FormatButton formatter={formatter} language={active} />}
            renderPanel={panel}
          />
          <StatusBar
            data-testid="code-status"
            start={
              <StatusStart
                language={active}
                text={value[active]}
                problems={problemCount(problems[active])}
                formatFailure={formatter.failure(active)}
              />
            }
            end={cursorText(cursors[active])}
          />
        </div>
      </ConfigWorkspace>
    </div>
  );
}
