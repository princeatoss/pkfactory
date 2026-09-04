import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  git: {
    deploymentEnabled: false,
  },
  installCommand: "npm install -g vite-plus && vp install --filter '@pkfactory/marketing...'",
  buildCommand: "vp run --filter @pkfactory/marketing build",
  outputDirectory: "dist",
};
