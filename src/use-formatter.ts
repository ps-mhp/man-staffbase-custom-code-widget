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
 * „Formatieren“ für den Arbeitsbereich: Prettier läuft nachgeladen und
 * asynchron, das Ergebnis geht als neuer Wert über `onChange` hinaus.
 */

import * as React from "react";

import type { Language } from "./code-mirror";
import type { CustomCode } from "./custom-code";
import { formatCode } from "./format-code";

/** Warum das Formatieren scheiterte – gültig nur für genau diesen Text. */
interface FormatFailure {
  source: string;
  message: string;
}

export interface Formatter {
  /** Die Sprache, die gerade formatiert wird, sonst `null`. */
  busy: Language | null;
  /** Warum das letzte Formatieren scheiterte, solange der Text unverändert ist. */
  failure: (language: Language) => string | undefined;
  format: (language: Language) => void;
}

export function useFormatter(value: CustomCode, onChange: (value: CustomCode) => void): Formatter {
  const [busy, setBusy] = React.useState<Language | null>(null);
  const [failures, setFailures] = React.useState<Partial<Record<Language, FormatFailure>>>({});
  const latest = React.useRef({ value, onChange });
  const mounted = React.useRef(true);

  React.useLayoutEffect(() => {
    latest.current = { value, onChange };
  });
  React.useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const format = (language: Language): void => {
    if (busy !== null) return;
    const source = value[language];
    setBusy(language);
    void formatCode(language, source).then((result) => {
      if (!mounted.current) return;
      setBusy(null);
      setFailures((current) => ({ ...current, [language]: result.ok ? undefined : { source, message: result.message } }));
      const { value: now, onChange: report } = latest.current;
      // Wer während des Formatierens weitertippt, behält, was er getippt
      // hat: das Ergebnis gehört zum alten Text und wird verworfen.
      if (result.ok && now[language] === source && result.code !== source) {
        report({ ...now, [language]: result.code });
      }
    });
  };

  // Eine Meldung gilt nur für den Text, an dem sie entstand. Jede Änderung
  // nimmt sie zurück – wie früher, als jede Eingabe sie löschte.
  const failure = (language: Language): string | undefined => {
    const found = failures[language];
    return found !== undefined && found.source === value[language] ? found.message : undefined;
  };

  return { busy, failure, format };
}
