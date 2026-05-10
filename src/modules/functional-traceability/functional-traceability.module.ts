import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FunctionalTraceabilityController } from './functional-traceability.controller';
import { FunctionalTraceabilityService } from './functional-traceability.service';

@Module({
  imports: [ConfigModule],
  controllers: [FunctionalTraceabilityController],
  providers: [FunctionalTraceabilityService],
  exports: [FunctionalTraceabilityService],
})
export class FunctionalTraceabilityModule {}