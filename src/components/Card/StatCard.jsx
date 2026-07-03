import React from 'react'

export default function StatCard({title,value,icon,children}){
  return (
    <div className="card card-custom p-3 rounded-16 h-100">
      <div className="d-flex align-items-center justify-content-between gap-3">
        <div>
          <div className="text-muted small fw-semibold">{title}</div>
          <div className="h4 mb-0 mt-1 fw-bold">{value}</div>
        </div>
        <div className="p-2 rounded-16" style={{ background: 'rgba(102,176,50,0.12)' }}>{icon}</div>
      </div>
      {children}
    </div>
  )
}
