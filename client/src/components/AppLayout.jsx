import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 232;
const links = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/leads', label: 'Leads', icon: <PeopleIcon /> },
  { to: '/companies', label: 'Companies', icon: <BusinessIcon /> },
  { to: '/tasks', label: 'Tasks', icon: <TaskAltIcon /> },
];

export default function AppLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight={800}>MINI CRM</Typography>
        </Toolbar>
        <Divider />
        <List sx={{ px: 1 }}>
          {links.map((link) => (
            <ListItemButton
              key={link.to}
              component={NavLink}
              to={link.to}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.active': { bgcolor: 'primary.main', color: 'primary.contrastText' },
                '&.active .MuiListItemIcon-root': { color: 'primary.contrastText' },
              }}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky" color="inherit" elevation={1}>
          <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
            <Typography color="text.secondary">{user?.name}</Typography>
            <Button startIcon={<LogoutIcon />} onClick={handleLogout} variant="outlined">
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
