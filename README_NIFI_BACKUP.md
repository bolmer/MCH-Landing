# 🦅 NiFi Data Governance Suite (UCC)

Plataforma enterprise de **Gobernanza de Datos** para Apache NiFi: visibilidad operativa en tiempo real, linaje profundo a nivel de columna y auditoría de integridad clínica.

---

## 🚀 Inicio Rápido (Full Suite)

Para levantar **todo el ecosistema** (Backend API + Dashboard Frontend) con un solo comando:

```bash
uv run python scripts/launch_dashboard.py
```
*   **API**: [http://localhost:8000/docs](http://localhost:8000/docs)
*   **Dashboard**: [http://localhost:3000](http://localhost:3000)

---


## 🚀 Acciones Rápidas (Cheat Sheet)

### 1. El "Golden Command" (Ciclo Maestro)
Este script es el orquestador principal. Descarga el estado actual de NiFi, audita riesgos, calcula cambios, extrae metadatos de DB y **envía alertas a Teams automáticamente** si detecta incidentes críticos o desviaciones de linaje.
```bash
python run_governance_cycle.py
```
**Ejecuta en secuencia (11 pasos):**
1.  **Backup**: Descarga el último estado (JSON).
2.  **Auditoría Integral**: Analiza riesgos y seguridad (Secrets, PII).
3.  **Deep Diff**: Compara con la versión anterior (Cambios SQL).
4.  **Diagrama Linaje**: Genera el grafo visual (Vis.js).
5.  **Dashboard Exporter**: Actualiza métricas y buscador para el frontend.
6.  **Respaldo SPs**: Descarga procedimientos de Redshift.
7.  **Linaje Técnico**: Reconstruye el motor de dependencias SP -> NiFi.
8.  **Metadata DB**: Extrae metadatos nativos de Redshift/Oracle.
9.  **Diccionario**: Genera `data_dictionary.md` cruzando NiFi + DB.
10. **Cobertura SAP**: Audita la ingesta de tablas críticas.
11. **Mirror Audit**: Verifica aislamiento de esquemas espejo.
12. **Grafo Unificado**: Consolida `NiFi -> SP -> AWS/PBI snapshots` para consultas de impacto y documentación.

### 1.1 Grafo Unificado y Orquestación AWS
Para reconstruir el grafo técnico consolidado usando artefactos locales:
```bash
uv run python scripts/lineage/build_unified_graph.py
```

Para leer Step Functions, EventBridge Rules y EventBridge Scheduler en **modo read-only** y guardar snapshot local:
```bash
uv run python scripts/lineage/export_aws_inventory.py --confirm-read-only --profile <PROFILE> --region <REGION>
```

### 2. Ver Dashboard (Frontend)
Para abrir la interfaz visual de monitoreo y chat:
```bash
bun dev
# Abrir en navegador: http://localhost:3000
```

### 3. Enviar Alerta Ejecutiva (Teams)
Para generar el reporte HTML con incidentes operativos y enviarlo manualmente:
```powershell
# Opción A: Actualizar datos y enviar (v3)
.\scripts\Send-TeamsAlert.ps1 -GenerateFirst

# Opción B: Enviar reporte existente (requiere VPN UC)
.\scripts\Send-TeamsAlert.ps1 -HtmlFile reports/teams_alert_latest.html
```

---

## 🛠️ Catálogo de Herramientas

### 🔥 Auditorías Blindadas (Críticas)
| Herramienta | Comando / Endpoint | Descripción |
| :--- | :--- | :--- |
| **🛡️ Auditoría Integral** | `POST /api/audit/analyze` | **(Migrado a API)** Detecta PII, Secrets, CRONs rápidos y cambios en SQL. |
| **🔬 Deep Audit Diff** | `uv run python deep_diff_audit.py` | Compara versiones. Detecta **Tablas Huérfanas** (TRUNCATE sin LOAD) y genera reportes HTML interactivos. |
| **🧠 Deep Lineage** | `/rastro <tabla> <columna>` | **(NUEVO)** Linaje a nivel de campo. Rastrea el origen real cruzando NiFi y SPs. |
| **💣 Impact Analysis** | `/impacto <tabla>` | **(NUEVO)** Calcula el "Blast Radius" de un cambio en una tabla. |
| **☁️ AWS Orchestration Map** | `GET /api/lineage/orchestration/sp/{sp}` | **(NUEVO)** Detecta Step Functions, EventBridge Rules y Schedules asociados a un SP. |
| **🚀 Live Diagnostics** | `GET /api/live/bulletins` | **(NUEVO)** Monitoreo en tiempo real de errores y congestión de colas. |

### 🚨 Alertas Activas y Protocolo Clínico
El sistema aplica el principio de **"Silencio Clínico"**: las notificaciones automáticas solo se disparan ante riesgos operativos reales para evitar la fatiga de alarmas.

| ID | Regla | Categoría | Estado | Descripción |
|:---|:---|:---|:---|:---|
| **A3** | **Aggressive Sched**| Operacional | **ACTIVA** | Cron Jobs ejecutándose por segundo (`* * * * * *`). **Crítica.** |
| **A4** | **SQL Drift** | Integridad | **ACTIVA** | Detecta cambios en la query SQL. Clasificado como **Atención**. |
| **D1** | **JDBC URL Drift** | Seguridad | **ACTIVA** | Cambio en la URL de conexión a base de datos. |
| **D2** | **S3 Bucket Drift** | Seguridad | **ACTIVA** | Cambio en el bucket de destino S3. |
| **D3** | **IAM Role Drift** | Seguridad | **ACTIVA** | Cambio en roles o credenciales AWS. |
| **E1** | **State Drift** | Operacional | Inactiva | Procesador habilitado/deshabilitado inesperadamente. |
| **B1** | **Dead Flows** | Operacional | Inactiva | Flujos habilitados sin tráfico en 24 horas. |
| **B2** | **Aged FlowFiles** | Operacional | Inactiva | Colas con datos estancados (>24h). |
| **E2** | **Manual Stop** | Operacional | Inactiva | Procesadores detenidos manualmente (Bypass). |
| **-**  | **SELECT *** | Info | **ACTIVA** | Cambios en queries tipo `SELECT *`. Clasificado como **Info**. |

### 📣 Enviar Alertas a Teams (PowerShell)

Las alertas críticas se pueden enviar directamente a un canal de Microsoft Teams usando el script de PowerShell.

**Requisitos:**
- VPN activa (conexión a red UC).
- Credenciales de Windows para el servidor `CMCPVW214`.

**¿Cómo funciona?**
1. El script se conecta remotamente al servidor `CMCPVW214` via PowerShell Remoting (Puerto 5985).
2. Desde ese servidor (que está en la red interna UC), envía el correo a `mail.med.puc.cl`.
3. El servidor de correo entrega el mensaje al canal de Teams configurado.
4. **v2.2**: Ahora detecta y adjunta automáticamente el detalle de cambios SQL (`sql_diff_detalle`).

> 💡 Las credenciales se guardan cifradas en `$env:USERPROFILE\.nifi_creds.xml` para no pedirlas cada vez.

### Operaciones Base
| Herramienta | Comando / Endpoint | Descripción |
| :--- | :--- | :--- |
| **Backup NiFi** | `uv run python backup_nifi.py` | Descarga el JSON del Process Group configurado. |
| **Respaldo SPs** | `POST /api/backup/sps/trigger` | **(Migrado a API)** Descarga Stored Procedures de Redshift. |
| **Setup Inicial** | `uv run python setup_auditoria.py` | Crea tablas en DB, vistas y baselines iniciales. |
| **Dashboard Sync** | `uv run python scripts/dashboard_exporter.py` | Exporta JSON estático para `dashboard/` (Next.js). |
| **Alertas Smart** | `backend.services.alert_service` | **(Migrado a API)** Motor de alertas predictivas integrado. |
| **Reporte Diario** | `uv run python daily_report.py` | Genera HTML con resumen ejecutivo de las últimas 24h. |

### Inteligencia y Entrenamiento (Machine Learning)
| Herramienta | Descripción |
| :--- | :--- |
| `scripts/calculate_baselines.py` | Calcula promedios históricos, std dev y P95 para detección de anomalías. |
| `scripts/learn_behavior.py` | Aprende patrones de horario (inicio/fin) para calcular SLAs dinámicos. |


### Auditoría Técnica y Metadatos
| Herramienta | Descripción |
| :--- | :--- |
| **Diccionario de Datos**| `scripts/utils/data_dictionary.py` - Catálogo unificado de tablas y columnas (NiFi + DB). |
| **Grafo Unificado** | `scripts/lineage/build_unified_graph.py` - Consolida NiFi, SPs y snapshots AWS/PBI en un solo JSON. |
| **Inventario AWS Read-Only** | `scripts/lineage/export_aws_inventory.py` - Descubre Step Functions y EventBridge sin modificar AWS. |
| **Metadatos DB** | `scripts/utils/extract_db_metadata.py` - Extracción técnica de Redshift/Oracle/SQL Server. |
| **Cobertura SAP** | `scripts/sap_coverage_report.py` - Audita si las tablas SAP esperadas están en flujos NiFi. |
| **Aislamiento Mirror**| `scripts/audit_sp_mirror.py` - Detecta fugas de datos hacia esquemas maestros en SPs espejo. |
| **Linaje Visual** | `scripts/CICLO_GOBERNANZA/lineage_diagram.py` - Genera grafos: `Origen` → `S3` → `Destino`. |
| **Historial SPs** | `scripts/report_sp_history.py` - Reporte ejecutivo de ejecución de SPs en PRD. |
| **Diagnóstico Runtime**| `scripts/check_sp_execution.py` - Utilidad de debugging para SPs y logs de NiFi. |
| **Secret Detector** | `detect_secrets.py` - Escáner legacy de credenciales (Complementario). |

### 🤖 Componentes Chatbot & Búsqueda
| Herramienta | Descripción |
| :--- | :--- |
| `nifi_chatbot_cli.py` | Asistente de IA (CLI). Diagnóstica alertas, explica linaje profundo y genera documentación. |
| `generar_documentacion_flujo` | Genera una ficha técnica (Markdown) automática basada en el análisis de impacto. |
| `trazar_columna` | Rastrea el origen técnico de una columna específica (Linaje campo a campo). |
| `analizar_impacto_tabla` | Identifica qué procesos y SPs se verían afectados por un cambio en la tabla. |
| `analizar_orquestacion_sp` | Identifica qué Step Functions y EventBridge participan en la ejecución de un SP. |

### 🛠️ Troubleshooting & VPN
1. **Redshift Timeout**: Si el bot responde "⚠️ Error de conexión", verifica que estar conectado a la **VPN Global**.
2. **Missing Token**: Si el script falla en `get_token`, las credenciales de NiFi en `.env` podrían haber expirado.
3. **VPN NiFi**: El diagnóstico en vivo (`/live`) requiere acceso a la red interna donde reside la API de NiFi.

---

- **Tecnología**: NiFi (Ingesta), FastAPI (Backend), Next.js 16 (Visualización).
- **Semántica**: El concepto principal es el **Flujo de Integración** (un conjunto lógico de procesadores que mueven datos), no el "Proceso" técnico.
- **Data Log Sources**:
  - `integraciones.status_procesos_nifi_V2`: Es un log exclusivo de los **flujos de NiFi** (Ingestas). NO contiene información de ejecución de Stored Procedures de Redshift.
  - `svl_stored_proc_call`: Única fuente de verdad para la ejecución técnica de **Stored Procedures** en Redshift.
- **Seguridad**:

  - `AuditService` escanea configuraciones estáticas (backups) en busca de PII y Secrets.
  - `AlertService` monitorea la ejecución operativa (Tiempos, SLAs).
- **Integridad**: Scripts operan en **Modo Read-Only**. PROHIBIDO modificar datos productivos.

---

## 🏛️ Estándar de Arquitectura Global (Obligatorio)

Todo nuevo desarrollo en este repositorio debe adherirse estrictamente a la **Constitución Global (@.gemini/GEMINI.md)**.

### Estructura de Carpetas Mandatoria: crear subcarpetas y subsub carpetas para mantener orden!
- `.agent/`: Workflows, memoria (GEMINI.md), reglas y traces.
- `docs/`: Documentación temática (api, maintenance, etc.).
- `scripts/`: Utilidades y automatización.
- `core/`: Lógica de negocio y código fuente principal.
- `cache/`: Temporales y DBs volátiles (no versionados).
- `logs/`: Registros de ejecución (no versionados).

### Guías de Operación y Mantenimiento
- [**Guía de Reinicio Seguro PBIRS**](docs/guides/GUIA_REINICIO_SEGURO_PBIRS.md): Protocolo manual para mantenimiento del Report Server.
- [Guía Alertas PBIRS](docs/GUIA_ALERTAS_PBIRS.md): Conexión y auditoría de fallos.
- [Guía Validación AWS Read-Only](docs/guides/GUIA_VALIDACION_MANUAL_AWS_READ_ONLY.md): Protocolo seguro para mapear Step Functions y EventBridge.
- [Guía Subida PBIX Remota](docs/GUIA_UPLOAD_PBIX_REMOTO.md): Automatización de despliegues.
- [Informe Auditoría de Datos](docs/INFORME_AUDITORIA_VALIDACION.md): Métricas de integridad.

### 🏆 Regla de Oro para Futuros Desarrollos (SaaS / Docker Readiness)
**Zero Local Coupling**: Desarrollar en Windows, pero programar para Linux/Docker.
1. **Rutas Dinámicas**: Usa `pathlib` (Python) o `process.cwd()` (Node). NUNCA `C:\...`.
2. **Desacoplamiento .env**: Todo recurso externo (DB, NiFi, Puertos) va en variables de entorno.
3. **Storage Volátil**: Asumir que `reports/` y `backups/` migrarán a un Bucket S3/MinIO.

**Protocolo de Acción:**
1. **Subcarpetas**: Agrupar elementos por tema (ej. `scripts/audit`).
2. **Backups**: NUNCA sobrescribir; usar versionado (`_YYYYMMDD`).
3. **Refactor**: Si se detecta desviación, se debe sugerir una sesión de **Housekeeping**.


---

## 📁 Estructura del Proyecto

```
nifi_backup/
├── .agent/                  ← Memoria, Workflows y Traces (Cumplimiento Global)
├── backend/                 ← API FastAPI Modular (Servicios: Audit, Alert, Metadata)
├── dashboard/               ← Frontend Next.js 16 (App Router)
├── core/                    ← Librerías y Lógica Core (Database, Storage, Logging)
│   ├── governance/          ← Motor de Auditoría y Linaje (Centralizado)
│   │   ├── auditor.py       ← Reglas de NiFi (Sec, PII, Scheduling)
│   │   ├── lineage.py       ← Parseo SQL y Construcción de Grafos
│   │   └── rules/           ← Sub-reglas modulares (Legacy auditors)
├── docs/                    ← Documentación Estratégica, Roadmaps y API
├── scripts/                 ← Utilidades de análisis y automatización
├── backups/                 ← Histórico de JSONs de NiFi y SPs
├── reports/                 ← Salida de auditorías (Markdown, JSON, HTML)
├── cache/                   ← Archivos volátiles (No versionado)
├── logs/                    ← Registros de ejecución (No versionado)
├── bot/                     ← Lógica del Chatbot IA (Refactorizar a backend/core)
├── legacy/                  ← Scripts Deprecados (Referencia histórica)
└── run_governance_cycle.py  ← Script Maestro
```

---

## 📚 Documentación (`/docs`)

### 🗺️ Estrategia y Roadmap
| Archivo | Contenido |
|---------|-----------|
| **[ROADMAP_NIFI_GOVERNANCE.md](./docs/ROADMAP_NIFI_GOVERNANCE.md)** | **📍 Documento Maestro**. Estado de implementación y alertas pendientes. |
| [ARCHITECTURE_PLAN.md](./docs/ARCHITECTURE_PLAN.md) | Visión técnica agnóstica del backend y servicios. |
| [ARCHITECTURE_PLAN_UCC.md](./docs/ARCHITECTURE_PLAN_UCC.md) | Implementación específica para la infraestructura UCC. |
| [BASE_IMPLEMENTATION_PLAN.md](./docs/BASE_IMPLEMENTATION_PLAN.md) | Plan de refactorización modular. |

### 🛠️ Planes Detallados (`/docs/plans`)
| Archivo | Contenido |
|---------|-----------|
| [PLAN_FASE1_BACKEND_FRONTEND.md](./docs/plans/PLAN_FASE1_BACKEND_FRONTEND.md) | Backend FastAPI + Integración Dashboard. |
| [PLAN_FASE2_ALERTAS_CHATOPS.md](./docs/plans/PLAN_FASE2_ALERTAS_CHATOPS.md) | Chatbot + Integración Teams. |
| [PLAN_FASE3_ACTIVATOR_ESCALADO.md](./docs/plans/PLAN_FASE3_ACTIVATOR_ESCALADO.md) | Docker Compose + Seguridad multi-tenant. |
| [PLAN_ALERTAS_AVANZADAS_NIFI.md](./docs/plans/PLAN_ALERTAS_AVANZADAS_NIFI.md) | **16 reglas de auditoría** (Fases A-E). |
| [LINEAJE_CICLO_INGRESOS.md](./docs/LINEAJE_CICLO_INGRESOS.md) | **Linaje y Orquestación**. Mapa de dependencias Redshift + AWS. |
| [WORKFLOW_GENERACION_LINEAJE.md](./docs/WORKFLOW_GENERACION_LINEAJE.md) | **Guía de Automatización**. Metodología para generar documentación. |

---

## 🔒 Integridad y Seguridad

TODOS LOS SCRIPTS DEBEN OPERAR EN MODO READ-ONLY. NO SE DEBE MODIFICAR NINGUN DATO DE PRODUCCION.

---

## 📚 Referencia de Negocio (Legacy)

Antiguamente existía una lógica de clasificación de procesos basada en el nombre (`scripts/discovery_catalogo.py`).

```python
# Lógica de Categorización por Nombre (Referencia)
if any(k in name_upper for k in ["SAP", "FI", "AR", "BSIS", "BKPF"]):
    category["sistema_origen"] = "SAP"
elif any(k in name_upper for k in ["TRAKCARE", "MR_", "PA_"]):
    category["sistema_origen"] = "TrakCare"
```

> **Nota sobre Gobernanza TrakCare:** 
> - **Extracción Directa**: El equipo de Datos lee directamente desde la Base de Datos maestra de TrakCare (típicamente **InterSystems Cache / IRIS**). Se detectan frecuentemente tablas con pre-fijos como `PA_` (Patient Administration), `MR_` (Medical Records), `CT_` (Code Tables), y `ARC_` (Billing/Items). Ejemplos: `MR_Observations`, `CT_Hospital`, `CT_Sex`.
> - **Vía Externa (HEALTHCONNECT)**: Existe adicionalmente **HealthConnect**, un motor de integración externo al equipo de Datos que también procesa y provee datos en tiempo real de TrakCare. Ambos vectores (Ingesta directa + HealthConnect) deben considerarse al rastrear el linaje del ecosistema HIS.
