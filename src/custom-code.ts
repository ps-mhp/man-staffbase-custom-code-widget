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
 * What the widget stores, and how it survives the trip through an attribute.
 *
 * Both languages live in a single attribute because the configuration dialog
 * edits them in one modal, and a modal binds to exactly one form field.
 *
 * The base64 wrapper is not caution but necessity: code is full of quotes,
 * `<` and `&`, and Staffbase's content translation re-serialises article HTML
 * without escaping them again — a raw value would be cut off at the first
 * quote (see `@shared/payload`).
 */

import { decodePayload, encodePayload, isPayload } from "@shared/payload";

export interface CustomCode {
  css: string;
  js: string;
}

export const EMPTY_CODE: CustomCode = { css: "", js: "" };

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

/**
 * Reads the attribute value.
 *
 * Never throws and never returns `null`: an unreadable value yields empty
 * code, so a broken attribute means "nothing runs", not "the page breaks".
 * Unencoded JSON is accepted too — a value typed straight into the raw field
 * should work.
 */
export function parseCustomCode(raw: unknown): CustomCode {
  if (typeof raw !== "string" || raw.trim() === "") return EMPTY_CODE;

  const json = isPayload(raw) ? decodePayload(raw) : raw;
  if (json === null) return EMPTY_CODE;

  try {
    const parsed: unknown = JSON.parse(json);
    if (typeof parsed !== "object" || parsed === null) return EMPTY_CODE;
    const record = parsed as Record<string, unknown>;
    return { css: asString(record.css), js: asString(record.js) };
  } catch {
    return EMPTY_CODE;
  }
}

/** Reverses {@link parseCustomCode}. */
export function encodeCustomCode(code: CustomCode): string {
  return encodePayload(JSON.stringify({ css: code.css, js: code.js }));
}

/** True when there is nothing to run. */
export const isEmptyCode = (code: CustomCode): boolean => code.css.trim() === "" && code.js.trim() === "";
