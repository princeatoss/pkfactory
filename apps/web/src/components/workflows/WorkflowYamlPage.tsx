import type { EnvironmentProject } from "@pkfactory/client-runtime/state/models";
import {
  isAtomCommandInterrupted,
  squashAtomCommandFailure,
} from "@pkfactory/client-runtime/state/runtime";
import { CheckIcon, FileCode2Icon, LoaderCircleIcon, RefreshCwIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { isElectron } from "../../env";
import { useProjectFileQuery } from "../files/projectFilesQueryState";
import { projectEnvironment } from "../../state/projects";
import { useProjects } from "../../state/entities";
import { useAtomCommand } from "../../state/use-atom-command";
import { Button } from "../ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "../ui/select";
import { SidebarInset } from "../ui/sidebar";
import { stackedThreadToast, toastManager } from "../ui/toast";
import { WorkspaceBreadcrumb, WorkspaceBreadcrumbItem } from "../WorkspaceBreadcrumb";
import { WorkspacePageContainer } from "../WorkspacePageContainer";
import { WorkspacePageHeader } from "../WorkspacePageHeader";

export const WORKFLOW_FILE_PATH = "pkfactory.workflows.yaml";

const NEW_WORKFLOW_YAML = `version: 1

workflows:
  - name: My workflow
    enabled: false
    schedule: "*/15 * * * *"
    provider:
      name: codex
      model: gpt-5.6-codex
      effort: high
    prompt: |
      Describe what the agent should do.
`;

function projectKey(project: EnvironmentProject): string {
  return `${project.environmentId}:${project.id}`;
}

function WorkflowYamlEditor({ project }: { readonly project: EnvironmentProject }) {
  const file = useProjectFileQuery(
    project.environmentId,
    project.workspaceRoot,
    WORKFLOW_FILE_PATH,
  );
  const writeFile = useAtomCommand(projectEnvironment.writeFile, {
    reportDefect: false,
    reportFailure: false,
  });
  const loadedContents = file.data?.contents ?? NEW_WORKFLOW_YAML;
  const [draft, setDraft] = useState(() => ({
    base: loadedContents,
    contents: loadedContents,
  }));
  const [saving, setSaving] = useState(false);
  const contents = draft.base === loadedContents ? draft.contents : loadedContents;
  const dirty = contents !== loadedContents;
  const save = useCallback(async () => {
    if (saving || !dirty) return;

    setSaving(true);
    const result = await writeFile({
      environmentId: project.environmentId,
      input: {
        cwd: project.workspaceRoot,
        relativePath: WORKFLOW_FILE_PATH,
        contents,
      },
    });
    setSaving(false);

    if (result._tag === "Failure") {
      if (!isAtomCommandInterrupted(result)) {
        const error = squashAtomCommandFailure(result);
        toastManager.add(
          stackedThreadToast({
            type: "error",
            title: "Workflow YAML was not saved",
            description:
              error instanceof Error ? error.message : "The environment rejected the file.",
          }),
        );
      }
      return;
    }

    setDraft({ base: contents, contents });
    file.refresh();
    toastManager.add({ type: "success", title: "Workflow YAML saved" });
  }, [contents, dirty, file, project.environmentId, project.workspaceRoot, saving, writeFile]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.key.toLowerCase() !== "s") return;
      if (!event.metaKey && !event.ctrlKey) return;
      event.preventDefault();
      void save();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [save]);

  const reload = () => {
    setDraft({ base: loadedContents, contents: loadedContents });
    file.refresh();
  };

  return (
    <section className="flex min-h-[34rem] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs/5">
      <div className="flex min-h-12 items-center gap-3 border-b border-border px-4">
        <FileCode2Icon className="size-4 shrink-0 text-icon-muted" aria-hidden />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{WORKFLOW_FILE_PATH}</div>
          <div className="truncate text-xs text-muted-foreground">{project.workspaceRoot}</div>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          {saving ? "Saving…" : dirty ? "Unsaved" : file.data ? "Saved" : "New file"}
        </span>
        <Button
          aria-label="Reload workflow YAML"
          disabled={file.isPending || saving}
          onClick={reload}
          size="icon-sm"
          variant="ghost"
        >
          <RefreshCwIcon className="size-3.5" />
        </Button>
        <Button disabled={!dirty || saving} onClick={() => void save()} size="sm">
          {saving ? (
            <LoaderCircleIcon className="size-3.5 animate-spin" />
          ) : (
            <CheckIcon className="size-3.5" />
          )}
          Save
        </Button>
      </div>

      {file.isPending && !file.data ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
          Loading workflow YAML…
        </div>
      ) : (
        <textarea
          aria-label="Workflow YAML"
          autoCapitalize="off"
          autoCorrect="off"
          className="min-h-[31rem] flex-1 resize-none bg-transparent p-4 font-mono text-[13px] leading-6 text-foreground outline-none selection:bg-primary/20"
          onChange={(event) =>
            setDraft({ base: loadedContents, contents: event.currentTarget.value })
          }
          spellCheck={false}
          value={contents}
        />
      )}

      {file.error && !file.data ? (
        <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          No workflow file is loaded. Saving creates {WORKFLOW_FILE_PATH} in this project.
        </div>
      ) : null}
    </section>
  );
}

export function WorkflowYamlPage() {
  const projects = useProjects();
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selectedProject = useMemo(
    () => projects.find((project) => projectKey(project) === selectedKey) ?? projects[0] ?? null,
    [projects, selectedKey],
  );

  const topbarContent = (
    <div className="flex w-full min-w-0 items-center gap-3">
      <WorkspaceBreadcrumb ariaLabel="Workflows breadcrumb" className="min-w-0">
        <WorkspaceBreadcrumbItem current>
          <h1>Workflows</h1>
        </WorkspaceBreadcrumbItem>
      </WorkspaceBreadcrumb>
      {selectedProject ? (
        <Select
          value={projectKey(selectedProject)}
          onValueChange={(value) => setSelectedKey(value)}
        >
          <SelectTrigger
            aria-label="Workflow project"
            className="ms-auto w-auto max-w-72"
            size="compact"
            variant="ghost"
          >
            <SelectValue>{selectedProject.title}</SelectValue>
          </SelectTrigger>
          <SelectPopup align="end" alignItemWithTrigger={false}>
            {projects.map((project) => (
              <SelectItem key={projectKey(project)} value={projectKey(project)}>
                <div className="min-w-0">
                  <div className="truncate">{project.title}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {project.workspaceRoot}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectPopup>
        </Select>
      ) : null}
    </div>
  );

  return (
    <SidebarInset className="h-dvh min-h-0 overflow-hidden overscroll-y-none bg-background text-foreground isolate">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-foreground">
        <WorkspacePageHeader electron={isElectron}>{topbarContent}</WorkspacePageHeader>
        <ScrollArea className="min-h-0 flex-1">
          <WorkspacePageContainer width="wide">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Workflow YAML</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Define project workflows directly in YAML. Visual workflow building is not included.
              </p>
            </div>

            {selectedProject ? (
              <WorkflowYamlEditor key={projectKey(selectedProject)} project={selectedProject} />
            ) : (
              <Empty className="min-h-[28rem] rounded-xl border border-dashed border-border">
                <EmptyMedia variant="icon">
                  <FileCode2Icon />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>Add a project first</EmptyTitle>
                  <EmptyDescription>
                    Workflow YAML belongs to a project folder on a connected environment.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </WorkspacePageContainer>
        </ScrollArea>
      </div>
    </SidebarInset>
  );
}
