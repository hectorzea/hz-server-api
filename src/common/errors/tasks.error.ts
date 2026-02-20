import { AppError } from "./app.error";

//User Specified Errors
export class TaskNotFoundError extends AppError {
  constructor(id: string) {
    super(`Task with id ${id} not found`, 404, "TASK_NOT_FOUND");
  }
}

//puede probarse en posts posiblemente, en get con id no es valido este caso
export class TaskValidationError extends AppError {
  constructor(field: string, reason: string) {
    super(
      `Field ${field} is invalid, reason: ${reason}`,
      404,
      "TASK_VALIDATION_ERROR"
    );
  }
}

export class TaskFileSystemError extends AppError {
  constructor(detail: string) {
    super(`System Error at exporting ${detail}`, 500, "TASK_FS_ERROR");
  }
}
