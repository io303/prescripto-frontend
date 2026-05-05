import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import AdminNavbar from '../../components/AdminNavbar'
import AdminSidebar from '../../components/AdminSidebar'
import axios from 'axios'
import { toast } from 'react-toastify'

const specialities = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist',
]

const AddDoctor = () => {
  const { aToken, backendUrl } = useContext(AdminContext)
  const navigate = useNavigate()

  const [docImg, setDocImg] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if (!docImg) return toast.error('Please upload doctor image')
    try {
      const formData = new FormData()
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('experience', experience)
      formData.append('fees', fees)
      formData.append('about', about)
      formData.append('speciality', speciality)
      formData.append('degree', degree)
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

      const { data } = await axios.post(`${backendUrl}/api/admin/add-doctor`, formData, {
        headers: { atoken: aToken },
      })

      if (data.success) {
        toast.success(data.message)
        setDocImg(null); setName(''); setEmail(''); setPassword('')
        setFees(''); setAbout(''); setDegree(''); setAddress1(''); setAddress2('')
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-6">Add Doctor</h1>

          <form onSubmit={onSubmitHandler} className="bg-white rounded-2xl border border-gray-100 p-8">
            {/* Image upload */}
            <div className="flex items-center gap-5 mb-8">
              <label htmlFor="doc-img" className="cursor-pointer">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border-2 border-dashed border-blue-200 overflow-hidden hover:border-primary transition">
                  {docImg
                    ? <img src={URL.createObjectURL(docImg)} className="w-full h-full object-cover" alt="" />
                    : <span className="text-3xl">📷</span>
                  }
                </div>
                <input id="doc-img" type="file" accept="image/*" hidden onChange={e => setDocImg(e.target.files[0])} />
              </label>
              <div>
                <p className="text-sm font-medium text-gray-700">Upload Doctor Photo</p>
                <p className="text-xs text-gray-400">Click to browse (JPG, PNG)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { label: 'Name', value: name, set: setName, type: 'text', placeholder: 'Dr. John Doe' },
                { label: 'Email', value: email, set: setEmail, type: 'email', placeholder: 'doctor@email.com' },
                { label: 'Password', value: password, set: setPassword, type: 'password', placeholder: 'Min 8 characters' },
                { label: 'Fees (₹)', value: fees, set: setFees, type: 'number', placeholder: '500' },
                { label: 'Degree', value: degree, set: setDegree, type: 'text', placeholder: 'MBBS, MD' },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-sm text-gray-600 mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={e => field.set(e.target.value)}
                    placeholder={field.placeholder}
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
                  />
                </div>
              ))}

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Speciality</label>
                <select
                  value={speciality}
                  onChange={e => setSpeciality(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
                >
                  {specialities.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Experience</label>
                <select
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
                >
                  {['1 Year','2 Years','3 Years','4 Years','5 Years','6 Years','7 Years','8 Years','9 Years','10+ Years'].map(y => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Address Line 1</label>
                <input
                  type="text"
                  value={address1}
                  onChange={e => setAddress1(e.target.value)}
                  placeholder="57th Cross, Richmond"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Address Line 2</label>
                <input
                  type="text"
                  value={address2}
                  onChange={e => setAddress2(e.target.value)}
                  placeholder="Circle, Ring Road, London"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-600 mb-1 block">About Doctor</label>
                <textarea
                  rows={4}
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  placeholder="Write a brief description about the doctor..."
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              Add Doctor
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}

export default AddDoctor
