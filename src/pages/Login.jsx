import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useToast } from '../context/ToastContext'
import BrandLogo from '../components/Brand/BrandLogo'

export default function Login(){
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [err,setErr] = useState(null)
  const [loading,setLoading] = useState(false)
  const [user, authLoading] = useAuthState(auth)
  const { addToast } = useToast()

  useEffect(()=>{
    if(user && !authLoading){
      nav('/dashboard')
    }
  },[user,authLoading,nav])

  const submit = async (e)=>{
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try{
      await signInWithEmailAndPassword(auth,email,password)
      addToast('Welcome back!', 'success')
      nav('/dashboard')
    }catch(e){ setErr(e.message) }
    setLoading(false)
  }

  return (
    <div className="auth-shell d-flex align-items-center justify-content-center">
      <div className="auth-card p-4 p-md-5">
        <div className="text-center mb-4">
          <BrandLogo size={56} />
          <h3 className="mt-3 fw-bold">Welcome back</h3>
          <p className="text-muted mb-0">Secure access to campus services, reporting, and volunteer opportunities.</p>
        </div>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
          </div>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <button className="btn btn-primary w-100 mt-2" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mt-3 small gap-2">
          <Link to="/forgot-password">Forgot password?</Link>
          <span>Don't have an account? <Link to="/signup">Sign up</Link></span>
        </div>
      </div>
    </div>
  )
}

