import AddIcon from '@mui/icons-material/Add';
import DoneIcon from '@mui/icons-material/Done';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
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
import http from '../api/http';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', lead: '', assignedTo: '', dueDate: '', status: 'Pending' });

  async function loadTasks() {
    const { data } = await http.get('/tasks');
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
    Promise.all([http.get('/users'), http.get('/leads', { params: { limit: 50 } })]).then(([userRes, leadRes]) => {
      setUsers(userRes.data);
      setLeads(leadRes.data.items);
    });
  }, []);

  async function createTask(event) {
    event.preventDefault();
    await http.post('/tasks', form);
    setOpen(false);
    setForm({ title: '', lead: '', assignedTo: '', dueDate: '', status: 'Pending' });
    loadTasks();
  }

  async function markDone(task) {
    await http.patch(`/tasks/${task._id}/status`, { status: 'Completed' });
    loadTasks();
  }

  return (
    <>
      <PageHeader
        title="Tasks"
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Add Task</Button>}
      />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => {
              const canUpdate = user?.role === 'admin' || task.assignedTo?._id === user?.id;
              return (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.lead?.name}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={canUpdate ? 'Mark done' : 'Only assigned user can update'}>
                      <span>
                        <IconButton disabled={!canUpdate || task.status === 'Completed'} onClick={() => markDone(task)}>
                          <DoneIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Task</DialogTitle>
        <DialogContent>
          <Stack component="form" id="task-form" onSubmit={createTask} spacing={2} sx={{ pt: 1 }}>
            <TextField label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <TextField label="Lead" select required value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })}>
              {leads.map((lead) => <MenuItem key={lead._id} value={lead._id}>{lead.name}</MenuItem>)}
            </TextField>
            <TextField label="Assigned To" select required value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
              {users.map((crmUser) => <MenuItem key={crmUser._id} value={crmUser._id}>{crmUser.name}</MenuItem>)}
            </TextField>
            <TextField
              label="Due Date"
              type="date"
              required
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" form="task-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
