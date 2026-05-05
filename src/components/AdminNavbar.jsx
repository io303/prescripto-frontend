import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'

const AdminNavbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()

  const logout = () => {
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }
    if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
    }
    navigate('/')
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-800 text-lg">Prescripto</span>
        <span className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full">
          {aToken ? 'Admin' : 'Doctor'}
        </span>
      </div>
      <button
        onClick={logout}
        className="bg-primary text-white px-5 py-1.5 rounded-full text-sm hover:bg-primary-dark transition-colors"
      >
        Logout
      </button>
    </header>
  )
}

export default AdminNavbar
