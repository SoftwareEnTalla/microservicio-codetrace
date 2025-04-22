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
 *
 *
 */


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import {
  CodetraceDto,
  CreateCodetraceDto,
  CreateOrUpdateCodetraceDto,
  CodetraceValueInput,
} from "../dtos/createcodetrace.dto";
import { Codetrace } from "../entities/codetrace.entity";
import {
  CreateCodetraceCommand,
  UpdateCodetraceCommand,
  DeleteCodetraceCommand,
} from "../commands/exporting.command";
import { CommandBus } from "@nestjs/cqrs";
import { CodetraceQueryService } from "../services/codetracequery.service";

import { UpdateCodetraceDto } from "../dtos/updatecodetrace.dto";
import { CodetraceResponse, CodetracesResponse } from "../types/codetrace.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";

import { v4 as uuidv4 } from "uuid";

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Codetrace)
export class CodetraceResolver {

   //Constructor del resolver de Codetrace
  constructor(
    private readonly service: CodetraceQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  // Mutaciones
  @Mutation(() => CodetraceResponse<Codetrace>)
  async createCodetrace(
    @Args("input", { type: () => CreateCodetraceDto }) input: CreateCodetraceDto
  ): Promise<CodetraceResponse<Codetrace>> {
    return this.commandBus.execute(new CreateCodetraceCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Mutation(() => CodetraceResponse<Codetrace>)
  async updateCodetrace(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCodetraceDto
  ): Promise<CodetraceResponse<Codetrace>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCodetraceCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Mutation(() => CodetraceResponse<Codetrace>)
  async createOrUpdateCodetrace(
    @Args("data", { type: () => CreateOrUpdateCodetraceDto })
    data: CreateOrUpdateCodetraceDto
  ): Promise<CodetraceResponse<Codetrace>> {
    if (data.id) {
      const existingCodetrace = await this.service.findById(data.id);
      if (existingCodetrace) {
        return this.commandBus.execute(
          new UpdateCodetraceCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCodetraceDto | UpdateCodetraceDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCodetraceCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCodetraceDto | UpdateCodetraceDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCodetrace(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCodetraceCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  // Queries
  @Query(() => CodetracesResponse<Codetrace>)
  async codetraces(
    options?: FindManyOptions<Codetrace>,
    paginationArgs?: PaginationArgs
  ): Promise<CodetracesResponse<Codetrace>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Query(() => CodetracesResponse<Codetrace>)
  async codetrace(
    @Args("id", { type: () => String }) id: string
  ): Promise<CodetraceResponse<Codetrace>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Query(() => CodetracesResponse<Codetrace>)
  async codetracesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CodetraceValueInput }) value: CodetraceValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CodetracesResponse<Codetrace>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Query(() => CodetracesResponse<Codetrace>)
  async codetracesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CodetracesResponse<Codetrace>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Query(() => Number)
  async totalCodetraces(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Query(() => CodetracesResponse<Codetrace>)
  async searchCodetraces(
    @Args("where", { type: () => CodetraceDto, nullable: false })
    where: Record<string, any>
  ): Promise<CodetracesResponse<Codetrace>> {
    const codetraces = await this.service.findAndCount(where);
    return codetraces;
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Query(() => CodetraceResponse<Codetrace>, { nullable: true })
  async findOneCodetrace(
    @Args("where", { type: () => CodetraceDto, nullable: false })
    where: Record<string, any>
  ): Promise<CodetraceResponse<Codetrace>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        console.info([logData,client]);
        return await client.send(logData);
      }
      catch(error){
        console.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        console.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: new LoggerClient()
      .registerClient(CodetraceResolver.name)

      .get(CodetraceResolver.name),
    })
  @Query(() => CodetraceResponse<Codetrace>)
  async findOneCodetraceOrFail(
    @Args("where", { type: () => CodetraceDto, nullable: false })
    where: Record<string, any>
  ): Promise<CodetraceResponse<Codetrace> | Error> {
    return this.service.findOneOrFail(where);
  }
}

