import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Avatar, Grid, Divider, TextField, Snackbar, Alert } from '@mui/material';
import { useFirebase } from '../context/Firebase';
import { useNavigate, useParams } from 'react-router-dom';

const MemberProfile = () => {
  const firebase = useFirebase();
  const param = useParams();
  const [members, setMembers] = useState(null);
  const [url, setUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const data = await firebase.getMembersById(param.id);
        const memberData = data.data();
        setMembers(memberData);
        setFormData(memberData);  // Initialize form data
      } catch (error) {
        console.error('Error fetching member:', error);
      }
    };
    fetchMember();
  }, [firebase, param.id]);

  useEffect(() => {
    if (members && members.imgURL) {
      const fetchImageUrl = async () => {
        try {
          const imageUrl = await firebase.getImageUrl(members.imgURL);
          setUrl(imageUrl);
        } catch (error) {
          console.error('Error fetching image URL:', error);
        }
      };
      fetchImageUrl();
    }
  }, [members, firebase]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await firebase.updateMember(param.id, formData);
      setSnackbarMessage('Profile updated successfully!');
      setOpenSnackbar(true);
      setTimeout(() =>{
        navigate(`/`)
      }, 2000);
      
    } catch (error) {
      console.error('Error updating member:', error);
      setSnackbarMessage('Failed to update profile.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (!members) return <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: 5 }} />;

  return (
    <Box sx={{ padding: 4, maxWidth: '800px', margin: 'auto' }}>
      <Paper sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 3 }}>
        {/* Profile Picture */}
        <Avatar
          src={url}
          alt="Profile"
          sx={{ width: 120, height: 120, borderRadius: '50%', boxShadow: 3, marginBottom: 2 }}
        />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          {members.name}
        </Typography>
        
        {/* Divider */}
        <Divider sx={{ width: '100%', marginY: 2 }} />

        {/* Update Form */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Due Date"
              variant="outlined"
              fullWidth
              name="dueDate"
              value={formData.dueDate || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Paid Date"
              variant="outlined"
              fullWidth
              name="paidDate"
              value={formData.paidDate || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              name="phoneNo"
              value={formData.phoneNo || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        {/* Update Button */}
        <Box sx={{ marginTop: 3, gap: 2 }}>
          <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 20, marginRight: 2 }} onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="contained" color="primary" size="large" sx={{ borderRadius: 20 }} onClick={handleBack}>
            Back
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('success') ? 'success' : 'error'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MemberProfile;
