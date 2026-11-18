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
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OptionCards } from "./option-cards";

const OPTIONS = [
  { id: "a", label: "Erste", hint: "Für das Erste." },
  { id: "b", label: "Zweite", hint: "Für das Zweite." },
] as const;

type Id = (typeof OPTIONS)[number]["id"];

function Harness({ onChange }: { onChange?: (id: Id) => void }): React.ReactElement {
  const [value, setValue] = React.useState<Id>("a");
  return (
    <OptionCards<Id>
      aria-label="Wahl"
      options={OPTIONS}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
}

describe("OptionCards", () => {
  it("ist eine Radiogruppe mit dem Titel als Namen und dem Hinweis als Beschreibung", () => {
    render(<Harness />);

    expect(screen.getByRole("radiogroup", { name: "Wahl" })).toBeInTheDocument();
    const first = screen.getByRole("radio", { name: "Erste" });
    expect(first).toBeChecked();
    expect(first).toHaveAccessibleDescription("Für das Erste.");
    expect(screen.getByRole("radio", { name: "Zweite" })).not.toBeChecked();
  });

  it("wählt per Klick auf die Karte", async () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);

    await act(async () => {
      await userEvent.click(screen.getByText("Für das Zweite."));
    });

    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("radio", { name: "Zweite" })).toBeChecked();
  });

  it("wandert und wählt mit den Pfeiltasten", async () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);

    await act(async () => {
      await userEvent.tab();
      await userEvent.keyboard("{ArrowDown}");
    });

    expect(onChange).toHaveBeenLastCalledWith("b");
    expect(screen.getByRole("radio", { name: "Zweite" })).toHaveFocus();
  });

  it("meldet die schon gewählte Karte nicht noch einmal", async () => {
    const onChange = jest.fn();
    render(<Harness onChange={onChange} />);

    await act(async () => {
      await userEvent.click(screen.getByText("Erste"));
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
