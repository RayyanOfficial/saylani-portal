import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useToast } from '../context/ToastContext'
import logo from '../assets/saylani-logo.svg'

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
    <div className="d-flex align-items-center justify-content-center" style={{minHeight:'100vh'}}>
      <div className="card p-4 rounded-16" style={{width:380,maxWidth:'100%'}}>
        <div className="text-center mb-4">
          <img src={logo} alt="logo" className="logo" />
          <h5 className="mt-2">Sign in to Portal</h5>
          <p className="text-muted small">Secure access to campus services, reporting, and volunteer opportunities.</p>
        </div>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} />
          </div>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <button className="btn btn-primary w-100 mt-2" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="d-flex justify-content-between align-items-center mt-3 small">
          <Link to="/forgot-password">Forgot password?</Link>
          <span>Don't have an account? <Link to="/signup">Sign up</Link></span>
        </div>
      </div>
    </div>
  )
}

