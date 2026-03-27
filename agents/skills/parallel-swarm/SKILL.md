---
name: parallel-swarm
description: Experto en ejecutar tareas paralelas usando el Swarm V11 (Hive Mind) y Singularity, gestionando ramas y worktrees.
---

# Parallel Swarm Ecosystem (V11 Worktrees Edition)

Sistema de agentes autónomos para desarrollo de software con aislamiento atómico, validación estricta y ruteo estratégico de modelos.

## 💡 Motivación
Optimizar el uso de la cuota de AI existente mediante la ejecución paralela en **Git Worktrees aislados** (`.swarm_worktrees`), garantizando que cada cambio sea independiente, seguro y validado localmente antes de integrarse en la rama principal.

## ⚠️ Regla Crítica: Aislamiento de Flujos
El parámetro `-TaskFile` es **OBLIGATORIO**. Cada flujo de trabajo debe tener su propio archivo de tareas para evitar colisiones.
No sobrescribas ni borres archivos de tareas pendientes.

```powershell
# ✅ CORRECTO - Flujo aislado
pwsh scripts/swarm/parallel_swarm.ps1 -TaskFile .agent/tasks_feat_auth.md

# ❌ ERROR - El script fallará si no se especifica -TaskFile
pwsh scripts/swarm/parallel_swarm.ps1
```

## Modos de Operación

### 1. Swarm V11 (Worktree Mode)
Ejecuta tareas de forma paralela en directorios físicos independientes, validando localmente y realizando `git merge` automáticamente al finalizar cada tarea de forma exitosa.

```powershell
pwsh scripts/swarm/parallel_swarm.ps1 -TaskFile .agent/tasks_mi_feature.md [-WorkerCount 4] [-ProviderStrategy scout-driven]
```

## Características Core (V11)

- **Worktree Isolation**: Cada agente trabaja en una carpeta separada temporal fuera de la raíz del proyecto (`.swarm_worktrees`), evitando conflictos de archivos en tiempo de ejecución.
- **Provider Routing**: Soporta diferentes estrategias `-ProviderStrategy`:
  - `gemini-only`: Solo usa Gemini local.
  - `round-robin`: Balancea entre API Key local y CLI.
  - `role-based`: Asigna modelos pesados/ligeros según el prefijo de la tarea (ej: `[backend]`, `[frontend]`, `[qa]`).
  - `scout-driven`: Verifica cuotas (`swarm_limits.yaml`, Kilo, Groq, Gemini) y selecciona el mejor proveedor disponible en tiempo real.
- **Auto-Merge y Calidad (Watcher v2)**: Al terminar un agente, sus cambios se validan *localmente* (con `ruff` y `pytest`). Si el 'diff' es superior a 50 líneas, la IA evalúa el cambio ("AI Watcher") contra el `CONTRACT.yaml`. Solo si aprueba, se commitea y se hace merge `--no-ff` a main.
- **Paramedic V11 (Auto-Healing)**: Si un agente falla sus validaciones o provoca errores durante la tarea, Paramedic (Gemini 3 Flash) analiza el log `agent_log.txt` para proveer diagnósticos instantáneos, actualizando automáticamente el archivo de tareas (hasta 2 intentos máximos).
- **Observability**: Estructura unificada en `traces/`, `logs/` con reportes automáticos, además de límites diarios en `usage_stats.json`.

## Seguridad y Prevención de Infinite Loops
- **Protección de Consumo Diario**: Se monitoriza el número de ciclos en `usage_stats.json`.
- **Validation Fallback**: Las tareas rechazadas son marcadas como `[FAILED]` (con el motivo: Lint Error, AI Rejected o Merge Conflict) para evitar bloqueos del swarm y proteger la rama principal.
- **Auto-Cleanup**: Los Worktrees transitorios se limpian automáticamente sin contaminar la estructura del proyecto original.

## Ejecución del Architect Agent (Generador de Tareas)
```powershell
python .\scripts\swarm\architect.py [--project subcarpetas]
```
Analiza las estructuras del proyecto de forma silenciosa para identificar mejoras (limpio de `.venv` / `.git`) y genera dinámicamente el listado de tareas bajo un objetivo puntual en `swarm_tasks.md`.
