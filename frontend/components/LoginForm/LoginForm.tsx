'use client';

import * as React from 'react';
import { Alert } from '@mui/material'; 
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

type State = {
  errors: {
    text?: string;
  };
};

export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const router = useRouter();

  async function authenticate(
    prevState: void | undefined,
    formData: FormData
  ) {
    const values = Object.fromEntries(formData);
    const { email, password } = values;

    // Validate input
    if (!email || !password) {
      return 'Email and Password are required.'; // Set the error message
    }

    try {
      const result: any = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      // Success
      if (result.status === 200) {
        router.push('/admin');
      } else if (result.status === 401) {
        throw new Error(result.message ?? "Invalid email or password.");
      }
    } catch (error: any) {
      console.error(error.message);
      return error.message;
    }
  }

  return (
    <main className="bg-white p-8 rounded-sm shadow-md w-[23rem]">
      <form action={dispatch}>
        <div className="mb-4">
          <input
            type="text"
            name="email"
            autoComplete="off"
            placeholder="Email"
            className="border border-gray-300 rounded-sm px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-2">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border border-gray-300 rounded-sm px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-1 min-h-[10px]">
          {errorMessage && (
            <span>
              <Alert severity="warning">{errorMessage}</Alert>
            </span>
          )}
        </div>
        {/* <span className="mt-10 text-sm ml-2 hover:text-blue-500 cursor-pointer">Forgot Password?</span> */}
        <LoginButton />
      </form>
    </main>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button aria-disabled={pending} className="mt-3 grid grid-col-1 group rounded-sm border border-gray-400 dark:bg-neutral-500/30 px-5 py-3 w-[9rem] mx-auto">
      {pending ? "Submitting..." : "Login"}
    </button>
  );
}