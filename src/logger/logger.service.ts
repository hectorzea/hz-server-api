import { Injectable, LoggerService } from "@nestjs/common";
import { createLogger, format, transports, Logger } from "winston";
import LokiTransport from "winston-loki";
import * as DailyRotateFile from "winston-daily-rotate-file";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class HzServerApiLogger implements LoggerService {
  private logger: Logger;
  constructor() {
    const isProduction = process.env.NODE_ENV === "production";

    const activeTransports: any[] = [];
    const activeExceptionHandlers: any[] = [];
    const activeRejectionHandlers: any[] = [];

    // ─── Console: SIEMPRE (tanto local como producción) ───
    const consoleTransport = new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message, context }) => {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
          return `${timestamp} [${level}] ${context ? `[${context}] ` : ""}${message}`;
        })
      )
    });

    activeTransports.push(consoleTransport);
    activeExceptionHandlers.push(consoleTransport);
    activeRejectionHandlers.push(consoleTransport);

    // ─── Daily Rotate File: SOLO en local ───
    //    En producción no tiene sentido escribir archivos
    //    porque en Render el filesystem es efímero (se borra en cada deploy)
    if (!isProduction) {
      const logDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const fileTransport = new DailyRotateFile({
        filename: path.join(logDir, "application-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
        auditFile: path.join(logDir, "audit.json"),
        format: format.combine(format.timestamp(), format.json())
      });

      activeTransports.push(fileTransport);
      activeExceptionHandlers.push(fileTransport);
      activeRejectionHandlers.push(fileTransport);
    }

    if (!isProduction) {
      const logDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const fileTransport = new DailyRotateFile({
        filename: path.join(logDir, "application-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d",
        auditFile: path.join(logDir, "audit.json"),
        format: format.combine(format.timestamp(), format.json())
      });

      activeTransports.push(fileTransport);
      activeExceptionHandlers.push(fileTransport);
      activeRejectionHandlers.push(fileTransport);
    }

    //Production Loki
    if (isProduction && process.env.LOKI_HOST) {
      const lokiTransport = new LokiTransport({
        host: process.env.LOKI_HOST,
        basicAuth: `${process.env.LOKI_USER}:${process.env.LOKI_API_KEY}`,
        // Labels que se agregan a TODOS los logs
        // Esto te permite filtrar en Grafana con {app="hz-server-api"}
        labels: {
          app: "hz-server-api",
          environment: "production"
        },

        // Send logs as structured json
        json: true,

        // Agrupa varios logs y los envía en un solo request HTTP
        // En vez de hacer 1 request por cada log
        batching: true,

        // Cada 5 segundos envía el batch acumulado a Loki
        interval: 5,

        // Si la conexión a Loki falla, lo logueamos en consola
        // para no perder visibilidad del error
        onConnectionError: (err) =>
          console.error("[Loki] Connection error:", err)
      });

      activeTransports.push(lokiTransport);
    }
    // ⑤ No agregamos Loki como exceptionHandler/rejectionHandler
    //    porque el Console ya lo cubre y evitamos que un error de conexión
    //    a Loki genere un loop infinito de errores

    // const logDir = path.join(process.cwd(), "logs");
    // if (!fs.existsSync(logDir)) {
    //   fs.mkdirSync(logDir, { recursive: true });
    // }

    // const transportOptions = {
    //   file: new DailyRotateFile({
    //     filename: path.join(logDir, "application-%DATE%.log"),
    //     datePattern: "YYYY-MM-DD",
    //     zippedArchive: true,
    //     maxSize: "20m",
    //     maxFiles: "30d", // Keep logs for 30 days
    //     auditFile: path.join(logDir, "audit.json"),
    //     format: format.combine(format.timestamp(), format.json())
    //   }),
    //   console: new transports.Console({
    //     format: format.combine(
    //       format.colorize(),
    //       format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    //       format.printf(({ timestamp, level, message, context }) => {
    //         // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
    //         return `${timestamp} [${level}] ${context ? `[${context}] ` : ""}${message}`;
    //       })
    //     )
    //   })
    // };

    this.logger = createLogger({
      level: process.env.LOG_LEVEL || "info",
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        verbose: 4,
        debug: 5,
        silly: 6
      },
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json()
      ),
      // ⑥ Usamos los arrays dinámicos en vez de valores fijos
      transports: activeTransports,
      exceptionHandlers: activeExceptionHandlers,
      rejectionHandlers: activeRejectionHandlers,
      exitOnError: true
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
