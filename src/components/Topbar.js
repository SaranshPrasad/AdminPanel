
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, NightlightRound as DarkModeIcon, Brightness7 as LightModeIcon, Notifications as NotificationsIcon, AccountCircle as ProfileIcon } from '@mui/icons-material';
import { useFirebase } from '../context/Firebase';

const Topbar = ({ toggleTheme, theme, toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const firebase = useFirebase();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await firebase.signoutUser();
      handleMenuClose();
      
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <IconButton color="inherit" onClick={toggleTheme}>
          {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      
        <IconButton color="inherit" onClick={handleProfileClick}>
          <ProfileIcon />
        </IconButton>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Topbar;
