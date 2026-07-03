import React, { useEffect, useRef } from 'react'
import { useToast } from '../../context/ToastContext'
import { listenAllNotifications } from '../../services/notificationsService'

export default function Toasts(){
  const { toasts, addToast } = useToast()
  const seenIds = useRef(new Set())
  const isInitialLoad = useRef(true)

  useEffect(() => {
    const unsub = listenAllNotifications(notes => {
      if (isInitialLoad.current) {
        notes.forEach(note => seenIds.current.add(note.id))
        isInitialLoad.current = false
        return
      }
      notes.forEach(note => {
        if (!seenIds.current.has(note.id)) {
          seenIds.current.add(note.id)
          addToast(note.message, note.read ? 'success' : 'info', 5000)
        }
      })
    })
    return unsub
  }, [addToast])

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex:1200}}>
      {toasts.slice(0,5).map(t=> (
        <div key={t.id} className={`toast show mb-2 border-0 shadow-soft ${t.type === 'danger' ? 'bg-danger text-white' : t.type === 'success' ? 'bg-success text-white' : 'bg-primary text-white'}`}>
          <div className="toast-header border-0 bg-transparent text-current">
            <strong className="me-auto">Status</strong>
            <small>now</small>
          </div>
          <div className="toast-body">{t.message}</div>
        </div>
      ))}
    </div>
  )
}
