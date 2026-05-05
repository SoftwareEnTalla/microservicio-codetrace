import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import {
  EVENT_DEFINITIONS,
  EVENT_DLQ_TOPICS,
  EVENT_RETRY_TOPICS,
  EVENT_TOPICS,
} from "../events/event-registry";
import { KafkaService } from "../shared/messaging/kafka.service";

type TopicKind = "primary" | "retry" | "dlq" | "other";

interface TopicPartitionSnapshot {
  partition: number;
  earliestOffset: number;
  latestOffset: number;
  retainedMessages: number;
  consumerOffset?: number | null;
  lag?: number | null;
}

interface TopicSnapshot {
  topic: string;
  kind: TopicKind;
  retainedMessages: number;
  consumerLag: number;
  earliestOffset: number;
  latestOffset: number;
  partitions: TopicPartitionSnapshot[];
}

@ApiTags("Events Observability")
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("events/query")
export class EventsObservabilityController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Get("overview")
  @ApiOperation({ summary: "Resumen operativo de eventos Kafka para management" })
  @ApiResponse({ status: 200, description: "Métricas y estado actual de topics/eventos." })
  async getOverview(): Promise<Record<string, unknown>> {
    const admin = await this.kafkaService.getAdminClient();
    const groupId = `${(process.env.KAFKA_GROUP_ID || "nestjs-group").trim()}-codetrace`;
    const topicNames = Array.from(new Set([...EVENT_TOPICS, ...EVENT_RETRY_TOPICS, ...EVENT_DLQ_TOPICS]));

    if (!admin) {
      return {
        available: false,
        generatedAt: new Date().toISOString(),
        metrics: {
          totalTopics: topicNames.length,
          configuredSubscriptions: Object.keys(EVENT_DEFINITIONS).length,
          totalLag: 0,
          totalRetainedMessages: 0,
          retryRetainedMessages: 0,
          dlqRetainedMessages: 0,
        },
        topics: [],
        subscriptions: this.buildSubscriptions(),
        history: [],
      };
    }

    const adminAny = admin as any;
    const consumerOffsets = await this.fetchConsumerOffsets(adminAny, groupId, topicNames);
    const topics = await Promise.all(topicNames.map((topic) => this.buildTopicSnapshot(adminAny, topic, consumerOffsets.get(topic) || new Map())));
    const totalLag = topics.reduce((sum, topic) => sum + topic.consumerLag, 0);
    const totalRetainedMessages = topics.reduce((sum, topic) => sum + topic.retainedMessages, 0);
    const retryRetainedMessages = topics.filter((topic) => topic.kind === "retry").reduce((sum, topic) => sum + topic.retainedMessages, 0);
    const dlqRetainedMessages = topics.filter((topic) => topic.kind === "dlq").reduce((sum, topic) => sum + topic.retainedMessages, 0);
    const primaryRetainedMessages = topics.filter((topic) => topic.kind === "primary").reduce((sum, topic) => sum + topic.retainedMessages, 0);

    return {
      available: true,
      generatedAt: new Date().toISOString(),
      consumerGroupId: groupId,
      metrics: {
        totalTopics: topics.length,
        configuredSubscriptions: Object.keys(EVENT_DEFINITIONS).length,
        primaryTopics: topics.filter((topic) => topic.kind === "primary").length,
        retryTopics: topics.filter((topic) => topic.kind === "retry").length,
        dlqTopics: topics.filter((topic) => topic.kind === "dlq").length,
        totalLag,
        totalRetainedMessages,
        primaryRetainedMessages,
        retryRetainedMessages,
        dlqRetainedMessages,
        launched: primaryRetainedMessages,
        failures: dlqRetainedMessages,
        pending: retryRetainedMessages + totalLag,
        responded: Math.max(primaryRetainedMessages - totalLag, 0),
      },
      topics,
      subscriptions: this.buildSubscriptions(),
      history: this.buildHistory(topics),
    };
  }

  private async buildTopicSnapshot(admin: any, topic: string, consumerOffsets: Map<number, number>): Promise<TopicSnapshot> {
    const offsets = await admin.fetchTopicOffsets(topic);
    const partitions = offsets.map((partitionOffset: any) => {
      const partition = Number(partitionOffset.partition ?? 0);
      const earliestOffset = this.toNumericOffset(partitionOffset.low ?? partitionOffset.offset ?? "0");
      const latestOffset = this.toNumericOffset(partitionOffset.high ?? partitionOffset.offset ?? "0");
      const consumerOffset = consumerOffsets.has(partition) ? consumerOffsets.get(partition)! : null;
      const retainedMessages = Math.max(latestOffset - earliestOffset, 0);
      const lag = consumerOffset === null ? retainedMessages : Math.max(latestOffset - consumerOffset, 0);

      return {
        partition,
        earliestOffset,
        latestOffset,
        retainedMessages,
        consumerOffset,
        lag,
      };
    });

    return {
      topic,
      kind: this.resolveTopicKind(topic),
      retainedMessages: partitions.reduce((sum, partition) => sum + partition.retainedMessages, 0),
      consumerLag: partitions.reduce((sum, partition) => sum + (partition.lag || 0), 0),
      earliestOffset: partitions.length ? Math.min(...partitions.map((partition) => partition.earliestOffset)) : 0,
      latestOffset: partitions.length ? Math.max(...partitions.map((partition) => partition.latestOffset)) : 0,
      partitions,
    };
  }

  private async fetchConsumerOffsets(admin: any, groupId: string, topics: string[]): Promise<Map<string, Map<number, number>>> {
    const offsetsByTopic = new Map<string, Map<number, number>>();
    if (typeof admin.fetchOffsets !== "function") {
      return offsetsByTopic;
    }

    try {
      const offsets = await admin.fetchOffsets({ groupId, topics });
      for (const topicOffset of offsets || []) {
        const partitionMap = new Map<number, number>();
        for (const partitionOffset of topicOffset.partitions || []) {
          partitionMap.set(Number(partitionOffset.partition), this.toNumericOffset(partitionOffset.offset));
        }
        offsetsByTopic.set(String(topicOffset.topic), partitionMap);
      }
    } catch {
      return offsetsByTopic;
    }

    return offsetsByTopic;
  }

  private buildSubscriptions(): Array<Record<string, unknown>> {
    return Object.values(EVENT_DEFINITIONS).map((definition) => ({
      topic: definition.topic,
      eventName: definition.eventName,
      version: definition.version,
      retryTopic: definition.retryTopic,
      dlqTopic: definition.dlqTopic,
      maxRetries: definition.maxRetries,
      replayable: definition.replayable,
    }));
  }

  private buildHistory(topics: TopicSnapshot[]): Array<Record<string, unknown>> {
    return topics
      .flatMap((topic) =>
        topic.partitions.map((partition) => ({
          topic: topic.topic,
          kind: topic.kind,
          partition: partition.partition,
          earliestOffset: partition.earliestOffset,
          latestOffset: partition.latestOffset,
          retainedMessages: partition.retainedMessages,
          consumerOffset: partition.consumerOffset,
          lag: partition.lag,
          status: topic.kind === "dlq" ? "failure" : topic.kind === "retry" ? "pending" : "active",
        })),
      )
      .sort((left, right) => Number(right.latestOffset) - Number(left.latestOffset))
      .slice(0, 30);
  }

  private resolveTopicKind(topic: string): TopicKind {
    if (EVENT_DLQ_TOPICS.includes(topic)) {
      return "dlq";
    }
    if (EVENT_RETRY_TOPICS.includes(topic)) {
      return "retry";
    }
    if (EVENT_TOPICS.includes(topic)) {
      return "primary";
    }
    return "other";
  }

  private toNumericOffset(offset: string | number | null | undefined): number {
    const numericOffset = Number(offset ?? 0);
    return Number.isFinite(numericOffset) ? numericOffset : 0;
  }
}