import * as Exit from "effect/Exit";
import * as Schema from "effect/Schema";

import { PKFactoryProjectFile, PKFACTORY_PROJECT_FILE_SCHEMA_URL } from "@pkfactory/contracts";

import { fromLenientJson } from "./schemaJson.ts";

/**
 * Codec between the raw `pkfactory.json` file contents (lenient JSONC string) and the
 * decoded {@link PKFactoryProjectFile}.
 */
export const PKFactoryProjectFileFromJson = fromLenientJson(PKFactoryProjectFile);

const decodePKFactoryProjectFile = Schema.decodeExit(PKFactoryProjectFileFromJson);

/**
 * Decode raw `pkfactory.json` contents, treating invalid or malformed files as
 * absent. Clients use this to read optional defaults (scripts, thread env
 * mode) without surfacing decode errors to the user.
 */
export function parsePKFactoryProjectFile(contents: string): PKFactoryProjectFile | null {
  const decoded = decodePKFactoryProjectFile(contents);
  return Exit.isSuccess(decoded) ? decoded.value : null;
}

/**
 * Build the publishable JSON Schema document for `pkfactory.json` (draft 2020-12).
 *
 * Served from the marketing site at {@link PKFACTORY_PROJECT_FILE_SCHEMA_URL} so
 * editors get LSP support via a `$schema` reference.
 */
export function buildPKFactoryProjectFileJsonSchema(): Record<string, unknown> {
  const document = Schema.toJsonSchemaDocument(PKFactoryProjectFile);
  const jsonSchema: Record<string, unknown> = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: PKFACTORY_PROJECT_FILE_SCHEMA_URL,
    ...document.schema,
  };
  if (document.definitions && Object.keys(document.definitions).length > 0) {
    jsonSchema.$defs = document.definitions;
  }
  return jsonSchema;
}
