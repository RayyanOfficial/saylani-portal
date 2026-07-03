import React from 'react'
import BrandLogo from '../Brand/BrandLogo'

export default function Footer(){
  return (
    <footer className="mt-4 py-4">
      <div className="container-fluid">
        <div className="card-custom p-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-2">
            <BrandLogo size={34} />
            <div>
              <div className="fw-semibold">Saylani Mass IT Hub Portal</div>
              <div className="small text-muted">Modern campus services for students and staff</div>
            </div>
          </div>
          <div className="small text-muted">© {new Date().getFullYear()} Saylani. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
