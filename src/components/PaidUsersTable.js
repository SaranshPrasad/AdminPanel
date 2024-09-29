// src/components/PaidUsersTable.js
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Typography, TablePagination, Avatar } from '@mui/material';
import { Visibility as ViewIcon, Delete as DeleteIcon, CheckCircle as PaidIcon } from '@mui/icons-material';
import { useFirebase } from '../context/Firebase';
import { useNavigate } from 'react-router-dom';

const PaidUsersTable = ({ users }) => {
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
    setPage(0); // Reset the page to the first page when rows per page change
  };
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; 
  };
  const today = getTodayDate();

  

  const paidUsers = members.filter(user => user.dueDate > today  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Paid Users
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell>Photo</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone No</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paidUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
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
                <TableCell>{user.paidDate}</TableCell>
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
          count={paidUsers.length} // Total number of paid users
          page={page} // Current page number
          onPageChange={handleChangePage} // Handle page change
          rowsPerPage={rowsPerPage} // Rows per page
          onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
          rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
        />
      </TableContainer>
    </Box>
  );
};

export default PaidUsersTable;
