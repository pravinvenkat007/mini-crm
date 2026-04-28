import { Card, CardContent, Grid2, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import http from '../api/http';
import PageHeader from '../components/PageHeader';

const cards = [
  ['totalLeads', 'Total Leads'],
  ['qualifiedLeads', 'Qualified Leads'],
  ['tasksDueToday', 'Tasks Due Today'],
  ['completedTasks', 'Completed Tasks'],
];

export default function Dashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    http.get('/dashboard').then(({ data }) => setStats(data));
  }, []);

  return (
    <>
      <PageHeader title="Dashboard" />
      <Grid2 container spacing={2}>
        {cards.map(([key, label]) => (
          <Grid2 key={key} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">{label}</Typography>
                <Typography variant="h3" fontWeight={900}>{stats[key] ?? 0}</Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </>
  );
}
