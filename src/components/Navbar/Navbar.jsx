import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBell, FaSignOutAlt, FaHome, FaTachometerAlt } from 'react-icons/fa'
import { listenAllNotifications } from '../../services/notificationsService'
import useAuth from '../../hooks/useAuth'
import { auth } from '../../firebase/firebaseConfig'
import { signOut } from 'firebase/auth'
import BrandLogo from '../Brand/BrandLogo'

export default function Navbar(){
  const nav = useNavigate()
  const { user, profile } = useAuth()
  const [notifications,setNotifications] = useState([])

  useEffect(()=>{
    const unsub = listenAllNotifications(setNotifications)
    return unsub
  },[])

  const unreadCount = notifications.filter(n=>!n.read).length

  const doLogout = async ()=>{
    await signOut(auth)
    nav('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg sticky-top-custom shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <BrandLogo size={44} />
          <div>
            <div className="fw-bold" style={{ color: 'var(--green)' }}>Saylani</div>
            <div className="small text-muted">Mass IT Hub</div>
          </div>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2">
            <li className="nav-item">
              <Link to="/dashboard" className="nav-link d-flex align-items-center gap-2"><FaTachometerAlt /> Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link d-flex align-items-center gap-2"><FaHome /> Home</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item position-relative">
                  <Link to="/notifications" className="nav-link position-relative d-flex align-items-center gap-2">
                    <FaBell />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unreadCount}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item d-flex align-items-center px-2">
                  <span className="text-muted small fw-semibold">{profile?.name || user.email}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger d-flex align-items-center" onClick={doLogout}>
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="btn btn-outline-success" to="/signup">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
