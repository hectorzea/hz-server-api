import { AppError } from "src/shared/errors/app.error";

export class AiInternalServerError extends AppError {
  constructor(detail: string) {
    super(
      `An error has ocurred with the ai process: ${detail}`,
      500,
      "AI_INTERNAL_SERVER_ERROR"
    );
  }
}
