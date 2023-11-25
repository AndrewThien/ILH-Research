import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export const POST = async (req: Request) => {
  try {
    const {userId} = await auth()
    const { avgCat1, avgCat2, avgCat3, avg } = req.body;
    console.log(userId)
    // Insert the values into the "users" table
    await db.insert(users).values({
        user_id: userId,
        category_1: avgCat1,
        category_2: avgCat2,
        category_3: avgCat3,
        average_score: avg
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
