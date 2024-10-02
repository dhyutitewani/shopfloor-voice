import SuggestionForm from "@/components/SuggestionForm/SuggestionForm";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center p-7 mt-6">
      <div className="w-full max-w-2xl text-center mb-10">
        <h1 className="underline text-3xl font-medium">Add New Suggestion</h1>
      </div>
      <div className="w-full max-w-2xl text-left">
        <SuggestionForm refreshTable={() => {}} />
      </div>
    </main>
  );
}