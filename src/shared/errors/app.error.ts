export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    options?: ErrorOptions
  ) {
    super(message, options);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
