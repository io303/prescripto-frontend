import React from 'react'
import { useNavigate } from 'react-router-dom'

const specialityData = [
  { speciality: 'General physician', emoji: '🩺' },
  { speciality: 'Gynecologist', emoji: '👶' },
  { speciality: 'Dermatologist', emoji: '🧴' },
  { speciality: 'Pediatricians', emoji: '🍭' },
  { speciality: 'Neurologist', emoji: '🧠' },
  { speciality: 'Gastroenterologist', emoji: '💊' },
]

const SpecialityMenu = () => {
  const navigate = useNavigate()

  return (
    <section className="py-16" id="speciality">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Find by Speciality</h2>
      <p className="text-gray-500 text-center mb-10">
        Browse through our network of trusted specialists and book an appointment instantly.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {specialityData.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/doctors/${item.speciality}`)}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-3xl
              group-hover:bg-primary group-hover:scale-110 transition-all duration-200 shadow-sm">
              {item.emoji}
            </div>
            <p className="text-sm font-medium text-gray-700 text-center group-hover:text-primary transition-colors">
              {item.speciality}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SpecialityMenu
