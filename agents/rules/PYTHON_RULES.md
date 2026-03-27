---
trigger: glob
globs: "**/*.py, **/*.ipynb, pyproject.toml, uv.lock, requirements*.txt, .env*"
---

# 🐍 Python & Data Science Standards

## Tech Stack
- **Manager:** `uv`
- **Version:** Python 3.13+
- **Linting/Formatting:** `ruff check . --fix && ruff format .`
- **Type Checking:** `pyrefly check core/`
- **Testing:** `pytest -x` (fail fast)
- **Dependencies:** `uv pip install <pkg>` (NEVER raw pip)
- **Config:** `pyproject.toml` is the ONLY source of truth.

## Code Style
- Prefer `dataclasses` over dicts for structured data.
- **Logging:**
  - No `print()` in production code. Use `logging`.
  - Violations must be fixed immediately.
  - **Structured Logs (TOON):** Use Token-Oriented Object Notation for efficiency.
  - **Docstrings:** Usar estrictamente **Google-style docstrings**. Todo componente nuevo debe documentar `Args`, `Returns` y `Raises` de forma explícita.
- **Context Management:** Optimizar el flujo de tokens priorizando resúmenes. Para comandos ruidosos (installs, dumps), mostrar solo inicio/fin y errores. Superar el límite de ~100 líneas solo cuando el diagnóstico profundo de una secuencia lo requiera estrictamente.

## 🚨 Critical Safety (Data Integrity)
*Applies to production/finance/health data*
- **Zero Assumptions:** If observed != expected, STOP and ASK.
- **Destructive Ops:** No mass DELETE/TRUNCATE without explicit confirmation.
- **ETL:** Always compare source vs target counts.
- **Migrations:** Rollback mechanism MUST exist before execution.