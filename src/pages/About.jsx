import React from 'react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
        About <span className="text-primary">Us</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-10 mb-16 items-center">
        <div className="md:w-80 h-64 bg-blue-50 rounded-2xl flex items-center justify-center text-8xl shrink-0">
          🏥
        </div>
        <div className="flex-1">
          <p className="text-gray-600 leading-relaxed mb-4">
            Welcome to <strong>Prescripto</strong>, your trusted partner in managing your healthcare needs conveniently and efficiently.
            We understand how valuable your time is, and we're committed to providing a seamless experience when it comes to booking doctor appointments.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            Prescripto is committed to excellence in healthcare technology. We continuously improve our platform to integrate the latest advancements, ensuring you always receive modern, high-quality care.
          </p>
          <h3 className="font-bold text-gray-800 mb-2">Our Vision</h3>
          <p className="text-gray-600 leading-relaxed">
            Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making quality healthcare accessible to all.
          </p>
        </div>
      </div>

      {/* Why Choose Us */}
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Why Choose Us</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
        {[
          {
            icon: '⚡',
            title: 'Efficiency',
            desc: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
          },
          {
            icon: '🔒',
            title: 'Convenience',
            desc: 'Access a network of trusted healthcare professionals from the comfort of your home.',
          },
          {
            icon: '🎯',
            title: 'Personalization',
            desc: 'Tailored recommendations and reminders to help you stay on top of your health.',
          },
        ].map((item) => (
          <div key={item.title} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-primary transition-all">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary rounded-2xl p-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Ready to get started?</h2>
        <p className="text-blue-100 mb-6">Join thousands of patients who trust Prescripto for their healthcare needs.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-white text-primary font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors"
        >
          Create Account
        </button>
      </div>
    </div>
  )
}

export default About
