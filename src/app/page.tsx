import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import { getServerSideProps } from '@/lib/checkExistedUser';

export default async function Home() {

  const { userId } = await auth()
  const user = await currentUser();
  const isAuth = !!userId;

  const answered = await getServerSideProps()


  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 ">
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex flex-col items-center text-center'>
          <h1 className="mr-3 mb-5 text-4xl font-semibold">Research Questionnaire</h1>
          <div className="flex items-center">
            {isAuth ? (
              <div>
                <h1 className="mr-3 text-4xl font-semibold">Hi {user?.firstName}</h1>
              </div>
            ) : (
              <div>
                <div className="max-w-xl mt-2 text-xl">
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
        You already answered the questionnaire
      </Button>
    )}

    {isAuth && !answered && (
      <Link href="/questionnaire">
        <Button>Get started here</Button>  
      </Link>
    )}

    {!isAuth && (
      <Link href="/sign-in">
        <Button>
           Log in to get started
        </Button>
      </Link>
    )}
  </div>
            {/* Add a button to go to the seeResult page */}
            <Link href="/seeResult">
              <Button>
                Go to seeResult page
              </Button>
            </Link>
          </div>
          <div className="flex mt-5">
          </div>
        </div>
      </div>
    </div>
  );
}
