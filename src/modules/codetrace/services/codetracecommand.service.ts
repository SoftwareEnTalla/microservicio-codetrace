/*
 * Copyright (c) 2025 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { Codetrace } from "../entities/codetrace.entity";
import { CreateCodetraceDto } from "../dtos/createcodetrace.dto";
import { UpdateCodetraceDto } from "../dtos/updatecodetrace.dto";
import { DeleteCodetraceDto } from "../dtos/deletecodetrace.dto";
import { generateCacheKey } from "src/utils/functions";
import { CodetraceCommandRepository } from "../repositories/codetracecommand.repository";
import { CodetraceQueryRepository } from "../repositories/codetracequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { CodetraceResponse, CodetracesResponse } from "../types/codetrace.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { CodetraceQueryService } from "./codetracequery.service";

@Injectable()
export class CodetraceCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(CodetraceCommandService.name);
  //Constructo del servicio CodetraceCommandService
  constructor(
    private readonly repository: CodetraceCommandRepository,
    private readonly queryRepository: CodetraceQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceCommandService.name)
      .get(CodetraceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateCodetraceDto>("createCodetrace", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createCodetraceDtoInput: CreateCodetraceDto
  ): Promise<CodetraceResponse<Codetrace>> {
    try {
      logger.info("Receiving in service:", createCodetraceDtoInput);
      const entity = await this.repository.create(
        Codetrace.fromDto(createCodetraceDtoInput)
      );
      logger.info("Entity created on service:", entity);
      // Respuesta si el codetrace no existe
      if (!entity)
        throw new NotFoundException("Entidad Codetrace no encontrada.");
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetrace obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceCommandService.name)
      .get(CodetraceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Codetrace>("createCodetraces", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createCodetraceDtosInput: CreateCodetraceDto[]
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
      const entities = await this.repository.bulkCreate(
        createCodetraceDtosInput.map((entity) => Codetrace.fromDto(entity))
      );

      // Respuesta si el codetrace no existe
      if (!entities)
        throw new NotFoundException("Entidades Codetraces no encontradas.");
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetraces creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceCommandService.name)
      .get(CodetraceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCodetraceDto>("updateCodetrace", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateCodetraceDto
  ): Promise<CodetraceResponse<Codetrace>> {
    try {
      const entity = await this.repository.update(
        id,
        Codetrace.fromDto(partialEntity)
      );
      // Respuesta si el codetrace no existe
      if (!entity)
        throw new NotFoundException("Entidades Codetraces no encontradas.");
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetrace actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceCommandService.name)
      .get(CodetraceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCodetraceDto>("updateCodetraces", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateCodetraceDto[]
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Codetrace.fromDto(entity))
      );
      // Respuesta si el codetrace no existe
      if (!entities)
        throw new NotFoundException("Entidades Codetraces no encontradas.");
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetraces actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceCommandService.name)
      .get(CodetraceCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteCodetraceDto>("deleteCodetrace", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<CodetraceResponse<Codetrace>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el codetrace no existe
      if (!entity)
        throw new NotFoundException("Instancias de Codetrace no encontradas.");

      const result = await this.repository.delete(id);
      // Devolver codetrace
      return {
        ok: true,
        message: "Instancia de Codetrace eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceCommandService.name)
      .get(CodetraceCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteCodetraces", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

