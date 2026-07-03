import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaChartPie, FaBoxOpen, FaExclamationCircle, FaHandsHelping, FaBell, FaShieldAlt, FaUserCircle } from 'react-icons/fa'
import useAuth from '../../hooks/useAuth'
import BrandLogo from '../Brand/BrandLogo'

export default function Sidebar(){
  const { profile } = useAuth()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <FaChartPie /> },
    { to: '/lost-found', label: 'Lost & Found', icon: <FaBoxOpen /> },
    { to: '/complaints', label: 'Complaints', icon: <FaExclamationCircle /> },
    { to: '/volunteer', label: 'Volunteers', icon: <FaHandsHelping /> },
    { to: '/notifications', label: 'Notifications', icon: <FaBell /> }
  ]

  return (
    <div className="card-custom sidebar glass p-3 p-lg-3">
      <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom">
        <BrandLogo size={38} />
        <div>
          <div className="fw-bold">Campus Portal</div>
          <div className="small text-muted">Service hub</div>
        </div>
      </div>
      <nav className="nav flex-column gap-1">
        {links.map(link => (
          <NavLink key={link.to} to={link.to} className={({isActive})=>"nav-link px-3 py-2 d-flex align-items-center gap-2 "+(isActive? 'active':'')}>
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
        <NavLink to="/profile" className={({isActive})=>"nav-link px-3 py-2 d-flex align-items-center gap-2 "+(isActive? 'active':'')}>
          <FaUserCircle />
          <span>Profile</span>
        </NavLink>
        {profile?.role === 'admin' && (
          <NavLink to="/admin" className={({isActive})=>"nav-link px-3 py-2 d-flex align-items-center gap-2 "+(isActive? 'active':'')}>
            <FaShieldAlt />
            <span>Admin Panel</span>
          </NavLink>
        )}
      </nav>
    </div>
  )
}
