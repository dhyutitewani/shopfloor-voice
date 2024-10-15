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
  FormControl,
  SelectChangeEvent,
} from '@mui/material';

interface Column {
  id: 'hash' | 'suggestion' | 'category' | 'dateTime' | 'employeeId' | 'action' | 'status';
  label: string;
  minWidth?: number;
  maxWidth?: number;
  maxHeight?: number;
  align?: 'right' | 'center';
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
  { id: 'status', label: 'Status', minWidth: 100, maxWidth: 120, align: 'center' },
  { id: 'action', label: 'Action', minWidth: 130, maxWidth: 130, align: 'center' },
];

interface Data {
  _id: string;
  hash: string;
  suggestion: string;
  category: string;
  dateTime: number;
  employeeId: string;
  status: 'unread' | 'read';
}

const dateOptions = [
  { value: 'oldest', label: 'Oldest to Latest' },
  { value: 'latest', label: 'Latest to Oldest' },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const AdminSuggestionTable = React.forwardRef<unknown, {}>(function AdminSuggestionTable(props, ref) {
  const { data: session } = useSession();
  const [rows, setRows] = React.useState<Data[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [dateFilter, setDateFilter] = React.useState<string>('oldest');

  // Memoize fetchSuggestions to prevent unnecessary re-creations
  const fetchSuggestions = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/suggestions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
        console.error('Failed to fetch suggestions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, session]);

  // Expose fetchSuggestions via ref if needed
  React.useImperativeHandle(ref, () => ({
    fetchSuggestions,
  }));

  // Fetch suggestions on component mount and when fetchSuggestions changes
  React.useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  // Toggle the suggestion status between 'read' and 'unread'
  const toggleReadStatus = React.useCallback(async (id: string, currentStatus: 'read' | 'unread') => {
    const newStatus = currentStatus === 'read' ? 'unread' : 'read';
    const endpoint = `${BACKEND_URL}/api/suggestions/${id}/${newStatus}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row._id === id ? { ...row, status: newStatus } : row
          )
        );
      } else {
        console.error('Failed to toggle status:', response.statusText);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }, [BACKEND_URL]);

  // Delete a suggestion by _id
  const deleteSuggestion = React.useCallback(async (id: string) => {
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
        console.error('Failed to delete suggestion:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  }, [BACKEND_URL]);

  // Handle category change
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setSelectedCategory(event.target.value as string);
  };

  // Filter rows based on selected category
  const filteredRows = selectedCategory
    ? rows.filter((row) => row.category === selectedCategory)
    : rows;

  // Sort rows based on date filter
  const sortedRows = React.useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      if (dateFilter === 'oldest') {
        return a.dateTime - b.dateTime;
      } else {
        return b.dateTime - a.dateTime;
      }
    });
  }, [filteredRows, dateFilter]);

  return (
    <div>
      <Box sx={{ width: '17%', padding: 2, marginBottom: -1, maxHeight: '200px', overflowY: 'auto' }}>
        <p className="text-[19px] mb-2 ml-2">Filter by Date</p>
        <FormControl fullWidth variant="outlined">
          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          >
            {dateOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 430 }}>
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
              ) : sortedRows.length > 0 ? (
                sortedRows.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row._id}
                    style={{
                      backgroundColor:
                        row.status === 'read'
                          ? 'rgba(209, 213, 219, 0.9)'
                          : 'rgba(255, 255, 255, 0.5)',
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
                            }}
                          >
                            {session ? (
                              <Tooltip title={row.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}>
                                <button
                                  onClick={() => toggleReadStatus(row._id, row.status)}
                                  style={{
                                    backgroundColor: 'transparent',
                                    color: row.status === 'read' ? 'blue' : 'black',
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
                                    color: 'rgb(0, 0, 0)', // Adjust color as needed
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                  }}
                                >
                                  {/* Delete Icon SVG */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    x="0px"
                                    y="0px"
                                    width="23"
                                    height="23"
                                    viewBox="0 0 48 48"
                                  >
                                    <path d="M24 4C20.4917 4 17.5704 6.62143 17.0801 10L10.2383 10A1.50015 1.50015 0 0 0 9.98047 9.97852A1.50015 1.50015 0 0 0 9.75781 10L6.5 10A1.50015 1.50015 0 1 0 6.5 13L8.63867 13L11.1563 39.0293C11.4273 41.8359 13.8118 44 16.6309 44L31.3672 44C34.1864 44 36.5708 41.8362 36.8418 39.0293L39.3613 13L41.5 13A1.50015 1.50015 0 1 0 41.5 10L38.2441 10A1.50015 1.50015 0 0 0 37.7637 10L30.9199 10C30.4296 6.62143 27.5083 4 24 4zM24 7C25.8792 7 27.4208 8.26816 27.8613 10L20.1387 10C20.5792 8.26816 22.1208 7 24 7zM11.6504 13L36.3477 13L33.8555 38.7402C33.7304 40.0354 32.668 41 31.3672 41L16.6309 41C15.3319 41 14.2675 40.0336 14.1426 38.7402L11.6504 13zM20.4766 17.9785A1.50015 1.50015 0 0 0 19 19.5L19 34.5A1.50015 1.50015 0 1 0 22 34.5L22 19.5A1.50015 1.50015 0 0 0 20.4766 17.9785zM27.4766 17.9785A1.50015 1.50015 0 0 0 26 19.5L26 34.5A1.50015 1.50015 0 1 0 29 34.5L29 19.5A1.50015 1.50015 0 0 0 27.4766 17.9785z"></path>
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
                              whiteSpace: 'normal', // Allow wrapping
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              verticalAlign: 'middle',
                            }}
                          >
                            {column.id === 'suggestion' ? (
                              <div
                                style={{
                                  maxHeight: column.maxHeight,
                                  overflowY: 'auto',
                                  paddingRight: '8px', // Prevent scrollbar overlapping text
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

// Assign displayName for better debugging and to satisfy ESLint
AdminSuggestionTable.displayName = 'AdminSuggestionTable';

export default AdminSuggestionTable;