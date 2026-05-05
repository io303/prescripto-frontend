import React from 'react'
import { useNavigate } from 'react-router-dom'

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/appointment/${doctor._id}`)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="bg-blue-50 h-52 flex items-end justify-center overflow-hidden">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`w-2 h-2 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-gray-300'}`}></span>
          <span className={`text-xs font-medium ${doctor.available ? 'text-green-600' : 'text-gray-400'}`}>
            {doctor.available ? 'Available' : 'Not Available'}
          </span>
        </div>
        <h3 className="font-semibold text-gray-800 text-base">{doctor.name}</h3>
        <p className="text-primary text-sm mt-0.5">{doctor.speciality}</p>
      </div>
    </div>
  )
}

export default DoctorCard
