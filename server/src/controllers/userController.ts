// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import { createUser } from "../services/userService";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, clerkId } = req.body;
    console.log("req.body", req.body);

    if (!name || !email || !clerkId) {
      return res.status(400).json({ message: "All fields are required" }); // 400 Bad Request
    }

    const user = await createUser(name, email, clerkId);
    console.log("user", user);

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error); // Pass any unexpected errors to the error handler
  }
};
