'use client';
import { Button } from '@/components/ui/button';
import { useState, ChangeEvent, SetStateAction } from 'react';
import { Home, Webhook } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/SeeResult.module.css';
import toast from "react-hot-toast";

interface UserData {
  id: string;
  cat1: number;
  cat2: number;
  cat3: number;
  avg: number;
}

export default function SeeResult() {
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState<UserData[] | null>(null);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const fetchUserData = async () => {
    try {
      const userResponse = await fetch('/api/users', { cache: 'no-cache' });
      const userData = await userResponse.json();
      setUserData(userData);
    } catch (error: any) {
      console.error('Error getting user data:', error.message);
      toast.error('Incorrect password. Please try again.');
    }
  };

  const handlePasswordSubmit = () => {
    if (password === '12345') {
      // If password is correct, fetch user data
      fetchUserData();
      toast.success('Thanks! Report is successfully accessed');
    } else {
      toast.error('Incorrect password. Please try again.');
    }
  };

  return (
    <div>
      <div className="w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 ">
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='flex flex-col items-center text-center'>
      <h1 className="mr-3 mb-5 text-4xl font-semibold">Research Report</h1>
      <h2 className="mr-3 mb-5 text-xl">Please enter the admin's password to access the report</h2>
      <div>
        <label>Password: </label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div className='flex mt-2'>
      <Link href='/'>
      <Button className='mt-2 mr-3'>Home <Home className="ml-2" /></Button>
      </Link>
      <Button className='mt-2' onClick={handlePasswordSubmit}>Access Report <Webhook className="ml-2" /></Button>
      </div>
      {userData && (
        <div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Participant's ID</th>
                <th>Category 1</th>
                <th>Category 2</th>
                <th>Category 3</th>
                <th>Overall point</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.cat1}</td>
                  <td>{user.cat2}</td>
                  <td>{user.cat3}</td>
                  <td>{user.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
    </div>
    </div>
  );
}
