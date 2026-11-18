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

import { LanguageTabs } from "./language-tabs";

type Id = "css" | "js";

function Harness({ problems = { css: 0, js: 0 } }: { problems?: Record<Id, number> }): React.ReactElement {
  const [value, setValue] = React.useState<Id>("css");
  return (
    <LanguageTabs<Id>
      aria-label="Sprache"
      tabs={[
        { id: "css", label: "CSS", problems: problems.css },
        { id: "js", label: "JavaScript", problems: problems.js },
      ]}
      value={value}
      onChange={setValue}
      actions={<button type="button">Formatieren</button>}
      renderPanel={(id) => <p>{`Inhalt ${id}`}</p>}
    />
  );
}

describe("LanguageTabs", () => {
  it("hält jeden Reiter eingehängt und zeigt nur den gewählten", () => {
    render(<Harness />);

    expect(screen.getByRole("tab", { name: "CSS" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Inhalt css")).toBeVisible();
    expect(screen.getByText("Inhalt js")).not.toBeVisible();
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Inhalt css");
  });

  it("wechselt per Klick und mit den Pfeiltasten", async () => {
    render(<Harness />);

    await act(async () => {
      await userEvent.click(screen.getByRole("tab", { name: "JavaScript" }));
    });
    expect(screen.getByText("Inhalt js")).toBeVisible();

    await act(async () => {
      await userEvent.keyboard("{ArrowRight}");
    });
    expect(screen.getByRole("tab", { name: "CSS" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "CSS" })).toHaveFocus();

    await act(async () => {
      await userEvent.keyboard("{End}");
    });
    expect(screen.getByRole("tab", { name: "JavaScript" })).toHaveFocus();
  });

  it("zeigt Fehler als Marke am Reiter und sagt sie als Text an", () => {
    render(<Harness problems={{ css: 0, js: 1 }} />);

    expect(screen.getByRole("tab", { name: "JavaScript 1 Fehler" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "CSS" })).not.toHaveTextContent("1");
  });

  it("stellt die Aktionen neben die Reiter", () => {
    render(<Harness />);

    expect(screen.getByRole("button", { name: "Formatieren" })).toBeInTheDocument();
  });
});
