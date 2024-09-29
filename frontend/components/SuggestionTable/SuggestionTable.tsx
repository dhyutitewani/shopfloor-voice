// 'use client';

// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';

// interface Column {
//   id: 'hash' | 'suggestion' | 'category' | 'dateTime' | 'employeeId';
//   label: string;
//   minWidth?: number;
//   maxWidth?: number;
//   minHeight?: number;
//   maxHeight?: number; 
//   align?: 'right';
//   format?: (value: any) => string;
// }

// const columns: readonly Column[] = [
//   { id: 'hash', label: '#', minWidth: 100, maxWidth: 1200 },
//   { id: 'category', label: 'Category', minWidth: 100, maxWidth: 120 },
//   { id: 'suggestion', label: 'Suggestion', minWidth: 500, maxWidth: 500, maxHeight: 75 }, 
//   {
//     id: 'dateTime',
//     label: 'Date & Time Submitted',
//     minWidth: 200,
//     maxWidth: 200,
//     format: (value: number) => new Date(value).toLocaleString('en-GB'),
//   },
//   { id: 'employeeId', label: 'Employee ID', minWidth: 100, maxWidth: 120 },
// ];

// interface Data {
//   hash: string;
//   suggestion: string;
//   category: string;
//   dateTime: number;
//   employeeId: string;
// }

// const SuggestionTable: React.FC = React.forwardRef((props, ref) => {
//   const [rows, setRows] = React.useState<Data[]>([]);

//   const fetchSuggestions = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/api/suggestions');
//       if (response.ok) {
//         const data: Data[] = await response.json();
//         setRows(data.map((item) => ({
//           hash: item.hash,
//           suggestion: item.suggestion,
//           category: item.category,
//           dateTime: new Date(item.dateTime).getTime(),
//           employeeId: item.employeeId || 'Anonymous',
//         })));
//       }
//     } catch (error) {
//       console.error('Error fetching suggestions:', error);
//     }
//   };

  

//   React.useImperativeHandle(ref, () => ({
//     fetchSuggestions,
//   }));

//   React.useEffect(() => {
//     fetchSuggestions();
//   }, []);

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   style={{
//                     minWidth: column.minWidth,
//                     maxWidth: column.maxWidth,
//                     overflow: 'hidden',
//                     textOverflow: 'ellipsis',
//                   }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//               <TableRow hover role="checkbox" tabIndex={-1} key={row.hash}>
//                 {columns.map((column) => {
//                   const value = row[column.id];
//                   return (
//                     <TableCell
//                       key={column.id}
//                       style={{
//                         minWidth: column.minWidth,
//                         maxWidth: column.maxWidth,
//                         overflow: 'hidden',
//                         textOverflow: 'ellipsis',
//                         display: column.id === 'suggestion' ? 'block' : undefined, 
//                         maxHeight: column.maxHeight, 
//                         overflowY: column.id === 'suggestion' ? 'auto' : undefined,
//                       }}
//                     >
//                       {column.format ? column.format(value) : value}
//                     </TableCell>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Paper>
//   );
// });

// export default SuggestionTable;

'use client';

import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';

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
  { id: 'hash', label: '#', minWidth: 100, maxWidth: 1200 },
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
  { id: 'actions', label: 'Actions', minWidth: 50, maxWidth: 50, align: 'right' },
];

interface Data {
  hash: string;
  suggestion: string;
  category: string;
  dateTime: number;
  employeeId: string;
}

const SuggestionTable: React.FC = React.forwardRef((props, ref) => {
  const [rows, setRows] = React.useState<Data[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Function to fetch suggestions from the backend API
  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/suggestions');
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data: Data[] = await response.json();
      setRows(
        data.map((item, index) => ({
          hash: `A${String(index + 1).padStart(3, '0')}`, // Hash values as A001, A002...
          suggestion: item.suggestion,
          category: item.category,
          dateTime: new Date(item.dateTime).getTime(),
          employeeId: item.employeeId || 'Anonymous',
        }))
      );
    } catch (error) {
      setError('Error fetching suggestions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a suggestion
  const deleteSuggestion = async (hash: string) => {
    if (!window.confirm('Are you sure you want to delete this suggestion?')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/suggestions/${hash}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setRows((prevRows) => prevRows.filter((row) => row.hash !== hash));
      } else {
        alert('Failed to delete suggestion.');
      }
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      alert('An error occurred while deleting the suggestion.');
    }
  };

  // Exposing fetchSuggestions method to the parent component using ref
  React.useImperativeHandle(ref, () => ({
    fetchSuggestions,
  }));

  // Fetch suggestions on component mount
  React.useEffect(() => {
    fetchSuggestions();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
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
                    textAlign: column.align || 'left',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.hash}>
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
                          maxHeight: column.maxHeight,
                          overflowY: column.id === 'suggestion' ? 'auto' : undefined,
                          textAlign: column.align || 'left',
                        }}
                      >
                        {column.id === 'actions' ? (
                          <IconButton
                            aria-label="delete"
                            onClick={() => deleteSuggestion(row.hash)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        ) : column.format ? (
                          column.format(value)
                        ) : (
                          value
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  <Typography>No suggestions found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
});

export default SuggestionTable;
