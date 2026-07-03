import React, { createContext, useContext, useState } from 'react'

const ToastContext = createContext()

export function ToastProvider({children}){
  const [toasts,setToasts] = useState([])
  function addToast(message,type='success',timeout=4000){
    const id = Date.now()+Math.random()
    setToasts(t=>[{id,message,type},...t])
    setTimeout(()=> setToasts(t=>t.filter(x=>x.id!==id)), timeout)
  }
  return (
    <ToastContext.Provider value={{toasts,addToast}}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(){
  return useContext(ToastContext)
}
