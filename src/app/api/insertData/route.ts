import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

interface users {
  user_id: string;
  cat1: number;
  cat2: number;
  cat3: number;
  avg: number;
}
export const runtime = 'edge';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { userId }: { userId: any } = await auth();

    const { avgCat1, avgCat2, avgCat3 }: { avgCat1: any; avgCat2: any; avgCat3: any } = body;
    console.log(body)
    console.log("2", typeof avgCat1, avgCat2, avgCat3)
    // Insert the values into the "users" table
    const cat1Value = avgCat1 !== null ? avgCat1 : 0;  
    const cat2Value = avgCat2 !== null ? avgCat2 : 0;  
    const cat3Value = avgCat3 !== null ? avgCat3 : 0;  
    console.log("3", typeof cat1Value, cat2Value, cat3Value)
    // Insert the values into the "users" table
    await db.insert(users).values({
      user_id: userId,
      cat1: cat1Value,
      cat2: cat2Value,
      cat3: cat3Value,
      avg: cat1Value + cat2Value + cat3Value,
    } as users);

    return NextResponse.json({ message: 'Data inserted successfully.' });
  } catch (error: any) {
    console.error('Error inserting data:', error);
    return NextResponse.json(
      { error: 'Error inserting data.', error},
      { status: 500 }
    );
  }
};
