import { useEffect, useState } from 'react'
import { ref, query, orderByChild, equalTo, onValue } from 'firebase/database'
import { database } from '../firebase/firebaseConfig'

export default function useRealtimeCollection(path, opts={orderBy:'createdAt', whereClause:null}){
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    if(!path){
      setData([])
      setLoading(false)
      return
    }

    const baseRef = ref(database, path)
    let q = baseRef
    if(opts?.whereClause){
      q = query(baseRef, orderByChild(opts.whereClause.field), equalTo(opts.whereClause.value))
    } else if(opts?.orderBy){
      q = query(baseRef, orderByChild(opts.orderBy))
    }

    const unsub = onValue(q, snapshot => {
      const raw = snapshot.val() || {}
      const list = Object.keys(raw).map(key => ({ id:key, ...raw[key] }))
      setData(list.sort((a,b)=> (b.createdAt || 0) - (a.createdAt || 0)))
      setLoading(false)
    }, err => {
      console.error('Realtime collection error', err)
      setLoading(false)
    })

    return unsub
  }, [path, opts?.orderBy, JSON.stringify(opts?.whereClause)])

  return { data, loading }
}
