import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Loader from '../Loader/Loader'
import { ref, get } from 'firebase/database'
import { database } from '../../firebase/firebaseConfig'

export default function ProtectedRoute({children, requiredRole}){
  const {user,loading} = useAuth()
  const [roleOk,setRoleOk] = useState(false)
  const [checking,setChecking] = useState(!!requiredRole)

  useEffect(()=>{
    let mounted = true
    if(requiredRole && user){
      (async ()=>{
        try{
          const d = ref(database, `users/${user.uid}`)
          const snap = await get(d)
          if(mounted){
            const data = snap.val()
            setRoleOk(data && data.role === requiredRole)
          }
        }catch(err){
          console.error('Role check failed', err)
          if(mounted) setRoleOk(false)
        }finally{
          if(mounted) setChecking(false)
        }
      })()
    } else {
      setRoleOk(true)
      setChecking(false)
    }
    return ()=>{mounted=false}
  },[requiredRole,user])

  if(loading || checking) return <Loader />
  if(!user) return <Navigate to="/login" replace />
  if(requiredRole && !roleOk) return <Navigate to="/dashboard" replace />
  return children
}
