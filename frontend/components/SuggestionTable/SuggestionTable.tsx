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
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TableContainer from '@mui/material/TableContainer';

interface Column {
  id: 'hash' | 'suggestion' | 'category' | 'dateTime' | 'employeeId';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  align?: 'right';
  format?: (value: any) => string;
}

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

interface Data {
  hash: string;
  suggestion: string;
  category: string;
  dateTime: number;
  employeeId: string;
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

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SuggestionTable: React.FC = React.forwardRef((props, ref) => {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>(''); // State for selected category

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions`);
      if (response.ok) {
        const data: Data[] = await response.json();
        setRows(data.map((item) => ({
          hash: item.hash,
          suggestion: item.suggestion,
          category: item.category,
          dateTime: new Date(item.dateTime).getTime(),
          employeeId: item.employeeId || 'Anonymous',
        })));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const deleteSuggestion = async (hash: string) => {
    const token = localStorage.getItem('token'); 
  
    if (!token) {
      return;
    }

    if (!window.confirm('Are you sure you want to delete this suggestion?')) return;
  
    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions/${hash}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
      });
  
      if (response.ok) {
        setRows((prevRows) => prevRows.filter((row) => row.hash !== hash));
      } 
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  React.useImperativeHandle(ref, () => ({
    fetchSuggestions,
  }));

  React.useEffect(() => {
    fetchSuggestions();
  }, []);

  // Filter rows based on the selected category
  const filteredRows = rows.filter(row => {
    return selectedCategory ? row.category === selectedCategory : true; 
  });

  return (
    <Box>
      <Box sx={{ width: '17%', padding: 2, maxHeight: '200px', overflowY: 'auto' }}>
        <p className="text-[19px] mb-2 ml-2">Filter</p>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
            sx={{ backgroundColor: 'white' }}
          >
            <MenuItem value="">All</MenuItem>
            {categories.map(category => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
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
              {filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align='center'>
                    No suggestions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.hash}>
                    {columns.map((column) => {
                      const value = row[column.id];
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
                                overflowY: 'auto', // Vertical scroll
                                paddingRight: '8px', // Prevent scrollbar overlap
                              }}
                            >
                              {column.format && typeof value === 'number'
                                ? column.format(value)
                                : value}
                            </div>
                          ) : (
                            column.format && typeof value === 'number'
                              ? column.format(value)
                              : value
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