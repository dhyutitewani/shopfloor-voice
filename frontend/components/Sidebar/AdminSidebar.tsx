'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AdminSidebar() {
  const { data: session, status } = useSession();

  // Determine if the session is loading
  const loading = status === 'loading';

  return (
    <aside className="w-64 min-h-screen bg-gray-800 p-4">
      <nav className="mt-20">
        <ul className="space-y-10 text-xl text-white">
          <li><Link href="/admin">Home</Link></li>
          <li><Link href="/admin/addSuggestion">Add Suggestion</Link></li>
          <li><Link href="/admin/viewSuggestion">View Suggestions</Link></li>
          
          {loading ? (
            <li>Loading...</li> // Display loading state while determining session
          ) : session ? (
            <li>
              <Link href="/admin/logout">Logout</Link>
            </li>
          ) : (
            <li><Link href="/admin/login">Login</Link></li>
          )}
        </ul>
      </nav>
    </aside>
  );
}