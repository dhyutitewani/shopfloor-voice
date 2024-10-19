'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Logout() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push('/admin/login');
    return null;    
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {session.user?.firstName} {session.user?.lastName}!
      </h1>
      <button
        className="px-6 py-2 bg-red-800 text-white rounded-sm"
        onClick={() => {
          signOut({ callbackUrl: '/admin/login' });
        }}
      >
        Logout
      </button>
    </div>
  );
}