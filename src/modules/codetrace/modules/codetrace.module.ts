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


import { Module } from "@nestjs/common";
import { CodetraceCommandController } from "../controllers/codetracecommand.controller";
import { CodetraceQueryController } from "../controllers/codetracequery.controller";
import { CodetraceCommandService } from "../services/codetracecommand.service";
import { CodetraceQueryService } from "../services/codetracequery.service";
import { CodetraceCommandRepository } from "../repositories/codetracecommand.repository";
import { CodetraceQueryRepository } from "../repositories/codetracequery.repository";
import { CodetraceRepository } from "../repositories/codetrace.repository";
import { CodetraceResolver } from "../graphql/codetrace.resolver";
import { CodetraceAuthGuard } from "../guards/codetraceauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Codetrace } from "../entities/codetrace.entity";
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { CacheModule } from "@nestjs/cache-manager";

//Interceptors
import { CodetraceInterceptor } from "../interceptors/codetrace.interceptor";
import { CodetraceLoggingInterceptor } from "../interceptors/codetrace.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { KafkaService } from "../shared/messaging/kafka.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Codetrace]), // Asegúrate de incluir esto
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [CodetraceCommandController, CodetraceQueryController],
  providers: [
    //Services
    EventStoreService,
    KafkaService,
    CodetraceQueryService,
    CodetraceCommandService,
    //Repositories
    CodetraceCommandRepository,
    CodetraceQueryRepository,
    CodetraceRepository,      
    //Resolvers
    CodetraceResolver,
    //Guards
    CodetraceAuthGuard,
    //Interceptors
    CodetraceInterceptor,
    CodetraceLoggingInterceptor,
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
  exports: [
    //Services
    EventStoreService,
    KafkaService,
    CodetraceQueryService,
    CodetraceCommandService,
    //Repositories
    CodetraceCommandRepository,
    CodetraceQueryRepository,
    CodetraceRepository,      
    //Resolvers
    CodetraceResolver,
    //Guards
    CodetraceAuthGuard,
    //Interceptors
    CodetraceInterceptor,
    CodetraceLoggingInterceptor,
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
})
export class CodetraceModule {}

