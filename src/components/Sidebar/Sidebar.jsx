import React from 'react'
import { NavLink } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Sidebar(){
  const { profile } = useAuth()

  return (
    <div className="bg-white p-3 card-custom sidebar glass">
      <div className="mb-4 text-center border-bottom pb-3">
        <div className="text-uppercase small text-muted mb-1">Saylani Hub</div>
        <div className="fw-bold">Campus Portal</div>
      </div>
      <nav className="nav flex-column">
        <NavLink to="/dashboard" className={({isActive})=>"nav-link px-3 py-2 rounded-12 mb-1 "+(isActive? 'active':'')}>Dashboard</NavLink>
        <NavLink to="/lost-found" className={({isActive})=>"nav-link px-3 py-2 rounded-12 mb-1 "+(isActive? 'active':'')}>Lost & Found</NavLink>
        <NavLink to="/complaints" className={({isActive})=>"nav-link px-3 py-2 rounded-12 mb-1 "+(isActive? 'active':'')}>Complaints</NavLink>
        <NavLink to="/volunteer" className={({isActive})=>"nav-link px-3 py-2 rounded-12 mb-1 "+(isActive? 'active':'')}>Volunteers</NavLink>
        <NavLink to="/notifications" className={({isActive})=>"nav-link px-3 py-2 rounded-12 mb-1 "+(isActive? 'active':'')}>Notifications</NavLink>
        {profile?.role === 'admin' && (
          <NavLink to="/admin" className={({isActive})=>"nav-link px-3 py-2 rounded-12 mb-1 "+(isActive? 'active':'')}>Admin Panel</NavLink>
        )}
      </nav>
    </div>
  )
}
