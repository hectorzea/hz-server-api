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
        format.printf(
          ({ timestamp, level, message, context, trace, stack }) => {
            const stackOutput = trace ?? stack;
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
            const baseLog = `${timestamp} [${level}] ${context ? `[${context}] ` : ""}${message}`;
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
            return stackOutput ? `${baseLog}\n${stackOutput}` : baseLog;
          }
        )
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
          app: "grafanacloud-hzserverapi-logs",
          environment: "production"
        },

        // Send logs as structured json
        json: true,

        // group multiple logs instead of individual
        batching: true,

        interval: 5,

        //if loki fails we show error
        onConnectionError: (err) =>
          // eslint-disable-next-line no-console
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

  log(message: unknown, ...optionalParams: unknown[]) {
    const { formattedMessage, context } = this.parseLogArgs(
      message,
      optionalParams
    );
    this.logger.info(formattedMessage, { context });
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    const { formattedMessage, trace, context } = this.parseErrorArgs(
      message,
      optionalParams
    );
    this.logger.error(formattedMessage, { trace, context });
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    const { formattedMessage, context } = this.parseLogArgs(
      message,
      optionalParams
    );
    this.logger.warn(formattedMessage, { context });
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    const { formattedMessage, context } = this.parseLogArgs(
      message,
      optionalParams
    );
    this.logger.debug(formattedMessage, { context });
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    const { formattedMessage, context } = this.parseLogArgs(
      message,
      optionalParams
    );
    this.logger.verbose(formattedMessage, { context });
  }

  private formatMessage(message: unknown): string {
    if (message instanceof Error) return message.message;
    if (typeof message === "object" && message !== null)
      return JSON.stringify(message);
    return String(message);
  }

  private parseLogArgs(message: unknown, optionalParams: unknown[]) {
    const lastParam = optionalParams[optionalParams.length - 1];
    const context = typeof lastParam === "string" ? lastParam : undefined;
    return {
      formattedMessage: this.formatMessage(message),
      context
    };
  }

  private parseErrorArgs(message: unknown, optionalParams: unknown[]) {
    // Si llaman error(msg, trace, context) -> optionalParams tiene 2 elementos
    // Si llaman error(msg, context)       -> optionalParams tiene 1 elemento
    let trace: string | undefined;
    let context: string | undefined;

    if (optionalParams.length >= 2) {
      trace =
        typeof optionalParams[0] === "string" ? optionalParams[0] : undefined;
      context =
        typeof optionalParams[1] === "string" ? optionalParams[1] : undefined;
    } else if (optionalParams.length === 1) {
      context =
        typeof optionalParams[0] === "string" ? optionalParams[0] : undefined;
    }

    if (!trace && message instanceof Error) {
      trace = message.stack;
    }

    return {
      formattedMessage: this.formatMessage(message),
      trace,
      context
    };
  }
}
