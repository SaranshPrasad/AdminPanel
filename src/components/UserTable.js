import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  TablePagination,
  Avatar,
  Tooltip
} from '@mui/material';
import { Visibility as ViewIcon, Delete as DeleteIcon, CheckCircle as PaidIcon, Cancel as DueIcon, Mail as MailIcon } from '@mui/icons-material';
import { useFirebase } from '../context/Firebase';
import { useNavigate } from 'react-router-dom';

const statusIcons = {
  Paid: <PaidIcon color="success" />,
  Due: <DueIcon color="error" />,
};

const UserTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [members, setMembers] = useState([]);
  const firebase = useFirebase();
  const navigate = useNavigate();

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

  const handleSendEmail = (email) => {
    // Replace with your EmailJS service ID and template ID
    // const serviceID = 'your_service_id';
    // const templateID = 'your_template_id';
    // const userID = 'your_user_id'; // Your EmailJS user ID

    // emailjs.send(serviceID, templateID, { to_email: email }, userID)
    //   .then((response) => {
    //     console.log('Email sent successfully:', response);
    //     alert('Email sent successfully!');
    //   })
    //   .catch((error) => {
    //     console.error('Error sending email:', error);
    //     alert('Failed to send email.');
    //   });
    console.log("send");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const checkDueStatus = (dueDate) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    return due < currentDate ? 'Due' : 'Paid';
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Total Members
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone No</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Paid Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((member) => {
              const status = checkDueStatus(member.dueDate);

              return (
                <TableRow key={member.id}>
                  {/* Display the user's image */}
                  <TableCell>
                    <Avatar
                      alt={member.name}
                      src={member.imageUrl}
                      sx={{ width: 56, height: 56 }}
                    />
                  </TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.phoneNo}</TableCell>
                  <TableCell>{member.dueDate}</TableCell>
                  <TableCell>{member.paidDate}</TableCell>
                  <TableCell>
                    {statusIcons[status]}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => navigate(`/member/view/${member.id}`)} color="primary">
                      <ViewIcon />
                    </IconButton>
                    <Tooltip title="Send Email">
                      <IconButton onClick={() => handleSendEmail(member.email)} color="info">
                        <MailIcon />
                      </IconButton>
                    </Tooltip>
                    <IconButton onClick={() => handleDelete(member.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={members.length}
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

export default UserTable;
