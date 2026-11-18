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
 * Die Reiter „CSS · JavaScript“ über der Codefläche, rechts „Formatieren“.
 *
 * Aussehen und Tasten wie `ToolTabs` aus `@man/config-ui` (← → wählen den
 * Nachbarn, Pos1/Ende den ersten und letzten), mit zwei Unterschieden, die
 * der Editor braucht:
 *
 * - Eine Marke am Reiter zählt die Fehler der Sprache, wie im Screen.
 * - Alle Reiter bleiben eingehängt, die verborgenen nur `hidden`. Ein
 *   CodeMirror, der beim Wechsel abgebaut würde, verlöre Schreibmarke,
 *   Auswahl und seinen eigenen Verlauf.
 *
 * Beides wären Optionen für `ToolTabs`; bis dahin steht es hier.
 */

import * as React from "react";
import { cn } from "@man/config-ui/primitives/utils";

export interface LanguageTab<T extends string> {
  id: T;
  label: string;
  /** Fehler in diesem Reiter; ab 1 steht eine rote Marke am Namen. */
  problems: number;
}

export interface LanguageTabsProps<T extends string> {
  "aria-label": string;
  tabs: readonly LanguageTab<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Rechts in der Reiterleiste, etwa „Formatieren“. */
  actions?: React.ReactNode;
  /** Der Inhalt eines Reiters; jeder wird gerendert, nur der gewählte ist sichtbar. */
  renderPanel: (id: T) => React.ReactNode;
}

function neighbour(count: number, current: number, key: string): number | undefined {
  if (key === "ArrowRight") return (current + 1) % count;
  if (key === "ArrowLeft") return (current - 1 + count) % count;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  return undefined;
}

/** Die rote Zahl am Reiter; vorgelesen als „1 Fehler“, nicht als bloße Zahl. */
function ProblemBadge({ count }: { count: number }): React.ReactElement {
  return (
    <>
      <span
        aria-hidden
        className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] leading-none font-bold text-primary-foreground"
      >
        {count}
      </span>
      <span className="sr-only">{`${count} Fehler`}</span>
    </>
  );
}

export function LanguageTabs<T extends string>({
  "aria-label": ariaLabel,
  tabs,
  value,
  onChange,
  actions,
  renderPanel,
}: LanguageTabsProps<T>): React.ReactElement {
  const baseId = React.useId();
  const tabId = (id: string): string => `${baseId}-tab-${id}`;
  const panelId = (id: string): string => `${baseId}-panel-${id}`;
  const active = tabs.find((tab) => tab.id === value) ?? tabs[0];

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    const index = neighbour(tabs.length, tabs.indexOf(active), event.key);
    if (index === undefined) return;
    event.preventDefault();
    onChange(tabs[index].id);
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')[index]?.focus();
  };

  return (
    <>
      <div className="flex shrink-0 items-center gap-1 border-b bg-background px-4">
        <div role="tablist" aria-label={ariaLabel} className="flex items-center gap-1" onKeyDown={onKeyDown}>
          {tabs.map((tab) => {
            const selected = tab.id === active.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={tabId(tab.id)}
                aria-selected={selected}
                aria-controls={panelId(tab.id)}
                tabIndex={selected ? 0 : -1}
                data-testid={`code-tab-${tab.id}`}
                className={cn(
                  "-mb-px inline-flex h-10 cursor-pointer items-center gap-1.5 border-b-2 border-transparent px-3.5 text-[13px] font-semibold whitespace-nowrap text-muted-foreground outline-none",
                  "transition-colors duration-150 motion-reduce:transition-none",
                  "hover:text-foreground focus-visible:rounded-t-md focus-visible:ring-[3px] focus-visible:ring-ring/40",
                  selected && "border-primary text-primary hover:text-primary",
                )}
                onClick={() => onChange(tab.id)}
              >
                {tab.label}
                {tab.problems > 0 && <ProblemBadge count={tab.problems} />}
              </button>
            );
          })}
        </div>
        {actions !== undefined && <div className="ml-auto flex shrink-0 items-center gap-1 py-1.5">{actions}</div>}
      </div>
      {tabs.map((tab) => {
        const selected = tab.id === active.id;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelId(tab.id)}
            aria-labelledby={tabId(tab.id)}
            hidden={!selected}
            // `hidden` als Klasse zusätzlich: `flex` schlüge sonst das Attribut.
            className={cn("flex min-h-0 min-w-0 flex-1 flex-col", !selected && "hidden")}
          >
            {renderPanel(tab.id)}
          </div>
        );
      })}
    </>
  );
}
