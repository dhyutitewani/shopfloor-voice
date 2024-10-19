'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';

// Type for the columns
interface Column {
  id: 'hash' | 'suggestion' | 'category' | 'dateTime' | 'employeeId';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  align?: 'right';
  format?: (value: any) => string;
}

// Table columns configuration
const columns: readonly Column[] = [
  { id: 'hash', label: '#', minWidth: 90, maxWidth: 90 },
  { id: 'category', label: 'Category', minWidth: 100, maxWidth: 120 },
  { id: 'suggestion', label: 'Suggestion', minWidth: 500, maxWidth: 500, maxHeight: 75 },
  {
    id: 'dateTime',
    label: 'Date & Time Submitted',
    minWidth: 200,
    maxWidth: 200,
    format: (value: number) => new Date(value).toLocaleString('en-GB'),
  },
  { id: 'employeeId', label: 'Employee ID', minWidth: 100, maxWidth: 120 },
];

// Type for row data
interface Data {
  hash: string;
  suggestion: string;
  category: string;
  dateTime: number;
  employeeId: string;
}

// Date filter options
const dateOptions = [
  { value: 'oldest', label: 'Oldest to Latest' },
  { value: 'latest', label: 'Latest to Oldest' },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface SuggestionTableProps {
  ref: React.ForwardedRef<unknown>;
}

const SuggestionTable = React.forwardRef<unknown, SuggestionTableProps>((props, ref) => {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [dateFilter, setDateFilter] = React.useState<string>('oldest');
  const [loading, setLoading] = React.useState<boolean>(true); // Added loading state

  // Fetch suggestions from the backend
  const fetchSuggestions = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions`);
      if (response.ok) {
        const data: Data[] = await response.json();
        setRows(
          data.map((item) => ({
            hash: item.hash,
            suggestion: item.suggestion,
            category: item.category,
            dateTime: new Date(item.dateTime).getTime(),
            employeeId: item.employeeId || 'Anonymous',
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  // Delete a specific suggestion by hash
  const deleteSuggestion = async (hash: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Unauthorized. Please log in.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this suggestion?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions/${hash}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setRows((prevRows) => prevRows.filter((row) => row.hash !== hash));
      }
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  // Expose `fetchSuggestions` through the forwarded ref
  React.useImperativeHandle(ref, () => ({
    fetchSuggestions,
  }));

  // Fetch suggestions on component mount
  React.useEffect(() => {
    fetchSuggestions();
  }, []);

  // Sort rows based on date filter
  const sortedRows = [...rows].sort((a, b) => {
    return dateFilter === 'latest' ? b.dateTime - a.dateTime : a.dateTime - b.dateTime;
  });

  return (
    <Box>
      <Box sx={{ width: '20%', padding: 2, maxHeight: '200px', overflowY: 'auto' }}>
        <p className="text-[19px] mb-2 ml-2">Filter by Date</p>
        <FormControl fullWidth variant="outlined">
          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          >
            {dateOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 370 }}>
          <Table stickyHeader aria-label="suggestion table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : sortedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No suggestions found.
                  </TableCell>
                </TableRow>
              ) : (
                sortedRows.map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.hash}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof Data];
                      return (
                        <TableCell
                          key={column.id}
                          style={{
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: column.id === 'suggestion' ? 'block' : undefined,
                          }}
                        >
                          {column.id === 'suggestion' ? (
                            <div
                              style={{
                                maxHeight: column.maxHeight,
                                maxWidth: column.maxWidth,
                                overflowY: 'auto',
                                paddingRight: '8px',
                              }}
                            >
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </div>
                          ) : column.format && typeof value === 'number' ? (
                            column.format(value)
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
});

export default SuggestionTable;