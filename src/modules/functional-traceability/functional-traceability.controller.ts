import { Controller, Get, MessageEvent, Query, Sse } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FunctionalTraceabilityService } from './functional-traceability.service';
import { Observable, from, interval, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

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

  @Sse('stream')
  @ApiOperation({ summary: 'Stream SSE de trazabilidad funcional para management' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  streamOverview(@Query('limit') limit?: string): Observable<MessageEvent> {
    const safeLimit = Number(limit || 12);
    return interval(5000).pipe(
      startWith(0),
      switchMap(() =>
        from(this.service.getOverview(safeLimit)).pipe(
          map((data) => ({ data })),
          catchError((error) =>
            of({
              data: {
                available: false,
                generatedAt: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'stream-error',
              },
            }),
          ),
        ),
      ),
    );
  }
}