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

/**
 * Prettier and the two parsers it needs, in one module.
 *
 * Everything is imported statically here and this module is reached through
 * exactly one `import()` (see `format-code.ts`), so webpack puts the lot into a
 * single chunk. Importing the parsers separately would emit one chunk each,
 * with the shared printer duplicated into every one of them.
 */

import * as prettier from "prettier/standalone";
import type { Plugin } from "prettier";
import * as babel from "prettier/plugins/babel";
import * as estree from "prettier/plugins/estree";
import * as postcss from "prettier/plugins/postcss";

import type { Language } from "./code-mirror";

/**
 * The plugins are taken as namespaces rather than default imports: they are
 * CommonJS modules with named exports and no default, so a default import is
 * `undefined` under one module interop and the plugin under another. Prettier
 * then fails deep inside with a message about `languages` that says nothing
 * about the cause.
 */
const asPlugin = (module: unknown): Plugin => module as Plugin;

/** Prettier's parser name and plugins for one of the widget's two languages. */
const SETUP: Record<Language, { parser: string; plugins: Plugin[] }> = {
  css: { parser: "css", plugins: [asPlugin(postcss)] },
  // `estree` is the printer for everything `babel` parses; without it Prettier
  // reports that it has no printer for the AST it just produced.
  js: { parser: "babel", plugins: [asPlugin(babel), asPlugin(estree)] },
};

export async function format(language: Language, source: string): Promise<string> {
  const { parser, plugins } = SETUP[language];
  return prettier.format(source, { parser, plugins, printWidth: 100 });
}
