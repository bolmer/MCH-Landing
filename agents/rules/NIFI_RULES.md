---
trigger: model_decision
description: Reglas para la gestión, auditoría y diagnóstico de flujos en Apache NiFi
---

# 🌀 NiFi Operational Rules

> **CONTEXT**: NiFi se encarga de la ingesta base (SAP -> S3 -> Redshift). La orquestación de SPs ocurre en AWS Step Functions.

## 1. Monitoring & Logging Protocol
- **`status_procesos_nifi_V2` Integrity:** Esta tabla es un log exclusivo de flujos de NiFi.
    - Se alimenta mediante procesadores `ReplaceText` + `PutSQL` que marcan el inicio y fin de una ingesta.
    - **PROHIBIDO** usar esta tabla para validar la finalización de un Stored Procedure (SP) de Redshift.
- **NiFi Ingestion Timing:** La mayoría de las ingestas inician entre las 00:00 y las 04:00 AM.
- **Backpressure Awareness:** Al auditar flujos vivos, priorizar la detección de colas con "Aged FlowFiles" (>24h) o saturación de backpressure.

## 2. Flow Identification (Naming Convention)
- Los flujos de SAP suelen seguir el patrón `carga_<N_TABLA>` (ej. `carga_MARA`, `carga_EKKO`).
- Si un proceso en NiFi menciona un SP, probablemente es solo para gatillar una carga mínima o limpiar stage, pero la lógica pesada reside en Redshift.

## 3. Diagnostic Futiltiy
- **No buscar lógica de negocio compleja en NiFi:** Si el problema es de balance de inventario o cálculo de KPIs, la causa raíz está en los SPs de Redshift o en la transformación SQL, no en el movimiento de datos de NiFi.
- **VPN Requirement:** Para diagnósticos en vivo (`/live`), es mandatorio estar conectado a la red interna que tiene visibilidad sobre la API de NiFi.
