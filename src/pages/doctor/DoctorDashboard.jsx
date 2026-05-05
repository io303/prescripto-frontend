import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import AdminNavbar from '../../components/AdminNavbar'
import DoctorSidebar from '../../components/DoctorSidebar'

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!dToken) { navigate('/admin'); return }
    getDashData()
  }, [dToken])

  if (!dashData) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  )

  const stats = [
    { icon: '💰', label: 'Earnings', value: `₹${dashData.earnings}`, color: 'bg-green-50 text-green-600' },
    { icon: '📅', label: 'Appointments', value: dashData.appointments, color: 'bg-blue-50 text-primary' },
    { icon: '👥', label: 'Patients', value: dashData.patients, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Dashboard</h1>

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

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 mb-4">Latest Appointments</h2>
            <div className="flex flex-col gap-3">
              {dashData.latestAppointments.map(apt => (
                <div key={apt._id} className="flex items-center gap-4 p-3 border border-gray-50 rounded-xl hover:bg-gray-50 transition">
                  <img src={apt.userData.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-700 text-sm">{apt.userData.name}</p>
                    <p className="text-xs text-gray-400">{apt.slotDate.replace(/_/g, '/')}</p>
                  </div>
                  {!apt.cancelled && !apt.isCompleted && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => cancelAppointment(apt._id)}
                        className="w-8 h-8 rounded-full border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center text-xs"
                        title="Cancel"
                      >✕</button>
                      <button
                        onClick={() => completeAppointment(apt._id)}
                        className="w-8 h-8 rounded-full border border-green-200 text-green-500 hover:bg-green-50 flex items-center justify-center text-xs"
                        title="Complete"
                      >✓</button>
                    </div>
                  )}
                  {apt.cancelled && <span className="text-xs text-red-400">Cancelled</span>}
                  {apt.isCompleted && <span className="text-xs text-green-500">Completed</span>}
                </div>
              ))}
              {dashData.latestAppointments.length === 0 && (
                <p className="text-center text-gray-400 py-8">No appointments yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DoctorDashboard
