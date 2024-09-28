'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); 
    const result = await signIn('credentials', {
      email : username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error); // Set error message
    } else {
      router.push('/admin'); // Redirect to admin dashboard on successful login
    }
  };

  return (
    <main className="bg-white p-8 rounded-sm shadow-md w-[23rem]">
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}
        <div className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border border-gray-300 rounded-sm px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-300 rounded-sm px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="grid grid-col-1 group rounded-sm border border-gray-400 dark:bg-neutral-500/30 px-5 py-3 w-[7rem] mx-auto"
        >
          Login
        </button>
      </form>
    </main>
  );
}