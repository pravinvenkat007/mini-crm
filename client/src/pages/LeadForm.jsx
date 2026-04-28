import { Alert, Button, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../api/http';
import PageHeader from '../components/PageHeader';

const statuses = ['New', 'Contacted', 'Qualified', 'Lost'];

export default function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    assignedTo: '',
    company: '',
  });

  useEffect(() => {
    Promise.all([http.get('/users'), http.get('/companies')]).then(([userRes, companyRes]) => {
      setUsers(userRes.data);
      setCompanies(companyRes.data);
    });
    if (isEdit) {
      http.get(`/leads/${id}`).then(({ data }) => {
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          status: data.status || 'New',
          assignedTo: data.assignedTo?._id || '',
          company: data.company?._id || '',
        });
      });
    }
  }, [id, isEdit]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const payload = { ...form, company: form.company || undefined };
      if (isEdit) await http.put(`/leads/${id}`, payload);
      else await http.post('/leads', payload);
      navigate('/leads');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save lead');
    }
  }

  return (
    <>
      <PageHeader title={isEdit ? 'Edit Lead' : 'Add Lead'} />
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 720 }}>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <TextField label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <TextField label="Status" select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {statuses.map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
          </TextField>
          <TextField label="Assigned To" select required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
            {users.map((user) => <MenuItem key={user._id} value={user._id}>{user.name}</MenuItem>)}
          </TextField>
          <TextField label="Company" select value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}>
            <MenuItem value="">No company</MenuItem>
            {companies.map((company) => <MenuItem key={company._id} value={company._id}>{company.name}</MenuItem>)}
          </TextField>
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained">Save</Button>
            <Button variant="outlined" onClick={() => navigate('/leads')}>Cancel</Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
