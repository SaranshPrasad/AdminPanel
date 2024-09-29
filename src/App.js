
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddMember from './components/AddMember';
import DefaultDashboardContent from './components/DefaultDashboardContent';
import UserTable from './components/UserTable';
import PaidUsersTable from './components/PaidUsersTable';
import DuePaymentUsersTable from './components/DuePaymentUsersTable';
import MemberProfile from './components/MemberProfile';
import LoginPage from './components/Login';
import { useFirebase } from './context/Firebase';

function App() {
  const firebase = useFirebase();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={firebase.isLoggedIn ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/" element={firebase.isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}>
          <Route index element={<DefaultDashboardContent />} />
          <Route path="add-member" element={<AddMember />} />
          <Route path="view-member" element={<UserTable />} />
          <Route path="paid-member" element={<PaidUsersTable />} />
          <Route path="due-member" element={<DuePaymentUsersTable />} />
          <Route path="/member/view/:id" element={<MemberProfile />} />
          


        </Route>
      </Routes>
    </Router>
  );
}

export default App;
