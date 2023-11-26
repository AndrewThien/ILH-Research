import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const GET = async (req: Request) => {

  try {

    const _users = await db
    .select()
    .from(users);

    return NextResponse.json(_users);
  } catch (error: any) {
    console.log(error, "Fetching users is going wrong")
    return NextResponse.json({error: "Fetching users is going wrong"}, {status: 500}); 
  }
}