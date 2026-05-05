import React from 'react'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-primary rounded-2xl px-8 sm:px-14 py-12 my-16 flex flex-col md:flex-row items-center gap-8 overflow-hidden relative">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400 rounded-full opacity-20"></div>
      <div className="absolute bottom-0 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-20"></div>

      <div className="flex-1 z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Book Appointment
        </h2>
        <p className="text-blue-100 mb-6">
          With 100+ Trusted Doctors
        </p>
        <button
          onClick={() => { navigate('/login'); scrollTo(0, 0) }}
          className="bg-white text-primary font-semibold px-6 py-2.5 rounded-full hover:bg-blue-50 transition-colors"
        >
          Create account
        </button>
      </div>
      <div className="hidden md:block z-10 text-8xl opacity-30">👨‍⚕️</div>
    </div>
  )
}

export default Banner
