'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react'; // You can still keep this import if you want session data
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

interface Column {
  id: 'hash' | 'suggestion' | 'category' | 'dateTime' | 'employeeId' | 'actions';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  align?: 'right';
  format?: (value: any) => string;
}

const columns: readonly Column[] = [
  { id: 'hash', label: '#', minWidth: 100, maxWidth: 120 },
  { id: 'category', label: 'Category', minWidth: 100, maxWidth: 120 },
  { id: 'suggestion', label: 'Suggestion', minWidth: 450, maxWidth: 450, maxHeight: 80 },
  {
    id: 'dateTime',
    label: 'Date & Time Submitted',
    minWidth: 200,
    maxWidth: 200,
    format: (value: number) => new Date(value).toLocaleString('en-GB'),
  },
  { id: 'employeeId', label: 'Employee ID', minWidth: 100, maxWidth: 120 },
  { id: 'actions', label: 'Actions', minWidth: 50, maxWidth: 100 },
];

interface Data {
  _id: string;
  hash: string;
  suggestion: string;
  category: string;
  dateTime: number;
  employeeId: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const AdminSuggestionTable = React.forwardRef<unknown, {}>((props, ref) => {
  const { data: session } = useSession(); // Keep session data if you need other session info
  const [rows, setRows] = React.useState<Data[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  // Fetch suggestions from the backend API
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions`); // API URL
      if (response.ok) {
        const data: Data[] = await response.json();
        setRows(
          data.map((item) => ({
            _id: item._id,
            hash: item.hash,
            suggestion: item.suggestion,
            category: item.category,
            dateTime: new Date(item.dateTime).getTime(),
            employeeId: item.employeeId || 'Anonymous',
          }))
        );
      } else {
        console.error('Failed to fetch suggestions');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a suggestion by _id
  const deleteSuggestion = async (id: string) => {
    // Removed token related logic
    if (!window.confirm('Are you sure you want to delete this suggestion?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions/${id}`, { // Updated URL
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setRows((prevRows) => prevRows.filter((row) => row._id !== id)); // Remove the deleted row from UI
        alert('Suggestion deleted successfully.');
      } else {
        const errorData = await response.json();
        console.error('Error data:', errorData); 
        alert(`Failed to delete suggestion: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      alert('An error occurred while deleting the suggestion.');
    }
  };

  React.useImperativeHandle(ref, () => ({
    fetchSuggestions,
  }));

  React.useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="suggestions table">
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
                    verticalAlign: 'middle', // Align vertically to the middle
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
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}> {/* Changed key to _id */}
                  {columns.map((column) => {
                    if (column.id === 'actions') {
                      return (
                        <TableCell
                          key={column.id}
                          style={{
                            minWidth: column.minWidth,
                            maxWidth: column.maxWidth,
                            textAlign: 'center', // Center align the content
                            display: 'flex',
                            justifyContent: 'center', // Center the button
                          }}
                        >
                          {/* Removed session check for delete button */}
                          <Tooltip title="Delete Suggestion">
                            <button
                              onClick={() => deleteSuggestion(row._id)} // Use _id instead of hash
                              style={{
                                backgroundColor: '#f44336', // Set button color similar to delete icon (red)
                                color: 'white',
                                textSizeAdjust: '70%',
                                border: 'none',
                                width: '100px',
                                height: '21px',
                                // padding: '0px 10px',
                                borderRadius: '3px',
                                cursor: 'pointer',
                              }}
                            >
                              Delete
                            </button>
                          </Tooltip>
                        </TableCell>
                      );
                    }

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
                          maxHeight: column.maxHeight,
                          overflowY: column.id === 'suggestion' ? 'auto' : undefined,
                          verticalAlign: 'middle', // Align vertically to the middle
                        }}
                      >
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No suggestions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
});

export default AdminSuggestionTable;