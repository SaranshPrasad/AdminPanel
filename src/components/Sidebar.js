// src/components/Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Add, ViewList, Payment, Paid , Home} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = ({ open, toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          marginTop: '64px', // Ensure sidebar is below the top bar
        },
      }}
      variant={isMobile ? 'temporary' : 'permanent'}
      anchor="left"
      open={open}
      onClose={toggleSidebar}
    >
      <List>
        <ListItem button component={Link} to="/" onClick={toggleSidebar}>
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/add-member" onClick={toggleSidebar}>
          <ListItemIcon><Add /></ListItemIcon>
          <ListItemText primary="Add Users" />
        </ListItem>
        <ListItem button component={Link} to="/view-member" onClick={toggleSidebar}>
          <ListItemIcon><ViewList /></ListItemIcon>
          <ListItemText primary="View Users" />
        </ListItem>
        <Divider />
        <ListItem button component={Link} to="/due-member" onClick={toggleSidebar}>
          <ListItemIcon><Payment /></ListItemIcon>
          <ListItemText primary="Payment Due" />
        </ListItem>
        <ListItem button component={Link} to="/paid-member" onClick={toggleSidebar}>
          <ListItemIcon><Paid /></ListItemIcon>
          <ListItemText primary="Paid" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
