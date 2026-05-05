import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  return (
    <footer className="mt-20 border-t border-gray-200">
      <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Rx</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Prescripto</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Connecting patients with trusted healthcare professionals for seamless appointment booking and quality care.
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            {[['/', 'Home'], ['/about', 'About Us'], ['/contact', 'Contact Us'], ['/doctors', 'Doctors']].map(([path, label]) => (
              <li
                key={path}
                onClick={() => navigate(path)}
                className="cursor-pointer hover:text-primary transition-colors"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Get in Touch</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>+1-800-PRESCRIPTO</li>
            <li>support@prescripto.com</li>
            <li>Mon–Sat, 9AM – 6PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Prescripto. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
