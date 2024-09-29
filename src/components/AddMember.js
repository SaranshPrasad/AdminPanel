import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, IconButton, Avatar, Snackbar, Alert } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useFirebase } from '../context/Firebase';


const AddMember = () => {
  const [name, setName] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [fee, setFee] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [photo, setPhoto] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const firebase = useFirebase();
  

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  // Function to calculate due date
  const calculateDueDate = (paidDate) => {
    const paidDateObj = new Date(paidDate);
    paidDateObj.setDate(paidDateObj.getDate() + 30);
    return paidDateObj.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dueDate = calculateDueDate(paidDate);

    try {
      await firebase.handleAddNewMember(name, phoneNo, email, paidDate, photo, fee, joinDate, dueDate);
      setSnackbarMessage('Member added successfully!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      // Reset form fields
      setName('');
      setPhoneNo('');
      setEmail('');
      setPaidDate('');
      setFee('');
      setJoinDate('');
      setPhoto(null);
    } catch (error) {
      console.error('Error adding member:', error);
      setSnackbarMessage('Failed to add member. Please try again.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom>
        Add New Member
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Profile Picture Input */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <input
              accept="image/*"
              id="photo-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
            <label htmlFor="photo-upload">
              <IconButton color="primary" component="span">
                <Avatar
                  src={photo ? URL.createObjectURL(photo) : undefined}
                  sx={{ width: 100, height: 100 }}
                  alt="Profile Picture"
                >
                  <PhotoCamera />
                </Avatar>
              </IconButton>
            </label>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone No"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Paid Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Join Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fees Amount"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Member
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddMember;
