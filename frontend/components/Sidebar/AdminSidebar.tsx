import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 p-4">
      <nav className="mt-20">
        <ul className="space-y-10 text-xl text-white">
          <li><Link href="/admin">Home</Link></li>
          <li><Link href="/admin/addSuggestion">Add Suggestion</Link></li>
          <li><Link href="/admin/viewSuggestion">View Suggestions</Link></li>
          <li><Link href="/admin/login">Login</Link></li>
        </ul>
      </nav>
    </aside>
  );
}