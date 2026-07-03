import { ref, push, set, query, orderByChild, onValue, update } from 'firebase/database'
import { database } from '../firebase/firebaseConfig'

const baseRef = ref(database,'notifications')

export async function addNotification(payload){
  payload.createdAt = payload.createdAt || Date.now()
  payload.read = payload.read || false
  const newRef = push(baseRef)
  await set(newRef, payload)
  return { id: newRef.key, ...payload }
}

export function listenAllNotifications(cb){
  const q = query(baseRef, orderByChild('createdAt'))
  return onValue(q, snap => {
    const raw = snap.val() || {}
    const list = Object.keys(raw).map(key => ({ id:key, ...raw[key] }))
    cb(list.sort((a,b)=> (b.createdAt||0) - (a.createdAt||0)))
  })
}

export function listenUserNotifications(userId, cb){
  return listenAllNotifications(cb)
}

export async function markAsRead(id){
  await update(ref(database, `notifications/${id}`), { read:true })
}
