import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'

const AdminSidebar = () => {
  const { aToken } = useContext(AdminContext)

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/admin/all-appointments', label: 'Appointments', icon: '📅' },
    { to: '/admin/add-doctor', label: 'Add Doctor', icon: '➕' },
    { to: '/admin/doctors-list', label: 'Doctors List', icon: '👨‍⚕️' },
  ]

  if (!aToken) return null

  return (
    <aside className="min-h-screen w-60 bg-white border-r border-gray-100 shrink-0">
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Rx</span>
          </div>
          <div>
            <p className="font-bold text-gray-800">Prescripto</p>
            <span className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>
      </div>
      <nav className="p-4 flex flex-col gap-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-primary'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default AdminSidebar
