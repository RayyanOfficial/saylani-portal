import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/saylani-logo.svg'

export default function Landing(){
  return (
    <div className="d-flex align-items-center justify-content-center" style={{minHeight:'70vh'}}>
      <div className="card p-5 rounded-16 text-center shadow-sm" style={{maxWidth:980}}>
        <img src={logo} alt="Saylani" className="logo mb-3" />
        <h1 style={{color:'var(--green)'}}>Saylani Mass IT Hub Portal</h1>
        <p className="lead">A responsive, secure portal for campus services and student engagement.</p>
        <div className="d-flex justify-content-center gap-2 mt-3">
          <Link to="/signup" className="btn btn-success btn-lg">Get Started</Link>
          <Link to="/login" className="btn btn-outline-primary btn-lg">Sign In</Link>
        </div>
      </div>
    </div>
  )
}
