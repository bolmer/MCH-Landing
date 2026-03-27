---
name: delegating-to-codex
description: Use when encountering a highly complex programming task, or when requested to verify an architecture plan created by Gemini or Claude. This skill explains how to invoke the Codex CLI natively as an expert reviewer or solver.
---

# Codex Delegation & Verification

## 💡 Cuándo usar esta skill
1. **Verificación de Planes (Planning Mode):** Si estás en un rol de Arquitecto (ej. Claude o Gemini) y has creado un `implementation_plan.md` complejo, puedes delegar parte de la validación a Codex para cruzar chequeos antes de aplicarlo.
2. **Tareas de Alta Complejidad:** Cuando la tarea de código sea matemáticamente compleja, implique algoritmos de bajo nivel, bases de datos masivas o cuando un agente de Kilo/Gemini no logre resolver un bug persistente tras 2 intentos de Auto-Healing.

## 🛠️ Cómo invocar a Codex vía CLI (Modo Worker)
Dado que Codex está integrado en el entorno de Antigravity (vía `pwsh` o `bun`), puedes ejecutarlo en modo "Robot" (no interactivo/headless) pasándole un archivo o string de entrada y capturando su salida. 

### Comando Base No Interactivo (Exec)
Asegúrate de ejecutar Codex usando el path absoluto de su entorno o el binario accesible vía la CLI: `C:\Users\matia\.bun\bin\codex.exe`.

```powershell
# En PowerShell, puedes invocar a Codex así:
$promptText = "Eres un Experto Arquitecto. Revisa rigurosamente este plan de implementacion detectando vulnerabilidades de token limits y bugs logicos. Plan: " + (Get-Content -Raw .agent/implementation_plan.md)

# Ejecución headless con JSONL output log (Fuerza alto razonamiento):
& "C:\Users\matia\.bun\bin\codex.exe" exec -c reasoning_effort="high" --full-auto -o ".agent/traces/codex_review.txt" --json "$promptText"
```

## 🔄 Flujo de Validación de Planes (Watcher / Review)
1. **Genera tu Plan Inicial:** Como Gemini, diseña la propuesta arquitectónica o el `implementation_plan.md`.
2. **Solicita Review al Agente Codex:** Ejecuta el comando CLI pasando el contenido del plan, como se mostró arriba. Asegúrate de pedir "crítica severa".
3. **Bloquea y Espera:** Haz un `Wait` de que Codex finalice. 
4. **Lee la Respuesta:** Lee el archivo `.agent_codex_review.txt` (usando la tool `view_file` de Antigravity).
5. **Itera o Ejecuta:** Si Codex halla errores, corrige tu plan. Si indica "OK", procede con la creación del Worktree o modificaciones.

## ⚠️ Reglas Especiales Críticas (Safety)
- **Bloqueo Interactivo:** **NO** ejecutes el comando base `codex` a secas. Codex abrirá su interfaz en terminal, esperando inputs de usuario, lo cual colgará el flujo de automatización y cortará nuestra sesión. SIEMPRE usa `codex exec`.
- **Modo YOLO:** La bandera `--full-auto` confiere a Codex la capacidad de re-escribir archivos para arreglar bugs si se lo pides explícitamente. Asume que estás en una `.swarm_worktrees` segura antes de darle control autónomo.
- **Output JSONL:** Si tu orquestador en Python/Powershell necesita procesar paso a paso qué herramienta está ejecutando Codex, pipea su salida `stdout` con `--json`.
- **Salida Limpia (Anti-Root Pollution):** NUNCA ensucies los directorios estructurales volcando el output de Codex directamente en `./`, `.agent/`, `scripts/` o `docs/`. Usa **SIEMPRE** carpetas efímeras designadas para esto (e.g. `logs/swarm/`, `.agent/traces/`, o dentro del `.swarm_worktrees/` actual). Utiliza la bandera `-o <DirectorioSeguro>/output.md`.

## 📜 Resiliencia Inter-Agencia
Si tú (como Gemini) tienes un *Agent Loop* atascado fallando repetitivamente (por ejemplo, con un error oscuro de TypeScript o Pytest):
1. Formula un prompt corto con el `agent_log.txt`.
2. Lanza un worker de Codex en background pasándole el prompt.
3. Extrae la función corregida a partir de la respuesta en el archivo de salida `-o`.
