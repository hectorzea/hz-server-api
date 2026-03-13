import { Injectable, OnModuleInit } from "@nestjs/common";
import * as client from "prom-client";
import { Counter } from "prom-client"; // Importar el tipo Counter explícitamente

@Injectable()
export class MonitoringService implements OnModuleInit {
  public register = new client.Registry();
  private httpRequestCounter: Counter<string>;

  onModuleInit() {
    this.httpRequestCounter = new client.Counter({
      name: "http_requests_total",
      help: "Total number of HTTP requests",
      labelNames: ["method", "route", "status_code"],
      registers: [this.register]
    });
  }

  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  incrementHttpRequestCounter(
    method: string,
    route: string,
    statusCode: number
  ): void {
    this.httpRequestCounter.inc({ method, route, status_code: statusCode });
  }
}
