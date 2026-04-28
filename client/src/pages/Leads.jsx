import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import http from '../api/http';
import PageHeader from '../components/PageHeader';

const statuses = ['', 'New', 'Contacted', 'Qualified', 'Lost'];

export default function Leads() {
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '', page: 1 });

  async function loadLeads() {
    const { data: response } = await http.get('/leads', { params: filters });
    setData(response);
  }

  useEffect(() => {
    loadLeads();
  }, [filters.page, filters.status]);

  async function handleDelete(id) {
    await http.delete(`/leads/${id}`);
    loadLeads();
  }

  function handleSearch(event) {
    event.preventDefault();
    setFilters((current) => ({ ...current, page: 1 }));
    loadLeads();
  }

  return (
    <>
      <PageHeader
        title="Leads"
        action={
          <Button component={RouterLink} to="/leads/new" variant="contained" startIcon={<AddIcon />}>
            Add Lead
          </Button>
        }
      />
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack component="form" onSubmit={handleSearch} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Search"
            size="small"
            value={filters.search}
            onChange={(event) => setFilters({ ...filters, search: event.target.value })}
          />
          <TextField
            label="Status"
            select
            size="small"
            sx={{ minWidth: 180 }}
            value={filters.status}
            onChange={(event) => setFilters({ ...filters, status: event.target.value, page: 1 })}
          >
            {statuses.map((status) => (
              <MenuItem key={status || 'all'} value={status}>{status || 'All Statuses'}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="outlined">Search</Button>
        </Stack>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>{lead.assignedTo?.name}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton component={RouterLink} to={`/leads/${lead._id}/edit`}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDelete(lead._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={data.pages}
          page={data.page}
          onChange={(_event, page) => setFilters({ ...filters, page })}
        />
      </Box>
    </>
  );
}
