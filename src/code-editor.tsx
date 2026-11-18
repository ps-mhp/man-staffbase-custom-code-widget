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

import * as React from "react";

import type { EditorView } from "@codemirror/view";
import { Textarea } from "@man/config-ui/primitives/textarea";

import { loadCodeMirror, CodeMirrorBundle, Language, ProblemMark } from "./code-mirror";
import { CursorPosition, minimalReplacement } from "./code-status";

/** Was der Arbeitsbereich mit einem Editor tun kann. */
export interface CodeEditorHandle {
  /**
   * Setzt die Schreibmarke an den Anfang von `line` (1-basiert), holt die
   * Zeile ins Bild und gibt dem Editor den Fokus – „Zur Fehlerstelle“.
   * Ohne Zeile nur den Fokus.
   */
  revealLine: (line: number | undefined) => void;
}

export interface CodeEditorProps {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  /** Die Fehlerstelle, deren Meldung unter ihrer Zeile steht. */
  problem?: ProblemMark | null;
  /** Meldet, wo die Schreibmarke steht – für die Statuszeile. */
  onCursor?: (position: CursorPosition) => void;
  /**
   * Meldet die Zeile der ersten Markierung des Parsers. Die Engine nennt für
   * einen Syntaxfehler oft keine Zeile; dann gilt diese.
   */
  onParsedErrorLine?: (line: number | undefined) => void;
  /** ⌘/Strg ↵ im Editor: im Rahmen „Übernehmen und schließen“. */
  onSubmitShortcut?: () => void;
  /** Identifies the editor in tests. */
  testId?: string;
  ref?: React.Ref<CodeEditorHandle>;
}

const LABELS: Record<Language, string> = { css: "CSS-Code", js: "JavaScript-Code" };

/** 1-basierte Zeile und Spalte einer Stelle im Text. */
function positionIn(text: string, offset: number): CursorPosition {
  const before = text.slice(0, offset).split("\n");
  return { line: before.length, column: before[before.length - 1].length + 1 };
}

/** Der Anfang von `line` (1-basiert) im Text, am Ende geklemmt. */
function offsetOfLine(text: string, line: number): number {
  const lines = text.split("\n");
  const index = Math.min(Math.max(line, 1), lines.length) - 1;
  return lines.slice(0, index).reduce((sum, current) => sum + current.length + 1, 0);
}

/** Der jüngste Wert einer Prop für Rückrufe, die CodeMirror einmal bekommt. */
function useLatest<T>(value: T): React.RefObject<T> {
  const ref = React.useRef(value);
  React.useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
}

