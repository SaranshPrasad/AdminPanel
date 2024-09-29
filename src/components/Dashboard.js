// src/components/Dashboard.js
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { CssBaseline, Box, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '../themes/theme';

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar and Topbar remain constant */}
        <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            marginLeft: { xs: 0, sm: 0, md: 8 },
            marginTop: '64px', // Ensure main content starts below the top bar
          }}
        >
          <Topbar toggleTheme={toggleTheme} theme={isDarkMode ? darkTheme : lightTheme} toggleSidebar={toggleSidebar} />
          {/* Dynamic content will be rendered here based on the route */}
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
