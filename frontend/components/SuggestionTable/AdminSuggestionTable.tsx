'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { useSession } from 'next-auth/react';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import { Box, Select, Tooltip, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';

interface Column {
  id: 'hash' | 'suggestion' | 'category' | 'dateTime' | 'employeeId' | 'action' | 'status';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  align?: 'right' | 'center'; // Updated to include 'center'
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
  { id: 'status', label: 'Status', minWidth: 100, maxWidth: 120, align: 'center' }, // Center align
  { id: 'action', label: 'Action', minWidth: 50, maxWidth: 100, align: 'center' }, // Center align
];

interface Data {
  _id: string;
  hash: string;
  suggestion: string;
  category: string;
  dateTime: number;
  employeeId: string;
  status: 'unread' | 'read'; // Status of the suggestion
}

const categories = [
  { value: 'HR', label: 'HR' },
  { value: 'IT', label: 'IT' },
  { value: 'Safety', label: 'Safety' },
  { value: 'Quality', label: 'Quality' },
  { value: 'Production', label: 'Production' },
  { value: 'Environment', label: 'Environment' },
  { value: 'Management', label: 'Management' },
  { value: 'Other', label: 'Other' },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const AdminSuggestionTable = React.forwardRef<unknown, {}>((props, ref) => {
  const { data: session } = useSession();
  const [rows, setRows] = React.useState<Data[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  // Fetch suggestions from the backend API
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include credentials only if the user is authenticated
        credentials: session ? 'include' : 'omit',
      });
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
            status: item.status || 'unread',
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

  // Toggle the suggestion status between 'read' and 'unread'
  const toggleReadStatus = async (id: string, currentStatus: 'read' | 'unread') => {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    const endpoint = `${BACKEND_URL}/api/suggestions/${id}/${newStatus}`; // Updated to match backend route

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure credentials are included for authenticated requests
      });

      if (response.ok) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === id ? { ...row, status: newStatus } : row
          )
        );
      } else {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        alert(`Failed to update suggestion status: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating suggestion status:', error);
      alert('An error occurred while updating the suggestion status.');
    }
  };

  // Delete a suggestion by _id
  const deleteSuggestion = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this suggestion?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure credentials are included for authenticated requests
      });

      if (response.ok) {
        setRows((prevRows) => prevRows.filter((row) => row._id !== id));
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
  }, [session]); // Refetch suggestions when session changes

  // Handle category filter change
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
  };

  // Filter rows based on selected category
  const filteredRows = selectedCategory
    ? rows.filter((row) => row.category === selectedCategory)
    : rows;

  return (
    <div>
      <Box sx={{ width: '17%', padding: 2, marginBottom: -2, maxHeight: '200px', overflowY: 'auto' }}>
        <p className="text-[19px] ml-6 mb-[-8px]">Filter</p>
        <FormControl variant="outlined" sx={{ m: 2, minWidth: 140 }}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedCategory}
            onChange={handleCategoryChange}
            label="Category"
          >
            <MenuItem value="">
              <p>All</p>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 450 }}>
          <Table stickyHeader aria-label="suggestions table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    style={{
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      verticalAlign: 'middle',
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
              ) : filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row._id}
                    style={{
                      backgroundColor:
                        row.status === 'read'
                          ? 'rgba(209, 213, 219, 0.3)' 
                          : 'rgba(255, 255, 255, 0.7)', 
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id as keyof Data];

                      if (column.id === 'status') {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align || 'left'}
                            style={{
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                              verticalAlign: 'middle',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                            }}
                          >
                            {session ? (
                              // If user is authenticated, show the button to toggle read/unread
                              <Tooltip title={row.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}>
                                <button
                                  onClick={() => toggleReadStatus(row._id, row.status)}
                                  style={{
                                    backgroundColor: 'transparent',
                                    color: row.status === 'read' ? 'blue' : 'black', // Change color as needed
                                    border: 'none',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    padding: 0,
                                    marginTop: '5px',
                                    fontSize: '14px',
                                  }}
                                >
                                  {row.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                                </button>
                              </Tooltip>
                            ) : (
                              // If user is NOT authenticated, just show the text 'Read' or 'Unread'
                              <span>{row.status.charAt(0).toUpperCase() + row.status.slice(1)}</span>
                            )}
                          </TableCell>
                        );
                      } else if (column.id === 'action') {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align || 'left'}
                            style={{
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                              textAlign: 'center',
                            }}
                          >
                            {session ? (
                              <Tooltip title="Delete Suggestion">
                                <button
                                  onClick={() => deleteSuggestion(row._id)}
                                  style={{
                                    backgroundColor: 'transparent',
                                    color: 'rgb(0, 0, 0)', // Red color for delete
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                  }}
                                >
                                  {/* Delete Icon */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px" y="0px" 
                                    width="23" 
                                    height="23" 
                                    viewBox="0 0 48 48"
                                  >
                                    <path d="M 24 4 C 20.491685 4 17.570396 6.6214322 17.080078 10 L 10.238281 10 A 1.50015 1.50015 0 0 0 9.9804688 9.9785156 A 1.50015 1.50015 0 0 0 
                                          9.7578125 10 L 6.5 10 A 1.50015 1.50015 0 1 0 6.5 13 L 8.6386719 13 L 11.15625 39.029297 C 11.427329 41.835926 13.811782 44 16.630859 44 L 31.367188 44 C 
                                          34.186411 44 36.570826 41.836168 36.841797 39.029297 L 39.361328 13 L 41.5 13 A 1.50015 1.50015 0 1 0 41.5 10 L 38.244141 10 A 1.50015 1.50015 0 0 0 37.763672 
                                          10 L 30.919922 10 C 30.429604 6.6214322 27.508315 4 24 4 z M 24 7 C 25.879156 7 27.420767 8.2681608 27.861328 10 L 20.138672 10 C 20.579233 8.2681608 22.120844 
                                          7 24 7 z M 11.650391 13 L 36.347656 13 L 33.855469 38.740234 C 33.730439 40.035363 32.667963 41 31.367188 41 L 16.630859 41 C 15.331937 41 14.267499 40.033606 
                                          14.142578 38.740234 L 11.650391 13 z M 20.476562 17.978516 A 1.50015 1.50015 0 0 0 19 19.5 L 19 34.5 A 1.50015 1.50015 0 1 0 22 34.5 L 22 19.5 A 
                                          1.50015 1.50015 0 0 0 20.476562 17.978516 z M 27.476562 17.978516 A 1.50015 1.50015 0 0 0 26 19.5 L 26 34.5 A 1.50015 1.50015 0 1 0 29 34.5 L 29 19.5 A 1.50015 1.50015 0 0 0 27.476562 17.978516 z">
                                    </path> 
                                  </svg>
                                </button>
                              </Tooltip>
                            ) : (
                              <span>Login Required</span>
                            )}
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align || 'left'}
                            style={{
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              verticalAlign: 'middle',
                            }}
                          >
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      }
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
    </div>
  );
});

export default AdminSuggestionTable;