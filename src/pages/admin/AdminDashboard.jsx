import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import AdminNavbar from '../../components/AdminNavbar'
import AdminSidebar from '../../components/AdminSidebar'

const AdminDashboard = () => {
  const { aToken, dashData, getDashData, cancelAppointment } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!aToken) { navigate('/admin'); return }
    getDashData()
  }, [aToken])

  if (!dashData) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  )

  const stats = [
    { icon: '👨‍⚕️', label: 'Doctors', value: dashData.doctors, color: 'bg-blue-50 text-primary' },
    { icon: '📅', label: 'Appointments', value: dashData.appointments, color: 'bg-purple-50 text-purple-600' },
    { icon: '👥', label: 'Patients', value: dashData.patients, color: 'bg-green-50 text-green-600' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {stats.map(s => (
              <div key={s.label} className={`rounded-2xl p-6 flex items-center gap-4 ${s.color}`}>
                <span className="text-3xl">{s.icon}</span>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm opacity-70">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Latest Appointments */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Latest Appointments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b border-gray-100">
                    <th className="pb-3 font-medium">#</th>
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Doctor</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashData.latestAppointments.map((apt, idx) => (
                    <tr key={apt._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="py-3 text-gray-400">{idx + 1}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <img src={apt.userData.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                          <span className="font-medium text-gray-700">{apt.userData.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600">{apt.docData.name}</td>
                      <td className="py-3 text-gray-600">{apt.slotDate.replace(/_/g, '/')}</td>
                      <td className="py-3">
                        {apt.cancelled
                          ? <span className="px-2 py-1 bg-red-50 text-red-500 rounded-full text-xs">Cancelled</span>
                          : apt.isCompleted
                            ? <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">Completed</span>
                            : <span className="px-2 py-1 bg-blue-50 text-primary rounded-full text-xs">Upcoming</span>
                        }
                      </td>
                      <td className="py-3">
                        {!apt.cancelled && !apt.isCompleted && (
                          <button
                            onClick={() => cancelAppointment(apt._id)}
                            className="text-red-400 hover:text-red-600 text-xs font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
