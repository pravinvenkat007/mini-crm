import { Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import http from '../api/http';
import PageHeader from '../components/PageHeader';

export default function CompanyDetail() {
  const { id } = useParams();
  const [data, setData] = useState({ company: null, leads: [] });

  useEffect(() => {
    http.get(`/companies/${id}`).then(({ data: response }) => setData(response));
  }, [id]);

  if (!data.company) return null;

  return (
    <>
      <PageHeader title={data.company.name} />
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800}>Company Info</Typography>
          <Typography>Industry: {data.company.industry || '-'}</Typography>
          <Typography>Location: {data.company.location || '-'}</Typography>
          <Typography>Website: {data.company.website || '-'}</Typography>
          <Typography color="text.secondary">{data.company.notes}</Typography>
        </Paper>
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Associated Lead</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.assignedTo?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </>
  );
}
