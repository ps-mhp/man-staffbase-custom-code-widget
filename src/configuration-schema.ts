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

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

/**
 * Schema for the widget's configuration dialog.
 *
 * The key is byte-identical to `CODE_ATTRIBUTE` and to the attribute
 * registered in `widgets.json`: the host saves a value under its schema key
 * verbatim and reads it back off the element under the declared attribute
 * name, and it drops an attribute it was never told about.
 *
 * One field for both languages, holding an encoded `{css, js}` object. The
 * editor is a modal injected in front of it (see `code-editor-injector.ts`),
 * and a modal binds to exactly one field; the textarea RJSF renders is the
 * backing field and stays as a fallback should the injection fail to mount.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    code: {
      type: "string",
      title: "Code",
    },
  },
};

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  code: {
    "ui:widget": "textarea",
    "ui:help": "Wird über den Code-Editor oberhalb bearbeitet.",
  },
};
