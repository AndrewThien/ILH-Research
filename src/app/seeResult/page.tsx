'use client';
import { useState, ChangeEvent, SetStateAction } from 'react';

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
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const fetchUserData = async () => {
    try {
      const userResponse = await fetch('/api/users', { cache: 'no-cache' });
      const userData = await userResponse.json();
      console.log(userData);
      setUserData(userData);
      setError(null); // Clear any previous errors on successful fetch
    } catch (error: any) {
      console.error('Error getting user data:', error.message);
      setError('Error getting user data. Please try again.');
    }
  };

  const handlePasswordSubmit = () => {
    if (password === '12345') {
      // If password is correct, fetch user data
      fetchUserData();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div>
      <div className="w-screen min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 ">
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='flex flex-col items-center text-center'>
      <h1>See Result Page</h1>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={handlePasswordChange} />
        <button onClick={handlePasswordSubmit}>Submit</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {userData && (
        <div>
          <h2>User Data</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cat1</th>
                <th>Cat2</th>
                <th>Cat3</th>
                <th>Avg</th>
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
