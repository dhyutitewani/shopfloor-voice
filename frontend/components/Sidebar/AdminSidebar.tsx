'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function AdminSidebar() {
  const { data: session } = useSession();

  return (
    <aside className="w-64 min-h-screen bg-gray-800 p-4">
      <nav className="mt-20">
        <ul className="space-y-10 text-xl text-white">
          <li><Link href="/admin">Home</Link></li>
          <li><Link href="/admin/addSuggestion">Add Suggestion</Link></li>
          <li><Link href="/admin/viewSuggestion">View Suggestions</Link></li>
          {session ? (
            // If logged in, show Logout button
            <li>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
              >
                Logout
              </button>
            </li>
          ) : (
            // If not logged in, show Login link
            <li><Link href="/admin/login">Login</Link></li>
          )}
        </ul>
      </nav>
    </aside>
  );
}