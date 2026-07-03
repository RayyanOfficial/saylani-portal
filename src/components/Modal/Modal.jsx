import React from 'react'

export default function Modal({show, title, children, footer, onClose}){
  if(!show) return null
  return (
    <div className="modal show d-block" tabIndex="-1" style={{background:'rgba(16,24,40,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 rounded-16 shadow-soft">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer border-0">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
