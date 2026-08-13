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

import { CustomCode, isEmptyCode } from "./custom-code";

export interface EditorPlaceholderProps {
  code: CustomCode;
}

const cardStyle: React.CSSProperties = {
  border: "1px dashed #b7bcc3",
  borderRadius: "4px",
  background: "#fafbfc",
  padding: "12px 16px",
  color: "#3a4148",
  fontSize: "13px",
  lineHeight: 1.5,
};

const titleStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: "4px",
};

const previewStyle: React.CSSProperties = {
  margin: "8px 0 0",
  padding: "8px",
  background: "#fff",
  border: "1px solid #e2e6ea",
  borderRadius: "3px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "12px",
  whiteSpace: "pre",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const timingStyle: React.CSSProperties = {
  marginTop: "6px",
  fontSize: "12px",
  color: "#5a6570",
};

const PREVIEW_LINES = 4;
/** The first few lines, so the card says which snippet this is. */
export function previewOf(code: string): string {
  const lines = code.trim().split("\n");
  const shown = lines.slice(0, PREVIEW_LINES).join("\n");
  return lines.length > PREVIEW_LINES ? `${shown}\n…` : shown;
}

/**
 * What the editing view shows in place of the code.
 *
 * The code itself is not run there: a broken snippet would wreck the very
 * surface needed to fix it, and the page would only be recoverable through the
 * API. So the editing view gets a card that says what is stored, and the page
 * gets the effect.
 */
export function EditorPlaceholder({ code }: EditorPlaceholderProps): React.ReactElement {
  return (
    <div style={cardStyle} data-testid="custom-code-placeholder">
      <div style={titleStyle}>Eigenes CSS / JavaScript</div>
      {isEmptyCode(code) ? (
        <div>Noch kein Code hinterlegt. Über die Widget-Einstellungen bearbeiten.</div>
      ) : (
        <>
          <div>Wird auf der veröffentlichten Seite und in der Vorschau ausgeführt, hier nicht.</div>
          {code.css.trim() !== "" && <pre style={previewStyle}>{`CSS\n${previewOf(code.css)}`}</pre>}
          {code.js.trim() !== "" && (
            <>
              <pre style={previewStyle}>{`JavaScript\n${previewOf(code.js)}`}</pre>
              <div style={timingStyle} data-testid="custom-code-timing">
                {code.timing === "ready"
                  ? "Skript startet, wenn die Seite fertig geladen ist."
                  : "Skript startet sofort."}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
