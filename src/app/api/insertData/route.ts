import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const {userId} = await auth();

    const { avgCat1, avgCat2, avgCat3 } = body;
    const userIdString = String(userId)
    const cat1Value = String(avgCat1 !== null ? avgCat1 : '');
    const cat2Value = String(avgCat2 !== null ? avgCat2 : '');
    const cat3Value = String(avgCat3 !== null ? avgCat3 : '');

    // Insert the values into the "users" table
    await db.insert(users).values({
      user_id: userIdString,
      cat1: cat1Value,
      cat2: cat2Value,
      cat3: cat3Value,
      avg: cat1Value + cat2Value + cat3Value,
    });

    return NextResponse.json({ message: 'Data inserted successfully.' });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json(
      { error: 'Error inserting data.' },
      { status: 500 }
    );
  }
};
