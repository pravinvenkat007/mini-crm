import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 420, p: 4 }}>
        <Stack spacing={2.5}>
          <Typography variant="h4" fontWeight={900} textAlign="center">MINI CRM</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            value={form.email}
            required
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            required
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
