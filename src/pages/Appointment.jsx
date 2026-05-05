import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import DoctorCard from '../components/DoctorCard'

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const Appointment = () => {
  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [relatedDocs, setRelatedDocs] = useState([])

  const fetchDocInfo = () => {
    const doc = doctors.find(d => d._id === docId)
    setDocInfo(doc)
  }

  const getAvailableSlots = () => {
    setDocSlots([])
    const today = new Date()
    const slots = []

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)
      const endTime = new Date(currentDate)
      endTime.setHours(21, 0, 0, 0)

      if (i === 0) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10, 0, 0, 0)
      }

      const timeSlots = []
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const day = currentDate.getDate()
        const month = currentDate.getMonth() + 1
        const year = currentDate.getFullYear()
        const slotDate = `${day}_${month}_${year}`

        const isBooked = docInfo?.slots_booked?.[slotDate]?.includes(formattedTime)
        if (!isBooked) {
          timeSlots.push({ datetime: new Date(currentDate), time: formattedTime })
        }
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      slots.push(timeSlots)
    }
    setDocSlots(slots)
  }

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Please login to book an appointment')
      return navigate('/login')
    }
    if (!slotTime) return toast.warn('Please select a time slot')

    try {
      const date = docSlots[slotIndex][0].datetime
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const slotDate = `${day}_${month}_${year}`

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      )

      if (data.success) {
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots()
      setRelatedDocs(doctors.filter(d => d.speciality === docInfo.speciality && d._id !== docId).slice(0, 4))
    }
  }, [docInfo])

  if (!docInfo) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  )

  return (
    <div className="py-6">
      {/* Doctor Info */}
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <div className="sm:w-64 h-64 bg-blue-50 rounded-2xl overflow-hidden shrink-0">
          <img src={docInfo.image} alt={docInfo.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-gray-800">{docInfo.name}</h1>
            <span className="text-blue-400">✓</span>
          </div>
          <p className="text-gray-500 text-sm mb-3">
            {docInfo.degree} · {docInfo.speciality} · {docInfo.experience}
          </p>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">About</p>
            <p className="text-gray-500 text-sm leading-relaxed">{docInfo.about}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 font-medium">Appointment fee:</span>
            <span className="text-primary font-bold">{currencySymbol}{docInfo.fees}</span>
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-gray-800 mb-4">Booking Slots</h2>

        {/* Days */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-5">
          {docSlots.map((slots, idx) => (
            <button
              key={idx}
              onClick={() => { setSlotIndex(idx); setSlotTime('') }}
              className={`flex flex-col items-center px-4 py-3 rounded-xl border min-w-[60px] transition-colors ${
                slotIndex === idx
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 text-gray-600 hover:border-primary'
              }`}
            >
              <span className="text-xs font-medium">
                {slots[0] && daysOfWeek[slots[0].datetime.getDay()]}
              </span>
              <span className="text-lg font-bold">
                {slots[0] && slots[0].datetime.getDate()}
              </span>
            </button>
          ))}
        </div>

        {/* Times */}
        <div className="flex flex-wrap gap-2 mb-6">
          {docSlots[slotIndex]?.map((slot, idx) => (
            <button
              key={idx}
              onClick={() => setSlotTime(slot.time)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                slotTime === slot.time
                  ? 'bg-primary text-white border-primary'
                  : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
              }`}
            >
              {slot.time.toLowerCase()}
            </button>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors"
        >
          Book an Appointment
        </button>
      </div>

      {/* Related Doctors */}
      {relatedDocs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Related Doctors</h2>
          <p className="text-gray-500 text-sm mb-5">
            Simply browse through our extensive list of trusted doctors.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedDocs.map(doc => <DoctorCard key={doc._id} doctor={doc} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default Appointment
