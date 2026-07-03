import React from 'react'

export default function StatCard({title,value,icon,children}){
  return (
    <div className="card card-custom p-3 rounded-16">
      <div className="d-flex align-items-center">
        <div className="me-3">{icon}</div>
        <div>
          <div className="text-muted small">{title}</div>
          <div className="h5 mb-0">{value}</div>
        </div>
      </div>
      {children}
    </div>
  )
}
