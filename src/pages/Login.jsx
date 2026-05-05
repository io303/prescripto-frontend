import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up')
  const [step, setStep] = useState(1) // Only used for Sign Up OTP flow
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  // ── SIGN UP: Step 1 — Send OTP ──
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-register-otp`, { name, email, password })
      if (data.success) { toast.success(data.message); setStep(2); setResendTimer(60) }
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  // ── SIGN UP: Step 2 — Verify OTP & Register ──
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password, otp })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Account created successfully!')
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  // ── LOGIN: Direct — No OTP ──
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/direct-login`, { email, password })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Logged in!')
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-register-otp`, { name, email, password })
      if (data.success) { toast.success('OTP resent!'); setResendTimer(60) }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
    setLoading(false)
  }

  useEffect(() => { if (token) navigate('/') }, [token])

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {state === 'Login' ? 'Welcome Back' : step === 1 ? 'Create Account' : 'Verify OTP'}
        </h2>
        <p className="text-gray-500 text-sm mb-7">
          {state === 'Login'
            ? 'Please log in to book appointments.'
            : step === 1
              ? 'Sign up to book appointments.'
              : `Enter the 6-digit OTP sent to ${email}`}
        </p>

        {/* ── LOGIN FORM — No OTP ── */}
        {state === 'Login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
            </div>
            <div className="text-right -mt-2">
              <button type="button" onClick={() => navigate('/forgot-password')}
                className="text-sm text-primary hover:underline font-medium">
                Forgot Password?
              </button>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        )}

        {/* ── SIGN UP: Step 1 — Form ── */}
        {state === 'Sign Up' && step === 1 && (
          <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="John Doe" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium mb-1 block">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors mt-2 disabled:opacity-60">
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* ── SIGN UP: Step 2 — OTP Verify ── */}
        {state === 'Sign Up' && step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-600 font-medium mb-3 block">Enter 6-digit OTP</label>
              <input type="text" value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="_ _ _ _ _ _" maxLength={6} required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-2xl font-bold text-center tracking-[16px] focus:outline-none focus:border-primary transition" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => { setStep(1); setOtp('') }}
                className="text-gray-500 hover:text-gray-700">← Change details</button>
              <button type="button" onClick={handleResend} disabled={resendTimer > 0}
                className={`font-medium transition-colors ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'}`}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
          </form>
        )}

        {/* Toggle */}
        <p className="text-center text-sm text-gray-500 mt-5">
          {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setState(state === 'Sign Up' ? 'Login' : 'Sign Up'); setStep(1); setOtp('') }}
            className="text-primary font-medium hover:underline">
            {state === 'Sign Up' ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
