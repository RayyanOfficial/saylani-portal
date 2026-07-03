import { ref, push, set, query, orderByChild, equalTo, onValue, update, remove, get } from 'firebase/database'
import { database } from '../firebase/firebaseConfig'
import { addNotification } from './notificationsService'

const baseRef = ref(database,'complaints')

export async function createComplaint(payload){
  payload.createdAt = Date.now()
  payload.status = payload.status || 'Submitted'
  const newRef = push(baseRef)
  await set(newRef, payload)
  return { id: newRef.key, ...payload }
}

export function listenAll(cb){
  const q = query(baseRef, orderByChild('createdAt'))
  return onValue(q, snapshot => {
    const raw = snapshot.val() || {}
    const list = Object.keys(raw).map(key => ({ id:key, ...raw[key] }))
    cb(list.sort((a,b)=> (b.createdAt||0) - (a.createdAt||0)))
  })
}

export function listenUser(userId, cb){
  const q = query(baseRef, orderByChild('userId'), equalTo(userId))
  return onValue(q, snapshot => {
    const raw = snapshot.val() || {}
    const list = Object.keys(raw).map(key => ({ id:key, ...raw[key] }))
    cb(list.sort((a,b)=> (b.createdAt||0) - (a.createdAt||0)))
  })
}

export async function updateComplaint(id,data){
  const d = ref(database, `complaints/${id}`)
  await update(d, data)
  if(data.status){
    await addNotification({
      message: `Complaint status changed to ${data.status}`,
      read: false,
      createdAt: Date.now(),
      meta: { collection: 'complaints', id }
    })
  }
}

export async function deleteComplaint(id){
  await remove(ref(database, `complaints/${id}`))
}

export async function searchComplaints(term){
  const snapshot = await get(query(baseRef, orderByChild('createdAt')))
  const raw = snapshot.val() || {}
  return Object.keys(raw).map(key => ({ id:key, ...raw[key] })).filter(i=> (i.description||'').toLowerCase().includes(term.toLowerCase()))
}
