import { neon } from "@neondatabase/serverless";

export async function POST(req: Request) {
  console.log("endpoint hit");

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const { name, email, clerkId } = await req.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await sql`
    INSERT INTO users (name, email, clerk_id)
    VALUES (${name}, ${email}, ${clerkId})
    `;

    return new Response(JSON.stringify(res), { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
