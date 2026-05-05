import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from './DoctorCard'

const TopDoctors = () => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Top Doctors to Book</h2>
      <p className="text-gray-500 text-center mb-10">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {doctors.slice(0, 10).map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
      <div className="text-center mt-10">
        <button
          onClick={() => { navigate('/doctors'); scrollTo(0, 0) }}
          className="bg-blue-50 text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-white transition-colors"
        >
          View All Doctors
        </button>
      </div>
    </section>
  )
}

export default TopDoctors
