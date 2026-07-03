import { ref, push, set, query, orderByChild, equalTo, onValue, update, remove, get } from 'firebase/database'
import { database } from '../firebase/firebaseConfig'
import { addNotification } from './notificationsService'
import { matchTitles } from '../utils/helpers'

const baseRef = ref(database,'lost_found_items')

export async function createItem(payload){
  payload.createdAt = Date.now()
  payload.status = payload.status || 'Pending'
  const newRef = push(baseRef)
  await set(newRef, payload)
  tryMatch(newRef.key, payload)
  return { id: newRef.key, ...payload }
}

async function tryMatch(newId, payload){
  try{
    const otherType = payload.type === 'Lost' ? 'Found' : 'Lost'
    const snap = await get(query(baseRef, orderByChild('type'), equalTo(otherType)))
    const raw = snap.val() || {}
    for(const key of Object.keys(raw)){
      const other = raw[key]
      if(matchTitles(payload.title, other.title)){
        await addNotification({
          message: `Possible Match Found: ${payload.title} ⇄ ${other.title}`,
          read: false,
          createdAt: Date.now(),
          meta: { newId, otherId: key }
        })
      }
    }
  }catch(e){console.error('match check failed',e)}
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

export async function updateItem(id,data){
  const d = ref(database, `lost_found_items/${id}`)
  await update(d, data)
  if(data.status){
    await addNotification({
      message: `Lost/Found item status changed to ${data.status}`,
      read: false,
      createdAt: Date.now(),
      meta: { collection: 'lost_found_items', id }
    })
  }
}

export async function deleteItem(id){
  await remove(ref(database, `lost_found_items/${id}`))
}

export async function searchByTitle(term){
  const snapshot = await get(query(baseRef, orderByChild('createdAt')))
  const raw = snapshot.val() || {}
  return Object.keys(raw).map(key => ({ id:key, ...raw[key] })).filter(i=>i.title.toLowerCase().includes(term.toLowerCase()))
}
