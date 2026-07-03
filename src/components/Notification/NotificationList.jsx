import React, { useEffect, useState } from 'react'
import { listenAllNotifications, markAsRead } from '../../services/notificationsService'
import { fmtDate } from '../../utils/helpers'

export default function NotificationList(){
  const [notes,setNotes] = useState([])
  useEffect(()=>{
    const unsub = listenAllNotifications(setNotes)
    return unsub
  },[])

  const unreadCount = notes.filter(note=>!note.read).length
  const markAllRead = async () => {
    await Promise.all(notes.filter(note=>!note.read).map(note=>markAsRead(note.id)))
  }

  return (
    <div className="card card-custom p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="mb-1">Notifications</h5>
          <div className="small text-muted">Real-time updates for every system alert.</div>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-sm btn-outline-primary" onClick={markAllRead}>Mark all read</button>
        )}
      </div>
      <div className="list-group">
        {notes.length===0 && <div className="text-muted small p-3">No notifications yet.</div>}
        {notes.map(n=> (
          <div key={n.id} className={`list-group-item d-flex justify-content-between align-items-start ${n.read ? 'text-muted bg-light' : ''}`}>
            <div>
              <div>{n.message}</div>
              <div className="small text-muted">{fmtDate(n.createdAt)}</div>
            </div>
            <div>
              {!n.read && <button className="btn btn-sm btn-outline-primary" onClick={()=>markAsRead(n.id)}>Mark read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
