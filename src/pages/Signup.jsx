import React, { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth, database } from '../firebase/firebaseConfig'
import { ref, set } from 'firebase/database'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useToast } from '../context/ToastContext'
import logo from '../assets/saylani-logo.svg'

export default function Signup(){
  const nav = useNavigate()
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirm,setConfirm] = useState('')
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
    if(password.length < 6) return setErr('Password must be at least 6 characters')
    if(password !== confirm) return setErr('Passwords do not match')
    setLoading(true)
    try{
      const u = await createUserWithEmailAndPassword(auth,email,password)
      await updateProfile(u.user,{displayName:name})
      await set(ref(database, `users/${u.user.uid}`), {
        uid: u.user.uid,
        name,
        email,
        role: 'student',
        createdAt: Date.now()
      })
      addToast('Account created successfully','success')
      nav('/dashboard')
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
          <h5 className="mt-2">Create an account</h5>
          <p className="text-muted small">Join the Saylani community and access campus support services.</p>
        </div>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} required type="email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required type="password" minLength={6} />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input className="form-control" value={confirm} onChange={e=>setConfirm(e.target.value)} required type="password" />
          </div>
          {err && <div className="alert alert-danger py-2">{err}</div>}
          <button className="btn btn-success w-100 mt-2" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Sign Up'}</button>
        </form>
        <div className="text-center mt-3 small">Already have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  )
}
