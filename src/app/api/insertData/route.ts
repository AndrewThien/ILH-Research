import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export const POST = async (req: Request) => {
  try {
    const { userId } : { userId: string } = auth();
    const body = await req.json();
    const { avgCat1, avgCat2, avgCat3 } = body;
    // Insert the values into the "users" table
    await db.insert(users).values({
        user_id: userId,
        cat1: avgCat1,
        cat2: avgCat2,
        cat3: avgCat3,
        avg: (avgCat1 + avgCat2 + avgCat3)
        })

    return NextResponse.json({ message: 'Data inserted successfully.' });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json(
      { error: 'Error inserting data.', details: error.message },
      { status: 500 }
    );
  }
};
