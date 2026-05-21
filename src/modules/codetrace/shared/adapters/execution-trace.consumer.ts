/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 *
 * Consumidor Kafka de trazas de ejecución enviadas por otros microservicios.
 * Escucha el tópico 'codetrace-execution-trace' y persiste cada traza
 * como una entidad Codetrace usando el servicio de comandos existente.
 */

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { KafkaService } from "../messaging/kafka.service";
import { CodetraceCommandService } from "../../services/codetracecommand.service";
import { CreateCodetraceDto } from "../../dtos/all-dto";
import { logger } from "@core/logs/logger";

const TRACE_TOPIC = "codetrace-execution-trace";

const ALLOWED_LAYER_TYPES = new Set([
  "SERVICE",
  "REPOSITORY",
  "CONTROLLER",
  "SAGA",
  "EVENT_PUBLISHER",
  "EVENT_SUBSCRIBER",
  "RESOLVER",
  "CONSUMER",
  "PRODUCER",
  "GUARD",
  "INTERCEPTOR",
  "MIDDLEWARE",
  "COMMAND",
  "QUERY",
]);

const ALLOWED_SEVERITIES = new Set([
  "DEBUG",
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL",
]);

const ALLOWED_FUNCTIONAL_KINDS = new Set([
  "BUSINESS",
  "AUDIT",
  "SECURITY",
  "INTEGRATION",
  "TECHNICAL",
]);

@Injectable()
export class ExecutionTraceConsumer implements OnModuleInit {
  private readonly logger = new Logger(ExecutionTraceConsumer.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly codetraceCommandService: CodetraceCommandService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async onModuleInit() {
    if (process.env.KAFKA_ENABLED !== "true") {
      this.logger.warn(
        "Kafka deshabilitado. No se inicia el consumidor de trazas de ejecución."
      );
      return;
    }

    const topic = process.env.LOG_KAFKA_TOPIC || TRACE_TOPIC;

    try {
      await this.kafkaService.connect();
      await this.kafkaService.subscribe(
        topic,
        async (message, metadata) => {
          await this.handleTraceEvent(message, metadata);
        },
      );
      this.logger.log(
        `Consumidor de trazas de ejecución suscrito al tópico: ${topic}`
      );
    } catch (error: any) {
      this.logger.error(
        `Error suscribiendo al tópico ${topic}: ${error.message}`,
        error.stack
      );
    }
  }

  private async handleTraceEvent(message: any, metadata: any): Promise<void> {
    try {
      const dto = this.mapToCreateDto(message);
      await this.codetraceCommandService.create(dto);

      this.logger.debug(
        `Traza procesada: ${message.functionName} de ${message.sourceService} (severity=${(dto as any).severity}, layer=${(dto as any).layerType}, kind=${(dto as any).functionalKind})`
      );
    } catch (error: any) {
      this.logger.error(
        `Error procesando traza de ejecución: ${error.message}`,
        error.stack
      );
    }
  }

  private normalizeLayerType(layer: any): string {
    const value = (typeof layer === "string" ? layer : "")
      .trim()
      .replace(/[^a-z0-9]+/gi, "_")
      .replace(/^_+|_+$/g, "")
      .toUpperCase();
    return ALLOWED_LAYER_TYPES.has(value) ? value : "SERVICE";
  }

  private normalizeSeverity(message: any): string {
    const explicitSeverity = (typeof message?.severity === "string" ? message.severity : "")
      .trim()
      .toUpperCase();
    if (ALLOWED_SEVERITIES.has(explicitSeverity)) {
      return explicitSeverity;
    }

    if ((message?.status || "").toLowerCase() === "error") {
      return "ERROR";
    }

    if (message?.error?.message) {
      return "ERROR";
    }

    return "INFO";
  }

  private normalizeFunctionalKind(message: any): string {
    const explicitKind = (typeof message?.functionalKind === "string" ? message.functionalKind : "")
      .trim()
      .toUpperCase();
    if (ALLOWED_FUNCTIONAL_KINDS.has(explicitKind)) {
      return explicitKind;
    }

    const text = [
      message?.sourceService,
      message?.className,
      message?.functionName,
      message?.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (/(auth|login|rbac|acl|mfa|guard|security)/.test(text)) {
      return "SECURITY";
    }
    if (/(kafka|event|integration|subscriber|producer|consumer|webhook|gateway)/.test(text)) {
      return "INTEGRATION";
    }
    if (/(audit|history|traceability|compliance)/.test(text)) {
      return "AUDIT";
    }
    if (/(order|invoice|merchant|payment|product|customer|crm|organization|salesmanager)/.test(text)) {
      return "BUSINESS";
    }

    return "TECHNICAL";
  }

  private buildTraceDescription(message: any, severity: string, layerType: string, functionalKind: string): string {
    const sourceService = message?.sourceService || "unknown-service";
    const functionName = message?.functionName || "unknown-function";
    const outcome = (message?.status || "success").toLowerCase() === "error" ? "falló" : "completó";
    const errorSuffix = message?.error?.message ? ` Error: ${message.error.message}` : "";
    return `${severity} ${functionalKind} ${layerType}: ${sourceService} -> ${functionName} ${outcome}.${errorSuffix}`.trim();
  }

  private mapToCreateDto(message: any): CreateCodetraceDto {
    const severity = this.normalizeSeverity(message);
    const layerType = this.normalizeLayerType(message.layer);
    const functionalKind = this.normalizeFunctionalKind(message);
    const traceName = message.sourceService
      ? `[${message.sourceService}] ${message.functionName || "unknown"}`
      : message.functionName || "unknown-trace";

    const dto = new CreateCodetraceDto({
      name: traceName.substring(0, 100),
      createdBy: message.sourceService || "kafka-trace",
      sourceService: message.sourceService || "kafka-trace",
      isActive: true,
      creationDate: message.startTime
        ? new Date(message.startTime)
        : new Date(),
      severity,
      layerType,
      functionalKind,
      executionStatus: message.status,
      className: message.className,
      functionName: message.functionName,
      traceUuid: message.uuid,
      refUuid: message.refuuid,
      startedAt: message.startTime ? new Date(message.startTime) : undefined,
      endedAt: message.endTime ? new Date(message.endTime) : undefined,
      durationMs: typeof message.duration === "number" ? message.duration : undefined,
      durationUnit: message.durationUnit,
      deliveredVia: message.deliveredVia || "kafka",
      errorMessage: message?.error?.message,
      metadata: {
        layer: message.layer,
        uuid: message.uuid,
        refuuid: message.refuuid,
        className: message.className,
        functionName: message.functionName,
        startTime: message.startTime,
        endTime: message.endTime,
        duration: message.duration,
        durationUnit: message.durationUnit,
        status: message.status,
        sourceService: message.sourceService,
        deliveredVia: message.deliveredVia,
        error: message.error,
      },
    });

    (dto as any).description = this.buildTraceDescription(
      message,
      severity,
      layerType,
      functionalKind,
    );

    return dto;
  }
}
