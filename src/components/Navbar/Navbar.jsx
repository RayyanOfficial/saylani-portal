import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBell, FaSignOutAlt } from 'react-icons/fa'
import { listenAllNotifications } from '../../services/notificationsService'
import useAuth from '../../hooks/useAuth'
import { auth } from '../../firebase/firebaseConfig'
import { signOut } from 'firebase/auth'
import logo from '../../assets/saylani-logo.svg'

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
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top-custom shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Saylani" className="logo me-2" />
          <span className="fw-bold" style={{color:'var(--green)'}}>Saylani</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item me-3">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
            </li>
            <li className="nav-item me-3">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item me-3 position-relative">
                  <Link to="/notifications" className="nav-link position-relative">
                    <FaBell />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unreadCount}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item me-3 d-flex align-items-center">
                  <span className="text-muted small">{profile?.name || user.email}</span>
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
                <li className="nav-item"><Link className="btn btn-outline-success ms-3" to="/signup">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
