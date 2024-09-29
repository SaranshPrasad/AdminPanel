// src/components/SummaryCard.js
import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Person as PersonIcon  } from '@mui/icons-material';

const SummaryCard = ({ title, count, icon }) => {
  return (
    <Card sx={{ minWidth: 275, mb: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            {icon}
          </Grid>
          <Grid item xs>
            <Typography variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {count}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;

