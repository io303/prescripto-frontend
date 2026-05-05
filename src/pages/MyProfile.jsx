import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)

  const updateProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      formData.append('gender', userData.gender)
      formData.append('dob', userData.dob)
      if (image) formData.append('image', image)

      const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
        headers: { token },
      })

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(null)
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!userData) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="bg-white border border-gray-100 rounded-2xl p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <label htmlFor={isEdit ? 'image' : ''} className={isEdit ? 'cursor-pointer' : ''}>
            <div className="relative w-20 h-20">
              <img
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-blue-50"
              />
              {isEdit && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">Edit</span>
                </div>
              )}
            </div>
            <input id="image" type="file" accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />
          </label>
          <div>
            {isEdit ? (
              <input
                type="text"
                value={userData.name}
                onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                className="text-2xl font-bold border-b border-primary outline-none bg-transparent"
              />
            ) : (
              <h1 className="text-2xl font-bold text-gray-800">{userData.name}</h1>
            )}
          </div>
        </div>

        <hr className="mb-6" />

        {/* Contact Info */}
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Email</p>
              <p className="text-sm text-gray-700">{userData.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Phone</p>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                  className="text-sm border-b border-gray-300 outline-none w-full bg-transparent"
                />
              ) : (
                <p className="text-sm text-gray-700">{userData.phone}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-gray-400 mb-1">Address</p>
              {isEdit ? (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={userData.address?.line1 || ''}
                    onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                    placeholder="Address line 1"
                    className="text-sm border-b border-gray-300 outline-none bg-transparent"
                  />
                  <input
                    type="text"
                    value={userData.address?.line2 || ''}
                    onChange={e => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                    placeholder="Address line 2"
                    className="text-sm border-b border-gray-300 outline-none bg-transparent"
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-700">
                  {userData.address?.line1}<br />{userData.address?.line2}
                </p>
              )}
            </div>
          </div>
        </section>

        <hr className="mb-6" />

        {/* Basic Info */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Gender</p>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none"
                >
                  <option>Not Selected</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              ) : (
                <p className="text-sm text-gray-700">{userData.gender}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Date of Birth</p>
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob}
                  onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none"
                />
              ) : (
                <p className="text-sm text-gray-700">{userData.dob}</p>
              )}
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3">
          {isEdit ? (
            <>
              <button
                onClick={updateProfileData}
                className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => { setIsEdit(false); setImage(null) }}
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
    </div>
  )
}

export default MyProfile
