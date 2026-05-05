import React from 'react'
import { useNavigate } from 'react-router-dom'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-primary rounded-2xl px-8 sm:px-14 py-14 mb-4">
        <div className="flex-1 text-white">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Book Appointment<br />With Trusted Doctors
          </h1>
          <p className="text-blue-100 mb-8 max-w-md leading-relaxed">
            Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
              className="bg-white text-primary font-semibold px-7 py-3 rounded-full hover:bg-blue-50 transition-colors"
            >
              Book appointment →
            </button>
          </div>
          {/* Trust indicators */}
          <div className="flex items-center gap-6 mt-8">
            {[['100+', 'Doctors'], ['10k+', 'Patients'], ['4.9★', 'Rating']].map(([val, label]) => (
              <div key={label}>
                <p className="text-xl font-bold text-white">{val}</p>
                <p className="text-blue-200 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hero illustration */}
        <div className="hidden md:flex flex-1 justify-end">
          <div className="w-64 h-64 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center">
            <span className="text-9xl">👨‍⚕️</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">How It Works</h2>
        <p className="text-gray-500 text-center mb-10">Simple steps to get your appointment</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🔍', step: '01', title: 'Find a Doctor', desc: 'Browse by speciality or search for a specific doctor.' },
            { icon: '📅', step: '02', title: 'Book a Slot', desc: 'Choose a convenient date and time that works for you.' },
            { icon: '✅', step: '03', title: 'Get Consultation', desc: 'Visit the doctor and get the care you deserve.' },
          ].map((item) => (
            <div key={item.step} className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{item.icon}</div>
              <span className="text-xs text-primary font-semibold tracking-widest">STEP {item.step}</span>
              <h3 className="font-bold text-gray-800 mt-1 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home
