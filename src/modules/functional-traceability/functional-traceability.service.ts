import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type TraceJourneyRow = {
  id: string;
  sourceService: string;
  journey: string;
  severity?: string | null;
  layerType?: string | null;
  functionalKind?: string | null;
  name: string;
  description: string;
  createdAt: string | null;
  traceUuid?: string | null;
  refUuid?: string | null;
  metadata?: Record<string, unknown> | null;
  aggregateType?: string;
  aggregateRef?: string | null;
  resourceLabel?: string;
  resourceRoute?: string;
};

@Injectable()
export class FunctionalTraceabilityService {
  constructor(@Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined) {}

  async getOverview(limit: number = 12): Promise<Record<string, unknown>> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      return {
        available: false,
        generatedAt: new Date().toISOString(),
        totals: { totalTraces: 0, functionalCoveragePercent: 0, businessTaggedTraces: 0 },
        journeys: [],
        aggregates: [],
        sources: [],
        recentJourneys: [],
      };
    }

    const safeLimit = Math.max(1, Math.min(limit, 20));
    const classifier = this.journeySql();

    const [totals] = await dataSource.query(
      `SELECT
         COUNT(*)::int AS "totalTraces",
         COUNT(*) FILTER (WHERE COALESCE("functionalKind", 'TECHNICAL') <> 'TECHNICAL')::int AS "businessTaggedTraces"
       FROM codetrace_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'codetrace'`,
    );

    const journeys = await dataSource.query(
      `SELECT COALESCE("functionalKind", ${classifier}) AS journey, COUNT(*)::int AS value
       FROM codetrace_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'codetrace'
       GROUP BY 1
       ORDER BY 2 DESC, 1 ASC`,
    );

    const aggregates = this.buildAggregateSummary(await dataSource.query(
      `SELECT id,
              COALESCE(NULLIF("sourceService", ''), NULLIF("createdBy", ''), 'unknown') AS "sourceService",
              COALESCE("functionalKind", ${classifier}) AS journey,
              "severity",
              "layerType",
              "functionalKind",
              name,
              description,
              "traceUuid",
              "refUuid",
              metadata,
              "creationDate" AS "createdAt"
       FROM codetrace_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'codetrace'`,
    ));

    const sources = await dataSource.query(
      `SELECT COALESCE(NULLIF("createdBy", ''), 'unknown') AS label, COUNT(*)::int AS value
       FROM codetrace_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'codetrace'
       GROUP BY 1
       ORDER BY 2 DESC, 1 ASC
       LIMIT 8`,
    );

    const recentJourneys = await dataSource.query(
      `SELECT id,
              COALESCE(NULLIF("sourceService", ''), NULLIF("createdBy", ''), 'unknown') AS "sourceService",
              COALESCE("functionalKind", ${classifier}) AS journey,
              "severity",
              "layerType",
              "functionalKind",
              name,
              description,
              "traceUuid",
              "refUuid",
              metadata,
              "creationDate" AS "createdAt"
       FROM codetrace_base_entity
       WHERE COALESCE("isActive", true) = true AND type = 'codetrace'
       ORDER BY COALESCE("modificationDate", "creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const totalTraces = Number(totals?.totalTraces ?? 0);
    const businessTaggedTraces = Number(totals?.businessTaggedTraces ?? 0);

    return {
      available: true,
      generatedAt: new Date().toISOString(),
      totals: {
        totalTraces,
        businessTaggedTraces,
        functionalCoveragePercent: totalTraces > 0 ? Math.round((businessTaggedTraces / totalTraces) * 100) : 0,
      },
      journeys,
      aggregates,
      sources,
      recentJourneys: (recentJourneys as TraceJourneyRow[]).map((row) => this.decorateTrace(row)),
    };
  }

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }
    return null;
  }

  private journeySql(): string {
    return `CASE
      WHEN LOWER(COALESCE("createdBy", '') || ' ' || COALESCE(name, '') || ' ' || COALESCE(description, '')) ~ '(login|auth|mfa|rbac|acl|security)' THEN 'IDENTITY_ACCESS'
      WHEN LOWER(COALESCE("createdBy", '') || ' ' || COALESCE(name, '') || ' ' || COALESCE(description, '')) ~ '(customer|onboarding|merchant|gateway)' THEN 'ONBOARDING_GATEWAY'
      WHEN LOWER(COALESCE("createdBy", '') || ' ' || COALESCE(name, '') || ' ' || COALESCE(description, '')) ~ '(product|promotion|inventory|catalog|price|media)' THEN 'PRODUCT_COMMERCE'
      WHEN LOWER(COALESCE("createdBy", '') || ' ' || COALESCE(name, '') || ' ' || COALESCE(description, '')) ~ '(payment|invoice|order|contract|crm|salesmanager|accounting|cashback|wallet|referral|payout|settlement)' THEN 'CONTRACT_TO_CASH'
      WHEN LOWER(COALESCE("createdBy", '') || ' ' || COALESCE(name, '') || ' ' || COALESCE(description, '')) ~ '(organization|hrms|employee|person|capacity|seat)' THEN 'WORKFORCE_STRUCTURE'
      ELSE 'TECHNICAL_ONLY'
    END`;
  }

  private buildAggregateSummary(rows: TraceJourneyRow[]): Array<{ aggregateType: string; value: number; resourceLabel: string; resourceRoute: string }> {
    const bucket = new Map<string, number>();
    for (const row of rows) {
      const aggregateType = this.inferAggregateType(row);
      bucket.set(aggregateType, (bucket.get(aggregateType) ?? 0) + 1);
    }

    return [...bucket.entries()]
      .map(([aggregateType, value]) => ({
        aggregateType,
        value,
        resourceLabel: this.resourceLabelForAggregate(aggregateType),
        resourceRoute: this.routeForAggregate(aggregateType),
      }))
      .sort((left, right) => right.value - left.value || left.aggregateType.localeCompare(right.aggregateType))
      .slice(0, 8);
  }

  private decorateTrace(row: TraceJourneyRow): TraceJourneyRow {
    const aggregateType = this.inferAggregateType(row);
    return {
      ...row,
      severity: row.severity || 'INFO',
      layerType: row.layerType || 'SERVICE',
      functionalKind: row.functionalKind || row.journey || 'TECHNICAL',
      aggregateType,
      aggregateRef: this.extractAggregateRef(row),
      resourceLabel: this.resourceLabelForAggregate(aggregateType),
      resourceRoute: this.routeForAggregate(aggregateType),
    };
  }

  private inferAggregateType(row: Pick<TraceJourneyRow, 'sourceService' | 'name' | 'description' | 'metadata'>): string {
    const text = this.buildSearchText(row).toLowerCase();
    if (/(wallet|cashback|referral|payout|settlement|accounting|netincome|platformamount)/.test(text)) return 'PAYMENT_ACCOUNTING';
    if (/(invoice|receipt|fiscal)/.test(text)) return 'INVOICE';
    if (/(order|shipment|tracking|reservation|stock)/.test(text)) return 'ORDER';
    if (/(contract|paymentmilestone|milestone|subscription|billingcycle|crm)/.test(text)) return 'CRM_CONTRACT';
    if (/(product|inventory|promotion|price|media|catalog)/.test(text)) return 'PRODUCT';
    if (/(salesmanager|commission)/.test(text)) return 'SALESMANAGER_CONTRACT';
    if (/(customer|merchant|onboarding|gateway)/.test(text)) return 'ONBOARDING';
    if (/(security|login|auth|acl|rbac|mfa)/.test(text)) return 'SECURITY';
    if (/(organization|hrms|employee|capacity|person|seat)/.test(text)) return 'WORKFORCE';
    return 'TECHNICAL';
  }

  private extractAggregateRef(row: Pick<TraceJourneyRow, 'name' | 'description' | 'traceUuid' | 'refUuid' | 'metadata'>): string | null {
    const explicitRef = this.pickUuidCandidate([
      row.refUuid,
      this.readMetadataString(row.metadata, 'refUuid'),
      this.readMetadataString(row.metadata, 'refuuid'),
      this.readMetadataString(row.metadata, 'aggregateRef'),
      this.readMetadataString(row.metadata, 'aggregateRefUuid'),
      row.traceUuid,
      this.readMetadataString(row.metadata, 'traceUuid'),
      this.readMetadataString(row.metadata, 'uuid'),
    ]);

    if (explicitRef) {
      return explicitRef;
    }

    const text = this.buildSearchText(row);
    const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
    return match?.[0] ?? null;
  }

  private buildSearchText(row: Partial<Pick<TraceJourneyRow, 'sourceService' | 'name' | 'description' | 'metadata'>>): string {
    const metadata = row.metadata ? JSON.stringify(row.metadata) : '';
    return `${row.sourceService ?? ''} ${row.name ?? ''} ${row.description ?? ''} ${metadata}`;
  }

  private readMetadataString(metadata: Record<string, unknown> | null | undefined, key: string): string | null {
    const value = metadata?.[key];
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private pickUuidCandidate(candidates: Array<string | null | undefined>): string | null {
    for (const candidate of candidates) {
      if (candidate && this.isUuid(candidate)) {
        return candidate;
      }
    }

    return null;
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private resourceLabelForAggregate(aggregateType: string): string {
    switch (aggregateType) {
      case 'INVOICE':
        return 'Abrir Invoice';
      case 'PAYMENT_ACCOUNTING':
        return 'Abrir Payment';
      case 'ORDER':
        return 'Abrir Orders';
      case 'CRM_CONTRACT':
        return 'Abrir CRM';
      case 'PRODUCT':
        return 'Abrir Product';
      case 'SALESMANAGER_CONTRACT':
        return 'Abrir SalesManager';
      case 'ONBOARDING':
        return 'Abrir Customer';
      case 'SECURITY':
        return 'Abrir Security';
      case 'WORKFORCE':
        return 'Abrir Organization';
      default:
        return 'Abrir Management';
    }
  }

  private routeForAggregate(aggregateType: string): string {
    switch (aggregateType) {
      case 'INVOICE':
        return '/invoice/invoices';
      case 'PAYMENT_ACCOUNTING':
        return '/payment/payments';
      case 'ORDER':
        return '/orders/orders';
      case 'CRM_CONTRACT':
        return '/crm/contracts';
      case 'PRODUCT':
        return '/product/products';
      case 'SALESMANAGER_CONTRACT':
        return '/salesmanager/salesmanager-merchant-contracts';
      case 'ONBOARDING':
        return '/customer/customer-gateway-onboardings';
      case 'SECURITY':
        return '/security/users';
      case 'WORKFORCE':
        return '/organization/control';
      default:
        return '/management/traces';
    }
  }
}