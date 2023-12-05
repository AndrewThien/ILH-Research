'use client';
import { Button } from '@/components/ui/button';
import { useState, ChangeEvent, SetStateAction } from 'react';
import { Home, Webhook } from 'lucide-react';
import Link from 'next/link';
import styles from '@/app/SeeResult.module.css';
import toast from "react-hot-toast";
import { Bar } from 'react-chartjs-2';
import { Chart, registerables, ChartOptions} from 'chart.js';

Chart.register(...registerables);

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

  const chartData = {
    labels: userData ? userData.map(user => user.id) : [],
    datasets: [
      {
        label: 'Need',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        data: userData ? userData.map(user => user.cat1) : [],
      },
      {
        label: 'Search',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        data: userData ? userData.map(user => user.cat2) : [],
      },
      {
        label: 'Evaluation',
        backgroundColor: 'rgba(255,206,86,0.2)',
        borderColor: 'rgba(255,206,86,1)',
        borderWidth: 1,
        data: userData ? userData.map(user => user.cat3) : [],
      },
      {
        label: 'Overall ILH score',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        data: userData ? userData.map(user => user.avg) : [],
      },
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    scales: {
      x: {
        type: 'category',
        labels: userData ? userData.map(user => user.id) : [],
        title: {
          display: true,
          text: 'Participant ID',
        },
      },
      y: {
        type: 'linear',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <div>
      <div className="w-screen min-h-screen bg-gradient-to-b from-sky-400 to-sky-200">
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='flex flex-col items-center text-center'>
      <h1 className="mb-1 text-3xl font-semibold">Research Report</h1>
      <h2 className="mb-1 text-xl">Please enter the password to access the report</h2>
      <h2 className="mb-2 text-sm">Note: Password is 12345 (for demonstration purpose)</h2>
      <div>
        <label>Password: </label>
        <input type="password" value={password} onChange={handlePasswordChange} />
      </div>
      <div className='flex mt-2'>
      <Link href='/'>
      <Button className='mt-2 mr-3'>Home <Home className="ml-2" /></Button>
      </Link>
      <Button className='mt-2' onClick={handlePasswordSubmit}>Submit Password <Webhook className="ml-2" /></Button>
      </div>
      {userData && (
        <div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Participant ID</th>
              <th>Need</th>
              <th>Search</th>
              <th>Evaluation</th>
              <th>Overall ILH score</th>
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
        <h2 className="mt-2 text-xl">Data in Bar chart (Hover to see the value)</h2>
        <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
    </div>
    </div>
    </div>
    </div>
  );
}
