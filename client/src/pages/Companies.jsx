import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', location: '', website: '', notes: '' });

  async function loadCompanies() {
    const { data } = await http.get('/companies');
    setCompanies(data);
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    await http.post('/companies', form);
    setOpen(false);
    setForm({ name: '', industry: '', location: '', website: '', notes: '' });
    loadCompanies();
  }

  return (
    <>
      <PageHeader
        title="Companies"
        action={<Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpen(true)}>Add Company</Button>}
      />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company._id}>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.location}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View details">
                    <IconButton component={RouterLink} to={`/companies/${company._id}`}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Company</DialogTitle>
        <DialogContent>
          <Stack component="form" id="company-form" onSubmit={handleCreate} spacing={2} sx={{ pt: 1 }}>
            <TextField label="Company Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
            <TextField label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <TextField label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            <TextField label="Notes" multiline minRows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="company-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
