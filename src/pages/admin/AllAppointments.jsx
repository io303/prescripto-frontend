import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import AdminNavbar from '../../components/AdminNavbar'
import AdminSidebar from '../../components/AdminSidebar'

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!aToken) { navigate('/admin'); return }
    getAllAppointments()
  }, [aToken])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">All Appointments ({appointments.length})</h1>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-500">
                    <th className="px-6 py-3 font-medium">#</th>
                    <th className="px-6 py-3 font-medium">Patient</th>
                    <th className="px-6 py-3 font-medium">Age</th>
                    <th className="px-6 py-3 font-medium">Date & Time</th>
                    <th className="px-6 py-3 font-medium">Doctor</th>
                    <th className="px-6 py-3 font-medium">Fees</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt, idx) => (
                    <tr key={apt._id} className="border-t border-gray-50 hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-gray-400">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={apt.userData.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                          <span className="font-medium text-gray-700">{apt.userData.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{apt.userData.dob || '—'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {apt.slotDate.replace(/_/g, '/')} · {apt.slotTime}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <img src={apt.docData.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                          <span className="text-gray-700">{apt.docData.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">₹{apt.amount}</td>
                      <td className="px-6 py-4">
                        {apt.cancelled
                          ? <span className="px-2 py-1 bg-red-50 text-red-500 rounded-full text-xs">Cancelled</span>
                          : apt.isCompleted
                            ? <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs">Completed</span>
                            : <span className="px-2 py-1 bg-blue-50 text-primary rounded-full text-xs">Upcoming</span>
                        }
                      </td>
                      <td className="px-6 py-4">
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
              {appointments.length === 0 && (
                <div className="text-center py-16 text-gray-400">No appointments found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AllAppointments
