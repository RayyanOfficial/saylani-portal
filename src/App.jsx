import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Layout from './components/Layout/Layout'
import LostFoundPage from './pages/LostFoundPage'
import ComplaintsPage from './pages/ComplaintsPage'
import VolunteerPage from './pages/VolunteerPage'
import AdminPage from './pages/AdminPage'
import NotificationList from './components/Notification/NotificationList'
import Toasts from './components/Notification/Toasts'

export default function App(){
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard/></Layout></ProtectedRoute>} />
        <Route path="/lost-found" element={<ProtectedRoute><Layout><LostFoundPage/></Layout></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute><Layout><ComplaintsPage/></Layout></ProtectedRoute>} />
        <Route path="/volunteer" element={<ProtectedRoute><Layout><VolunteerPage/></Layout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole={'admin'}><Layout><AdminPage/></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Layout><NotificationList/></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
      <Toasts />
    </>
  )
}
