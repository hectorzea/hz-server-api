import { Injectable, LoggerService } from "@nestjs/common";
import { createLogger, format, transports, Logger } from "winston";
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

    // ─── Console: ALWAYS (Local & Production) ───
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

    // ─── Daily Rotate File: Just Local ───
    //    No writing on files on production
    //    Render delete filesystem every deploy
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
      const LokiTransport = require("winston-loki");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const lokiTransport = new LokiTransport({
        host: process.env.LOKI_HOST,
        basicAuth: `${process.env.LOKI_USER}:${process.env.LOKI_API_KEY}`,
        // labels that are being added to all logs
        // this allows grafana to filter with {app="hz-server-api"}
        labels: {
          app: "hz-server-api-logs",
          environment: "production"
        },

        // Send logs as structured json
        json: true,

        // group multiple logs instead of individual
        batching: true,

        interval: 5,

        //if loki fails we show error
        onConnectionError: (err) =>
          console.error("[Loki] Connection error:", err)
      });

      activeTransports.push(lokiTransport);
    }
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
      // Usage of dynamic arrays
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
