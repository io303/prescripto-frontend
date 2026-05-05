import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import DoctorCard from '../components/DoctorCard'

const specialities = [
  'General physician', 'Gynecologist', 'Dermatologist',
  'Pediatricians', 'Neurologist', 'Gastroenterologist',
]

const Doctors = () => {
  const { speciality } = useParams()
  const { doctors } = useContext(AppContext)
  const navigate = useNavigate()
  const [filterDocs, setFilterDocs] = useState([])
  const [showFilter, setShowFilter] = useState(false)

  const applyFilter = () => {
    if (speciality) {
      setFilterDocs(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDocs(doctors)
    }
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div className="py-6">
      <p className="text-gray-600 mb-6">Browse through the doctors specialist.</p>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter sidebar */}
        <aside className="md:w-48 shrink-0">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="md:hidden w-full text-left px-4 py-2 bg-blue-50 text-primary rounded-lg font-medium mb-3"
          >
            {showFilter ? '▲ Hide Filters' : '▼ Filters'}
          </button>
          <div className={`flex flex-col gap-1 ${showFilter ? 'flex' : 'hidden md:flex'}`}>
            {specialities.map(spec => (
              <button
                key={spec}
                onClick={() => {
                  speciality === spec
                    ? navigate('/doctors')
                    : navigate(`/doctors/${spec}`)
                }}
                className={`px-4 py-2.5 text-sm rounded-xl text-left transition-colors border ${
                  speciality === spec
                    ? 'bg-blue-50 border-primary text-primary font-medium'
                    : 'border-gray-100 text-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </aside>

        {/* Doctor grid */}
        <div className="flex-1">
          {filterDocs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p>No doctors found for this speciality.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {filterDocs.map(doc => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors
