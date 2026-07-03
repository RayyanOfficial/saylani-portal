import React from 'react'

export default function Loader(){
  return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <div className="d-flex align-items-center gap-3 text-muted">
        <div className="spinner-border text-success" role="status" />
        <span className="fw-semibold">Loading insights...</span>
      </div>
    </div>
  )
}
