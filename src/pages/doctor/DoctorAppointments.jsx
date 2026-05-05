import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import AdminNavbar from '../../components/AdminNavbar'
import DoctorSidebar from '../../components/DoctorSidebar'

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!dToken) { navigate('/admin'); return }
    getAppointments()
  }, [dToken])

  const startVideoCall = (appointmentId) => navigate(`/video-call/apt_${appointmentId}?role=doctor`)
  const createReport = (appointmentId) => navigate(`/doctor/create-report/${appointmentId}`)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">My Appointments ({appointments.length})</h1>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-4 py-3 font-medium">#</th>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium">Payment</th>
                    <th className="px-4 py-3 font-medium">Date & Time</th>
                    <th className="px-4 py-3 font-medium">Fees</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, idx) => (
                    <tr key={apt._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={apt.userData.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                          <span className="font-medium text-gray-700">{apt.userData.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${apt.payment ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                          {apt.payment ? '✓ Paid' : 'Cash'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {apt.slotDate.replace(/_/g, '/')} · {apt.slotTime}
                      </td>
                      <td className="px-4 py-3 text-gray-600">₹{apt.amount}</td>
                      <td className="px-4 py-3">
                        {apt.cancelled ? (
                          <span className="text-xs text-red-400">Cancelled</span>
                        ) : apt.isCompleted ? (
                          <span className="text-xs text-green-500">✓ Completed</span>
                        ) : (
                          <div className="flex gap-1.5 flex-wrap">
                            {/* Video Call */}
                            <button onClick={() => startVideoCall(apt._id)}
                              className="bg-green-500 text-white px-2.5 py-1.5 rounded-full text-xs hover:bg-green-600 transition">
                              📹 Call
                            </button>
                            {/* Create Report */}
                            <button onClick={() => createReport(apt._id)}
                              className="bg-blue-500 text-white px-2.5 py-1.5 rounded-full text-xs hover:bg-blue-600 transition">
                              📄 Report
                            </button>
                            {/* Complete */}
                            <button onClick={() => completeAppointment(apt._id)}
                              className="w-7 h-7 rounded-full border border-green-200 text-green-500 hover:bg-green-50 flex items-center justify-center text-xs">✓</button>
                            {/* Cancel */}
                            <button onClick={() => cancelAppointment(apt._id)}
                              className="w-7 h-7 rounded-full border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center text-xs">✕</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {appointments.length === 0 && (
                <div className="text-center py-16 text-gray-400">No appointments yet.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DoctorAppointments
