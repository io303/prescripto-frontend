import React from 'react'

const Contact = () => {
  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">
        Contact <span className="text-primary">Us</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-10 mb-16 items-start">
        <div className="md:w-80 bg-blue-50 rounded-2xl p-8 shrink-0">
          <div className="text-4xl mb-4">🏢</div>
          <h3 className="font-bold text-gray-800 mb-4">Our Office</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>📍 54709 Willms Station,<br />Suite 350, Washington, USA</p>
            <p>📞 +1-800-PRESCRIPTO</p>
            <p>✉️ support@prescripto.com</p>
          </div>
          <h3 className="font-bold text-gray-800 mt-6 mb-2">Careers at Prescripto</h3>
          <p className="text-sm text-gray-500 mb-3">
            Learn more about our teams and job openings.
          </p>
          <button className="border border-primary text-primary px-5 py-2 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
            Explore Jobs
          </button>
        </div>

        <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-8">
          <h3 className="font-bold text-gray-800 mb-6">Send a Message</h3>
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">First Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Last Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Message</label>
              <textarea
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition resize-none"
                placeholder="How can we help you?"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
