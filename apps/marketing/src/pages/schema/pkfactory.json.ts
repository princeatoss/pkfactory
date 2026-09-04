import type { APIRoute } from "astro";

import { buildPKFactoryProjectFileJsonSchema } from "@pkfactory/shared/pkfactoryProjectFile";

// Rendered at build time; published at https://pkfactory.codes/schema/pkfactory.json so
// pkfactory.json files can reference it via "$schema" for editor/LSP support.
export const GET: APIRoute = () =>
  new Response(`${JSON.stringify(buildPKFactoryProjectFileJsonSchema(), null, 2)}\n`, {
    headers: { "Content-Type": "application/json" },
  });
