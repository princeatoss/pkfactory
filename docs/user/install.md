# Install PK Factory

PK Factory is a web and desktop GUI for running coding agents on your machine.

## Requirements

Node.js `^22.16 || ^23.11 || >=24.10` on the machine that runs the PK Factory server.

At least one provider runtime, installed and authenticated. You can install Antigravity from
PK Factory settings. See [Providers](#providers) below.

## Run Without Installing

```bash
npx pkfactory@latest
```

This starts the PK Factory server on your machine and opens the local web app. Use
`npx pkfactory@latest --help` for the full CLI reference.

If the web or desktop app shows "PK Factory could not load", check your connection and select
**Reload** to try again.

## Open a project in the desktop app

When the PK Factory desktop app is running on the same machine, open the current directory with:

```bash
npx pkfactory app
```

Pass a path to open another directory:

```bash
npx pkfactory app ../my-project
```

The command adds the directory as a project when needed, focuses the desktop app, and opens a new
thread. It does not launch the desktop app, open a browser, or start a PK Factory server. A background
server does not count as the desktop app. The command also rejects SSH sessions because a remote
shell cannot focus a local desktop window. The CLI package and the running desktop app must both
include `pkfactory app` support.

## Desktop App

Download the latest release from
[GitHub Releases](https://github.com/princeatoss/pkfactory/releases), or install from a package
registry.

Windows:

```bash
winget install PKFactoryTools.PKFactory
```

macOS:

```bash
brew install --cask pkfactory
```

Arch Linux:

Stable:

```bash
yay -S pkfactory-bin
```

Nightly:

```bash
yay -S pkfactory-nightly-bin
```

### Windows Subsystem for Linux

When the desktop app runs a WSL backend, it installs the matching server runtime into
`~/.pkfactory/wsl-runtime` inside the selected distro. The first launch after installing or updating PK Factory
Code may take a little longer while that release's runtime is extracted. Later launches reuse the
Linux-local copy so startup does not depend on reading application files through `/mnt/c`. After a
successful launch, PK Factory keeps the current runtime and one previous runtime for rollback and
removes older caches automatically. If a cached runtime stops working, PK Factory launches from the
application files under `/mnt/c` instead and reinstalls the runtime on the next launch.

## Providers

PK Factory uses provider runtimes but does not bundle them. Install and authenticate each
provider's CLI, or use PK Factory's managed setup for Antigravity.

| Provider    | CLI                                                                                                        | Default binary        | Log in with                           |
| ----------- | ---------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------- |
| Codex       | [Codex CLI](https://developers.openai.com/codex/cli)                                                       | `codex`               | `codex login`                         |
| Claude      | [Claude Code](https://claude.com/product/claude-code)                                                      | `claude`              | `claude auth login`                   |
| Cursor      | [Cursor CLI](https://cursor.com/cli)                                                                       | `cursor-agent`        | `agent login`                         |
| Grok Build  | [Grok Build CLI](https://x.ai/cli)                                                                         | `grok`                | `grok login`                          |
| OpenCode    | [OpenCode](https://opencode.ai)                                                                            | `opencode`            | `opencode auth login`                 |
| Antigravity | [Official ACP agent](https://github.com/agentclientprotocol/registry/blob/main/antigravity-acp/agent.json) | Managed by PK Factory | **Sign in with Google** in PK Factory |

Codex and Claude are on by default. Cursor, Grok Build, OpenCode, and Antigravity are off by
default. Turn them on in **Settings** > **Providers** when you want to use them.

For Antigravity, select the environment in provider settings, then install and sign in there.
The runtime and credentials stay on that environment, even when you use a phone or remote
browser. See [Antigravity setup](./providers-antigravity.md) for Google sign-in, remote callback
steps, and supported hosts.

Cursor is the one to watch: install Cursor CLI, which provides the `cursor-agent` binary that
PK Factory looks for, but authenticate with `agent login`, not `cursor-agent login`.

Grok models that support adjustable reasoning show a **Reasoning** control beside the model picker.
The available levels and default come from the installed Grok Build CLI, so they can vary by model
and CLI version.

Run CLI login commands on the machine running the PK Factory server, not on the device you browse
from. Antigravity uses its sign-in controls in PK Factory instead of a CLI login command.

### Binary Discovery

Each provider CLI must be on the server's `PATH`, or have an explicit binary path set in
**Settings** → the provider instance → **Binary path**. Use the explicit path when a version
manager or a non-standard install location keeps the CLI off the `PATH` of the shell that
started PK Factory.

Antigravity can use its managed runtime without a `PATH` entry. Its optional **Binary path**
overrides the managed runtime and must point to the official ACP executable.

### When Auth Is Needed

Provider auth is required before you start a session with that provider, not before you start
PK Factory. You can install PK Factory, open it, and add providers afterwards. A provider that is not
authenticated shows its status and setup instructions in **Settings**.

For multi-account setups, see [Codex](./providers-codex.md), [Claude](./providers-claude.md), and
[Antigravity](./providers-antigravity.md#accounts-and-removal).

## Next Steps

- [Permission modes](./permission-modes.md): how much PK Factory asks before acting
- [Remote access](./remote-access.md): connect from a phone, tablet, or another desktop
- [Keeping PK Factory in sync](./updating.md): client and server version skew
- [Running in the background](./background-service.md): Linux background service
