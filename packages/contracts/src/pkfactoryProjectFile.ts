import * as Schema from "effect/Schema";
import * as SchemaTransformation from "effect/SchemaTransformation";

import { ThreadEnvMode } from "./environment.ts";
import { ProjectScriptIcon } from "./orchestration.ts";

/** File name of the checked-in PK Factory project file, resolved at the workspace root. */
export const PKFACTORY_PROJECT_FILE_NAME = "pkfactory.json";

/** Public URL of the published JSON Schema for {@link PKFactoryProjectFile}. */
export const PKFACTORY_PROJECT_FILE_SCHEMA_URL = "https://pkfactory.codes/schema/pkfactory.json";

const PKFACTORY_PROJECT_FILE_PATH_MAX_LENGTH = 512;
const PKFACTORY_PROJECT_FILE_MAX_SCRIPTS = 50;

// Annotations go on the encoded (string) side so they survive into the
// published JSON Schema; decoding still trims and re-validates non-emptiness.
const trimmedNonEmpty = (annotations: { readonly description: string }, maxLength?: number) => {
  const annotated = Schema.String.annotate(annotations);
  const encoded =
    maxLength === undefined
      ? annotated.check(Schema.isNonEmpty())
      : annotated.check(Schema.isNonEmpty(), Schema.isMaxLength(maxLength));
  return encoded.pipe(Schema.decodeTo(encoded, SchemaTransformation.trim()));
};

export const PKFactoryProjectFileScript = Schema.Struct({
  name: trimmedNonEmpty({
    description: "Display name for the script, shown in the PK Factory scripts menu.",
  }),
  command: trimmedNonEmpty({
    description: "Shell command executed in a PK Factory terminal at the project root.",
  }),
  icon: Schema.optionalKey(
    ProjectScriptIcon.annotate({
      description: 'Icon shown next to the script in the scripts menu. Defaults to "play".',
    }),
  ),
  runOnWorktreeCreate: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "When true, the script runs automatically after a worktree is created for a new thread.",
    }),
  ),
  previewUrl: Schema.optionalKey(
    trimmedNonEmpty({
      description:
        "URL opened in the in-app browser preview when this script runs. Only honored on the desktop build.",
    }),
  ),
  autoOpenPreview: Schema.optionalKey(
    Schema.Boolean.annotate({
      description:
        "When true, automatically open the preview panel at `previewUrl` the moment the script starts.",
    }),
  ),
}).annotate({
  description: "A project script that team members can import into PK Factory.",
});
export type PKFactoryProjectFileScript = typeof PKFactoryProjectFileScript.Type;

export const PKFactoryProjectFile = Schema.Struct({
  $schema: Schema.optionalKey(
    Schema.String.annotate({
      description: `URL of the JSON Schema for this file, typically "${PKFACTORY_PROJECT_FILE_SCHEMA_URL}".`,
    }),
  ),
  iconPath: Schema.optionalKey(
    trimmedNonEmpty(
      {
        description:
          'Workspace-relative path to the project icon (e.g. "assets/logo.svg"). Checked before PK Factory\'s built-in icon locations.',
      },
      PKFACTORY_PROJECT_FILE_PATH_MAX_LENGTH,
    ),
  ),
  defaultThreadEnvMode: Schema.optionalKey(
    ThreadEnvMode.annotate({
      description:
        'Where new threads start for this repository: "worktree" for a fresh git worktree, "local" for the current checkout. A per-project setting in PK Factory overrides this; when neither is set, the global default applies.',
    }),
  ),
  scripts: Schema.optionalKey(
    Schema.Array(PKFactoryProjectFileScript)
      .annotate({
        description:
          "Project scripts shared with everyone who opens this repository in PK Factory.",
      })
      .check(Schema.isMaxLength(PKFACTORY_PROJECT_FILE_MAX_SCRIPTS)),
  ),
}).annotate({
  title: "PK Factory project file",
  description:
    "Checked-in project configuration for PK Factory (pkfactory.json at the repository root). See https://pkfactory.codes for documentation.",
});
export type PKFactoryProjectFile = typeof PKFactoryProjectFile.Type;
