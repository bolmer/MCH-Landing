---
trigger: always_on
---

# Project Rules: Antigravity Helper (Templates & Tooling)

> **INHERITANCE**: strictly adhere to the coding standards and protocols defined in **Global Rules** (@.gemini/GEMINI.md), specifically regarding **Anti-hallucination**, **Diagnostics**, and **Data Integrity**.

### 0. 🚨 CRITICAL SAFETY (NON-NEGOTIABLE)

#### 0.1 Clinical Safety & Read-Only Default
- **CONTEXT**: We work for a CLINICAL RED. Data errors impact critical operations.
- **READ-ONLY DEFAULT**: Analysis scripts are **FORBIDDEN** from running `INSERT`/`UPDATE`/`DELETE` on external DBs (Redshift, Oracle) without authorization.
- **ZERO ASSUMPTIONS**: If observed != expected, STOP and ASK. Do not "fix" data discrepancies blindly.
- **PII & Secrets**: Zero tolerance for committing credentials or exposing patient data in logs.

#### 0.2 Data Isolation & Backups
- **Backups**: NEVER overwrite json backups; always use versioning (`_YYYYMMDD`).
- **Git Safety**: Run `git fetch` and compare with remote before starting major tasks.

## 🐘 Redshift & SQL Standards (Production-Learned)
- **Time Variables**: ALWAYS use `GETDATE()`. NEVER use `clock_timestamp`.
- **Duration**: Store as `INTEGER` seconds: `DATEDIFF(s, start, end)`. **BANNED**: `INTERVAL` type variables.
- **Date Math**: Use integer arithmetic (`v_date - n`). **BANNED**: `DATE - INTERVAL 'n DAY'` in CTEs (inconsistent returns).
- **SAP Dates**: Never compare `DATE` with `'00000000'`. Use `IS NULL`.
- **Performance**: Align `DISTKEY` with the most frequent JOIN key.
- **Money/Currency**: **STRICTLY BANNED** to use `INTEGER` or `BIGINT` for monetary values. ALWAYS use `NUMERIC(20,2)` or higher to prevent truncation.
- **Connectivity**: ACCESS to Redshift requires **Active VPN**. If connection fails, prompt user to check VPN before retrying.

## 1. 🚀 Golden Commands (Operational Truth)

| Task | Command | Description |
| :--- | :--- | :--- |
| **🌀 Master Cycle** | `python run_governance_cycle.py` | Runs full audit: Backup -> Deep Diff -> Security -> Alerting. |
| **💻 Dev Frontend** | `bun dev` | Starts Next.js 16 Dashboard (Port 3000). |
| **🔌 Dev Backend** | `uv run fastapi dev` | Starts FastAPI (Port 8000). |
| **📢 Teams Alert** | `.\scripts\Send-TeamsAlert.ps1` | Generates/Sends HTML report to MS Teams (Requires VPN). |
| **🔬 Deep Lineage** | `/rastro <tabla> <columna>` | Traces column lineage across NiFi and Redshift. |

### 1. 🛡️ CRITICAL SAFETY (TOOLING CONTEXT)
- **NON-DESTRUCTIVE DEFAULT**: Scripts de automatización (`parallel_swarm.ps1`, `scaffold_project.py`, etc.) deben operar en modo **Dry-Run** o pedir confirmación explícita antes de modificar archivos fuera del directorio de pruebas.
- **ISOLATION**: 
  - Los workflows de agentes (Swarm/Singularity) deben respetar el aislamiento por proyecto (`-ProjectName`).
  - **Ejecución Paralela**: DEBE usar **Git Worktrees** en `.agent/worktrees/` para cualquier tarea de escritura concurrente.
  - **Logs**: Deben escribirse en `.agent/traces/` en formato JSONL.

## 🏗️ Adherencia a Arquitectura Estándar
Este proyecto DEBE seguir la estructura global definida en `GEMINI.md`:
- `.agent/`, `.git/`, `docs/`, `scripts/`, `core/`, `cache/`, `logs/`.
- **Importante**: La carpeta `.agent/mockup/` ha sido **DEPRECADA** y eliminada. No regenerarla.
- **Nuevos Scripts**: Colocar en `scripts/` (o subcarpeta adecuada).
- **Templates**: Centralizar en una ubicación compatible con la nueva arquitectura (ej. `core/templates/` o `docs/templates/` si son solo de referencia).

## 🛠️ Stack Tecnológico (Core)

### Python (Tooling & Scripts)
- **Gestor**: **uv** (Reemplaza pip/poetry).
- **Linter/Formatter**: **Ruff** (Estricto).
- **Type Checking**: **PyRefly** (Rápido) + **BasedPyright** (Estricto).
- **Seguridad**: **Bandit** + **Scan Secrets**.

### Powershell (Orquestación)
- **Versión**: PowerShell 7+ (pwsh).
- **Estilo**: PascalCase para funciones, verb-noun naming convention.
- **Ejecución de Scripts**: **EVITAR** *one-liners* complejos (ej: `python -c "import os;..."`) desde la terminal, ya que el parser de PowerShell rompe comillas y puntos y comas. **SIEMPRE** escribe un archivo `.py` en la carpeta `scripts/` temporal o final y ejecútalo mediante `uv run scripts/tu_script.py`.

### Infrastructure & MCP
- **MCP Servers**: Context7, Filesystem.
- **Node.js**: Bun (para herramientas JS/TS si las hubiera).

## ⚙️ Development Workflow & Standards
1. **Scripting**:
    - Todo script en `scripts/` debe tener `if __name__ == "__main__":`.
    - Argumentos via `argparse` o `click`.
    - Logs estructurados (no print debugging en prod).

2. **Templates**:
    - Verificar compatibilidad hacia atrás al modificar templates existentes.

3. **Workflows**:
    - Definidos en `.agent/workflows/`.
    - Documentación clara en el header del archivo `.md`.

4. **Testing**:
    - Python: `pytest tests/` (si aplica).
    - Manual: Verificar ejecución en entorno aislado.

## 🤖 Comportamiento por Modelo AI

> **Referencia completa**: Ver sección correspondiente en `@.gemini/GEMINI.md`.

### Claude Opus (Modo Planning)
- **🚫 NO IMPLEMENTAR AUTOMÁTICAMENTE**: Solo generar plan detallado.
- **✅ Esperar confirmación explícita** del usuario antes de ejecutar cualquier cambio.
- **Palabras clave para proceder**: "implementa", "ejecuta", "hazlo", "procede".

### Gemini
- **✅ Puede planificar e implementar** de forma autónoma.
- **Aplica todas las demás reglas** de este proyecto.
