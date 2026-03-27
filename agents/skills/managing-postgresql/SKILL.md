---
name: managing-postgresql
description: Design a PostgreSQL-specific schema. Covers best-practices, data types, indexing, constraints, performance patterns, and advanced features. Highly relevant for Redshift logic.
---

# PostgreSQL Table Design

## Use this skill when
- Designing a schema for PostgreSQL or Redshift (as Redshift is based on Postgres 8.0.2).
- Selecting data types and constraints.
- Planning indexes, partitions, or RLS policies.
- Reviewing tables for scale and maintainability.

## Do not use this skill when
- You are targeting a non-PostgreSQL/Redshift database.
- You only need query tuning without schema changes.
- You require a DB-agnostic modeling guide.

## Instructions
1. Capture entities, access patterns, and scale targets (rows, QPS, retention).
2. Choose data types and constraints that enforce invariants.
3. Add indexes for real query paths and validate with `EXPLAIN`.
4. Plan partitioning or RLS where required by scale or access control.
5. Review migration impact and apply changes safely.

## Safety
- Avoid destructive DDL on production without backups and a rollback plan.
- Use migrations and staging validation before applying schema changes.

## Core Rules
- Define a **PRIMARY KEY** for reference tables. Use `BIGINT GENERATED ALWAYS AS IDENTITY`.
- **Normalize first (to 3NF)**; denormalize **only** for measured, high-ROI reads.
- Add **NOT NULL** everywhere it’s semantically required.
- Create **indexes for access paths you actually query** (especially FK columns).
- Prefer **TIMESTAMPTZ** for events; **NUMERIC** for money; **TEXT** for strings; **BIGINT** for integers.

## PostgreSQL “Gotchas” (Critical for Redshift Compatibility)
- **Identifiers**: unquoted → lowercased. Use `snake_case`.
- **FK indexes**: PostgreSQL/Redshift **does not** auto-index FK columns. Add them.
- **Sequences/identity have gaps**: Expected behavior due to concurrent transactions.
- **MVCC**: Updates/deletes leave dead tuples; vacuum handles them.

## Data Types
- **IDs**: `BIGINT GENERATED ALWAYS AS IDENTITY`.
- **Strings**: prefer `TEXT`; use `CHECK (LENGTH(col) <= n)` for limits.
- **JSONB**: Preferred over JSON (not supported in old Redshift, but relevant for modern PG/Athena).
- **Time**: `TIMESTAMPTZ` for timestamps; `INTERVAL` for durations. Avoid `TIMESTAMP`.

## Indexing & Performance
- **B-tree**: Default for equality/range queries.
- **Composite**: Order matters (leftmost prefix).
- **BRIN**: Very large, naturally ordered data (time-series).
- **Partial**: For hot subsets (`WHERE status = 'active'`).

## Special Considerations
- **Update-Heavy Tables**: Separate hot/cold columns; use `fillfactor`.
- **Insert-Heavy Workloads**: Minimize indexes; use `COPY` or multi-row `INSERT`.
- **Upsert-Friendly**: Use `ON CONFLICT (...) DO UPDATE`.
