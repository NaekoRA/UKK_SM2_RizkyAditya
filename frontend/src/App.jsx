import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/navbar";
import Home from "../pages/home";
import Login from "../auth/login";
import Register from "../auth/register";
import ProfilePage from "../pages/profile";
import PrivateRoute from "../auth/private"; 
import AdminPage from "../admin/admin";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        <Route element={<PrivateRoute allowedRoles={['user', 'admin']} />}>
          <Route path="/" element={<Sidebar />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
