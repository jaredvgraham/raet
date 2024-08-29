// src/middlewares/customError.ts

export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Set the prototype explicitly to maintain instanceof checks
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
