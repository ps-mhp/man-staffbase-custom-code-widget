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
 * Wahlkarten: wenige, sich ausschließende Optionen untereinander, jede mit
 * Name und einem Satz, wofür sie gedacht ist – wie „Ausführen“ im Screen.
 * Pills (`Segmented`) tragen keinen Hinweis je Option; hier entscheidet
 * gerade der Hinweis.
 *
 * Auf react-aria `RadioGroup` wie `Segmented` auf `ToggleButtonGroup`:
 * echte Radio-Eingaben, Pfeiltasten wandern und wählen, Tab erreicht nur die
 * gewählte Karte. Der Name ist allein der Titel, der Hinweis wird als
 * Beschreibung vorgelesen.
 *
 * Kandidat für `@man/config-ui/form`; bis dahin hier.
 */

import * as React from "react";
import { Radio, RadioGroup } from "react-aria-components";
import { cn } from "@man/config-ui/primitives/utils";

export interface OptionCard<T extends string> {
  id: T;
  label: string;
  hint: string;
}

export interface OptionCardsProps<T extends string> {
  "aria-label": string;
  options: readonly OptionCard<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  /** Kennung für Tests; jede Karte bekommt `<testId>-<id>`. */
  "data-testid"?: string;
}

/** Der Kreis vor dem Namen: leer, gewählt mit dickem Rand in der Akzentfarbe. */
function RadioMark({ selected }: { selected: boolean }): React.ReactElement {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-px size-[18px] shrink-0 rounded-full border-2 border-muted-foreground bg-background transition-[border] duration-150 motion-reduce:transition-none",
        selected && "border-[6px] border-primary",
      )}
    />
  );
}

export function OptionCards<T extends string>({
  "aria-label": ariaLabel,
  options,
  value,
  onChange,
  className,
  "data-testid": testId,
}: OptionCardsProps<T>): React.ReactElement {
  const baseId = React.useId();
  return (
    <RadioGroup
      aria-label={ariaLabel}
      value={value}
      onChange={(next) => {
        if (next !== value) onChange(next as T);
      }}
      className={cn("flex flex-col gap-2", className)}
      data-testid={testId}
    >
      {options.map(({ id, label, hint }) => (
        <Radio
          key={id}
          value={id}
          aria-labelledby={`${baseId}-${id}-label`}
          aria-describedby={`${baseId}-${id}-hint`}
          data-testid={testId && `${testId}-${id}`}
          className={({ isSelected, isFocusVisible, isHovered }) =>
            cn(
              "flex w-full cursor-pointer items-start gap-2.5 rounded-lg border bg-background p-3 text-left transition-colors duration-150 motion-reduce:transition-none",
              isHovered && !isSelected && "bg-accent",
              isSelected && "border-primary bg-primary-soft",
              isFocusVisible && "ring-[3px] ring-ring/40",
            )
          }
        >
          {({ isSelected }) => (
            <>
              <RadioMark selected={isSelected} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span id={`${baseId}-${id}-label`} className="text-sm font-semibold text-foreground">
                  {label}
                </span>
                <span id={`${baseId}-${id}-hint`} className="text-[13px] leading-[1.45] text-muted-foreground">
                  {hint}
                </span>
              </span>
            </>
          )}
        </Radio>
      ))}
    </RadioGroup>
  );
}
