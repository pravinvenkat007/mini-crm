import { Box, Typography } from '@mui/material';

export default function PageHeader({ title, action }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h4" fontWeight={800}>{title}</Typography>
      {action}
    </Box>
  );
}
