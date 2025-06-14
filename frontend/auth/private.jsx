import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/login" replace /> 
    }

    return <Outlet />
}

export default PrivateRoute
