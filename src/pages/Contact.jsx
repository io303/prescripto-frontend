import React, { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const Contact = () => {
  const { backendUrl } = useContext(AppContext)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/contact/submit`, form)
      if (data.success) {
        toast.success(data.message)
        setForm({ firstName: '', lastName: '', email: '', message: '' })
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
    setLoading(false)
  }

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
        Contact <span className="text-primary">Us</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-10 mb-16 items-start">
        {/* Info */}
        <div className="md:w-80 bg-blue-50 rounded-2xl p-8 shrink-0">
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="font-bold text-gray-800 mb-4">Our Office</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>📍 54709 Willms Station,<br />Suite 350, Washington, USA</p>
            <p>📞 +1-800-PRESCRIPTO</p>
            <p>✉️ support@prescripto.com</p>
            <p>🕐 Mon–Sat, 9AM – 6PM</p>
          </div>

          <h3 className="font-bold text-gray-800 mt-6 mb-2">Careers at Prescripto</h3>
          <p className="text-sm text-gray-500 mb-3">Learn more about our teams and job openings.</p>
          <button className="border border-primary text-primary px-5 py-2 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
            Explore Jobs
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-8">
          <h3 className="font-bold text-gray-800 mb-6">Send a Message</h3>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">First Name <span className="text-red-400">*</span></label>
                <input
                  type="text" name="firstName" value={form.firstName}
                  onChange={handleChange} placeholder="John" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Last Name</label>
                <input
                  type="text" name="lastName" value={form.lastName}
                  onChange={handleChange} placeholder="Doe"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email <span className="text-red-400">*</span></label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Message <span className="text-red-400">*</span></label>
              <textarea
                name="message" value={form.message}
                onChange={handleChange} rows={5} required
                placeholder="How can we help you?"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition resize-none"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <><span className="animate-spin">⟳</span> Sending...</> : '📩 Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
