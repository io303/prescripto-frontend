import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const MyReports = () => {
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) fetchReports()
  }, [token])

  const fetchReports = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/report/my-reports`, { headers: { token } })
      if (data.success) setReports(data.reports)
    } catch (error) { toast.error(error.message) }
    setLoading(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  )

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My Medical Reports</h1>
      <p className="text-gray-500 text-sm mb-6">Download or view your medical reports from past consultations.</p>

      {reports.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-medium">No medical reports yet</p>
          <p className="text-sm mt-1">Reports will appear here after your doctor creates them post-consultation.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <div key={report._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-2xl">📄</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-800">{report.diagnosis}</h3>
                  <span className="text-xs bg-blue-50 text-primary px-2 py-0.5 rounded-full font-medium">
                    {report.reportNumber}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  Dr. {report.doctorName} · {report.doctorSpeciality}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span>📅 {report.slotDate?.replace(/_/g, '/')}</span>
                  <span>💊 {report.medicines?.length || 0} medicines</span>
                  <span className={`px-2 py-0.5 rounded-full ${
                    report.paymentStatus === 'Paid'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {report.paymentStatus}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/report/${report.appointmentId}`)}
                className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition shrink-0 flex items-center gap-1"
              >
                🖨️ View & Print
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyReports
