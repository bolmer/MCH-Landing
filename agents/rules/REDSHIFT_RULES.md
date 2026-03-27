---
trigger: model_decision
description: Load for Amazon Redshift SQL, diagnostics, stored procedures, DDL, or Redshift execution workflows
---

# Redshift Rules

> Knowledge base: .agent/memory/REDSHIFT_SQL_MEMORY.md

## Orchestration and Control Plane
- AWS Step Functions: Redshift Stored Procedures (SPs) are primarily triggered by AWS Step Functions.
- NiFi Scope: NiFi is used for base table migration (e.g., SAP to Redshift). Complex consolidation logic and SP orchestration occur in the AWS control plane, not within NiFi flows.
- Lineage: If lineage artifacts or flow backups exist, use them first for tracing dependencies before live introspection.

## Scope
- Use for Redshift SQL, warehouse diagnostics, stored procedures, DDL, performance review, and historical reprocessing.
- If the task is not Redshift-specific, use a more relevant rule set first.

## Preflight
1. Identify the task type: diagnostics, metadata, analytics, DDL, stored procedures, or reprocessing.
2. Prefer the cheapest reliable source: local backup, narrow catalog query, then live system views.
3. If the object may have changed today, trust live metadata over local backups.
4. Add a bounded time window before querying stl_*, svl_*, stv_*/sys_* views.
5. Validate runtime-sensitive patterns on the target cluster instead of assuming PostgreSQL behavior.

## Task Rules

### Diagnostics
- Prefer bounded diagnostics over broad scans.
- Set statement_timeout for manual diagnostics when waits or queueing are possible.
- Before retrying timed-out work, check locks and workload pressure.
- Do not treat a successful stored procedure call record as proof of correct data output; verify volume and stl_error.

### Metadata
- Prefer local SQL backups for stored procedure source if they are recent enough.
- If freshness is uncertain, query live metadata.
- Inspect real columns before using unfamiliar system views.
- Avoid broad sweeps when a narrow pg_catalog query or local file is enough.

### Stored Procedures
- Assume heavy orchestration may happen outside NiFi when the project uses Step Functions or other AWS control-plane tools.
- If lineage artifacts or flow backups exist, use them first for tracing.
- Pass only IN and INOUT parameters in CALL.
- For nested procedure value flow, use INOUT, not OUT.
- Do not rely on DROP PROCEDURE IF EXISTS in Redshift.
- Treat the signature deployed in the target cluster as the source of truth.

### Historical Reprocessing
- Prefer idempotent date-by-date or slice-by-slice reprocessing.
- If the requirement is "missing dates only", iterate the exact missing dates unless broader reprocessing is explicitly approved.
- If a wrapper procedure fails because of engine limits, use a dedicated reprocess procedure or a client-driven SQL artifact with explicit CALL statements.

### DDL and Analytics
- Choose DISTKEY from real high-volume join paths, not intuition.
- Choose SORTKEY from actual range and recency filters.
- Widen numeric precision before large aggregates when overflow risk exists.
- Keep the same ORDER BY across PERCENTILE_CONT expressions in the same select layer, or split them into separate layers.

## Catalog Compatibility
- Redshift is PostgreSQL-derived but not catalog-compatible with modern PostgreSQL.
- Do not assume modern columns exist in pg_stat_activity, stl_query, or other views.
- pg_stat_activity: Use datid, datname, procpid, usesysid, usename, current_query, query_start. No state column.
- svl_stored_proc_call: Use userid, session_userid, query, label, xid, pid, database, querytxt. No starttime, endtime, aborted, or proid.
- To get SP execution time/status, join svl_stored_proc_call.query with stl_query.query.
- pg_proc does not expose proargmodes; use oidvectortypes(p.proargtypes) with p.pronargs.
- pg_table_def does not expose ordinal position; use pg_attribute.attnum.
- In svv_relation_privileges and similar views, validate the real naming convention rather than assuming modern PostgreSQL column names.

## Operational Safety
- Never overwrite SQL or JSON backups in place; version them using YYYYMMDD.
- Add a bounded time filter to log and execution-history queries such as svl_stored_proc_call, stl_query, stl_insert, and similar views unless the task explicitly requires a wider historical scan.
- For rough row counts on large tables, prefer svv_table_info or stv_tbl_perm over COUNT(*).
- Avoid mass introspection through svv_columns when a narrower catalog query is enough.
- Validate stored procedure runs with both error state (stl_error) and data outcome.
- Query svl_stored_proc_messages ordered by record_id when RAISE INFO messages matter.
- In sys_query_history, expect user_id, not user_name; join to pg_user if needed.
- Run VACUUM as an isolated statement, outside of transaction blocks.
- If rerunning work after a timeout, check locks: SELECT pid, blocker_pid, lock_mode FROM stv_locks;

