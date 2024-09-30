import Link from 'next/link';
import StatisticsGraph from '@/components/StatisticsGraph/StatisticsGraph';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <div className="z-10 w-full items-center text-center justify-between mb-10">
        <h1 className="underline text-3xl font-medium">Employee Suggestions</h1>
      </div>
      <div className="mb-12">
        <StatisticsGraph />
      </div>
      <div className="mb-28 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-2 lg:text-center">
        <Link
          href="user/addSuggestion"
          className="group rounded-lg border border-gray-400 dark:bg-neutral-500/30 px-5 py-4 w-[25rem] mx-auto"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Add Suggestion
          </h2>
        </Link>
        <Link
          href="user/viewSuggestion"
          className="group rounded-lg border border-gray-400 dark:bg-neutral-500/30 px-5 py-4 w-[25rem] mx-auto"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold"> View Suggestions </h2>
        </Link>
      </div>
    </main>
  );
}