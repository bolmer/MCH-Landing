---
trigger: glob
globs: Dockerfile, docker-compose*.yml, *.sh, *.ps1, .github/**/*.yml, .vscode/*.json
---

# 🐳 Infrastructure & Shell Standards

## Hybrid Environment (Windows Host + Linux Docker)
- **Paths:** ALWAYS use `pathlib.Path` or `os.path.join()`. No hardcoded `\` or `/`.
- **Line Endings:** Docker files (`Dockerfile`, `entrypoint.sh`) MUST use **LF**.
- **Command Targeting:**
  - **Start containers/builds:** Default to Linux/Bash context.
  - **Local scripts/tools:** Default to Windows/PowerShell.
  - **Ambiguity:** Ask "Host or Container?".
- **Docker:** `Dockerfile` context must be minimal.

## Swarm & Task Management
- **TaskFile:** ALWAYS specify `-TaskFile`.
- **Isolation:** Never overwrite pending task files.
- **Naming:** `.agent/tasks_[feat|fix|refactor]_<name>.md`
- **Execution:**
  ```powershell
  .\scripts\agents\parallel_swarm.ps1 -TaskFile .agent/tasks_feat_xyz.md
  ```
