# Workflow YAML

Open **Workflows** from the bottom of the sidebar or from the command palette. Choose a project and
edit its `pkfactory.workflows.yaml` file directly in PK Factory.

The file lives at the root of the selected project on its environment. This means a remote
project's workflow file is read from and saved to the remote machine, while a local project's file
stays in its local folder.

This first version is YAML-only. It does not include a visual workflow canvas or execute scheduled
workflows yet.
