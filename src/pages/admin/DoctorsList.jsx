import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import AdminNavbar from '../../components/AdminNavbar'
import AdminSidebar from '../../components/AdminSidebar'

const DoctorsList = () => {
  const { aToken, doctors, getAllDoctors, changeAvailability } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!aToken) { navigate('/admin'); return }
    getAllDoctors()
  }, [aToken])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Doctors List ({doctors.length})</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {doctors.map(doc => (
              <div key={doc._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-44 bg-blue-50 overflow-hidden">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800">{doc.name}</h3>
                  <p className="text-primary text-sm mb-3">{doc.speciality}</p>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => changeAvailability(doc._id)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${doc.available ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${doc.available ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </div>
                      <span className="text-xs text-gray-500">{doc.available ? 'Available' : 'Unavailable'}</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {doctors.length === 0 && (
            <div className="text-center py-16 text-gray-400">No doctors found. Add one!</div>
          )}
        </main>
      </div>
    </div>
  )
}

export default DoctorsList
