import { db } from "@/lib/db";
import { questions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const GET = async (req: Request) => {
  try {
    const _questions = await db.select().from(questions);
    
    return NextResponse.json(_questions);
  } catch (error) {
    console.error(error, "Fetching questions is going wrong");
    return NextResponse.json(
      { error: "Fetching questions is going wrong" },
      { status: 500 }
    );
  }
};
