import { Injectable, OnModuleInit } from "@nestjs/common";
import * as client from "prom-client";
import { Counter } from "prom-client"; // Importar el tipo Counter explícitamente

@Injectable()
export class MonitoringService implements OnModuleInit {
  public register = new client.Registry();
  private httpRequestCounter: Counter<string>; // Declarar la métrica con el tipo correcto

  onModuleInit() {
    client.collectDefaultMetrics({ register: this.register });

    // Inicializar la métrica con el tipo Counter
    this.httpRequestCounter = new client.Counter({
      name: "http_requests_total",
      help: "Total number of HTTP requests",
      labelNames: ["method", "route", "status_code"],
      registers: [this.register]
    });
    // No necesitas registrarla de nuevo con register.registerMetric si ya la pasaste en el constructor
  }

  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  // Método para incrementar el contador de peticiones
  incrementHttpRequestCounter(
    method: string,
    route: string,
    statusCode: number
  ): void {
    // Usar la métrica directamente, ya está correctamente tipada
    this.httpRequestCounter.inc({ method, route, status_code: statusCode });
  }
}
