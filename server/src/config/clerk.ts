import { createClerkClient } from "@clerk/clerk-sdk-node";
import "dotenv/config";
const key = process.env.CLERK_SECRET_KEY;
console.log("clerk sec", key);

const clerkClient = createClerkClient({ secretKey: key });

export default clerkClient;
