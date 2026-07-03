import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaUserCircle, FaShieldAlt, FaSignOutAlt, FaIdCard } from 'react-icons/fa'
import Layout from '../components/Layout/Layout'
import useAuth from '../hooks/useAuth'
import { auth } from '../firebase/firebaseConfig'
import { signOut } from 'firebase/auth'
import { useToast } from '../context/ToastContext'
import BrandLogo from '../components/Brand/BrandLogo'

export default function ProfilePage(){
  const navigate = useNavigate()
  const { user, profile, loading } = useAuth()
  const { addToast } = useToast()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      addToast('Signed out successfully', 'success')
      navigate('/login')
    } catch (error) {
      addToast('Could not sign out right now', 'danger')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="empty-state">Loading your profile…</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="row g-4">
        <div className="col-12 col-xl-4">
          <div className="card card-custom p-4 rounded-16">
            <div className="d-flex flex-column align-items-center text-center">
              <div className="rounded-circle p-3 mb-3" style={{ background: 'rgba(102,176,50,0.12)' }}>
                <FaUserCircle size={54} style={{ color: 'var(--green)' }} />
              </div>
              <h5 className="fw-bold mb-1">{profile?.name || user?.displayName || 'Student User'}</h5>
              <div className="text-muted small">{user?.email}</div>
              <div className="mt-3 d-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ background: 'rgba(0,87,168,0.08)', color: 'var(--blue)' }}>
                <FaShieldAlt />
                <span className="fw-semibold">{profile?.role || 'student'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <div className="card card-custom p-4 rounded-16">
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-4">
              <div>
                <h5 className="fw-bold mb-1">Account Overview</h5>
                <p className="text-muted small mb-0">A quick snapshot of your Saylani portal account.</p>
              </div>
              <div className="d-flex align-items-center gap-2">
                <BrandLogo size={34} />
                <span className="fw-semibold">Saylani Portal</span>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-16" style={{ background: 'rgba(102,176,50,0.05)' }}>
                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <FaIdCard />
                    <span>User ID</span>
                  </div>
                  <div className="fw-semibold">{user?.uid || 'Unavailable'}</div>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="p-3 rounded-16" style={{ background: 'rgba(0,87,168,0.05)' }}>
                  <div className="d-flex align-items-center gap-2 text-muted small mb-2">
                    <FaEnvelope />
                    <span>Email</span>
                  </div>
                  <div className="fw-semibold">{user?.email || 'Unavailable'}</div>
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex flex-wrap gap-2">
              <button className="btn btn-outline-primary" onClick={() => navigate('/dashboard')}>Go to dashboard</button>
              <button className="btn btn-outline-danger" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
