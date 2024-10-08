'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginForm from '@/components/LoginForm/LoginForm';

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push('/admin'); 
    return null;
  }

  return (
    <main className="flex flex-col items-center justify-center p-10 mt-20">
      <h1 className="underline text-3xl font-medium">Admin Login</h1>
      <div className="mt-20">
        <LoginForm />
      </div>
    </main>
  );
}