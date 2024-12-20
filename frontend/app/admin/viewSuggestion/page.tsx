import AdminSuggestionTable from '@/components/SuggestionTable/AdminSuggestionTable';

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center p-8 mt-10">
      <div className="w-full max-w-2xl text-center mb-1">
        <h1 className="underline text-3xl font-medium">View Suggestions</h1>
      </div>
      <div className='mt-3'>
        <AdminSuggestionTable />
      </div>
    </main>
  );
}