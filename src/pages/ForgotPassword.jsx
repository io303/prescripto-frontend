import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const ForgotPassword = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  React.useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/forgot-password-otp`, { email })
      if (data.success) { toast.success(data.message); setStep(2); setResendTimer(60) }
      else toast.error(data.message)
    } catch (error) { toast.error(error.response?.data?.message || error.message) }
    setLoading(false)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, { email, otp })
      if (data.success) { toast.success(data.message); setStep(3) }
      else toast.error(data.message)
    } catch (error) { toast.error(error.response?.data?.message || error.message) }
    setLoading(false)
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match!')
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, { email, newPassword })
      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else toast.error(data.message)
    } catch (error) { toast.error(error.response?.data?.message || error.message) }
    setLoading(false)
  }

  const stepLabels = ['Enter Email', 'Verify OTP', 'New Password']

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 w-full max-w-md">

        {/* Steps indicator */}
        <div className="flex items-center justify-between mb-8">
          {stepLabels.map((label, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step > idx + 1 ? 'bg-green-500 text-white' :
                step === idx + 1 ? 'bg-primary text-white' :
                'bg-gray-100 text-gray-400'
              }`}>
                {step > idx + 1 ? '✓' : idx + 1}
              </div>
              <span className={`text-xs ${step === idx + 1 ? 'text-primary font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
              {idx < 2 && <div className={`absolute`}></div>}
            </div>
          ))}
        </div>

        {/* Step 1 — Email */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Forgot Password</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your registered email to receive an OTP.</p>
            <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
              <button type="button" onClick={() => navigate('/login')}
                className="text-center text-sm text-gray-500 hover:text-primary transition-colors">
                ← Back to Login
              </button>
            </form>
          </>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Verify OTP</h2>
            <p className="text-gray-500 text-sm mb-6">Enter the 6-digit OTP sent to <strong>{email}</strong></p>
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block">Enter OTP</label>
                <input type="text" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="_ _ _ _ _ _" maxLength={6} required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 text-2xl font-bold text-center tracking-[16px] focus:outline-none focus:border-primary transition" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700">
                  ← Change email
                </button>
                <button type="button" onClick={handleSendOTP} disabled={resendTimer > 0}
                  className={`font-medium ${resendTimer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:underline'}`}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          </>
        )}

        {/* Step 3 — New Password */}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Set New Password</h2>
            <p className="text-gray-500 text-sm mb-6">Choose a strong new password for your account.</p>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="text-sm text-gray-600 font-medium mb-1 block">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition" />
              </div>
              {newPassword && confirmPassword && (
                <p className={`text-xs font-medium ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-400'}`}>
                  {newPassword === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
              <button type="submit" disabled={loading || newPassword !== confirmPassword}
                className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-60">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
