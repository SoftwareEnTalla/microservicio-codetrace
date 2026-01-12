/*
 * Copyright (c) 2026 SoftwarEnTalla
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


import { Module } from "@nestjs/common";
import { codetraceCommandController } from "../controllers/codetracecommand.controller";
import { codetraceQueryController } from "../controllers/codetracequery.controller";
import { codetraceCommandService } from "../services/codetracecommand.service";
import { codetraceQueryService } from "../services/codetracequery.service";
import { codetraceCommandRepository } from "../repositories/codetracecommand.repository";
import { codetraceQueryRepository } from "../repositories/codetracequery.repository";
import { codetraceRepository } from "../repositories/codetrace.repository";
import { codetraceResolver } from "../graphql/codetrace.resolver";
import { codetraceAuthGuard } from "../guards/codetraceauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { codetrace } from "../entities/codetrace.entity";
import { BaseEntity } from "../entities/base.entity";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { CacheModule } from "@nestjs/cache-manager";

//Interceptors
import { codetraceInterceptor } from "../interceptors/codetrace.interceptor";
import { codetraceLoggingInterceptor } from "../interceptors/codetrace.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { KafkaService } from "../shared/messaging/kafka.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([BaseEntity, codetrace]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [codetraceCommandController, codetraceQueryController],
  providers: [
    //Services
    EventStoreService,
    KafkaService,
    codetraceQueryService,
    codetraceCommandService,
    //Repositories
    codetraceCommandRepository,
    codetraceQueryRepository,
    codetraceRepository,      
    //Resolvers
    codetraceResolver,
    //Guards
    codetraceAuthGuard,
    //Interceptors
    codetraceInterceptor,
    codetraceLoggingInterceptor,
    //Publishers
    KafkaEventPublisher,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED === 'true',
        kafkaEnabled: process.env.KAFKA_ENABLED === 'true',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: ['codetrace-events']
      })
    },
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
  exports: [
    //Services
    EventStoreService,
    KafkaService,
    codetraceQueryService,
    codetraceCommandService,
    //Repositories
    codetraceCommandRepository,
    codetraceQueryRepository,
    codetraceRepository,      
    //Resolvers
    codetraceResolver,
    //Guards
    codetraceAuthGuard,
    //Interceptors
    codetraceInterceptor,
    codetraceLoggingInterceptor,
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
})
export class codetraceModule {}

