---
trigger: glob
globs: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx, **/*.css, package.json, bun.lockb, next.config.*, tailwind.config.*"
---

# 🌐 Web & Next.js Standards


## Tech Stack
- **Runtime:** Bun
- **Language:** TypeScript
- **Framework:** Next.js 16 (App Router + Turbopack)

## Next.js Protocol
**Trigger:** `next` in `package.json`
- **Zero Hallucination:** NEVER rely on internal training data for Next.js APIs (v15+).
- **Retrieval-First:**
  1. Read `AGENTS.md` index.
  2. Search `.next-docs/`.
  3. Use `context7` fallback.
- **Missing Docs:** If `.next-docs/` is missing, ALERT user and request `codemod agents-md`.
- **Security:** Audit all Server Actions for `"use server"` and auth checks.

## 🎨 Aesthetics & Design (Mandatory Skill)
- **Skill Usage:** For ANY UI change, component creation, or styling task, you MUST invoke the `frontend-design` skill.
- **Protocol:**
  1. Calculate **DFII Score** before coding (Target: ≥ 8).
  2. Implement a **Differentiation Anchor** (No generic layouts).
  3. **Typography:** BANNED Inter/Roboto/System defaults. Use expressive pairings from Google Fonts (Inter is ONLY allowed for small body text if paired with an expressive display font).
- **Standards:** Premium, polished, responsive. If the result looks like a generic SaaS template, it's a FAILURE.
