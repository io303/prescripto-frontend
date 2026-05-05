import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [payingId, setPayingId] = useState(null)

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } })
      if (data.success) setAppointments(data.appointments.reverse())
    } catch (error) { toast.error(error.message) }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } })
      if (data.success) { toast.success(data.message); getUserAppointments(); getDoctorsData() }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
  }

  const handlePayOnline = async (appointment) => {
    try {
      setPayingId(appointment._id)
      const { data } = await axios.post(
        `${backendUrl}/api/user/create-payment-order`,
        { appointmentId: appointment._id },
        { headers: { token } }
      )
      if (!data.success) { toast.error(data.message); setPayingId(null); return }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Prescripto',
        description: `Appointment with ${appointment.docData.name}`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyData = await axios.post(
              `${backendUrl}/api/user/verify-payment`,
              { ...response, appointmentId: appointment._id },
              { headers: { token } }
            )
            if (verifyData.data.success) { toast.success('Payment Successful! 🎉'); getUserAppointments() }
            else toast.error('Payment verification failed')
          } catch (err) { toast.error('Verification error') }
          setPayingId(null)
        },
        prefill: { name: appointment.userData.name, email: appointment.userData.email },
        theme: { color: '#3B82F6' },
        modal: { ondismiss: () => { setPayingId(null); toast.info('Payment cancelled') } }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
      setPayingId(null)
    }
  }

  const startVideoCall = (appointmentId) => {
    const roomId = `apt_${appointmentId}`
    navigate(`/video-call/${roomId}?role=patient`)
  }

  useEffect(() => { if (token) getUserAppointments() }, [token])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => document.body.removeChild(script)
  }, [])

  const statusBadge = (apt) => {
    if (apt.cancelled) return <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-xs font-medium">Cancelled</span>
    if (apt.isCompleted) return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Completed</span>
    if (apt.payment) return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Paid ✓</span>
    return <span className="px-3 py-1 bg-blue-50 text-primary rounded-full text-xs font-medium">Upcoming</span>
  }

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">📅</p>
          <p>No appointments yet. Book your first appointment!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {appointments.map((apt) => (
            <div key={apt._id} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
              <img src={apt.docData.image} alt={apt.docData.name}
                className="w-20 h-20 rounded-xl object-cover bg-blue-50 shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h3 className="font-bold text-gray-800">{apt.docData.name}</h3>
                    <p className="text-primary text-sm">{apt.docData.speciality}</p>
                  </div>
                  {statusBadge(apt)}
                </div>
                <div className="mt-2 text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                  <span>📅 {apt.slotDate.replace(/_/g, '/')}</span>
                  <span>🕐 {apt.slotTime}</span>
                  <span>💰 ₹{apt.amount}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">📍 {apt.docData.address?.line1}</p>
              </div>

              {!apt.cancelled && !apt.isCompleted && (
                <div className="flex flex-col gap-2 shrink-0 justify-center">
                  {/* Video Call Button */}
                  <button
                    onClick={() => startVideoCall(apt._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-green-600 transition-colors flex items-center gap-1 justify-center"
                  >
                    📹 Video Call
                  </button>

                  {/* Pay Button */}
                  {!apt.payment && (
                    <button
                      onClick={() => handlePayOnline(apt)}
                      disabled={payingId === apt._id}
                      className="bg-primary text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-1 justify-center"
                    >
                      {payingId === apt._id ? '⟳ Processing...' : `💳 Pay ₹${apt.amount}`}
                    </button>
                  )}

                  {/* Cancel Button */}
                  <button
                    onClick={() => cancelAppointment(apt._id)}
                    className="border border-red-200 text-red-400 px-4 py-2 rounded-full text-xs font-medium hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyAppointments
