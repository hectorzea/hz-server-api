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
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const { status, message, code } = this.resolveException(exception);

    // stack trace in internal logs, never on client
    if (exception instanceof Error) {
      this.logger.error(
        `[${code}] ${message} | ${request.method} ${request.url}`,
        "AllExceptionsFilter"
      );
    }
    response.status(status).json({
      statusCode: status,
      code,
      message,
      path: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    });
  }

  private resolveException(exception: unknown): {
    status: number;
    message: string;
    code: string;
  } {
    if (exception instanceof AppError) {
      return {
        status: exception.statusCode,
        message: exception.message,
        code: exception.code
      };
    }
    if (exception instanceof HttpException) {
      const res = exception.getResponse();
      return {
        status: exception.getStatus(),
        //Todo Check later
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        message: typeof res === "string" ? res : (res as any).message,
        code: "NEST_HTTP_EXCEPTION"
      };
    }
    if (exception instanceof Error && "code" in exception) {
      const sysError = exception as NodeJS.ErrnoException;
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error del sistema: ${sysError.code}`,
        code: sysError.code ?? "SYSTEM_ERROR"
      };
    }
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error interno inesperado",
      code: "UNKNOWN_ERROR"
    };
  }
}
