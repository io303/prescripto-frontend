import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import AdminNavbar from '../../components/AdminNavbar'
import DoctorSidebar from '../../components/DoctorSidebar'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (!dToken) { navigate('/admin'); return }
    getProfileData()
  }, [dToken])

  const updateProfile = async () => {
    try {
      const updateData = {
        fees: profileData.fees,
        address: profileData.address,
        available: profileData.available,
      }
      const { data } = await axios.post(`${backendUrl}/api/doctor/update-profile`, updateData, {
        headers: { dtoken: dToken },
      })
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!profileData) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">My Profile</h1>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl">
            {/* Avatar + basic */}
            <div className="flex items-center gap-5 mb-8">
              <img
                src={profileData.image}
                alt={profileData.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
                <p className="text-gray-500 text-sm">{profileData.degree} · {profileData.speciality}</p>
                <span className="inline-block mt-1 text-xs bg-blue-50 text-primary px-3 py-1 rounded-full">
                  {profileData.experience} experience
                </span>
              </div>
            </div>

            <hr className="mb-6" />

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs text-gray-400 mb-1">About</p>
                <p className="text-sm text-gray-700 leading-relaxed">{profileData.about}</p>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Appointment Fees</p>
                  {isEdit ? (
                    <input
                      type="number"
                      value={profileData.fees}
                      onChange={e => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary w-full"
                    />
                  ) : (
                    <p className="text-sm font-bold text-primary">₹{profileData.fees}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-1">Availability</p>
                  {isEdit ? (
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <div
                        onClick={() => setProfileData(prev => ({ ...prev, available: !prev.available }))}
                        className={`w-10 h-5 rounded-full relative transition-colors ${profileData.available ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${profileData.available ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                      </div>
                      <span className="text-sm text-gray-600">{profileData.available ? 'Available' : 'Not available'}</span>
                    </label>
                  ) : (
                    <p className={`text-sm font-medium ${profileData.available ? 'text-green-600' : 'text-gray-400'}`}>
                      {profileData.available ? '✓ Available' : '✗ Not available'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">Address</p>
                {isEdit ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={profileData.address?.line1 || ''}
                      onChange={e => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="Address line 1"
                    />
                    <input
                      type="text"
                      value={profileData.address?.line2 || ''}
                      onChange={e => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                      className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder="Address line 2"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">
                    {profileData.address?.line1}<br />{profileData.address?.line2}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              {isEdit ? (
                <>
                  <button
                    onClick={updateProfile}
                    className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => { setIsEdit(false); getProfileData() }}
                    className="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-full text-sm hover:border-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="border border-primary text-primary px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DoctorProfile
