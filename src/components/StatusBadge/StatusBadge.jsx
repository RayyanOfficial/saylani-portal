import React from 'react'

const colorMap = {
  Pending: 'bg-warning text-dark',
  Found: 'bg-success text-white',
  Submitted: 'bg-secondary text-white',
  'In Progress': 'bg-info text-white',
  Resolved: 'bg-success text-white'
}

export default function StatusBadge({status}){
  const cls = colorMap[status] || 'bg-light'
  return <span className={`status-badge ${cls}`}>{status}</span>
}
