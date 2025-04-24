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
import { FindManyOptions } from "typeorm";
import { Codetrace } from "../entities/codetrace.entity";
import { BaseEntity } from "../entities/base.entity";
import { CodetraceQueryRepository } from "../repositories/codetracequery.repository";
import { CodetraceResponse, CodetracesResponse } from "../types/codetrace.types";
import { Helper } from "src/common/helpers/helpers";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
//import { Cacheable } from "../decorators/cache.decorator";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { ModuleRef } from "@nestjs/core";
import { logger } from '@core/logs/logger';



@Injectable()
export class CodetraceQueryService implements OnModuleInit{
  // Private properties
  readonly #logger = new Logger(CodetraceQueryService.name);
  private readonly loggerClient = new LoggerClient();

  constructor(private readonly repository: CodetraceQueryRepository,
  private moduleRef: ModuleRef
  ) {
    this.validate();
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
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  private validate(): void {
    try {
      const entityInstance = Object.create(Codetrace.prototype);
      if (!(entityInstance instanceof BaseEntity)) {
        let sms = `El tipo ${Codetrace.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`;
        logger.info(sms);
        throw new Error(sms);
      }
    } catch (error) {
      // Imprimir error
      logger.error(error);
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
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findAll(
    options?: FindManyOptions<Codetrace>,
    paginationArgs?: PaginationArgs
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
      const codetraces = await this.repository.findAll(options);
      // Devolver respuesta
      logger.info("sms");
      return {
        ok: true,
        message: "Listado de codetraces obtenido con éxito",
        data: codetraces,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          codetraces.length
        ),
        count: codetraces.length,
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
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findById(id: string): Promise<CodetraceResponse<Codetrace>> {
    try {
      const codetrace = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      // Respuesta si el codetrace no existe
      if (!codetrace)
        throw new NotFoundException(
          "Codetrace no encontrado para el id solicitado"
        );
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetrace obtenido con éxito",
        data: codetrace,
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
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findByField(
    field: string,
    value: any,
    paginationArgs?: PaginationArgs
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      // Respuesta si el codetrace no existe
      if (!entities)
        throw new NotFoundException(
          "Codetraces no encontrados para la propiedad y valor especificado"
        );
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetraces obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
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
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findWithPagination(
    options: FindManyOptions<Codetrace>,
    paginationArgs?: PaginationArgs
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
      const entities = await this.repository.findWithPagination(
        options,
        paginationArgs ? paginationArgs.page : 1,
        paginationArgs ? paginationArgs.size : 25
      );

      // Respuesta si el codetrace no existe
      if (!entities)
        throw new NotFoundException("Entidades Codetraces no encontradas.");
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetrace obtenido con éxito.",
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
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async count(): Promise<number> {
    return this.repository.count();
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
  async findAndCount(
    where?: Record<string, any>,
    paginationArgs?: PaginationArgs
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: where,
      });

      // Respuesta si el codetrace no existe
      if (!entities)
        throw new NotFoundException(
          "Entidades Codetraces no encontradas para el criterio especificado."
        );
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetraces obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
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
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findOne(where?: Record<string, any>): Promise<CodetraceResponse<Codetrace>> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

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
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findOneOrFail(
    where?: Record<string, any>
  ): Promise<CodetraceResponse<Codetrace> | Error> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

      // Respuesta si el codetrace no existe
      if (!entity)
        return new NotFoundException("Entidad Codetrace no encontrada.");
      // Devolver codetrace
      return {
        ok: true,
        message: "Codetrace obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
}



