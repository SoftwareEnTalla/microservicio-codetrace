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
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOptionsWhere,
  In,
  MoreThanOrEqual,
  Repository,
  DeleteResult,
  UpdateResult,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { Codetrace } from '../entities/codetrace.entity';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {CodetraceRepository} from './codetrace.repository'

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';

  @Injectable()
  export class CodetraceQueryRepository {

    //Constructor del repositorio de datos: CodetraceQueryRepository
    constructor(
      @InjectRepository(Codetrace)
      private readonly repository: Repository<Codetrace>
    ) {
      this.validate();
    }

    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    private validate(): void {
      const entityInstance = Object.create(Codetrace.prototype);

      if (!(entityInstance instanceof BaseEntity)) {
        throw new Error(
          `El tipo ${Codetrace.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
        );
      }
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    async findAll(options?: FindManyOptions<Codetrace>): Promise<Codetrace[]> {
      console.info('Ready to findAll Codetrace on repository:', options);
      return this.repository.find(options);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    async findById(id: string): Promise<Codetrace | null> {
      const tmp: FindOptionsWhere<Codetrace> = { id } as FindOptionsWhere<Codetrace>;
      console.info('Ready to findById Codetrace on repository:', tmp);
      return this.repository.findOneBy(tmp);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    async findByField(
      field: string,
      value: any,
      page: number,
      limit: number
    ): Promise<Codetrace[]> {
      let options={
        where: { [field]: value },
        skip: (page - 1) * limit,
        take: limit,
      };
      console.info('Ready to findByField Codetrace on repository:', options);
      const [entities] = await this.repository.findAndCount(options);
      return entities;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    async findWithPagination(
      options: FindManyOptions<Codetrace>,
      page: number,
      limit: number
    ): Promise<Codetrace[]> {
      const skip = (page - 1) * limit;
      options={ ...options, skip, take: limit };
      console.info('Ready to findWithPagination Codetrace on repository:', options);
      return this.repository.find(options);
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    async count(): Promise<number> {
      console.info('Ready to count Codetrace on repository...');
      let result= this.repository.count();
      console.info('Was counted  instances of Codetrace on repository:');
      return result;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    async findAndCount(where?: Record<string, any>): Promise<[Codetrace[], number]> {
      console.info('Ready to findAndCount Codetrace on repository:',where);
      let result= this.repository.findAndCount({
        where: where,
      });
      console.info('Was counted  instances of Codetrace on repository:',result);
      return result;
    }


    @LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    async findOne(where?: Record<string, any>): Promise<Codetrace | null> {
      const tmp: FindOptionsWhere<Codetrace> = where as FindOptionsWhere<Codetrace>;
      console.info('Ready to findOneBy Codetrace on repository with conditions:', tmp);
      // Si 'where' es undefined o null, puedes manejarlo según tu lógica
      if (!where) {
        console.warn('No conditions provided for finding Codetrace.');
        return null; // O maneja el caso como prefieras
      }
      console.info('Ready to findOneBy Codetrace on repository:',tmp);
      return this.repository.findOneBy(tmp);
    }


@LogExecutionTime({
    layer: 'repository',
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
      .registerClient(CodetraceRepository.name)
      .get(CodetraceRepository.name),
  })
    async findOneOrFail(where?: Record<string, any>): Promise<Codetrace> {
      console.info('Ready to findOneOrFail Codetrace on repository:',where);
      const entity = await this.repository.findOne({
        where: where,
      });
      if (!entity) {
        throw new Error('Entity not found');
      }
      return entity;
    }
}
