// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { CustomError } from "./customError";

export const errorHandler = (
  err: CustomError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err); // Log the error message for debugging
  if (err.message === "Unauthenticated") {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const statusCode = err.statusCode || 500; // Default to 500 if statusCode is not set
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
