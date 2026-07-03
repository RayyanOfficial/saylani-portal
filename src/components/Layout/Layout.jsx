import React from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Footer from '../Footer/Footer'

export default function Layout({children}){
  return (
    <div className="app-shell">
      <Navbar />
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-12 col-lg-3 mb-3">
            <Sidebar />
          </div>
          <div className="col-12 col-lg-9">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
