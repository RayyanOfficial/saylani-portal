import React from 'react'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaHandsHelping, FaShieldAlt, FaBullhorn } from 'react-icons/fa'
import BrandLogo from '../components/Brand/BrandLogo'

export default function Landing(){
  const highlights = [
    { icon: <FaBullhorn />, title: 'Instant updates', text: 'Stay informed on alerts, notices, and community actions.' },
    { icon: <FaHandsHelping />, title: 'Volunteer access', text: 'Register easily for events and campus initiatives.' },
    { icon: <FaShieldAlt />, title: 'Secure reporting', text: 'Submit complaints and lost-and-found items with confidence.' }
  ]

  return (
    <div className="auth-shell d-flex align-items-center justify-content-center">
      <div className="container py-4">
        <div className="row g-4 align-items-center">
          <div className="col-12 col-xl-7">
            <div className="hero-panel position-relative p-4 p-md-5">
              <div className="position-relative">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <BrandLogo size={54} />
                  <div>
                    <div className="fw-bold fs-4">Saylani Mass IT Hub</div>
                    <div className="small opacity-75">A polished portal for students, staff, and volunteers</div>
                  </div>
                </div>
                <h1 className="display-6 fw-bold mb-3">Modern campus support, beautifully organized.</h1>
                <p className="lead mb-4" style={{ maxWidth: 620, opacity: 0.92 }}>
                  Centralize complaints, lost and found reports, notifications, and volunteer participation in one premium experience.
                </p>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <Link to="/signup" className="btn btn-light text-primary fw-semibold">Get Started</Link>
                  <Link to="/login" className="btn btn-outline-light">Sign In</Link>
                </div>
                <div className="d-flex flex-wrap gap-3">
                  {['Realtime updates', 'Responsive across all devices', 'Professional experience'].map(item => (
                    <div key={item} className="d-flex align-items-center gap-2 small fw-semibold">
                      <FaCheckCircle /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-xl-5">
            <div className="card-custom p-4 p-md-5">
              <h3 className="fw-bold mb-3">Everything you need in one place</h3>
              <div className="d-grid gap-3">
                {highlights.map(item => (
                  <div key={item.title} className="d-flex align-items-start gap-3 p-3 rounded-16" style={{ background: 'rgba(102,176,50,0.05)' }}>
                    <div className="fs-5" style={{ color: 'var(--green)' }}>{item.icon}</div>
                    <div>
                      <div className="fw-semibold">{item.title}</div>
                      <div className="small text-muted">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
