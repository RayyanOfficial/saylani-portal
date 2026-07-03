import { ref, push, set, query, orderByChild, equalTo, onValue, update, remove, get } from 'firebase/database'
import { database } from '../firebase/firebaseConfig'
import { addNotification } from './notificationsService'

const baseRef = ref(database,'volunteers')

export async function createVolunteer(payload){
  payload.createdAt = Date.now()
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

export async function updateVolunteer(id,data){
  await update(ref(database, `volunteers/${id}`), data)
  if(data.approved){
    await addNotification({
      message: `Volunteer registration approved for ${id}`,
      read: false,
      createdAt: Date.now(),
      meta: { collection: 'volunteers', id }
    })
  }
}

export async function deleteVolunteer(id){
  await remove(ref(database, `volunteers/${id}`))
}

export async function searchVolunteers(term){
  const snapshot = await get(query(baseRef, orderByChild('createdAt')))
  const raw = snapshot.val() || {}
  return Object.keys(raw).map(key => ({ id:key, ...raw[key] })).filter(i=> (i.name||'').toLowerCase().includes(term.toLowerCase()) || (i.event||'').toLowerCase().includes(term.toLowerCase()))
}
