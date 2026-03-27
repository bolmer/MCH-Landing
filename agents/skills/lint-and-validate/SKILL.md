---
name: lint-and-validate
description: "Automatic quality control, linting, and static analysis procedures. Use after every code modification to ensure syntax correctness and project standards. Triggers onKeywords: lint, format, check, validate, types, static analysis."
allowed-tools: Read, Glob, Grep, Bash
---

# Lint and Validate Skill

> **MANDATORY:** Run appropriate validation tools after EVERY code change. Do not finish a task until the code is error-free.

### Procedures by Ecosystem

#### Node.js / TypeScript (Bun & Biome)
1. **Lint/Format:** `bunx biome check --write .` (Project Standard)
   - *Note: We use Biome, not ESLint/Prettier.*
2. **Types:** `bunx tsc --noEmit`
   - *Note: Ensure tsconfig.json is respected.*
3. **Security:** `bun x knip` (Detect unused exports/dependencies)

#### Python (Modern Stack)
1. **Linter/Formatter (Ruff):** `uv run ruff check . --fix` AND `uv run ruff format .`
   - *Note: We use Ruff, not Flake8/Black.*
2. **Types (PyRefly/BasedPyright):** `uv run basedpyright .` 
   - *Note: We prioritize PyRefly/BasedPyright over MyPy for speed.*
3. **Security:** `uv run bandit -r . -ll`

## The Quality Loop
1. **Write/Edit Code**
2. **Run Audit:**
   - **JS/TS**: `bunx biome check . && bunx tsc --noEmit`
   - **Python**: `uv run ruff check . && uv run basedpyright .`
3. **Analyze Report:** Check the "FINAL AUDIT REPORT" section.
4. **Fix & Repeat:** Submitting code with "FINAL AUDIT" failures is NOT allowed.

## Error Handling
- If `biome` fails: Run with `--write` or `--apply` to auto-fix safe issues.
- If `tsc` fails: Correct type mismatches. Do NOT suppress with `@ts-ignore` without a strict reason.
- If `ruff` fails: Run with `--fix`.
- If no tool is configured: Check `pyproject.toml` or `biome.json`.

---
**Strict Rule:** No code should be committed or reported as "done" without passing these checks.

---

## Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `scripts/lint_runner.py` | Unified lint check | `uv run python scripts/lint_runner.py <project_path>` |
| `scripts/type_coverage.py` | Type coverage analysis | `uv run python scripts/type_coverage.py <project_path>` |
