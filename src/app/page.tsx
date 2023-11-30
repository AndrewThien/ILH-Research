import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {FileCheck } from 'lucide-react'
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { checkUser } from '@/lib/checkExistedUser';

export default async function Home() {

  const { userId } = await auth()
  const user = await currentUser();
  const isAuth = !!userId;

  const answered = await checkUser()


  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 ">
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center text-center'>
        <h1 className="mr-3 mb-5 text-4xl font-semibold">Involvement Load Hypothesis</h1>
          <h1 className="mr-3 mb-5 text-3xl font-semibold">Research Questionnaire</h1>
          <div className="flex items-center">
            {isAuth ? (
              <div>
                <h1 className="mr-3 text-2xl font-semibold">Hi {user?.firstName}</h1>
              </div>
            ) : (
              <div>
                <div className="max-w-xl mt-2 text-xl font-semibold">
                  <p>Thanks for agreeing to participate in my research</p>
                </div>
              </div>
            )}

            <UserButton afterSignOutUrl="/"></UserButton>
          </div>
          <div className="w-full mt-4">
          <div>
              {isAuth && answered && (  
                <Button disabled>
                  Thanks! You already answered the questionnaire.
                </Button>
              )}

              {isAuth && !answered  && (
                <Link href="/questionaire">
                  <Button>Get started here</Button>  
                </Link>
              )}

              {!isAuth && (
                <Link href="/sign-in">
                  <Button>
                    Log in to get started <LogIn className='ml-2'/>
                  </Button>
                </Link>
              )}
            </div>
            <Link href="/seeResult">
              <Button className='mt-4'>
                Admin? See the report here <FileCheck className='ml-2'/>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
