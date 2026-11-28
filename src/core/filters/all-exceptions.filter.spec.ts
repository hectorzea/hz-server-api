import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { AllExceptionsFilter } from "./all-exceptions.filter";
import { HzServerApiLogger } from "src/core/logger/logger.service";
import { AppError } from "src/shared/errors/app.error";

describe("AllExceptionsFilter", () => {
  let filter: AllExceptionsFilter;
  let mockLogger: { error: jest.Mock; warn: jest.Mock };
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    mockLogger = {
      error: jest.fn(),
      warn: jest.fn()
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    mockHost = {
      getType: jest.fn().mockReturnValue("http"),
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => ({ method: "GET", url: "/api/tasks/test" })
      })
    } as unknown as ArgumentsHost;

    filter = new AllExceptionsFilter(
      mockLogger as unknown as HzServerApiLogger
    );
  });

  it("1. AppError 4xx: devuelve el mensaje real al cliente y registra warn", () => {
    const error = new AppError("Task not found", 404, "TASK_NOT_FOUND");

    filter.catch(error, mockHost);

    expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        code: "TASK_NOT_FOUND",
        message: "Task not found"
      })
    );
  });

  it("2. AppError 5xx con cause: oculta detalles al cliente pero registra stack + Caused by", () => {
    const originalCause = new Error("ENOENT: secret path /etc/passwd");
    const error = new AppError("FS failure", 500, "TASK_FS_ERROR", {
      cause: originalCause
    });

    filter.catch(error, mockHost);

    // Al cliente solo le llega mensaje genérico seguro
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        code: "TASK_FS_ERROR",
        message: "Internal server error"
      })
    );

    // En el log sí queda el mensaje interno y la causa encadenada
    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringContaining("FS failure"),
      expect.stringContaining("Caused by: Error: ENOENT: secret path"),
      "AllExceptionsFilter"
    );
  });

  it("3. ValidationPipe (array de errores): los une en un string legible como warn", () => {
    const error = new BadRequestException([
      "Title can not be empty",
      "status must be a valid enum"
    ]);

    filter.catch(error, mockHost);

    expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Title can not be empty, status must be a valid enum"
      })
    );
  });

  it("4. HttpException con { status, error } sin .message: rescata .error en vez de undefined", () => {
    const error = new HttpException(
      { status: HttpStatus.FORBIDDEN, error: "Custom forbidden reason" },
      HttpStatus.FORBIDDEN
    );

    filter.catch(error, mockHost);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Custom forbidden reason"
      })
    );
  });

  it("5. Contexto no-HTTP (ej. rpc/ws): registra el error sin llamar a switchToHttp", () => {
    const nonHttpHost = {
      getType: () => "rpc",
      switchToHttp: jest.fn()
    } as unknown as ArgumentsHost;

    filter.catch(new Error("RPC explosion"), nonHttpHost);

    expect(mockLogger.error).toHaveBeenCalledTimes(1);
  });
});
