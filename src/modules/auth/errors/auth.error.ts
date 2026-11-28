import { AppError } from "src/shared/errors/app.error";

export class EmailAlreadyInUseError extends AppError {
  constructor() {
    super("This email is in use", 409, "AUTH_EMAIL_IN_USE");
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid credentials", 401, "AUTH_INVALID_CREDENTIALS");
  }
}

export class TokenMissingError extends AppError {
  constructor(detail = "Token not present") {
    super(detail, 401, "AUTH_TOKEN_MISSING");
  }
}

export class InvalidTokenError extends AppError {
  constructor(detail = "Invalid or expired token", options?: ErrorOptions) {
    super(detail, 401, "AUTH_INVALID_TOKEN", options);
  }
}
