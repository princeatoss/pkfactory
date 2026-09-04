/**
 * PKFactoryProjectFileLoader - Effect service that loads the checked-in `pkfactory.json`
 * project file from a workspace root.
 *
 * Loading is best-effort: a missing file resolves to `Option.none`, and
 * unreadable or invalid files are logged and treated as absent so callers
 * can fall back to their defaults.
 *
 * @module PKFactoryProjectFileLoader
 */
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as FileSystem from "effect/FileSystem";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Path from "effect/Path";
import * as Schema from "effect/Schema";

import { PKFACTORY_PROJECT_FILE_NAME, type PKFactoryProjectFile } from "@pkfactory/contracts";
import { PKFactoryProjectFileFromJson } from "@pkfactory/shared/pkfactoryProjectFile";

const decodePKFactoryProjectFileJson = Schema.decodeEffect(PKFactoryProjectFileFromJson);

export class PKFactoryProjectFileLoadError extends Schema.TaggedErrorClass<PKFactoryProjectFileLoadError>()(
  "PKFactoryProjectFileLoadError",
  {
    operation: Schema.Literals(["read", "decode"]),
    workspaceRoot: Schema.String,
    filePath: Schema.String,
    cause: Schema.Defect(),
  },
) {
  override get message(): string {
    return `Failed to ${this.operation} ${PKFACTORY_PROJECT_FILE_NAME} at ${this.filePath}.`;
  }
}

/** Service tag for pkfactory.json project file loading. */
export class PKFactoryProjectFileLoader extends Context.Service<
  PKFactoryProjectFileLoader,
  {
    /**
     * Load and decode `pkfactory.json` at the workspace root.
     *
     * Never fails: missing, unreadable, or invalid files resolve to
     * `Option.none` (invalid files are logged as warnings).
     */
    readonly load: (workspaceRoot: string) => Effect.Effect<Option.Option<PKFactoryProjectFile>>;
  }
>()("pkfactory/project/PKFactoryProjectFileLoader") {}

const logPKFactoryProjectFileLoadError = (error: PKFactoryProjectFileLoadError) =>
  Effect.logWarning(error).pipe(
    Effect.annotateLogs({
      operation: error.operation,
      workspaceRoot: error.workspaceRoot,
      filePath: error.filePath,
      errorTag: error._tag,
    }),
  );

export const make = Effect.gen(function* () {
  const fileSystem = yield* FileSystem.FileSystem;
  const path = yield* Path.Path;

  const load: PKFactoryProjectFileLoader["Service"]["load"] = Effect.fn(
    "PKFactoryProjectFileLoader.load",
  )(function* (workspaceRoot) {
    const filePath = path.join(workspaceRoot, PKFACTORY_PROJECT_FILE_NAME);
    const raw = yield* fileSystem.readFileString(filePath).pipe(
      Effect.map(Option.some),
      Effect.catchTags({
        PlatformError: (error) =>
          error.reason._tag === "NotFound"
            ? Effect.succeed(Option.none<string>())
            : logPKFactoryProjectFileLoadError(
                new PKFactoryProjectFileLoadError({
                  operation: "read",
                  workspaceRoot,
                  filePath,
                  cause: error,
                }),
              ).pipe(Effect.as(Option.none<string>())),
      }),
    );
    if (Option.isNone(raw)) {
      return Option.none<PKFactoryProjectFile>();
    }
    return yield* decodePKFactoryProjectFileJson(raw.value).pipe(
      Effect.map(Option.some),
      Effect.catchTags({
        SchemaError: (error) =>
          logPKFactoryProjectFileLoadError(
            new PKFactoryProjectFileLoadError({
              operation: "decode",
              workspaceRoot,
              filePath,
              cause: error,
            }),
          ).pipe(Effect.as(Option.none<PKFactoryProjectFile>())),
      }),
    );
  });

  return PKFactoryProjectFileLoader.of({ load });
});

export const layer = Layer.effect(PKFactoryProjectFileLoader, make);
