// src/components/DefaultDashboardContent.js
import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import SummaryCard from './SummaryCard';
import UserTable from './UserTable';
import { Person as PersonIcon, Paid as PaidIcon } from '@mui/icons-material';
import { useFirebase } from '../context/Firebase';

const DefaultDashboardContent = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPaidUsers, setTotalPaidUsers] = useState(0);
  const firebase = useFirebase();
  
  useEffect(() => {
    const getTodayDate = () => {
      const today = new Date();
      return today.toISOString().split('T')[0]; 
    };
    const today = getTodayDate();
    const fetchData = async () => {
      try {
        // Fetch all members
        const membersSnapshot = await firebase.getMembers();
        const members = membersSnapshot.docs.map(doc => doc.data());

        // Calculate total users and total paid users
        setTotalUsers(members.length);
        const paidUsersCount = members.filter(user => user.dueDate > today ).length;
        setTotalPaidUsers(paidUsersCount);
      } catch (error) {
        console.error('Error fetching members: ', error);
      }
    };

    fetchData();
  }, [firebase]);

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, Admin!
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Here’s a summary of your dashboard activities.
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Total Users"
            count={totalUsers}
            icon={<PersonIcon fontSize="large" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <SummaryCard
            title="Total Paid Users"
            count={totalPaidUsers}
            icon={<PaidIcon fontSize="large" />}
          />
        </Grid>
      </Grid>

      {/* User Table */}
      <UserTable />
    </>
  );
};

export default DefaultDashboardContent;
