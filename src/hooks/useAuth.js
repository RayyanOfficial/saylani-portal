import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, database } from '../firebase/firebaseConfig'
import { ref, get } from 'firebase/database'

export default function useAuth(){
  const [user,setUser] = useState(null)
  const [profile,setProfile] = useState(null)
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async u=>{
      setUser(u)
      if (u) {
        try {
          const snapshot = await get(ref(database, `users/${u.uid}`))
          const data = snapshot.val()
          setProfile(data ? { id:u.uid, ...data } : null)
        } catch (error) {
          console.error('Failed to load user profile', error)
          setProfile(null)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  },[])

  return {user,profile,loading}
}
