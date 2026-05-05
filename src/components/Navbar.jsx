import React, { useContext, useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { token, setToken, userData } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false)
  const [showPortal, setShowPortal] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const portalRef = useRef(null)
  const aiRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (portalRef.current && !portalRef.current.contains(e.target)) setShowPortal(false)
      if (aiRef.current && !aiRef.current.contains(e.target)) setShowAI(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav className="flex items-center justify-between py-4 mb-5 border-b border-gray-200">
      {/* Logo */}
      <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">Rx</span>
        </div>
        <span className="text-xl font-bold text-gray-800">Prescripto</span>
      </div>

      {/* Desktop Nav */}
      <ul className="hidden md:flex items-center gap-5 font-medium text-gray-600">
        {[['/', 'Home'], ['/doctors', 'All Doctors'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
          <NavLink key={path} to={path}
            className={({ isActive }) => `py-1 transition-colors hover:text-primary text-sm ${isActive ? 'text-primary border-b-2 border-primary' : ''}`}>
            <li>{label}</li>
          </NavLink>
        ))}

        {/* AI Tools Dropdown */}
        <div className="relative" ref={aiRef}>
          <button onClick={() => { setShowAI(!showAI); setShowPortal(false) }}
            className="flex items-center gap-1.5 text-sm py-1 transition-colors hover:text-primary font-medium">
            🤖 AI Tools
            <svg className={`w-3 h-3 transition-transform ${showAI ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAI && (
            <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-2 min-w-[220px] z-30">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 py-1.5 mb-1">AI Features</p>
              <button onClick={() => { navigate('/disease-predictor'); setShowAI(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary transition-colors text-left">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">🩺</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Disease Predictor</p>
                  <p className="text-xs text-gray-400">Symptom based AI diagnosis</p>
                </div>
              </button>
              <button onClick={() => { navigate('/prescription-analyzer'); setShowAI(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors text-left">
                <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm">📋</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Prescription Analyzer</p>
                  <p className="text-xs text-gray-400">OCR + medicine details</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </ul>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Staff Portal */}
        <div className="relative hidden md:block" ref={portalRef}>
          <button onClick={() => { setShowPortal(!showPortal); setShowAI(false) }}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-sm hover:border-primary hover:text-primary transition-colors font-medium">
            <span>🏥</span> Staff
            <svg className={`w-3 h-3 transition-transform ${showPortal ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showPortal && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-2 min-w-[180px] z-30">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-3 py-1.5 mb-1">Login as</p>
              <button onClick={() => { navigate('/admin'); setShowPortal(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:text-primary transition-colors text-left">
                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-sm">🛠️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Admin</p>
                  <p className="text-xs text-gray-400">Manage platform</p>
                </div>
              </button>
              <button onClick={() => { navigate('/admin'); setShowPortal(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors text-left">
                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">👨‍⚕️</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Doctor</p>
                  <p className="text-xs text-gray-400">View appointments</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Auth */}
        {token && userData ? (
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2">
              <img src={userData.image} className="w-9 h-9 rounded-full object-cover border-2 border-primary" alt="profile" />
              <svg className="w-3 h-3 text-gray-500 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="absolute right-0 top-full pt-2 z-20 hidden group-hover:block">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 min-w-[200px]">
                {[
                  ['/my-profile', '👤', 'My Profile'],
                  ['/my-appointments', '📅', 'My Appointments'],
                  ['/my-reports', '📋', 'My Medical Reports'],
                  ['/disease-predictor', '🩺', 'Disease Predictor'],
                  ['/prescription-analyzer', '📸', 'Prescription Analyzer'],
                ].map(([path, icon, label]) => (
                  <p key={path} onClick={() => navigate(path)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg cursor-pointer transition">
                    <span>{icon}</span> {label}
                  </p>
                ))}
                <hr className="my-1 border-gray-100" />
                <p onClick={logout}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition">
                  <span>🚪</span> Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button onClick={() => navigate('/login')}
            className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:bg-primary-dark transition-colors text-sm">
            Create account
          </button>
        )}

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-600" onClick={() => setShowMenu(!showMenu)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showMenu
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col items-start p-6 gap-3 md:hidden overflow-y-auto">
          <div className="flex justify-between w-full items-center mb-2">
            <span className="text-xl font-bold text-primary">Prescripto</span>
            <button onClick={() => setShowMenu(false)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {[['/', 'Home'], ['/doctors', 'All Doctors'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
            <NavLink key={path} to={path} onClick={() => setShowMenu(false)}
              className="text-base text-gray-700 hover:text-primary transition-colors w-full py-2 border-b border-gray-50">
              {label}
            </NavLink>
          ))}

          <div className="w-full pt-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">🤖 AI Tools</p>
            <div className="flex flex-col gap-2">
              <button onClick={() => { navigate('/disease-predictor'); setShowMenu(false) }}
                className="flex items-center gap-2 bg-blue-50 text-primary px-4 py-3 rounded-xl font-medium text-sm hover:bg-blue-100 transition">
                🩺 Disease Predictor
              </button>
              <button onClick={() => { navigate('/prescription-analyzer'); setShowMenu(false) }}
                className="flex items-center gap-2 bg-purple-50 text-purple-600 px-4 py-3 rounded-xl font-medium text-sm hover:bg-purple-100 transition">
                📋 Prescription Analyzer
              </button>
            </div>
          </div>

          <div className="w-full pt-1">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Staff Portal</p>
            <div className="flex gap-2">
              <button onClick={() => { navigate('/admin'); setShowMenu(false) }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-primary px-4 py-3 rounded-xl font-medium text-sm">
                🛠️ Admin
              </button>
              <button onClick={() => { navigate('/admin'); setShowMenu(false) }}
                className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 px-4 py-3 rounded-xl font-medium text-sm">
                👨‍⚕️ Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
