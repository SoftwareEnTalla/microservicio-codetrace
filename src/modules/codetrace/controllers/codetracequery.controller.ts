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


import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Logger,
} from "@nestjs/common";
import { CodetraceQueryService } from "../services/codetracequery.service";
import { FindManyOptions } from "typeorm";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from "@nestjs/swagger";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { CodetraceResponse, CodetracesResponse } from "../types/codetrace.types";
import { LoggerClient } from "src/common/logger/logger.client";
import { Codetrace } from "../entities/codetrace.entity";
import { Order, PaginationArgs } from "src/common/dto/args/pagination.args";
import { Helper } from "src/common/helpers/helpers";
import { CodetraceDto } from "../dtos/all-dto";

import { logger } from '@core/logs/logger';

@ApiTags("Codetrace Query")
@Controller("codetraces/query")
export class CodetraceQueryController {
  #logger = new Logger(CodetraceQueryController.name);

  constructor(private readonly service: CodetraceQueryService) {}

  @Get("list")
  @ApiOperation({ summary: "Get all codetrace with optional pagination" })
  @ApiResponse({ status: 200, type: CodetracesResponse })
  @ApiQuery({ name: "options", required: false, type: CodetraceDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: ()=>Order })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findAll(
    @Query("options") options?: FindManyOptions<Codetrace>    
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
     
      const codetraces = await this.service.findAll(options);
      logger.info("Retrieving all codetrace");
      return codetraces;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get codetrace by ID" })
  @ApiResponse({ status: 200, type: CodetraceResponse<Codetrace> })
  @ApiResponse({ status: 404, description: "Codetrace not found" })
  @ApiParam({ name: 'id', required: true, description: 'ID of the codetrace to retrieve', type: String })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findById(@Param("id") id: string): Promise<CodetraceResponse<Codetrace>> {
    try {
      const codetrace = await this.service.findOne({ where: { id } });
      if (!codetrace) {
        throw new NotFoundException(
          "Codetrace no encontrado para el id solicitado"
        );
      }
      return codetrace;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("field/:field") // Asegúrate de que el endpoint esté definido correctamente
  @ApiOperation({ summary: "Find codetrace by specific field" })
  @ApiQuery({ name: "value", required: true, description: 'Value to search for', type: String }) // Documenta el parámetro de consulta
  @ApiParam({ name: 'field', required: true, description: 'Field to filter codetrace', type: String }) // Documenta el parámetro de la ruta
  @ApiResponse({ status: 200, type: CodetracesResponse })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findByField(
    @Param("field") field: string, // Obtiene el campo de la ruta
    @Query("value") value: string, // Obtiene el valor de la consulta
    @Query() paginationArgs?: PaginationArgs
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
      const entities = await this.service.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      if (!entities) {
        throw new NotFoundException(
          "Codetrace no encontrados para la propiedad y valor especificado"
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }


  @Get("pagination")
  @ApiOperation({ summary: "Find codetraces with pagination" })
  @ApiResponse({ status: 200, type: CodetracesResponse<Codetrace> })
  @ApiQuery({ name: "options", required: false, type: CodetraceDto }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: ()=>Order })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findWithPagination(
    @Query() options: FindManyOptions<Codetrace>,
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: Order,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
     const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        order || Order.asc, // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findWithPagination(
        options,
        paginationArgs
      );
      if (!entities) {
        throw new NotFoundException("Entidades Codetraces no encontradas.");
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("count")
  @ApiOperation({ summary: "Count all codetraces" })
  @ApiResponse({ status: 200, type: Number })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get("search")
  @ApiOperation({ summary: "Find and count codetraces with conditions" })
  @ApiResponse({ status: 200, type: CodetracesResponse<Codetrace> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "size", required: false, type: Number })
  @ApiQuery({ name: "sort", required: false, type: String })
  @ApiQuery({ name: "order", required: false, type: ()=>Order })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "initDate", required: false, type: Date })
  @ApiQuery({ name: "endDate", required: false, type: Date })
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findAndCount(
    @Query() where: Record<string, any>={},
    @Query("page") page?: number,
    @Query("size") size?: number,
    @Query("sort") sort?: string,
    @Query("order") order?: Order,
    @Query("search") search?: string,
    @Query("initDate") initDate?: Date,
    @Query("endDate") endDate?: Date
  ): Promise<CodetracesResponse<Codetrace>> {
    try {
      const paginationArgs: PaginationArgs = PaginationArgs.createPaginator(
        page || 1,
        size || 25,
        sort || "createdAt", // Asigna valor por defecto
        order || Order.asc, // Asigna valor por defecto
        search || "", // Asigna valor por defecto
        initDate || undefined, // Puede ser undefined si no se proporciona
        endDate || undefined // Puede ser undefined si no se proporciona
      );
      const entities = await this.service.findAndCount({
        where: where,
        paginationArgs: paginationArgs,
      });

      if (!entities) {
        throw new NotFoundException(
          "Entidades Codetraces no encontradas para el criterio especificado."
        );
      }
      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one")
  @ApiOperation({ summary: "Find one codetrace with conditions" })
  @ApiResponse({ status: 200, type: CodetraceResponse<Codetrace> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findOne(
    @Query() where: Record<string, any>={}
  ): Promise<CodetraceResponse<Codetrace>> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        throw new NotFoundException("Entidad Codetrace no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @Get("find-one-or-fail")
  @ApiOperation({ summary: "Find one codetrace or return error" })
  @ApiResponse({ status: 200, type: CodetraceResponse<Codetrace> })
  @ApiQuery({ name: "where", required: true, type: Object }) // Ajustar según el tipo real
  @LogExecutionTime({
    layer: "controller",
    callback: async (logData, client) => {
      return await client.send(logData);
    },
    client: new LoggerClient()
      .registerClient(CodetraceQueryService.name)
      .get(CodetraceQueryService.name),
  })
  async findOneOrFail(
    @Query() where: Record<string, any>={}
  ): Promise<CodetraceResponse<Codetrace> | Error> {
    try {
      const entity = await this.service.findOne({
        where: where,
      });

      if (!entity) {
        return new NotFoundException("Entidad Codetrace no encontrada.");
      }
      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }
}


