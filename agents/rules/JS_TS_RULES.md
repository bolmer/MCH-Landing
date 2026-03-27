---
trigger: glob
globs: "**/*.js, **/*.jsx, **/*.mjs, **/*.cjs, **/*.ts, **/*.tsx, **/*.mts, **/*.cts"
---

# JavaScript & TypeScript Standards (Agent-Enforced)

> Goal: prevent silent runtime bugs, unsafe edits, and low-confidence changes. Favor explicit contracts, type safety, and verifiable outcomes.

## 0. Agent Protocol (Mandatory)
- Never invent APIs, props, library options, or object fields. Confirm from local code, type definitions, or project docs.
- Before editing, identify impacted modules and call sites.
- For non-trivial behavior changes, add or update tests in the same scope.
- Never claim a fix without running validation commands and checking their output.
- Prefer minimal, scoped diffs. Do not perform opportunistic refactors unless explicitly requested.
- If behavior is ambiguous, stop and ask instead of guessing.

## 1. Language Baseline
- Prefer TypeScript for new code.
- If TypeScript is present, `tsconfig.json` must include:
  - `strict: true`
  - `noUncheckedIndexedAccess: true`
  - `exactOptionalPropertyTypes: true`
  - `noImplicitOverride: true`
- For JavaScript-only files, use `// @ts-check` when feasible and JSDoc for public contracts.
- `any` is banned except at external boundaries (legacy or third-party adapters). Narrow immediately with `unknown` plus guards.

## 2. Contracts and Runtime Validation
- Validate all external inputs at boundaries: API responses, env vars, URL params, localStorage, postMessage, and DOM datasets.
- Use schema validation (`zod`, `valibot`, or project standard) where data crosses trust boundaries.
- Shared cross-module objects must have explicit defaults and guard rails (`?.`, `??`, `typeof`, `in`).
- If a field is read in a different module than where it is defined, include a fallback or explicit failure path.

## 3. Async and Error Handling
- No unhandled promises. Use `await` or explicit handling like `void task().catch(reportError)`.
- Any business logic inside `setTimeout` or `setInterval` must have internal `try/catch`.
- Use `AbortController` for cancellable async operations when lifecycle can end early.
- Throw `Error` objects (or typed domain errors), never raw strings.
- UI paths must expose recoverable failure states, not silent failures.

## 4. Module Boundaries and Exports
- Prefer named exports for reusable modules. Use default exports only when framework conventions require them.
- Avoid side effects at import time unless file purpose is explicitly side-effectful.
- Document module public contracts when files are concatenated or injected.
- For injected scripts, add an `EXPORTS` header comment describing globally exposed symbols.

## 5. Nullability and Safe Access
- Treat optional/nullable values as unsafe until narrowed.
- Avoid deep property access without guards.
- Prefer optional chaining and nullish coalescing over brittle fallback logic.
- Prefer early returns for invalid states to reduce nested branching.

## 6. Security Rules
- `eval`, `new Function`, and dynamic code execution are forbidden.
- Do not write unsanitized user input to `innerHTML`.
- Never hardcode credentials, tokens, or secrets.
- Enforce auth checks explicitly in server actions/routes where applicable.
- Avoid logging secrets, personal data, or security-sensitive payloads.

## 7. Performance Rules
- Measure before optimizing; avoid speculative micro-optimizations.
- Do not introduce avoidable `O(n^2)` logic in hot paths.
- Memoize only when profiling or render analysis justifies it.
- Use pagination or virtualization for large lists.
- Lazy-load heavy, non-critical modules/components.

## 8. Testing and Quality Gates
- Minimum coverage for changed behavior:
  1. Unit tests for business logic.
  2. Integration tests for cross-module behavior when applicable.
  3. Regression tests for fixed bugs.
- Keep tests deterministic: no real network calls and no timing flakiness.
- Before marking complete, run relevant:
  - lint
  - type-check
  - tests

## 9. Logging and Observability
- Avoid raw `console.log` in production paths; use the project logger or structured wrapper.
- Prefix logs/errors with module context (example: `[AutoAccept]`).
- Log enough context to debug quickly, without sensitive data exposure.

## 10. Naming and Readability
- Public function names should be descriptive and verb-led (`buildPayload`, `fetchUserProfile`).
- Booleans should use `is`, `has`, `can`, or `should`.
- Avoid cryptic abbreviations in exported/public APIs.
- Keep functions cohesive; extract helpers when branching or responsibilities grow.

## 11. Done Criteria for AI Agents
- Change is minimal and scoped to the request.
- Contracts are explicit through types and runtime validation at boundaries.
- Quality gates pass for the touched scope.
- Assumptions and limitations are documented in handoff notes.
