import { ServiceRegistry } from "@core/service-registry";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class LoggerService implements OnModuleInit {
  private readonly environment: string = process.env.NODE_ENV || "development";
  private readonly level: string = process.env.LOG_LEVEL || "info";

  private readonly levels: { [key: string]: number } = {
    error: 0,
    warning: 1,
    info: 2,
    log: 3,
  };

  constructor() {}

  async onModuleInit() {
    ServiceRegistry.getInstance().registry(this);
  }

  private shouldLog(level: string): boolean {
    return this.levels[level] <= this.levels[this.level];
  }

  log(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog("log")) {
      console.log(`🔊 [${this.environment}] ${message}`, optionalParams);
    }
  }

  error(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog("error")) {
      console.error(`❌[${this.environment}] ${message}`, optionalParams);
    }
  }

  warning(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog("warning")) {
      console.warn(`⚠️[${this.environment}] ${message}`, optionalParams);
    }
  }

  info(message: any, ...optionalParams: any[]): void {
    if (this.shouldLog("info")) {
      console.info(`ℹ️[${this.environment}] ${message}`, optionalParams);
    }
  }
}
export default LoggerService;
export const logger = new LoggerService();
