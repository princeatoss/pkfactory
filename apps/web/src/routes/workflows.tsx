import { createFileRoute } from "@tanstack/react-router";

import { WorkflowYamlPage } from "../components/workflows/WorkflowYamlPage";

export const Route = createFileRoute("/workflows")({
  component: WorkflowYamlPage,
});
