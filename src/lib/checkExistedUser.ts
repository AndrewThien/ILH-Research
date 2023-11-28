import { auth } from "@clerk/nextjs";


const { userId } = await auth()

export async function getServerSideProps() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users`);
    const data = await res.json();
    const userIds = data.map(user => user.user_id);
    const answered = userIds.includes(userId);
    return answered
  }