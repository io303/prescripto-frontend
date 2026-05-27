import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const { setAToken } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('patient') // patient | staff
  const [staffRole, setStaffRole] = useState('admin')   // admin | doctor
  const [view, setView] = useState('login')              // login | signup | otp
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])

  const otpRefs = useRef([])

  // Countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  useEffect(() => { if (token) navigate('/') }, [token])

  // OTP input handler
  const handleOtpChange = (idx, val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 1)
    const newOtp = [...otp]
    newOtp[idx] = cleaned
    setOtp(newOtp)
    if (cleaned && otpRefs.current[idx + 1]) otpRefs.current[idx + 1].focus()
  }

  const handleOtpKey = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && otpRefs.current[idx - 1]) {
      otpRefs.current[idx - 1].focus()
    }
  }

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  // Patient Signup — Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-register-otp`, { name, email, password })
      if (data.success) {
        toast.success(data.message)
        setView('otp')
        setResendTimer(60)
      } else toast.error(data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }

  // Patient Verify OTP & Register
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    if (otpCode.length !== 6) return toast.error('Enter complete OTP')
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password, otp: otpCode })
      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        toast.success('Account created!')
      } else toast.error(data.message)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }

  // Patient Login
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
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }

  // Staff Login (Admin or Doctor)
  const handleStaffLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (staffRole === 'admin') {
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
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
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
    } catch (err) { toast.error(err.message) }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4ff', padding: '20px' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        maxWidth: '900px',
        minHeight: '560px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.15)',
      }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          background: 'linear-gradient(145deg, #0a1628 0%, #0d2137 50%, #0a1e35 100%)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px 40px',
          overflow: 'hidden',
        }}>
          {/* Blobs */}
          {[
            { w: 280, h: 280, c: '#4a9eff', t: '-80px', l: '-80px' },
            { w: 200, h: 200, c: '#ff6b6b', b: '-60px', r: '-40px' },
            { w: 160, h: 160, c: '#4affb4', t: '45%', l: '55%' },
          ].map((b, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: b.w, height: b.h,
              background: b.c,
              borderRadius: '50%',
              opacity: 0.12,
              top: b.t, left: b.l, bottom: b.b, right: b.r,
            }} />
          ))}

          {/* Leaf SVGs */}
          <svg style={{ position: 'absolute', top: 20, left: 20, opacity: 0.25 }} width="60" height="80" viewBox="0 0 60 80">
            <ellipse cx="30" cy="20" rx="18" ry="20" fill="#4affb4" transform="rotate(-30 30 20)" />
            <ellipse cx="20" cy="50" rx="12" ry="16" fill="#4affb4" transform="rotate(20 20 50)" />
          </svg>
          <svg style={{ position: 'absolute', bottom: 30, right: 20, opacity: 0.25 }} width="50" height="70" viewBox="0 0 50 70">
            <ellipse cx="25" cy="20" rx="15" ry="18" fill="#ff9b9b" transform="rotate(20 25 20)" />
            <ellipse cx="35" cy="45" rx="10" ry="14" fill="#ff9b9b" transform="rotate(-15 35 45)" />
          </svg>

          {/* Center content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
            <div style={{
              width: 80, height: 80,
              background: 'rgba(74,158,255,0.15)',
              border: '2px solid rgba(74,158,255,0.35)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path d="M4 22 L10 22 L14 10 L18 32 L22 16 L26 26 L30 22 L40 22" stroke="#4a9eff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="22" cy="36" r="5" stroke="#4affb4" strokeWidth="2" fill="none" />
                <path d="M22 31 C18 27 14 22 18 16 C22 10 30 14 30 20" stroke="#4affb4" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div style={{ color: 'white', fontSize: 28, fontWeight: 600, letterSpacing: '-0.5px' }}>Prescripto</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 6 }}>Doctor Appointment Platform</div>
          </div>

          {/* Stats */}
          <div style={{ position: 'absolute', bottom: 48, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 32, zIndex: 2 }}>
            {[['100+', 'Doctors'], ['10k+', 'Patients'], ['4.9★', 'Rating']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: 20, left: 32, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 5, opacity: 0.15 }}>
            {Array(15).fill(0).map((_, i) => (
              <div key={i} style={{ width: 4, height: 4, background: 'white', borderRadius: '50%' }} />
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ background: '#f8f9ff', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 44px' }}>

          {/* TAB SWITCHER */}
          <div style={{ display: 'flex', background: '#eef0f7', borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {['patient', 'staff'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setView('login') }}
                style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: 9,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  background: activeTab === tab ? 'white' : 'transparent',
                  color: activeTab === tab ? '#2563eb' : '#888',
                  boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}>
                {tab === 'patient' ? '👤 Patient' : '🏥 Staff / Doctor'}
              </button>
            ))}
          </div>

          {/* ── PATIENT LOGIN ── */}
          {activeTab === 'patient' && view === 'login' && (
            <>
              <div style={{ fontSize: 11, background: 'rgba(37,99,235,0.1)', color: '#2563eb', padding: '3px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 10, fontWeight: 500 }}>Welcome back</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#0d1b2a', marginBottom: 4 }}>Sign in</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Book appointments with trusted doctors</div>

              <form onSubmit={handleLogin}>
                {[
                  { label: 'Email address', type: 'email', val: email, set: setEmail, ph: 'you@example.com', icon: '✉️' },
                  { label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••', icon: '🔒' },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, color: '#666', fontWeight: 500, display: 'block', marginBottom: 5 }}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                      placeholder={f.ph} required
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #e2e5f0', borderRadius: 10, fontSize: 14, background: 'white', color: '#0d1b2a', outline: 'none' }} />
                  </div>
                ))}

                <div style={{ textAlign: 'right', marginBottom: 18 }}>
                  <span onClick={() => navigate('/forgot-password')} style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer' }}>Forgot password?</span>
                </div>

                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: 13, background: '#1a56db', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Signing in...' : 'Login'}
                </button>
              </form>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
                Don't have an account?{' '}
                <span onClick={() => setView('signup')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>Create account</span>
              </div>
            </>
          )}

          {/* ── PATIENT SIGNUP ── */}
          {activeTab === 'patient' && view === 'signup' && (
            <>
              <div style={{ fontSize: 11, background: 'rgba(74,200,130,0.12)', color: '#16a34a', padding: '3px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 10, fontWeight: 500 }}>Get started</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#0d1b2a', marginBottom: 4 }}>Create account</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Join thousands of patients on Prescripto</div>

              <form onSubmit={handleSendOTP}>
                {[
                  { label: 'Full name', type: 'text', val: name, set: setName, ph: 'John Doe' },
                  { label: 'Email address', type: 'email', val: email, set: setEmail, ph: 'you@example.com' },
                  { label: 'Password', type: 'password', val: password, set: setPassword, ph: 'Min. 8 characters' },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, color: '#666', fontWeight: 500, display: 'block', marginBottom: 5 }}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                      placeholder={f.ph} required
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #e2e5f0', borderRadius: 10, fontSize: 14, background: 'white', color: '#0d1b2a', outline: 'none' }} />
                  </div>
                ))}

                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: 13, background: '#1a56db', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Sending OTP...' : 'Send OTP →'}
                </button>
              </form>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
                Already have an account?{' '}
                <span onClick={() => setView('login')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>Login</span>
              </div>
            </>
          )}

          {/* ── OTP VERIFY ── */}
          {activeTab === 'patient' && view === 'otp' && (
            <>
              <div style={{ fontSize: 11, background: 'rgba(234,179,8,0.12)', color: '#b45309', padding: '3px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 10, fontWeight: 500 }}>Verification</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#0d1b2a', marginBottom: 4 }}>Enter OTP</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 28 }}>6-digit code sent to <strong>{email}</strong></div>

              <form onSubmit={handleVerifyOTP}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }} onPaste={handleOtpPaste}>
                  {otp.map((digit, idx) => (
                    <input key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      type="text" maxLength={1} value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKey(idx, e)}
                      style={{
                        flex: 1, height: 52, border: `2px solid ${digit ? '#2563eb' : '#e2e5f0'}`,
                        borderRadius: 10, textAlign: 'center', fontSize: 22, fontWeight: 600,
                        color: '#0d1b2a', background: 'white', outline: 'none', transition: 'border 0.2s',
                      }} />
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span onClick={() => { setView('signup'); setOtp(['','','','','','']) }}
                    style={{ fontSize: 12, color: '#888', cursor: 'pointer' }}>← Change details</span>
                  <span onClick={handleResend} style={{ fontSize: 12, color: resendTimer > 0 ? '#bbb' : '#2563eb', cursor: resendTimer > 0 ? 'default' : 'pointer', fontWeight: 500 }}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </span>
                </div>

                <button type="submit" disabled={loading || otp.join('').length !== 6}
                  style={{ width: '100%', padding: 13, background: '#1a56db', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', opacity: (loading || otp.join('').length !== 6) ? 0.6 : 1 }}>
                  {loading ? 'Verifying...' : 'Verify & Create Account'}
                </button>
              </form>
            </>
          )}

          {/* ── STAFF LOGIN ── */}
          {activeTab === 'staff' && (
            <>
              <div style={{ fontSize: 11, background: 'rgba(139,92,246,0.1)', color: '#7c3aed', padding: '3px 12px', borderRadius: 20, display: 'inline-block', marginBottom: 10, fontWeight: 500 }}>Staff portal</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: '#0d1b2a', marginBottom: 4 }}>Staff Login</div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Access your dashboard</div>

              {/* Role selector */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {[['admin', '🛠️ Admin'], ['doctor', '👨‍⚕️ Doctor']].map(([role, label]) => (
                  <button key={role} onClick={() => setStaffRole(role)}
                    style={{
                      flex: 1, padding: '10px', border: `2px solid ${staffRole === role ? '#2563eb' : '#e2e5f0'}`,
                      borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                      background: staffRole === role ? 'rgba(37,99,235,0.06)' : 'white',
                      color: staffRole === role ? '#2563eb' : '#666',
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleStaffLogin}>
                {[
                  { label: 'Email address', type: 'email', val: email, set: setEmail, ph: staffRole === 'admin' ? 'admin@prescripto.com' : 'doctor@prescripto.com' },
                  { label: 'Password', type: 'password', val: password, set: setPassword, ph: '••••••••' },
                ].map(f => (
                  <div key={f.label} style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, color: '#666', fontWeight: 500, display: 'block', marginBottom: 5 }}>{f.label}</label>
                    <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                      placeholder={f.ph} required
                      style={{ width: '100%', padding: '11px 14px', border: '1px solid #e2e5f0', borderRadius: 10, fontSize: 14, background: 'white', color: '#0d1b2a', outline: 'none' }} />
                  </div>
                ))}

                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: 13, background: staffRole === 'admin' ? '#1a56db' : '#059669', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: 'pointer', marginTop: 4, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Signing in...' : `Login as ${staffRole === 'admin' ? 'Admin' : 'Doctor'}`}
                </button>
              </form>

              <div style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
                Patient?{' '}
                <span onClick={() => setActiveTab('patient')} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 500 }}>Login here</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
