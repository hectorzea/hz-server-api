import { Injectable, LoggerService } from "@nestjs/common";
import { createLogger, format, transports, Logger } from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import * as path from "path";
import * as fs from "fs";

@Injectable()
export class HzServerApiLogger implements LoggerService {
  private logger: Logger;
  constructor() {
    const logDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const transportOptions = {
      file: new DailyRotateFile({
        filename: path.join(logDir, "application-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        zippedArchive: true,
        maxSize: "20m",
        maxFiles: "30d", // Keep logs for 30 days
        auditFile: path.join(logDir, "audit.json"),
        format: format.combine(format.timestamp(), format.json())
      }),
      console: new transports.Console({
        format: format.combine(
          format.colorize(),
          format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          format.printf(({ timestamp, level, message, context }) => {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
            return `${timestamp} [${level}] ${context ? `[${context}] ` : ""}${message}`;
          })
        )
      })
    };

    this.logger = createLogger({
      level: "info",
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
      transports: [transportOptions.file, transportOptions.console],
      exceptionHandlers: [transportOptions.file, transportOptions.console],
      rejectionHandlers: [transportOptions.file, transportOptions.console],
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
