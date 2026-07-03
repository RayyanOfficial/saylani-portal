import React from 'react'
import logo from '../../../Main-LOGO.png'

export default function BrandLogo({ className = '', size = 46, alt = 'Saylani Mass IT Hub' }) {
  return (
    <img
      src={logo}
      alt={alt}
      className={`brand-logo ${className}`.trim()}
      style={{ height: size, width: 'auto' }}
    />
  )
}
