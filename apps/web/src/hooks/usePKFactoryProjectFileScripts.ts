import {
  PKFACTORY_PROJECT_FILE_NAME,
  type EnvironmentId,
  type PKFactoryProjectFile,
  type PKFactoryProjectFileScript,
} from "@pkfactory/contracts";
import { parsePKFactoryProjectFile } from "@pkfactory/shared/pkfactoryProjectFile";
import { useMemo } from "react";

import { useProjectFileQuery } from "~/components/files/projectFilesQueryState";

const NO_SCRIPTS: ReadonlyArray<PKFactoryProjectFileScript> = [];

export interface PKFactoryProjectFileState {
  /**
   * - `valid`: pkfactory.json exists and decoded.
   * - `invalid`: pkfactory.json exists but fails to decode (the server then ignores
   *   the whole file, including `iconPath` and every script).
   * - `missing`: no readable pkfactory.json at the workspace root.
   * - `loading`: the file query has not settled yet.
   */
  status: "loading" | "missing" | "invalid" | "valid";
  /** The decoded file when status is `valid`, null otherwise. */
  file: PKFactoryProjectFile | null;
  scripts: ReadonlyArray<PKFactoryProjectFileScript>;
}

/**
 * Decoded state of the project's checked-in `pkfactory.json`, including whether the
 * file exists but is broken — which the runtime otherwise swallows silently.
 */
export function usePKFactoryProjectFileState(
  environmentId: EnvironmentId,
  cwd: string | null,
): PKFactoryProjectFileState {
  const query = useProjectFileQuery(
    environmentId,
    cwd ?? "",
    PKFACTORY_PROJECT_FILE_NAME,
    cwd !== null,
  );
  const contents = query.data && !query.data.truncated ? query.data.contents : null;
  const isPending = query.isPending;
  return useMemo(() => {
    if (contents === null) {
      return {
        status: isPending ? "loading" : "missing",
        file: null,
        scripts: NO_SCRIPTS,
      } as const;
    }
    const file = parsePKFactoryProjectFile(contents);
    if (file === null) {
      return { status: "invalid", file: null, scripts: NO_SCRIPTS } as const;
    }
    return { status: "valid", file, scripts: file.scripts ?? NO_SCRIPTS } as const;
  }, [contents, isPending]);
}

/**
 * Scripts declared in the project's checked-in `pkfactory.json`, offered in the
 * scripts menu for import. Missing, truncated, or invalid files resolve to
 * an empty list.
 */
export function usePKFactoryProjectFileScripts(
  environmentId: EnvironmentId,
  cwd: string | null,
): ReadonlyArray<PKFactoryProjectFileScript> {
  return usePKFactoryProjectFileState(environmentId, cwd).scripts;
}
