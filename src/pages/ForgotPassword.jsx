import React, { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import logo from '../assets/saylani-logo.svg'

export default function ForgotPassword(){
  const [email,setEmail] = useState('')
  const [err,setErr] = useState(null)
  const [success,setSuccess] = useState(null)
  const [loading,setLoading] = useState(false)
  const { addToast } = useToast()

  const submit = async (e)=>{
    e.preventDefault()
    setErr(null)
    setSuccess(null)
    setLoading(true)
    try{
      await sendPasswordResetEmail(auth,email)
      setSuccess('Password reset email sent. Check your inbox.')
      addToast('Password reset email sent', 'success')
    }catch(e){
      console.error(e)
      setErr(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={{minHeight:'100vh'}}>
      <div className="card p-4 rounded-16" style={{width:420,maxWidth:'100%'}}>
        <div className="text-center mb-4">
          <img src={logo} alt="Saylani" className="logo" />
          <h5 className="mt-2">Reset your password</h5>
          <p className="text-muted small">Enter your email and we will send a reset link.</p>
        </div>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}
          <button className="btn btn-primary w-100 mt-2" type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Email'}</button>
        </form>
        <div className="text-center mt-3 small">Remembered? <Link to="/login">Login</Link></div>
      </div>
    </div>
  )
}