### Data Types and PL/pgSQL
- VARCHAR(n) is measured in bytes, not characters.
- If multibyte UTF-8 input is possible, leave extra headroom and validate with MAX(OCTET_LENGTH(col)).
- Treat 128 bit numeric data overflow as a precision-budget problem.
- Widen numeric types (e.g., to DECIMAL(38,4) or higher) only when large accumulations justify it.
- Use explicit casts for Redshift functions that are sensitive to input types when signature resolution is ambiguous.
- Avoid short PL/pgSQL variable names that can collide with SQL aliases.
- Prefer descriptive aliases inside PL/pgSQL.
- Validate each target signature and runtime pattern; do not generalize one wrapper to all procedures.

## Shell Execution
- Avoid large inline SQL strings in PowerShell or other quote-sensitive shells.
- Prefer a .sql file or a small script-based execution path when quoting is fragile.

## Anti-Patterns

### `COUNT(*)` on large tables for quick operational checks
- Why it is a problem: it can trigger unnecessary full-table work, consume I/O, and compete with production workloads just to answer a rough sizing question.
- Preferred approach: use `svv_table_info`, `stv_tbl_perm`, or another metadata source when an operational estimate is enough.

### `SELECT *` from `stl_*`, `svl_*`, `stv_*`, or broad `sys_*` views
- Why it is a problem: it pulls extra columns, increases scan cost, and often encourages unbounded diagnostics against large system history.
- Preferred approach: select only the columns you need and always add a bounded time filter unless the task explicitly requires a wider range.

### Choosing `DISTKEY` by intuition instead of observed join patterns
- Why it is a problem: a bad `DISTKEY` increases data redistribution and can produce expensive execution steps such as `DS_BCAST_INNER` and `DS_DIST_BOTH`.
- Preferred approach: choose distribution based on the most frequent large joins and validate with `EXPLAIN`.

### Passing `OUT` parameters in `CALL`
- Why it is a problem: Redshift procedure resolution does not expect `OUT` parameters in the call signature, so the call can fail with argument mismatch or procedure-not-found style errors.
- Preferred approach: pass only `IN` and `INOUT` parameters in `CALL`.

### Using nested procedures with `OUT` return flow
- Why it is a problem: nested procedure calls cannot use `OUT` to move values through child procedure boundaries in the way PostgreSQL users may expect.
- Preferred approach: use `INOUT` parameters and local variables for nested procedure value flow.

### Generalizing one successful wrapper pattern to all procedures
- Why it is a problem: version differences, parameter modes, and cluster-specific behavior can make a wrapper valid for one procedure and invalid for another.
- Preferred approach: validate the exact target procedure signature and a minimal runtime call in the target environment before scaling the pattern.

### Creating multiple functions/procedures with the same name but different inputs (Function Overloading)
- Why it is a problem: while Redshift supports function overloading, it causes severe ambiguity at runtime. If a caller uses an untyped literal or a variable with implicit casting, Redshift may resolve to the wrong function signature, causing silent precision loss, unexpected behavior, or execution failures.
- Preferred approach: avoid function overloading entirely. Give each function a distinct, descriptive name that reflects its specific input types or unique behavior (e.g., `calculate_tax_numeric` vs `calculate_tax_integer`).

### Reprocessing a full date range when only sparse missing dates are required
- Why it is a problem: it can do unnecessary work and alter data outside the intended scope.
- Preferred approach: iterate the exact missing dates unless broader recomputation is explicitly approved.

### Multiple `PERCENTILE_CONT` expressions with different `ORDER BY` clauses in one `SELECT`
- Why it is a problem: Redshift requires consistent ordering across `WITHIN GROUP` expressions in the same select layer.
- Preferred approach: keep the same `ORDER BY` expression across percentile calculations or split them into separate query layers.

### Querying logs without a time window
- Why it is a problem: unbounded log scans can become expensive, slow, and disruptive in operational contexts.
- Preferred approach: add a recent bounded filter such as the last hours or last day before widening the search.

### Using heavy live introspection when local backups or narrow catalog queries are enough
- Why it is a problem: it wastes time, increases token usage, and can turn a cheap metadata question into an expensive warehouse query.
- Preferred approach: check local backups first, then use the smallest live metadata query that can verify freshness or fill the gap.
