import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-800 p-4">
      <nav className="mt-20">
        <ul className="space-y-10 text-xl text-white">
          <li><Link href="/user">Home</Link></li>
          <li><Link href="/user/addSuggestion">Add Suggestion</Link></li>
          <li><Link href="/user/viewSuggestion">View Suggestions</Link></li>
        </ul>
      </nav>
    </aside>
  );
}