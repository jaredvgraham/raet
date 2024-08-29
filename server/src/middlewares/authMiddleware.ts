import { Request, Response, NextFunction } from "express";
import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

export const authenticateMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isSignedIn } = await clerkClient.authenticateRequest(req, {
      jwtKey: process.env.CLERK_JWT_KEY,
    });

    if (!isSignedIn) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach sessionClaims to req object for later use

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
