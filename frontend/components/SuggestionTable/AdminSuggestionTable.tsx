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
import { 
        Box, 
        Select, 
        Tooltip, 
        MenuItem, 
        InputLabel, 
        FormControl, 
        SelectChangeEvent,
      } from '@mui/material';

interface Column {
  id: 'hash' | 'suggestion' | 'category' | 'dateTime' | 'employeeId' | 'action';
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
  { id: 'action', label: 'Action', minWidth: 50, maxWidth: 100 },
];

interface Data {
  _id: string;
  hash: string;
  suggestion: string;
  category: string;
  dateTime: number;
  employeeId: string;
}

// Categories for filtering
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
  const { data: session } = useSession(); // Keep session data
  const [rows, setRows] = React.useState<Data[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(''); // State for selected category

  // Fetch suggestions from the backend API
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions`);
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
    if (!window.confirm('Are you sure you want to delete this suggestion?')) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
  }, []);

  // Handle category filter change
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
  };

  // Filter rows based on selected category
  const filteredRows = selectedCategory
    ? rows.filter(row => row.category === selectedCategory)
    : rows;

  return (
    <div>
      <Box sx={{ width: '17%', padding: 2, marginBottom: -2 }}>
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
                  <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof Data];

                      if (column.id === 'action') {
                        return (
                          <TableCell
                            key={column.id}
                            style={{
                              minWidth: column.minWidth,
                              maxWidth: column.maxWidth,
                              textAlign: 'center',
                              display: 'flex',
                              justifyContent: 'center',
                            }}
                          >
                            {session ? (
                              <Tooltip title="Delete Suggestion">
                                <button
                                  onClick={() => deleteSuggestion(row._id)}
                                  style={{
                                    backgroundColor: '#f44336',
                                    color: 'white',
                                    border: 'none',
                                    width: '100px',
                                    height: '21px',
                                    borderRadius: '3px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </button>
                              </Tooltip>
                            ) : (
                              <span>—</span> // Show hyphen if the user is not logged in
                            )}
                          </TableCell>
                        );
                      }

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
                            verticalAlign: 'middle',
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
    </div>
  );
});

export default AdminSuggestionTable;