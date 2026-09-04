import * as Option from "effect/Option";

export type JoinPath = (first: string, ...segments: string[]) => string;

function normalizeConfiguredBaseDir(pkfactoryHome: Option.Option<string>): Option.Option<string> {
  if (Option.isNone(pkfactoryHome)) {
    return Option.none();
  }
  const trimmed = pkfactoryHome.value.trim();
  return trimmed.length > 0 ? Option.some(trimmed) : Option.none();
}

export function resolveDesktopBaseDir(input: {
  readonly homeDirectory: string;
  readonly joinPath: JoinPath;
  readonly pkfactoryHome: Option.Option<string>;
}): string {
  return Option.getOrElse(normalizeConfiguredBaseDir(input.pkfactoryHome), () =>
    input.joinPath(input.homeDirectory, ".pkfactory"),
  );
}

export function resolveDesktopStateDir(input: {
  readonly baseDir: string;
  readonly isDevelopment: boolean;
  readonly joinPath: JoinPath;
  readonly pkfactoryHome: Option.Option<string>;
}): string {
  const useDevSubdir =
    input.isDevelopment && Option.isNone(normalizeConfiguredBaseDir(input.pkfactoryHome));
  return input.joinPath(input.baseDir, useDevSubdir ? "dev" : "userdata");
}
