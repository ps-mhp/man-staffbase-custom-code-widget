/*!
 * Copyright 2026, Staffbase SE and contributors.
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

import { CodeEditor } from "./code-editor";
import type { Language } from "./code-mirror";
import { CustomCode } from "./custom-code";

export interface CodeTabsProps {
  value: CustomCode;
  onChange: (value: CustomCode) => void;
  onDone: () => void;
}

const layoutStyle: React.CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  fontFamily: "inherit",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const tabStyle = (isActive: boolean): React.CSSProperties => ({
  border: "1px solid #d5d9de",
  borderBottomColor: isActive ? "transparent" : "#d5d9de",
  background: isActive ? "#fff" : "#f3f5f7",
  color: isActive ? "#1d2b36" : "#5a6570",
  fontWeight: isActive ? 600 : 400,
  cursor: "pointer",
  padding: "6px 16px",
  borderRadius: "4px 4px 0 0",
  fontSize: "13px",
});

const doneButtonStyle: React.CSSProperties = {
  marginLeft: "auto",
  border: "none",
  background: "#0b5cd5",
  color: "#fff",
  cursor: "pointer",
  padding: "8px 20px",
  borderRadius: "4px",
  fontSize: "13px",
};

const hintStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#5a6570",
  lineHeight: 1.5,
};

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "css", label: "CSS" },
  { id: "js", label: "JavaScript" },
];

const HINTS: Record<Language, string> = {
  css: "Gilt für die ganze Seite. Wird beim Verlassen der Seite wieder entfernt.",
  js: "Läuft auf der veröffentlichten Seite und in der Vorschau, nicht in der Bearbeitung. " +
    "Verfügbar ist ctx mit container und widgetApi. Wer eine Funktion zurückgibt, " +
    "bekommt sie beim Entfernen des Widgets zum Aufräumen aufgerufen.",
};

/**
 * The modal's content: one tab per language.
 *
 * Both editors stay mounted, hidden rather than unmounted, so switching tabs
 * neither loses the cursor nor makes CodeMirror reload its document. The state
 * itself lives in the injector, not here.
 */
export function CodeTabs({ value, onChange, onDone }: CodeTabsProps): React.ReactElement {
  const [active, setActive] = React.useState<Language>("css");

  return (
    <div style={layoutStyle} data-testid="code-tabs">
      <div style={headerStyle}>
        {LANGUAGES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active === id}
            data-testid={`code-tab-${id}`}
            style={tabStyle(active === id)}
            onClick={() => setActive(id)}
          >
            {label}
          </button>
        ))}
        <button type="button" data-testid="code-tabs-done" style={doneButtonStyle} onClick={onDone}>
          Fertig
        </button>
      </div>

      <p style={hintStyle}>{HINTS[active]}</p>

      {LANGUAGES.map(({ id }) => (
        <div
          key={id}
          style={{
            flex: 1,
            minHeight: 0,
            display: active === id ? "flex" : "none",
            flexDirection: "column",
          }}
        >
          <CodeEditor
            language={id}
            testId={`code-editor-${id}`}
            value={value[id]}
            onChange={(next) => onChange({ ...value, [id]: next })}
          />
        </div>
      ))}
    </div>
  );
}
