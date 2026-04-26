# Codetrace Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3002
> **Base URL**: `http://localhost:3002/api`
> **Swagger UI**: `http://localhost:3002/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: Codetrace

El microservicio **codetrace** es el **bounded context transversal de auditoría y observabilidad**
del ecosistema. Centraliza las trazas de ejecución (logs estructurados con correlación por
`correlationId` / `traceId`) emitidas por todos los demás microservicios vía Kafka o HTTP, para
análisis forense, debugging cross-service y reconstrucción de flujos de negocio.

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Ingesta de trazas con correlación cross-service | codetrace |
| UH-2 | Consulta de trazas por correlationId, traceId o eventName | codetrace |
| UH-3 | Retención configurable + TTL automático | codetrace |

---

## 2. Modelo DSL

El modelo se ubica (si aplica) bajo `models/` y cumple DSL v2. No hay dependencias cross-context.

| Modelo XML | Versión | Descripción |
|------------|---------|-------------|
| `codetrace.xml` | 1.0.0 | Entrada de traza estructurada |

---

## 3. Arquitectura

Mismos patrones que el resto del ecosistema: **CQRS + Event Sourcing + Kafka + Hexagonal
Architecture + DDD**. Este servicio consume topics Kafka de TODOS los demás microservicios para
registrar trazas; también expone ingesta HTTP para entornos sin Kafka.

### 3.3. Estructura de carpetas por módulo

Idéntica a la del resto del ecosistema (ver [security-service/src/docs/README.md](../../../security-service/src/docs/README.md) secciones 3.2 y 3.3 para el diagrama completo).

---

## 4. Módulos del Microservicio

### 4.1. Codetrace
- **Entidad**: `Codetrace` — correlationId, traceId, sourceService, eventName, level, message, payload, emittedAt
- **CRUD**: create/update/delete + queries por correlationId/traceId/eventName
- **Rol**: sink universal de trazas estructuradas

---

## 5. Eventos Publicados

| Módulo | Evento | Tópico Kafka | Versión |
|--------|--------|--------------|---------|
| codetrace | `CodetraceCreatedEvent` | `codetrace-created` | 1.0.0 |
| codetrace | `CodetraceUpdatedEvent` | `codetrace-updated` | 1.0.0 |
| codetrace | `CodetraceDeletedEvent` | `codetrace-deleted` | 1.0.0 |

---

## 6. Eventos Consumidos

Este servicio **consume todos los topics del ecosistema** (modo broadcast listener) para materializar
trazas. Ver `src/modules/codetrace/shared/adapters/kafka-event-subscriber.ts` para la lista de topics.

---

## 7. API REST — Guía Completa Swagger

Mismos patrones Command/Query CRUD que el resto del ecosistema. Ver
[security-service/src/docs/README.md](../../../security-service/src/docs/README.md) secciones 7.1–7.2.

### Prefijos de rutas

| Módulo | Command | Query |
|--------|---------|-------|
| codetrace | `/api/codetraces/command` | `/api/codetraces/query` |

### 7.5. Autenticación

- Stub `Authorization: Bearer valid-token`
- Swagger: `admin:admin123`

---

## 8. Guía para Desarrolladores

Ver [security-service/src/docs/README.md](../../../security-service/src/docs/README.md) sección 8
(Creación/Actualización de Eventos, Sagas, patrones CQRS).

---

## 9. Test E2E con curl

```bash
# Arrancar el servicio
cd codetrace-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js

# Ejecutar el test
bash codetrace-service/src/docs/e2e-test.sh
```

### Requisitos previos

1. Codetrace-service corriendo en `http://localhost:3002`
2. PostgreSQL accesible (`codetrace-service` DB)
3. `curl` y `jq` instalados

---

## 10. Análisis de Sagas y Eventos (E2E)

### Sagas CRUD

| Módulo | Saga Class | Handlers |
|--------|-----------|----------|
| codetrace | `CodetraceCrudSaga` | 3 (Created, Updated, Deleted) |

### Inventario de eventos

3 eventos propios + **topics consumidos de todos los microservicios** para materialización.
