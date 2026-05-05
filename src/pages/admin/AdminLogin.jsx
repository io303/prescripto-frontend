import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const AdminLogin = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { setAToken, backendUrl } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password })
        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('Admin logged in!')
          navigate('/admin/dashboard')
        } else toast.error(data.message)
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password })
        if (data.success) {
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('Doctor logged in!')
          navigate('/doctor/dashboard')
        } else toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 w-full max-w-md mx-4">
        <div className="flex items-center gap-2 justify-center mb-6">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Rx</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Prescripto</span>
        </div>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-1">
          <span className="text-primary">{state}</span> Login
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">Sign in to access your panel</p>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {['Admin', 'Doctor'].map(role => (
            <button
              key={role}
              onClick={() => setState(role)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                state === role ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
              placeholder="admin@prescripto.com"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
