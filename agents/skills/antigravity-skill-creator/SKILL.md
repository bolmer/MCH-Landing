---
name: creating-skills
description: Generates high-quality, predictable, and efficient .agent/skills/ directories for the Antigravity environment. Use when the user requests to create or design a new skill.
---

# Antigravity Skill Creator

## When to use this skill
- Use when the user requests a new skill to be added to the project.
- Use when the goal is to standardize agent capabilities into portable directories.

## Workflow
- [ ] **Analyze Requirements**: Understand the specific task or capability needed.
- [ ] **Draft Structure**: Define the gerund name and folder name.
- [ ] **Initialize Folder**: Create `.agent/skills/<skill-name>/`.
- [ ] **Write SKILL.md**: Follow YAML frontmatter and writing principles.
- [ ] **Add Support Files**: Create scripts, examples, or resources if required.
- [ ] **Verification**: Ensure the skill follows the "Claude Way" and structural requirements.

## Instructions
### 1. Core Structural Requirements
Every skill generated must follow this folder hierarchy:
- `<skill-name>/`
    - `SKILL.md` (Required: Main logic and instructions)
    - `scripts/` (Optional: Helper scripts)
    - `examples/` (Optional: Reference implementations)
    - `resources/` (Optional: Templates or assets)

### 2. YAML Frontmatter Standards
The `SKILL.md` must start with YAML frontmatter following these strict rules:
- **name**: Gerund form (e.g., `testing-code`, `managing-databases`). Max 64 chars. Lowercase, numbers, and hyphens only. No "claude" or "anthropic" in the name.
- **description**: Written in **third person**. Must include specific triggers/keywords. Max 1024 chars.

### 3. Writing Principles (The "Claude Way")
- **Conciseness**: Assume the agent is smart. Focus only on the unique logic of the skill.
- **Progressive Disclosure**: Keep `SKILL.md` under 500 lines. Link to secondary files if needed.
- **Forward Slashes**: Always use `/` for paths.
- **Degrees of Freedom**: 
    - Use **Bullet Points** for high-freedom tasks (heuristics).
    - Use **Code Blocks** for medium-freedom (templates).
    - Use **Specific Bash Commands** for low-freedom (fragile operations).

### 4. Workflow & Feedback Loops
- **Checklists**: Include markdown checklists for state tracking.
- **Validation Loops**: "Plan-Validate-Execute" pattern.
- **Error Handling**: Scripts should be "black boxes"—run `--help` if unsure.

## Resources
- [See SKILL_TEMPLATE.md](resources/SKILL_TEMPLATE.md)
