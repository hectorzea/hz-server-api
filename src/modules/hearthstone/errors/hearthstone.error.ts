import { AppError } from "src/shared/errors/app.error";

export class CardNotFoundError extends AppError {
  constructor(cardName: string) {
    super(`Card with name: ${cardName} not found`, 404, "CARD_NOT_FOUND");
  }
}

export class CardTokensFetchError extends AppError {
  constructor(cardId: string, options?: ErrorOptions) {
    super(
      `Error obtaining card tokens for ${cardId}`,
      500,
      "CARD_TOKENS_ERROR",
      options
    );
  }
}

export class HearthstoneDatabaseError extends AppError {
  constructor(detail: string, options?: ErrorOptions) {
    super(detail, 500, "HEARTHSTONE_DB_ERROR", options);
  }
}

export class MatchSaveError extends AppError {
  constructor(options?: ErrorOptions) {
    super("Error saving match results", 500, "MATCH_SAVE_ERROR", options);
  }
}
