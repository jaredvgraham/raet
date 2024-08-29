import { createClerkClient } from "@clerk/clerk-sdk-node";
const { CLERK_SECRET_KEY } = process.env;

const clerkClient = createClerkClient({ secretKey: CLERK_SECRET_KEY });

export default clerkClient;
