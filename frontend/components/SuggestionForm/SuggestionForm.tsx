import ClientForm from './ClientForm';

interface SuggestionFormProps {
  refreshTable: () => void; 
}

export default function SuggestionForm({ refreshTable }: SuggestionFormProps) {
  return (
    <div>
      <ClientForm />
    </div>
  );
}