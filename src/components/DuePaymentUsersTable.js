// src/components/DuePaymentUsersTable.js
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography, TablePagination, Avatar } from '@mui/material';
import { Visibility as ViewIcon, Delete as DeleteIcon, Cancel as DueIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../context/Firebase';
const DuePaymentUsersTable = ({ users }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const firebase = useFirebase();
  useEffect(() => {
    firebase.getMembers().then((member) => {
      const memberData = member.docs.map(async (user) => {
        const memberData = user.data();
        let imageUrl = '/defaultProfilePic.jpg'; // Default image

        if (memberData.imgURL) {
          try {
            imageUrl = await firebase.getImageUrl(memberData.imgURL);
          } catch (error) {
            console.error('Error fetching image URL:', error);
          }
        }
        
        return { ...memberData, id: user.id, imageUrl };
      });

      Promise.all(memberData).then((resolvedMembers) => setMembers(resolvedMembers));
    });
  }, [firebase]);
 

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      firebase.deleteMember(userId).then(() => {
        setMembers(members.filter(member => member.id !== userId));
        
      }).catch(error => {
        console.error('Error deleting user: ', error);
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };
  
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  };

  const dueUsers = members.filter(user => user.dueDate <= getTodayDate());

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Due Payment Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone No</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dueUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                    <Avatar 
                      alt={user.name} 
                      src={user.imageUrl} 
                      sx={{ width: 56, height: 56 }} 
                    />
                  </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.phoneNo}</TableCell>
                <TableCell>{user.dueDate}</TableCell>
                <TableCell>
                <IconButton onClick={() => navigate(`/member/view/${user.id}`)} color="primary">
                    <ViewIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={dueUsers.length} 
          page={page} 
          onPageChange={handleChangePage} 
          rowsPerPage={rowsPerPage} 
          onRowsPerPageChange={handleChangeRowsPerPage} 
          rowsPerPageOptions={[5, 10, 25]} 
        />
      </TableContainer>
    </Box>
  );
};

export default DuePaymentUsersTable;
