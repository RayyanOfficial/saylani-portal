import React from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../Footer/Footer'

export default function Layout({children}){
  return (
    <div className="app-shell">
      <Navbar />
      <div className="container-fluid py-4">
        <div className="row g-4 align-items-start">
          <div className="col-12 col-lg-3">
            <Sidebar />
          </div>
          <div className="col-12 col-lg-9">
            <div className="page-card p-3 p-md-4">
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
