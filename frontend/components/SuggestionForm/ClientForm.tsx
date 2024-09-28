'use client';

import * as React from 'react';
import Dropdown from './Dropdown';
import Alert from '@mui/material/Alert';

interface State {
  errors: {
    text: string | undefined;
  };
}

export default function ClientForm() {
  const [state, setState] = React.useState<State>({ errors: { text: undefined } });
  const [suggestion, setSuggestion] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const charLimit = 500;

  const countCharacters = (text: string) => {
    return text.length;
  };

  const refreshTable = () => {
    console.log('Table reloaded');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!suggestion || !category) {
      setState({ errors: { text: 'Suggestion and Category are required.' } });
      return;
    }

    const charCount = countCharacters(suggestion);
    if (charCount > charLimit) {
      setState({ errors: { text: `Suggestion is too long. Limit is ${charLimit} characters.` } });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suggestion, employeeId, category }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Network response was not ok');
      }

      const result = await response.json();
      console.log('Suggestion saved:', result);

      setSuggestion('');
      setEmployeeId('');
      setCategory('');
      setState({ errors: { text: undefined } });
      setSubmitted(true);

      refreshTable();
    } catch (error) {
      console.error('Error saving suggestion:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save suggestion';
      setState({ errors: { text: errorMessage } });
    }
  };

  const errors = state?.errors ?? { text: undefined };

  if (submitted) {
    return (
      <div className="relative flex items-center justify-center">
        <div className="text-center mt-40">
          <h1 className="text-3xl font-bold">Thank you for your response!</h1>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <div>
          <h3 className="text-2xl mb-2 mt-2">Enter your suggestion:</h3>
          <div>
            <label htmlFor="text" className="block text-l font-l"></label>
            <textarea
              className="mt-1 block w-full px-4 py-2 border border-black rounded-sm text-opacity-100 focus:outline-none sm:text-sm"
              id="text"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}        
              autoComplete="off"
              placeholder={`Maximum ${charLimit} characters`}
              style={{
                textAlign: "left",
                boxSizing: "border-box", 
                height: "180px", 
                overflow: "auto", 
                resize: "none", 
              }}
            />
            <p className="mt-1 text-sm text-gray-600">
              Character Count: {countCharacters(suggestion)} / {charLimit}
            </p>
            <style jsx>{`
              textarea::placeholder {
                position: 'absolute';
                display: 'flex';
                alignItems: 'center';
                justifyContent: 'center';
                text-align: center;
                color: #888;
              }
            `}</style>
          </div>
        </div>
        <div className="mt-1 min-h-[10px]">
          {errors.text && (
            <span>
              <Alert severity="warning">{errors.text}</Alert>
            </span>
          )}
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="employeeId" className="block text-m font-l">Employee ID (optional)</label>
        <input
          id="employeeId"
          type="text"
          className="mt-1 block w-full px-3 py-3 rounded-sm border border-black text-opacity-100 focus:outline-none sm:text-sm"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          autoComplete="off"
        />
      </div>
      <div>
        <Dropdown setCategory={setCategory} />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="w-1/4 h-14 dark:bg-neutral-500/30 text-black py-2 px-2 border border-black rounded-lg shadow-sm text-2xl"
        >
          Submit
        </button>
      </div>
    </form>
  );
}