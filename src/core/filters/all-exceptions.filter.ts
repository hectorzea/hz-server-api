import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Request, Response } from "express";
import { AppError } from "src/shared/errors/app.error";
import { HzServerApiLogger } from "src/core/logger/logger.service";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: HzServerApiLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    if (host.getType() !== "http") {
      this.logger.error(
        exception instanceof Error ? exception.message : String(exception),
        this.buildStackWithCause(exception),
        AllExceptionsFilter.name
      );
      return;
    }
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const { status, internalMessage, clientMessage, code } =
      this.resolveException(exception);

    const logMessage = `[${code}] ${internalMessage} | ${request.method} ${request.url}`;
    const logContext = "AllExceptionsFilter";

    if (status >= 500) {
      this.logger.error(
        logMessage,
        this.buildStackWithCause(exception),
        logContext
      );
    } else if (status >= 400) {
      this.logger.warn(logMessage, AllExceptionsFilter.name);
    }

    response.status(status).json({
      statusCode: status,
      code,
      message: clientMessage,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    });
  }

  private buildStackWithCause(exception: unknown): string | undefined {
    if (!(exception instanceof Error)) return undefined;

    let fullStack =
      exception.stack ?? `${exception.name}: ${exception.message}`;
    let currentCause: unknown = exception.cause;

    while (currentCause instanceof Error) {
      const causeTrace =
        currentCause.stack ?? `${currentCause.name}: ${currentCause.message}`;
      fullStack += `\nCaused by: ${causeTrace}`;
      currentCause = currentCause.cause;
    }

    return fullStack;
  }

  private resolveException(exception: unknown): {
    status: number;
    internalMessage: string;
    clientMessage: string;
    code: string;
  } {
    if (exception instanceof AppError) {
      const isServerError = exception.statusCode >= 500;
      return {
        status: exception.statusCode,
        internalMessage: exception.message,
        clientMessage: isServerError
          ? "Internal server error"
          : exception.message,
        code: exception.code
      };
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const extractedMessage = this.extractHttpExceptionMessage(exception);
      const isServerError = status >= 500;
      return {
        status,
        internalMessage: extractedMessage,
        clientMessage: isServerError
          ? "Internal server error"
          : extractedMessage,
        code: "NEST_HTTP_EXCEPTION"
      };
    }
    if (exception instanceof Error && "code" in exception) {
      const sysError = exception as NodeJS.ErrnoException;
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        internalMessage: `System error (${sysError.code}): ${sysError.message}`,
        clientMessage: "Internal server error",
        code: sysError.code ?? "SYSTEM_ERROR"
      };
    }

    // si no ocurre ninguna excepcion detectable por el logger
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      internalMessage:
        exception instanceof Error ? exception.message : String(exception),
      clientMessage: "Internal server error",
      code: "UNKNOWN_ERROR"
    };
  }

  private extractHttpExceptionMessage(exception: HttpException): string {
    const res = exception.getResponse();
    if (typeof res === "string") return res;
    if (typeof res === "object" && res !== null) {
      const resObj = res as Record<string, unknown>;
      if (Array.isArray(resObj.message)) {
        return resObj.message.join(", ");
      }
      if (typeof resObj.message === "string" && resObj.message.length > 0) {
        return resObj.message;
      }
      if (typeof resObj.error === "string" && resObj.error.length > 0) {
        return resObj.error;
      }
    }
    return exception.message || "HTTP Exception";
  }
}
