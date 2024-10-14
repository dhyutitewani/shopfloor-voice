'use client';

import { Bar } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Suggestion {
  hash: string;
  suggestion: string;
  category: string;
  dateTime: number;
  employeeId: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SuggestionBarGraph: React.FC = () => {
  const [suggestionData, setSuggestionData] = useState<Suggestion[]>([]);
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });

  useEffect(() => {
    // Fetch suggestions data
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/suggestions`);
        if (response.ok) {
          const data: Suggestion[] = await response.json();
          setSuggestionData(data);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    const suggestionsPerMonth: { [key: string]: number } = {};

    suggestionData.forEach((suggestion) => {
      const date = new Date(suggestion.dateTime);
      const monthYear = date.toLocaleString('default', { month: 'short' });
      suggestionsPerMonth[monthYear] = (suggestionsPerMonth[monthYear] || 0) + 1;
    });

    // Define the correct month order
    const monthOrder = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const orderedLabels = monthOrder.filter(month => suggestionsPerMonth[month] !== undefined);
    const orderedData = orderedLabels.map(month => suggestionsPerMonth[month] || 0);

    setChartData({
      labels: orderedLabels,
      datasets: [
        {
          data: orderedData,
          backgroundColor: 'rgba(0, 62, 115, 1)', 
          borderColor: 'rgba(0, 62, 115, 1)', 
          borderWidth: 1,
          barThickness: 50,
        },
      ],
    });
  }, [suggestionData]);

  return (
    <div>
      <h3 style={{ fontSize: '21px', color: '#000' }}>Suggestions Received</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          animation: {
            duration: 0,
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                color: '#000',
                font: {
                  size: 14,
                },
              },
            },
            x: {
              ticks: {
                color: '#000',
                font: {
                  size: 14,
                },
              },
            },
          },
        }}
        width={900}
        height={350}
      />
    </div>
  );
};

export default SuggestionBarGraph;