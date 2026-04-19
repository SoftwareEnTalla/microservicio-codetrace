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

// Layers permitidos como discriminadores. Cualquier otro valor cae a "codetrace".
const ALLOWED_TYPES = new Set([
  "service",
  "repository",
  "controller",
  "saga",
  "event-publisher",
  "event-subscriber",
  "resolver",
  "consumer",
  "producer",
  "guard",
  "interceptor",
  "middleware",
  "command",
  "query",
  "codetrace",
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
      const response = await this.codetraceCommandService.create(dto);

      // Sobrescribir el discriminador 'type' (forzado a 'codetrace' por @ChildEntity)
      // con el layer recibido, para poder agrupar por capa lógica.
      const layer = this.normalizeType(message.layer);
      const traceId = (response as any)?.data?.id;
      if (traceId && layer && layer !== "codetrace") {
        try {
          await this.dataSource.query(
            `UPDATE "codetrace_base_entity" SET "type" = $1 WHERE "id" = $2`,
            [layer, traceId],
          );
        } catch (updErr: any) {
          this.logger.warn(
            `No se pudo actualizar 'type' a '${layer}' para traza ${traceId}: ${updErr.message}`,
          );
        }
      }

      this.logger.debug(
        `Traza procesada: ${message.functionName} de ${message.sourceService} (type=${layer})`
      );
    } catch (error: any) {
      this.logger.error(
        `Error procesando traza de ejecución: ${error.message}`,
        error.stack
      );
    }
  }

  private normalizeType(layer: any): string {
    const value = (typeof layer === "string" ? layer : "").trim().toLowerCase();
    return ALLOWED_TYPES.has(value) ? value : "codetrace";
  }

  private mapToCreateDto(message: any): CreateCodetraceDto {
    const traceName = message.sourceService
      ? `[${message.sourceService}] ${message.functionName || "unknown"}`
      : message.functionName || "unknown-trace";

    const traceDescription = JSON.stringify({
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
    });

    const dto = new CreateCodetraceDto({
      name: traceName.substring(0, 100),
      createdBy: message.sourceService || "kafka-trace",
      isActive: true,
      creationDate: message.startTime
        ? new Date(message.startTime)
        : new Date(),
    });

    // Asignar la descripción directamente (el entity la acepta vía plainToInstance)
    // Campo description es tipo TEXT, no requiere truncamiento
    (dto as any).description = traceDescription;

    return dto;
  }
}
