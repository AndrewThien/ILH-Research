import { db } from "@/lib/db";
import { choices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

export const GET = async (req: Request) => {

  try {

    const _choices = await db
    .select()
    .from(choices);
    console.log(_choices)
    return NextResponse.json(_choices);
  } catch (error) {
    console.log(error, "Fetching Choices is going wrong")
    return NextResponse.json({error: "Fetching Choices is going wrong"}, {status: 500}); 
  }
}