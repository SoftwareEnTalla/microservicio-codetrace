import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FunctionalTraceabilityService } from './functional-traceability.service';

@ApiTags('Functional Traceability')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('functional-traceability/query')
export class FunctionalTraceabilityController {
  constructor(private readonly service: FunctionalTraceabilityService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Resumen funcional de journeys ERP a partir de CodeTrace' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen funcional de trazabilidad.' })
  async getOverview(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getOverview(Number(limit || 12));
  }
}