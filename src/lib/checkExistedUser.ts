import { auth } from "@clerk/nextjs";

interface User {
  user_id: string;
}

const { userId } = await auth()

export async function getServerSideProps() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users`);
    const data: User[] = await res.json();
    const userIds = data.map(user => user.user_id);
    const answered = userIds.includes(userId);
    return answered
  }