/** Lädt CodeMirror einmal; scheitert es, bleibt das Textfeld. */
function useCodeMirror(): { bundle: CodeMirrorBundle | null; failed: boolean } {
  const [bundle, setBundle] = React.useState<CodeMirrorBundle | null>(null);
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    loadCodeMirror().then(
      (loaded) => {
        if (!cancelled) setBundle(loaded);
      },
      (error) => {
        console.error("[custom-code-widget] Der Code-Editor konnte nicht geladen werden:", error);
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);
  return { bundle, failed };
}

interface MountProps {
  bundle: CodeMirrorBundle | null;
  hostRef: React.RefObject<HTMLDivElement | null>;
  viewRef: React.RefObject<EditorView | null>;
  language: Language;
  latest: React.RefObject<CodeEditorProps>;
  /** Wahr, solange der Editor einen Wert von außen übernimmt – der geht nicht zurück. */
  syncing: React.RefObject<boolean>;
  /** Was der Editor gemeldet hat und als `value` noch zurückkommen wird. */
  echoes: React.RefObject<string[]>;
}

/** Mehr unbestätigte Meldungen hält der Editor nicht; sie kommen sonst ohnehin zurück. */
const MAX_ECHOES = 32;

/** Baut den CodeMirror-Editor auf und wieder ab. */
function useEditorView({ bundle, hostRef, viewRef, language, latest, syncing, echoes }: MountProps): void {
  React.useEffect(() => {
    const host = hostRef.current;
    if (!bundle || !host) return;

    const view = new bundle.EditorView({
      parent: host,
      state: bundle.EditorState.create({
        doc: latest.current.value,
        extensions: [
          bundle.shortcut("Mod-Enter", () => latest.current.onSubmitShortcut?.()),
          bundle.basicSetup,
          bundle.forLanguage(language),
          bundle.lintGutter(),
          bundle.linter((linted) => {
            const diagnostics = bundle.parseDiagnostics(language, linted);
            latest.current.onParsedErrorLine?.(
              diagnostics.length === 0 ? undefined : linted.state.doc.lineAt(diagnostics[0].from).number,
            );
            return diagnostics;
          }),
          bundle.problemMarks,
          bundle.editorTheme,
          bundle.EditorView.contentAttributes.of({ "aria-label": LABELS[language] }),
          bundle.EditorView.updateListener.of((update) => {
            if (update.docChanged || update.selectionSet) {
              const head = update.state.selection.main.head;
              const line = update.state.doc.lineAt(head);
              latest.current.onCursor?.({ line: line.number, column: head - line.from + 1 });
            }
            if (update.docChanged && !syncing.current) {
              const next = update.state.doc.toString();
              echoes.current = [...echoes.current.slice(1 - MAX_ECHOES), next];
              latest.current.onChange(next);
            }
          }),
        ],
      }),
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [bundle, language, hostRef, viewRef, latest, syncing, echoes]);
}

interface SyncProps {
  viewRef: React.RefObject<EditorView | null>;
  value: string;
  syncing: React.RefObject<boolean>;
  echoes: React.RefObject<string[]>;
  bundle: CodeMirrorBundle | null;
}

/**
 * Bringt einen Wert von außen in den Editor – Rückgängig im Kopf,
 * Formatieren – als kleinste Ersetzung, damit die Schreibmarke bleibt.
 *
 * Ein Wert, den der Editor selbst gemeldet hat, ist keiner von außen, auch
 * wenn er erst ankommt, nachdem schon weitergetippt wurde: React rendert
 * nicht zwingend nach jedem Tastendruck. Ihn zu „übernehmen“, nähme die
 * letzten Zeichen wieder heraus. Deshalb zählt der Editor mit, was er
 * gemeldet hat, und lässt diese Werte bei ihrer Rückkehr stehen.
 */
function useValueSync({ viewRef, value, syncing, echoes, bundle }: SyncProps): void {
  React.useLayoutEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const echo = echoes.current.indexOf(value);
    if (echo !== -1) {
      echoes.current = echoes.current.slice(echo + 1);
      return;
    }
    echoes.current = [];
    const change = minimalReplacement(view.state.doc.toString(), value);
    if (change === null) return;
    syncing.current = true;
    try {
      view.dispatch({ changes: change });
    } finally {
      syncing.current = false;
    }
  }, [viewRef, value, syncing, echoes, bundle]);
}

/** Schreibt die Fehlerstelle in den Editor; nach jeder Änderung neu, damit sie zur Zeile passt. */
function useProblemMark(viewRef: React.RefObject<EditorView | null>, bundle: CodeMirrorBundle | null, problem: ProblemMark | null, value: string): void {
  const line = problem?.line;
  const message = problem?.message;
  React.useEffect(() => {
    const view = viewRef.current;
    if (!bundle || !view) return;
    bundle.setProblemMark(view, line === undefined || message === undefined ? null : { line, message });
  }, [viewRef, bundle, line, message, value]);
}

/**
 * Ein CodeMirror-Editor für eine Sprache, im Aussehen des Config-Modals.
 *
 * Gesteuert über `value`: was der Editor tippt, geht über `onChange` hinaus;
 * was von außen kommt (Rückgängig im Kopf, Formatieren), kommt als kleinste
 * Ersetzung herein. Der Editor selbst bleibt dabei bestehen – ein Neuaufbau
 * je Tastendruck nähme ihm Schreibmarke und Verlauf.
 *
 * Bis der Chunk da ist – und in einem Browser, in dem er nicht kommt – hält
 * ein schlichtes Textfeld denselben Wert. Ohne Hervorhebung zu arbeiten ist
 * lästig; gar nicht arbeiten zu können machte das Widget unbrauchbar.
 */
export function CodeEditor(props: CodeEditorProps): React.ReactElement {
  const { language, value, onChange, problem = null, onCursor, testId, ref } = props;
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const viewRef = React.useRef<EditorView | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const syncing = React.useRef(false);
  const echoes = React.useRef<string[]>([]);
  const latest = useLatest(props);
  const { bundle, failed } = useCodeMirror();
  const hasView = bundle !== null && !failed;

  useEditorView({ bundle: hasView ? bundle : null, hostRef, viewRef, language, latest, syncing, echoes });
  useValueSync({ viewRef, value, syncing, echoes, bundle });
  useProblemMark(viewRef, bundle, problem, value);

  React.useImperativeHandle(
    ref,
    () => ({
      revealLine: (line) => {
        const view = viewRef.current;
        if (view) {
          if (line !== undefined) {
            const target = view.state.doc.line(Math.min(Math.max(line, 1), view.state.doc.lines));
            view.dispatch({ selection: { anchor: target.from }, scrollIntoView: true });
          }
          view.focus();
          return;
        }
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.focus();
        if (line !== undefined) {
          const offset = offsetOfLine(textarea.value, line);
          textarea.setSelectionRange(offset, offset);
        }
      },
    }),
    [],
  );

  const reportTextareaCursor = (textarea: HTMLTextAreaElement): void =>
    onCursor?.(positionIn(textarea.value, textarea.selectionStart ?? 0));

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted" data-testid={testId}>
      {hasView ? (
        // Vertikal und waagerecht scrollt CodeMirror selbst; die Hülle hält
        // ihn nur auf die Fläche, damit eine lange Zeile scrollt statt das
        // Modal zu verbreitern.
        <div ref={hostRef} className="min-h-0 min-w-0 flex-1 overflow-hidden" data-testid={testId && `${testId}-host`} />
      ) : (
        <Textarea
          ref={textareaRef}
          spellCheck={false}
          aria-label={LABELS[language]}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onSelect={(event) => reportTextareaCursor(event.currentTarget)}
          // Code liest man an seiner Einrückung; umbrechen zerstörte sie.
          className="min-h-0 flex-1 resize-none rounded-none border-0 bg-muted px-4 py-3 font-mono text-[13px] leading-[1.75] whitespace-pre shadow-none [overflow-wrap:normal] focus-visible:ring-inset"
        />
      )}
    </div>
  );
}
