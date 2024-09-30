'use client';

import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type State = {
  errors: {
    text?: string;
  };
};

export default function LoginForm() {
  const [state, setState] = React.useState<State>({ errors: { text: undefined } });
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');   

    if (!username || !password) {
      setState({ errors: { text: 'Suggestion and Category are required.' } });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Network response was not ok');
      }

      const result = await signIn('credentials', {
        email : username,
        password,
        redirect: true,
      });

      if (result?.error) {
        setError(result.error); // Set error message
      } else {
        router.push('/admin/dashboard'); // Redirect to admin dashboard on successful login
      }
    } catch (error) {
      console.error('Error loging in.', error);
      const errorMessage = error instanceof Error ? error.message : 'User not admin.';
      setState({ errors: { text: errorMessage } });
    }
  };

  const errors = state?.errors ?? { text: undefined };

  if (submitted) {
    return (
      <div className="relative flex items-center justify-center">
        <div className="text-center mt-40">
          <h1 className="text-3xl font-bold">Thank you for your response!</h1>
        </div>
      </div>
    );
  }

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